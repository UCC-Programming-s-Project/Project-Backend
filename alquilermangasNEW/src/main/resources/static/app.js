document.addEventListener('DOMContentLoaded', () => {
    // La URL base de la API de tu backend. Asegúrate de que el puerto sea el correcto.
    const API_URL = 'http://localhost:8080';

    // Referencias a los elementos del DOM
    const mangaSelect = document.getElementById('mangaSelect');
    const clienteSelect = document.getElementById('clienteSelect');
    const mangasDisponiblesList = document.getElementById('mangas-list');
    const alquileresActivosList = document.getElementById('alquileres-list');
    const alquilerForm = document.getElementById('alquilerForm');
    const formError = document.getElementById('form-error');

    // --- FUNCIONES DE CARGA DE DATOS ---

    /**
     * Carga los clientes desde la API y los popula en el menú desplegable.
     */
    async function cargarClientes() {
        try {
            const response = await fetch(`${API_URL}/clientes`);
            if (!response.ok) throw new Error('No se pudieron cargar los clientes.');
            const clientes = await response.json();

            clienteSelect.innerHTML = '<option value="">-- Seleccione un cliente --</option>'; // Opción por defecto
            clientes.forEach(cliente => {
                const option = document.createElement('option');
                option.value = cliente.id;
                option.textContent = cliente.nombre;
                clienteSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Error cargando clientes:', error);
        }
    }

    /**
     * Carga los mangas desde la API, los muestra en la lista de disponibles
     * y popula el menú desplegable del formulario solo con los disponibles.
     */
    async function cargarMangas() {
        try {
            const response = await fetch(`${API_URL}/mangas`);
            if (!response.ok) throw new Error('No se pudieron cargar los mangas.');
            const mangas = await response.json();

            mangasDisponiblesList.innerHTML = ''; // Limpiar lista
            mangaSelect.innerHTML = '<option value="">-- Seleccione un manga --</option>'; // Limpiar select

            mangas.forEach(manga => {
                // Tarjeta de manga para la lista visual
                const mangaCard = document.createElement('div');
                mangaCard.className = 'card';
                // Adaptado al nuevo DTO: Se usa `disponible` y se eliminan `genero` y `precio`.
                const estado = manga.disponible ? 'DISPONIBLE' : 'ALQUILADO';
                mangaCard.innerHTML = `
                    <h3>${manga.titulo}</h3>
                    <p>por ${manga.autor}</p>
                    <p class="status status-${estado}">${estado}</p>
                `;
                mangasDisponiblesList.appendChild(mangaCard);

                // Añadir solo los mangas disponibles al formulario de alquiler
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

    /**
     * Carga los alquileres y muestra solo los que no han sido devueltos.
     */
    async function cargarAlquileres() {
        try {
            const response = await fetch(`${API_URL}/alquileres`);
            if (!response.ok) throw new Error('No se pudieron cargar los alquileres.');
            const alquileres = await response.json();

            alquileresActivosList.innerHTML = ''; // Limpiar lista
            // Adaptado al nuevo DTO: Se filtra por `devuelto === false`
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

    /**
     * Función helper para recargar todos los datos de la página.
     */
    function cargarTodo() {
        cargarClientes();
        cargarMangas();
        cargarAlquileres();
    }

    // --- MANEJADORES DE EVENTOS ---

    /**
     * Maneja el envío del formulario para crear un nuevo alquiler.
     */
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
            // Adaptado al nuevo DTO: Se envía `fechaInicio` y `fechaFin` como null.
            const body = {
                clienteId: parseInt(clienteId),
                mangaId: parseInt(mangaId),
                fechaInicio: new Date().toISOString().split('T')[0], // Fecha de hoy en formato YYYY-MM-DD
                fechaFin: null
            };

            const response = await fetch(`${API_URL}/alquileres`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });

            if (response.status === 201) { // 201 Created
                alquilerForm.reset();
                cargarTodo(); // Recargar toda la data para reflejar el nuevo alquiler
            } else {
                const errorData = await response.json();
                formError.textContent = errorData.message || 'Ocurrió un error al alquilar.';
            }
        } catch (error) {
            console.error('Error al enviar formulario:', error);
            formError.textContent = 'No se pudo conectar con el servidor.';
        }
    });

    /**
     * Maneja los clics en los botones "Devolver" de la lista de alquileres.
     */
    alquileresActivosList.addEventListener('click', async (e) => {
        if (e.target.classList.contains('devolver-btn')) {
            const alquilerId = e.target.dataset.id;
            try {
                // El endpoint de devolver ya era compatible.
                const response = await fetch(`${API_URL}/alquileres/${alquilerId}/devolver`, {
                    method: 'POST',
                });

                if (response.ok) {
                    cargarTodo(); // Recargar la data para que el alquiler desaparecido y el manga aparezca como disponible.
                } else {
                    const errorData = await response.json();
                    alert(`Error al devolver: ${errorData.message}`);
                }
            } catch (error) {
                console.error('Error al devolver:', error);
                alert('No se pudo conectar con el servidor.');
            }
        }
    });

    // --- INICIALIZACIÓN ---
    // Carga todos los datos cuando la página está lista.
    cargarTodo();
});
