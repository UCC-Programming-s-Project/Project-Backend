document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'http://localhost:8080/api';


    const mangaSelect = document.getElementById('mangaSelect');
    const clienteSelect = document.getElementById('clienteSelect');
    const fechaFinInput = document.getElementById('fechaFin');
    const mangasDisponiblesList = document.getElementById('mangas-list');
    const alquileresActivosList = document.getElementById('alquileres-list');
    const clientesList = document.getElementById('clientes-list');


    const alquilerForm = document.getElementById('alquilerForm');
    const mangaForm = document.getElementById('mangaForm');
    const clienteForm = document.getElementById('clienteForm');
    const formError = document.getElementById('form-error');


    const mangaModal = new bootstrap.Modal(document.getElementById('mangaModal'));
    const clienteModal = new bootstrap.Modal(document.getElementById('clienteModal'));


    function setMinDate() {
        const today = new Date().toISOString().split('T')[0];
        fechaFinInput.setAttribute('min', today);
    }

   
    async function cargarTodo() {
        await Promise.all([cargarClientes(), cargarMangas(), cargarAlquileres()]);
    }

    async function cargarClientes() {
        try {
            const response = await fetch(`${API_URL}/clientes`);
            if (!response.ok) throw new Error('Error al cargar clientes');
            const clientes = await response.json();
            clienteSelect.innerHTML = '<option value="">-- Seleccione un cliente --</option>';
            clientesList.innerHTML = '';
            clientes.forEach(cliente => {
                const option = document.createElement('option');
                option.value = cliente.id;
                option.textContent = cliente.nombre;
                clienteSelect.appendChild(option);
                const card = document.createElement('div');
                card.className = 'col';
                card.innerHTML = `
                    <div class="card h-100">
                        <div class="card-body">
                            <h5 class="card-title">${cliente.nombre}</h5>
                            <p class="card-text text-muted">${cliente.correo || 'Sin correo'}</p>
                        </div>
                        <div class="card-footer d-flex justify-content-end">
                            <button class="btn btn-sm btn-outline-primary me-2 editar-cliente-btn" data-id="${cliente.id}">Editar</button>
                            <button class="btn btn-sm btn-outline-danger eliminar-cliente-btn" data-id="${cliente.id}">Eliminar</button>
                        </div>
                    </div>`;
                clientesList.appendChild(card);
            });
        } catch (error) { console.error(error); }
    }

    async function cargarMangas() {
        try {
            const response = await fetch(`${API_URL}/mangas`);
            if (!response.ok) throw new Error('Error al cargar mangas');
            const mangas = await response.json();
            mangasDisponiblesList.innerHTML = '';
            mangaSelect.innerHTML = '<option value="">-- Seleccione un manga --</option>';
            mangas.forEach(manga => {
                const estadoText = manga.disponible ? 'DISPONIBLE' : 'ALQUILADO';
                const estadoClass = manga.disponible ? 'bg-success' : 'bg-secondary';
                const imageUrl = manga.imagenUrl || `https://via.placeholder.com/400x600.png/2a2a2a/e0e0e0?text=${encodeURIComponent(manga.titulo)}`;
                const card = document.createElement('div');
                card.className = 'col';
                card.innerHTML = `
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
                    </div>`;
                mangasDisponiblesList.appendChild(card);
                if (manga.disponible) {
                    const option = document.createElement('option');
                    option.value = manga.id;
                    option.textContent = manga.titulo;
                    mangaSelect.appendChild(option);
                }
            });
        } catch (error) { console.error(error); }
    }

    async function cargarAlquileres() {
        try {
            const response = await fetch(`${API_URL}/alquileres`);
            if (!response.ok) throw new Error('Error al cargar alquileres');
            const alquileres = await response.json();
            alquileresActivosList.innerHTML = '';
            alquileres.filter(a => !a.devuelto).forEach(alquiler => {
                const card = document.createElement('div');
                card.className = 'col';
                // **MODIFICADO: Muestra fecha de inicio y fin **
                card.innerHTML = `
                    <div class="card h-100">
                        <div class="card-body">
                            <h5 class="card-title">${alquiler.manga.titulo}</h5>
                            <p class="card-text"><strong>Alquilado por:</strong> ${alquiler.cliente.nombre}</p>
                            <p class="card-text"><small class="text-muted">Alquilado: ${new Date(alquiler.fechaInicio).toLocaleDateString()}</small></p>
                            <p class="card-text"><strong><small class="text-danger">Devolver antes de: ${new Date(alquiler.fechaFin).toLocaleDateString()}</small></strong></p>
                            <button class="btn btn-warning btn-sm devolver-btn w-100 mt-2" data-id="${alquiler.id}">Devolver</button>
                        </div>
                    </div>`;
                alquileresActivosList.appendChild(card);
            });
        } catch (error) { console.error(error); }
    }

    

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
            if (response.ok) { clienteModal.hide(); cargarTodo(); } 
            else { alert('Error al guardar el cliente.'); }
        } catch (error) { alert('No se pudo conectar al servidor.'); }
    });

    mangaForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('mangaId').value;
        const titulo = document.getElementById('mangaTitulo').value.trim();
        const autor = document.getElementById('mangaAutor').value.trim();
        const imagenUrl = document.getElementById('mangaImagenUrl').value.trim();
        if (!titulo || !autor) return;
        const url = id ? `${API_URL}/mangas/${id}` : `${API_URL}/mangas`;
        const method = id ? 'PUT' : 'POST';
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
            if (response.ok) { mangaModal.hide(); cargarTodo(); } 
            else { alert('Error al guardar el manga.'); }
        } catch (error) { alert('No se pudo conectar al servidor.'); }
    });
    
  
    alquilerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        formError.textContent = '';
        const clienteId = clienteSelect.value;
        const mangaId = mangaSelect.value;
        const fechaFin = fechaFinInput.value; 

        if (!clienteId || !mangaId || !fechaFin) {
            formError.textContent = 'Por favor, complete todos los campos.';
            return;
        }

        const fechaInicio = new Date().toISOString().split('T')[0]; 

        try {
            const response = await fetch(`${API_URL}/alquileres`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    clienteId: parseInt(clienteId), 
                    mangaId: parseInt(mangaId),
                    fechaInicio,
                    fechaFin
                }),
            });

            if (response.status === 201) {
                alquilerForm.reset();
                setMinDate(); 
                cargarTodo();
            } else {
                const errorData = await response.json();
                formError.textContent = errorData.message || 'Ocurrió un error al alquilar.';
            }
        } catch (error) {
            formError.textContent = 'No se pudo conectar con el servidor.';
        }
    });

   
    document.getElementById('addClienteBtn').addEventListener('click', () => {
        document.getElementById('clienteModalTitle').textContent = 'Añadir Nuevo Cliente';
        clienteForm.reset();
        document.getElementById('clienteId').value = '';
    });

    document.getElementById('addMangaBtn').addEventListener('click', () => {
        document.getElementById('mangaModalTitle').textContent = 'Añadir Nuevo Manga';
        mangaForm.reset();
        document.getElementById('mangaId').value = '';
    });

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
            if (confirm(`¿Seguro que quieres eliminar?`)) {
                await fetch(`${API_URL}/clientes/${id}`, { method: 'DELETE' });
                cargarTodo();
            }
        }
    });

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
            if (confirm(`¿Seguro que quieres eliminar?`)) {
                await fetch(`${API_URL}/mangas/${id}`, { method: 'DELETE' });
                cargarTodo();
            }
        }
    });
    
    alquileresActivosList.addEventListener('click', async (e) => {
        if (e.target.classList.contains('devolver-btn')) {
            const alquilerId = e.target.dataset.id;
            try {
                const response = await fetch(`${API_URL}/alquileres/${alquilerId}/devolver`, { method: 'POST' });
                if (response.ok) { cargarTodo(); } 
                else { alert('Error al devolver el manga.'); }
            } catch (error) { alert('No se pudo conectar con el servidor.'); }
        }
    });


    setMinDate();
    cargarTodo();
});
