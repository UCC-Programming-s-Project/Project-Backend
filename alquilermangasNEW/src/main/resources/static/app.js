document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'http://localhost:8080/api';

    // --- REFERENCIAS AL DOM ---
    const mangaSelect = document.getElementById('mangaSelect');
    const clienteSelect = document.getElementById('clienteSelect');
    const mangasDisponiblesList = document.getElementById('mangas-list');
    const alquileresActivosList = document.getElementById('alquileres-list');
    const clientesList = document.getElementById('clientes-list');

    // Formularios
    const alquilerForm = document.getElementById('alquilerForm');
    const mangaForm = document.getElementById('mangaForm');
    const clienteForm = document.getElementById('clienteForm');
    const formError = document.getElementById('form-error');

    // Modales (instancias de Bootstrap)
    const mangaModal = new bootstrap.Modal(document.getElementById('mangaModal'));
    const clienteModal = new bootstrap.Modal(document.getElementById('clienteModal'));

    // --- FUNCIONES DE CARGA Y RENDERIZADO ---

    // Carga todos los datos iniciales
    async function cargarTodo() {
        await Promise.all([cargarClientes(), cargarMangas(), cargarAlquileres()]);
    }

    // Carga y muestra los clientes
    async function cargarClientes() {
        try {
            const response = await fetch(`${API_URL}/clientes`);
            if (!response.ok) throw new Error('No se pudieron cargar los clientes.');
            const clientes = await response.json();

            clienteSelect.innerHTML = '<option value="">-- Seleccione un cliente --</option>';
            clientesList.innerHTML = '';

            clientes.forEach(cliente => {
                // Añadir al dropdown de alquiler
                const option = document.createElement('option');
                option.value = cliente.id;
                option.textContent = cliente.nombre;
                clienteSelect.appendChild(option);

                // Crear tarjeta de cliente
                const clienteCard = document.createElement('div');
                clienteCard.className = 'col';
                clienteCard.innerHTML = `
                    <div class="card h-100">
                        <div class="card-body">
                            <h5 class="card-title">${cliente.nombre}</h5>
                            <p class="card-text text-muted">${cliente.correo || 'Sin correo'}</p>
                        </div>
                        <div class="card-footer d-flex justify-content-end">
                            <button class="btn btn-sm btn-outline-primary me-2 editar-cliente-btn" data-id="${cliente.id}">Editar</button>
                            <button class="btn btn-sm btn-outline-danger eliminar-cliente-btn" data-id="${cliente.id}">Eliminar</button>
                        </div>
                    </div>
                `;
                clientesList.appendChild(clienteCard);
            });
        } catch (error) {
            console.error('Error cargando clientes:', error);
        }
    }

    // Carga y muestra los mangas
    async function cargarMangas() {
        try {
            const response = await fetch(`${API_URL}/mangas`);
            if (!response.ok) throw new Error('No se pudieron cargar los mangas.');
            const mangas = await response.json();

            mangasDisponiblesList.innerHTML = '';
            mangaSelect.innerHTML = '<option value="">-- Seleccione un manga --</option>';

            mangas.forEach(manga => {
                const estadoText = manga.disponible ? 'DISPONIBLE' : 'ALQUILADO';
                const estadoClass = manga.disponible ? 'bg-success' : 'bg-secondary';
                // Usar imagen del manga o una por defecto
                const imageUrl = manga.imagenUrl || `https://via.placeholder.com/400x600.png/2a2a2a/e0e0e0?text=${encodeURIComponent(manga.titulo)}`;

                // Crear tarjeta de manga
                const mangaCard = document.createElement('div');
                mangaCard.className = 'col';
                mangaCard.innerHTML = `
                    <div class="card h-100">
                        <img src="${imageUrl}" class="card-img-top manga-card-img" alt="${manga.titulo}">
                        <div class="card-body">
                            <h5 class="card-title">${manga.titulo}</h5>
                            <h6 class="card-subtitle mb-2 text-muted">${manga.autor}</h6>
                            <span class="badge ${estadoClass}">${estadoText}</span>
                        </div>
                        <div class="card-footer d-flex justify-content-end">
                            <button class="btn btn-sm btn-outline-primary me-2 editar-manga-btn" data-id="${manga.id}">Editar</button>
                            <button class="btn btn-sm btn-outline-danger eliminar-manga-btn" data-id="${manga.id}">Eliminar</button>
                        </div>
                    </div>
                `;
                mangasDisponiblesList.appendChild(mangaCard);

                // Añadir al dropdown de alquiler si está disponible
                if (manga.disponible) {
                    const option = document.createElement('option');
                    option.value = manga.id;
                    option.textContent = manga.titulo;
                    mangaSelect.appendChild(option);
                }
            });
        } catch (error) {
            console.error('Error cargando mangas:', error);
        }
    }

    // Carga y muestra los alquileres activos
    async function cargarAlquileres() {
        try {
            const response = await fetch(`${API_URL}/alquileres`);
            if (!response.ok) throw new Error('No se pudieron cargar los alquileres.');
            const alquileres = await response.json();

            alquileresActivosList.innerHTML = '';
            alquileres.filter(a => !a.devuelto).forEach(alquiler => {
                const alquilerCard = document.createElement('div');
                alquilerCard.className = 'col';
                alquilerCard.innerHTML = `
                    <div class="card h-100">
                        <div class="card-body">
                            <h5 class="card-title">${alquiler.manga.titulo}</h5>
                            <p class="card-text"><strong>Alquilado por:</strong> ${alquiler.cliente.nombre}</p>
                            <p class="card-text"><small class="text-muted">Alquilado el: ${new Date(alquiler.fechaInicio).toLocaleDateString()}</small></p>
                            <button class="btn btn-warning btn-sm devolver-btn w-100" data-id="${alquiler.id}">Devolver</button>
                        </div>
                    </div>
                `;
                alquileresActivosList.appendChild(alquilerCard);
            });
        } catch (error) {
            console.error('Error cargando alquileres:', error);
        }
    }

    // --- MANEJADORES DE EVENTOS PARA FORMULARIOS ---

    // Formulario de Cliente (Crear/Editar)
    clienteForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('clienteId').value;
        const nombre = document.getElementById('clienteNombre').value.trim();
        const correo = document.getElementById('clienteCorreo').value.trim();
        if (!nombre) return;

        const url = id ? `${API_URL}/clientes/${id}` : `${API_URL}/clientes`;
        const method = id ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: id ? parseInt(id) : undefined, nombre, correo }),
            });

            if (response.ok) {
                clienteModal.hide();
                cargarTodo();
            } else {
                alert('Error al guardar el cliente.');
            }
        } catch (error) {
            alert('No se pudo conectar al servidor.');
        }
    });

    // Formulario de Manga (Crear/Editar)
    mangaForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('mangaId').value;
        const titulo = document.getElementById('mangaTitulo').value.trim();
        const autor = document.getElementById('mangaAutor').value.trim();
        const imagenUrl = document.getElementById('mangaImagenUrl').value.trim();
        if (!titulo || !autor) return;

        const url = id ? `${API_URL}/mangas/${id}` : `${API_URL}/mangas`;
        const method = id ? 'PUT' : 'POST';
        
        // Para PUT, necesitamos enviar también el estado 'disponible'
        const mangaData = { titulo, autor, imagenUrl };
        if(id) {
            const originalMangaResponse = await fetch(`${API_URL}/mangas/${id}`);
            const originalManga = await originalMangaResponse.json();
            mangaData.disponible = originalManga.disponible;
        }

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(mangaData),
            });

            if (response.ok) {
                mangaModal.hide();
                cargarTodo();
            } else {
                alert('Error al guardar el manga.');
            }
        } catch (error) {
            alert('No se pudo conectar al servidor.');
        }
    });
    
    // Formulario de Alquiler
    alquilerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        formError.textContent = '';
        const clienteId = clienteSelect.value;
        const mangaId = mangaSelect.value;

        if (!clienteId || !mangaId) {
            formError.textContent = 'Por favor, seleccione un cliente y un manga.';
            return;
        }

        try {
            const response = await fetch(`${API_URL}/alquileres`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ clienteId: parseInt(clienteId), mangaId: parseInt(mangaId) }),
            });

            if (response.status === 201) {
                alquilerForm.reset();
                cargarTodo();
            } else {
                const errorData = await response.json();
                formError.textContent = errorData.message || 'Ocurrió un error al alquilar.';
            }
        } catch (error) {
            formError.textContent = 'No se pudo conectar con el servidor.';
        }
    });

    // --- MANEJADORES DE EVENTOS PARA BOTONES (Click Delegation) ---

    // Botón para abrir modal de 'Añadir Cliente'
    document.getElementById('addClienteBtn').addEventListener('click', () => {
        document.getElementById('clienteModalTitle').textContent = 'Añadir Nuevo Cliente';
        clienteForm.reset();
        document.getElementById('clienteId').value = '';
    });

    // Botón para abrir modal de 'Añadir Manga'
    document.getElementById('addMangaBtn').addEventListener('click', () => {
        document.getElementById('mangaModalTitle').textContent = 'Añadir Nuevo Manga';
        mangaForm.reset();
        document.getElementById('mangaId').value = '';
    });

    // Clicks en la lista de clientes (Editar/Eliminar)
    clientesList.addEventListener('click', async (e) => {
        const id = e.target.dataset.id;
        if (e.target.classList.contains('editar-cliente-btn')) {
            const response = await fetch(`${API_URL}/clientes/${id}`);
            const cliente = await response.json();
            document.getElementById('clienteModalTitle').textContent = 'Editar Cliente';
            document.getElementById('clienteId').value = cliente.id;
            document.getElementById('clienteNombre').value = cliente.nombre;
            document.getElementById('clienteCorreo').value = cliente.correo;
            clienteModal.show();
        } else if (e.target.classList.contains('eliminar-cliente-btn')) {
            if (confirm(`¿Seguro que quieres eliminar al cliente con ID ${id}?`)) {
                await fetch(`${API_URL}/clientes/${id}`, { method: 'DELETE' });
                cargarTodo();
            }
        }
    });

    // Clicks en la lista de mangas (Editar/Eliminar)
    mangasDisponiblesList.addEventListener('click', async (e) => {
        const id = e.target.dataset.id;
        if (e.target.classList.contains('editar-manga-btn')) {
            const response = await fetch(`${API_URL}/mangas/${id}`);
            const manga = await response.json();
            document.getElementById('mangaModalTitle').textContent = 'Editar Manga';
            document.getElementById('mangaId').value = manga.id;
            document.getElementById('mangaTitulo').value = manga.titulo;
            document.getElementById('mangaAutor').value = manga.autor;
            document.getElementById('mangaImagenUrl').value = manga.imagenUrl;
            mangaModal.show();
        } else if (e.target.classList.contains('eliminar-manga-btn')) {
            if (confirm(`¿Seguro que quieres eliminar el manga con ID ${id}?`)) {
                await fetch(`${API_URL}/mangas/${id}`, { method: 'DELETE' });
                cargarTodo();
            }
        }
    });
    
    // Clicks en la lista de alquileres (Devolver)
    alquileresActivosList.addEventListener('click', async (e) => {
        if (e.target.classList.contains('devolver-btn')) {
            const alquilerId = e.target.dataset.id;
            try {
                const response = await fetch(`${API_URL}/alquileres/${alquilerId}/devolver`, { method: 'POST' });
                if (response.ok) {
                    cargarTodo();
                } else {
                    alert('Error al devolver el manga.');
                }
            } catch (error) {
                alert('No se pudo conectar con el servidor.');
            }
        }
    });

    // --- INICIALIZACIÓN ---
    cargarTodo();
});
