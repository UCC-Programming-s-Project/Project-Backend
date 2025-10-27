document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'http://localhost:8080';

    const mangaSelect = document.getElementById('mangaSelect');
    const clienteSelect = document.getElementById('clienteSelect');
    const mangasDisponiblesList = document.getElementById('mangas-list');
    const alquileresActivosList = document.getElementById('alquileres-list');
    const alquilerForm = document.getElementById('alquilerForm');
    const formError = document.getElementById('form-error');

    // --- FUNCIONES DE CARGA DE DATOS ---

    async function cargarClientes() {
        try {
            const response = await fetch(`${API_URL}/clientes`);
            if (!response.ok) throw new Error('No se pudieron cargar los clientes.');
            const clientes = await response.json();

            clienteSelect.innerHTML = '<option value="">-- Seleccione un cliente --</option>';
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

    async function cargarMangas() {
        try {
            const response = await fetch(`${API_URL}/mangas`);
            if (!response.ok) throw new Error('No se pudieron cargar los mangas.');
            const mangas = await response.json();

            mangasDisponiblesList.innerHTML = '';
            mangaSelect.innerHTML = '<option value="">-- Seleccione un manga --</option>';
            
            mangas.forEach(manga => {
                // Añadir a la lista de mangas disponibles en la UI
                const mangaCard = document.createElement('div');
                mangaCard.className = 'card';
                mangaCard.innerHTML = `
                    <h3>${manga.titulo}</h3>
                    <p>por ${manga.autor}</p>
                    <p><strong>Género:</strong> ${manga.genero}</p>
                    <p><strong>Precio:</strong> $${manga.precio.toFixed(2)}</p>
                    <p class="status status-${manga.status}">${manga.status.replace('_', ' ')}</p>
                `;
                mangasDisponiblesList.appendChild(mangaCard);

                // Añadir solo los disponibles al formulario
                if (manga.status === 'DISPONIBLE') {
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
            alquileres.filter(a => a.fechaFin === null).forEach(alquiler => {
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
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    clienteId: parseInt(clienteId),
                    mangaId: parseInt(mangaId)
                }),
            });

            if (response.status === 201) {
                alquilerForm.reset();
                cargarTodo(); // Recargar toda la data
            } else {
                const errorData = await response.json();
                formError.textContent = errorData.message || 'Ocurrió un error al alquilar.';
            }
        } catch (error) {
            console.error('Error al enviar formulario:', error);
            formError.textContent = 'No se pudo conectar con el servidor.';
        }
    });

    alquileresActivosList.addEventListener('click', async (e) => {
        if (e.target.classList.contains('devolver-btn')) {
            const alquilerId = e.target.dataset.id;
            try {
                const response = await fetch(`${API_URL}/alquileres/${alquilerId}/devolver`, {
                    method: 'POST',
                });

                if (response.ok) {
                    cargarTodo(); // Recargar toda la data
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
    cargarTodo();
});
