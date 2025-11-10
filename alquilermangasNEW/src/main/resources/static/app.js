document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'http://localhost:8080/api';

    // Referencias a elementos del DOM
    const mangaSelect = document.getElementById('mangaSelect');
    const clienteSelect = document.getElementById('clienteSelect');
    const mangasDisponiblesList = document.getElementById('mangas-list');
    const alquileresActivosList = document.getElementById('alquileres-list');
    const clientesList = document.getElementById('clientes-list');

    const alquilerForm = document.getElementById('alquilerForm');
    const mangaForm = document.getElementById('mangaForm');
    const clienteForm = document.getElementById('clienteForm');

    const formError = document.getElementById('form-error');

    // Instancias de los Modales de Bootstrap
    const addMangaModal = new bootstrap.Modal(document.getElementById('addMangaModal'));
    const addClienteModal = new bootstrap.Modal(document.getElementById('addClienteModal'));


    // --- FUNCIONES DE CARGA DE DATOS ---

    async function cargarClientes() {
        try {
            const response = await fetch(`${API_URL}/clientes`);
            if (!response.ok) throw new Error('No se pudieron cargar los clientes.');
            const clientes = await response.json();

            clienteSelect.innerHTML = '<option value="">-- Seleccione un cliente --</option>';
            clientesList.innerHTML = ''; 

            clientes.forEach(cliente => {
                const option = document.createElement('option');
                option.value = cliente.id;
                option.textContent = cliente.nombre;
                clienteSelect.appendChild(option);

                const clienteCardWrapper = document.createElement('div');
                clienteCardWrapper.className = 'col';
                clienteCardWrapper.innerHTML = `
                    <div class="card h-100">
                        <div class="card-body d-flex align-items-center justify-content-center">
                            <h5 class="card-title text-center">${cliente.nombre}</h5>
                        </div>
                    </div>
                `;
                clientesList.appendChild(clienteCardWrapper);
            });
        } catch (error) {
            console.error('Error cargando clientes:', error);
        }
    }

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
                const imageUrl = `https://via.placeholder.com/400x250.png/2a2a2a/e0e0e0?text=${encodeURIComponent(manga.titulo)}`;

                const mangaCardWrapper = document.createElement('div');
                mangaCardWrapper.className = 'col';
                mangaCardWrapper.innerHTML = `
                    <div class="card h-100">
                         <img src="${imageUrl}" class="card-img-top manga-card-img" alt="Carátula de ${manga.titulo}">
                        <div class="card-body">
                            <h5 class="card-title">${manga.titulo}</h5>
                            <h6 class="card-subtitle mb-2 text-muted">por ${manga.autor}</h6>
                            <p class="card-text">
                                <span class="badge ${estadoClass}">${estadoText}</span>
                            </p>
                        </div>
                    </div>
                `;
                mangasDisponiblesList.appendChild(mangaCardWrapper);

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

    async function cargarAlquileres() {
        try {
            const response = await fetch(`${API_URL}/alquileres`);
            if (!response.ok) throw new Error('No se pudieron cargar los alquileres.');
            const alquileres = await response.json();

            alquileresActivosList.innerHTML = '';
            alquileres.filter(a => !a.devuelto).forEach(alquiler => {
                const alquilerCardWrapper = document.createElement('div');
                alquilerCardWrapper.className = 'col';
                alquilerCardWrapper.innerHTML = `
                    <div class="card h-100">
                        <div class="card-body">
                            <h5 class="card-title">${alquiler.manga.titulo}</h5>
                            <p class="card-text"><strong>Alquilado por:</strong> ${alquiler.cliente.nombre}</p>
                            <p class="card-text"><small class="text-muted">Alquilado el: ${alquiler.fechaInicio}</small></p>
                            <button class="btn btn-warning btn-sm devolver-btn" data-id="${alquiler.id}">Devolver</button>
                        </div>
                    </div>
                `;
                alquileresActivosList.appendChild(alquilerCardWrapper);
            });
        } catch (error) {
            console.error('Error cargando alquileres:', error);
        }
    }

    function cargarTodo() {
        cargarClientes();
        cargarMangas();
        cargarAlquileres();
    }

    // --- MANEJADORES DE EVENTOS ---

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

    clienteForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const nombre = document.getElementById('clienteNombre').value.trim();
        if (!nombre) return;

        try {
            const response = await fetch(`${API_URL}/clientes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre }),
            });

            if (response.status === 201) {
                clienteForm.reset();
                addClienteModal.hide(); // Ocultar modal
                cargarClientes();
            } else {
                alert('Error al añadir cliente.');
            }
        } catch (error) {
            alert('No se pudo conectar al servidor.');
        }
    });

    mangaForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const titulo = document.getElementById('mangaTitulo').value.trim();
        const autor = document.getElementById('mangaAutor').value.trim();
        if (!titulo || !autor) return;

        try {
            const response = await fetch(`${API_URL}/mangas`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ titulo, autor }),
            });

            if (response.status === 201) {
                mangaForm.reset();
                addMangaModal.hide(); // Ocultar modal
                cargarMangas(); 
            } else {
                alert('Error al añadir manga.');
            }
        } catch (error) {
            alert('No se pudo conectar al servidor.');
        }
    });

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