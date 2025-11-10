
document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'http://localhost:8080/api';

    // Referencias a elementos del DOM
    const mangaSelect = document.getElementById('mangaSelect');
    const clienteSelect = document.getElementById('clienteSelect');
    const mangasDisponiblesList = document.getElementById('mangas-list');
    const alquileresActivosList = document.getElementById('alquileres-list');
    const clientesList = document.getElementById('clientes-list'); // Nueva lista de clientes

    const alquilerForm = document.getElementById('alquilerForm');
    const mangaForm = document.getElementById('mangaForm'); // Formulario de nuevo manga
    const clienteForm = document.getElementById('clienteForm'); // Formulario de nuevo cliente

    const formError = document.getElementById('form-error');

    // --- FUNCIONES DE CARGA DE DATOS ---

    async function cargarClientes() {
        try {
            const response = await fetch(`${API_URL}/clientes`);
            if (!response.ok) throw new Error('No se pudieron cargar los clientes.');
            const clientes = await response.json();

            clienteSelect.innerHTML = '<option value="">-- Seleccione un cliente --</option>';
            clientesList.innerHTML = ''; // Limpiar la lista de clientes visual

            clientes.forEach(cliente => {
                // Poblar el menú desplegable
                const option = document.createElement('option');
                option.value = cliente.id;
                option.textContent = cliente.nombre;
                clienteSelect.appendChild(option);

                // Poblar la lista visual de clientes
                const clienteCard = document.createElement('div');
                clienteCard.className = 'card';
                clienteCard.innerHTML = `<h3>${cliente.nombre}</h3>`;
                clientesList.appendChild(clienteCard);
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
                const estado = manga.disponible ? 'DISPONIBLE' : 'ALQUILADO';
                const mangaCard = document.createElement('div');
                mangaCard.className = 'card';
                mangaCard.innerHTML = `
                    <h3>${manga.titulo}</h3>
                    <p>por ${manga.autor}</p>
                    <p class="status status-${estado}">${estado}</p>
                `;
                mangasDisponiblesList.appendChild(mangaCard);

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
                const alquilerCard = document.createElement('div');
                alquilerCard.className = 'card';
                alquilerCard.innerHTML = `
                    <h3>${alquiler.manga.titulo}</h3>
                    <p><strong>Alquilado por:</strong> ${alquiler.cliente.nombre}</p>
                    <p><strong>Fecha de Inicio:</strong> ${alquiler.fechaInicio}</p>
                    <button class="devolver-btn" data-id="${alquiler.id}">Devolver</button>
                `;
                alquileresActivosList.appendChild(alquilerCard);
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
        const nombreInput = document.getElementById('clienteNombre');
        const nombre = nombreInput.value.trim();

        if (!nombre) return;

        try {
            const response = await fetch(`${API_URL}/clientes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre: nombre }),
            });

            if (response.status === 201) {
                clienteForm.reset();
                cargarClientes(); // Solo recargamos clientes
            } else {
                alert('Error al añadir cliente.');
            }
        } catch (error) {
            alert('No se pudo conectar al servidor.');
        }
    });

    mangaForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const tituloInput = document.getElementById('mangaTitulo');
        const autorInput = document.getElementById('mangaAutor');
        const titulo = tituloInput.value.trim();
        const autor = autorInput.value.trim();

        if (!titulo || !autor) return;

        try {
            const response = await fetch(`${API_URL}/mangas`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ titulo: titulo, autor: autor }),
            });

            if (response.status === 201) {
                mangaForm.reset();
                cargarMangas(); // Solo recargamos mangas
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
                    const errorData = await response.json();
                    alert(`Error al devolver: ${errorData.message}`);
                }
            } catch (error) {
                alert('No se pudo conectar con el servidor.');
            }
        }
    });

    // --- INICIALIZACIÓN ---
    cargarTodo();
});
