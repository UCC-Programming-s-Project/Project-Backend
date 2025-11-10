# 📖 README: Proyecto "MangaUCC Pro"

Este documento proporciona una explicación detallada del proyecto de gestión de alquiler de mangas "MangaUCC Pro". El objetivo es servir como una guía completa tanto para la ejecución y prueba de la aplicación como para la comprensión de su arquitectura interna y las tecnologías involucradas.

## 📝 Índice
1.  [Visión General del Proyecto](#1-visión-general-del-proyecto)
2.  [🚀 Cómo Ejecutar la Aplicación](#2--cómo-ejecutar-la-aplicación)
3.  [🛠️ Tecnologías Utilizadas](#3-️-tecnologías-utilizadas)
4.  [🏗️ Arquitectura y Estructura de Archivos](#4-️-arquitectura-y-estructura-de-archivos)
    *   [Backend (Spring Boot)](#backend-spring-boot)
    *   [Frontend (Vanilla JS)](#frontend-vanilla-js)
5.  [🧠 Análisis Detallado del Código](#5--análisis-detallado-del-código)
    *   [Capa de Datos (Entidades y Repositorios)](#capa-de-datos-entidades-y-repositorios)
    *   [Capa de API (Controladores)](#capa-de-api-controladores)
    *   [Capa de Lógica de Negocio (Servicios y DTOs)](#capa-de-lógica-de-negocio-servicios-y-dtos)
    *   [Carga Inicial de Datos (`DataLoader`)](#carga-inicial-de-datos-dataloader)
    *   [Lógica del Frontend (`app.js`)](#lógica-del-frontend-appjs)
6.  [❓ Preguntas y Conceptos Clave](#6--preguntas-y-conceptos-clave)

---

### 1. Visión General del Proyecto

**MangaUCC Pro** es una aplicación web completa (Full-Stack) diseñada para la administración de una tienda de alquiler de mangas. Permite a los usuarios gestionar el inventario de mangas, registrar clientes y procesar alquileres y devoluciones.

Funcionalidades implementadas:
*   **Gestión (CRUD):** Crear, Leer, Actualizar y Eliminar mangas y clientes.
*   **Sistema de Alquiler:** Registrar un nuevo alquiler asociando un cliente y un manga.
*   **Devoluciones:** Marcar un manga como devuelto, liberándolo para un nuevo alquiler.
*   **Dashboard de Estadísticas:** Visualización en tiempo real de métricas clave (total de mangas, disponibles, alquilados, manga más popular).
*   **Búsqueda en Tiempo Real:** Filtrar el inventario de mangas a medida que el usuario escribe.
*   **Alertas Visuales:** Los alquileres cuya fecha de devolución ha pasado se resaltan en rojo.
*   **Base de Datos de Demostración:** La aplicación se inicia con un conjunto de datos de ejemplo para poder probar todas las funcionalidades inmediatamente.

### 2. 🚀 Cómo Ejecutar la Aplicación

Para ejecutar el proyecto en tu máquina local, sigue estos pasos:

**Prerrequisitos:**
*   **Java Development Kit (JDK):** Versión 17 o superior.
*   **Apache Maven:** Un gestor de dependencias y construcción de proyectos Java.

**Pasos para la ejecución:**
1.  Abre una terminal o línea de comandos.
2.  Navega hasta el directorio raíz del proyecto (la carpeta `alquilermangasNEW`).
3.  Ejecuta el siguiente comando:
    ```bash
    mvn spring-boot:run
    ```
4.  Maven descargará las dependencias necesarias y compilará el proyecto. Después de unos segundos, el servidor se iniciará. Verás un mensaje en la consola indicando que la aplicación se ha iniciado en el puerto `8080`.
5.  Abre tu navegador web y ve a la siguiente URL:
    ```
    http://localhost:8080
    ```
6.  ¡Listo! La aplicación estará funcionando con los datos de ejemplo precargados.

**Acceso a la Base de Datos (Opcional):**
La aplicación utiliza una base de datos en memoria (H2). Puedes acceder a su consola web para inspeccionar los datos directamente:
1.  Ve a `http://localhost:8080/h2-console`.
2.  En el campo `JDBC URL`, asegúrate de que ponga `jdbc:h2:mem:testdb`.
3.  Haz clic en `Connect`. Ahora podrás ejecutar consultas SQL sobre las tablas `MANGA`, `CLIENTE` y `ALQUILERES`.

### 3. 🛠️ Tecnologías Utilizadas

*   **Backend:**
    *   **Java 17:** Lenguaje de programación principal.
    *   **Spring Boot 3:** Framework para crear aplicaciones autocontenidas y robustas.
    *   **Spring Web:** Para construir los endpoints de la API REST.
    *   **Spring Data JPA:** Para interactuar con la base de datos de forma sencilla mediante repositorios.
    *   **H2 Database:** Base de datos en memoria, ideal para desarrollo y demostraciones.
    *   **Maven:** Gestor del proyecto y sus dependencias.
    *   **MapStruct:** Para mapear (convertir) automáticamente entre entidades JPA y objetos DTO.
*   **Frontend:**
    *   **HTML5:** Para la estructura de la página.
    *   **CSS3:** Para los estilos visuales personalizados.
    *   **JavaScript (ES6+):** Para la lógica interactiva, la comunicación con el backend y la manipulación del DOM.
    *   **Bootstrap 5:** Framework CSS para un diseño responsive y componentes pre-diseñados (modales, tarjetas, etc.).

### 4. 🏗️ Arquitectura y Estructura de Archivos

El proyecto sigue una arquitectura cliente-servidor desacoplada.

#### Backend (Spring Boot)
Ubicado en `src/main/java/com/proyectoucc/alquilermangas/`:
*   **`entities`**: Contiene las clases (`Manga`, `Cliente`, `Alquiler`) que modelan las tablas de la base de datos. Usan anotaciones de JPA (`@Entity`).
*   **`repositories`**: Interfaces que extienden de `JpaRepository`. Spring Data las implementa automáticamente para darnos las operaciones CRUD (Create, Read, Update, Delete) sin escribir código.
*   **`controllers`**: Clases que definen la API REST. Exponen los endpoints (URLs) a los que el frontend llamará (ej. `/api/mangas`). Usan anotaciones como `@RestController`, `@GetMapping`, `@PostMapping`.
*   **`services`**: Contiene la lógica de negocio más compleja. Por ejemplo, `StatService` calcula las estadísticas para el dashboard.
*   **`dto`**: (Data Transfer Objects) Clases simples que definen la "forma" de los datos que se envían y reciben a través de la API. Se usan para no exponer las entidades de la base de datos directamente al exterior.
*   **`mapper`**: Interfaces de MapStruct que definen cómo convertir una entidad (ej. `Manga`) a su DTO correspondiente (ej. `MangaDTO`).
*   **`DataLoader.java`**: Una clase especial que se ejecuta al inicio para poblar la base de datos con datos de ejemplo.

#### Frontend (Vanilla JS)
Ubicado en `src/main/resources/static/`:
*   **`index.html`**: El esqueleto de la aplicación. Contiene la estructura de la página, incluyendo los formularios, las secciones para las listas y los modales (ventanas emergentes).
*   **`style.css`**: Hoja de estilos personalizada. Define la apariencia de elementos como las tarjetas de manga, el resaltado de alquileres vencidos y otras personalizaciones visuales.
*   **`app.js`**: El cerebro del frontend. Contiene toda la lógica para:
    *   Pedir los datos al backend (usando `fetch`).
    *   Actualizar dinámicamente el HTML para mostrar los datos.
    *   Manejar los eventos del usuario (clics en botones, envíos de formulario, escritura en el buscador).

### 5. 🧠 Análisis Detallado del Código

#### Capa de Datos (Entidades y Repositorios)
*   **`Manga.java`**: Define un manga con `id`, `titulo`, `autor`, `imagenUrl` y un booleano `disponible`.
*   **`Cliente.java`**: Define un cliente con `id`, `nombre` y `correo`.
*   **`Alquiler.java`**: Es la entidad más compleja. Define un alquiler con `id`, `fechaInicio`, `fechaFin` y `devuelto`. Usa la anotación `@ManyToOne` para establecer las relaciones: un alquiler pertenece a un `Cliente` y a un `Manga`.
*   **`AlquilerRepository.java`**: Además de los métodos CRUD heredados, se añadió una consulta personalizada (`@Query`) llamada `findMangaMasAlquiladoId` que busca en la tabla de alquileres cuál es el `manga_id` que más se repite para encontrar al manga más popular.

#### Capa de API (Controladores)
*   **`MangaController.java`**: Gestiona las peticiones a `/api/mangas`.
    *   `GET /api/mangas`: Devuelve todos los mangas. Permite un parámetro opcional `?titulo=` para filtrar.
    *   `POST /api/mangas`: Crea un nuevo manga.
    *   `PUT /api/mangas/{id}`: Actualiza un manga existente.
    *   `DELETE /api/mangas/{id}`: Elimina un manga.
*   **`StatController.java`**: Expone un único endpoint `GET /api/stats` que devuelve el DTO `StatsDTO` con todas las estadísticas calculadas para el dashboard.

#### Capa de Lógica de Negocio (Servicios y DTOs)
*   **`StatService.java`**: Orquesta el cálculo de las estadísticas. Llama a los diferentes repositorios, cuenta los resultados y los ensambla en un `StatsDTO`.
*   **`StatsDTO.java`**: Un objeto simple que transporta los cuatro datos del dashboard. Esto es más eficiente que hacer cuatro peticiones separadas desde el frontend.

#### Carga Inicial de Datos (`DataLoader`)
*   Esta clase implementa `CommandLineRunner`, una interfaz de Spring Boot que garantiza que su método `run()` se ejecute justo después de que la aplicación arranque.
*   Primero comprueba si la base de datos ya tiene datos (`mangaRepository.count() > 0`). Si es así, no hace nada para evitar duplicados.
*   Luego, crea y guarda una lista de `Manga` y `Cliente`.
*   Finalmente, crea varios `Alquiler`, algunos activos, otros vencidos y otros ya devueltos, modificando el estado de disponibilidad de los mangas correspondientes. Esto asegura un escenario de demostración realista.

#### Lógica del Frontend (`app.js`)
*   **`document.addEventListener('DOMContentLoaded', ...)`**: Todo el código está envuelto en este evento, que espera a que el HTML esté completamente cargado antes de ejecutar el JavaScript.
*   **`async function cargar...()`**: Las funciones que piden datos al backend son asíncronas (`async`) porque la comunicación por red toma tiempo. Usan `await fetch(...)` para esperar la respuesta del servidor sin bloquear el navegador.
*   **Manipulación del DOM**: Después de recibir los datos (en formato JSON), el código recorre las listas (ej. `mangas.forEach(...)`) y crea dinámicamente el HTML (tarjetas, filas, opciones de un select) para mostrar la información en pantalla.
*   **Manejo de Eventos (`.addEventListener`)**: Se asignan "escuchas" a los botones y formularios.
    *   El formulario de alquiler intercepta el evento `submit`, previene el envío tradicional, recoge los datos de los inputs y los envía al backend con `fetch` y el método `POST`.
    *   Los botones de "Editar" y "Eliminar" usan el mismo sistema. Delegan el evento a un contenedor padre (`clientesList.addEventListener(...)`) para ser más eficientes.
    *   El buscador de mangas escucha el evento `input`, que se dispara con cada tecla que el usuario presiona, y vuelve a llamar a `cargarMangas()` con el término de búsqueda, logrando la interactividad en tiempo real.

### 6. ❓ Preguntas y Conceptos Clave

**P: ¿Qué es Spring Boot y por qué se usó?**
**R:** Spring Boot es un framework que facilita enormemente la creación de aplicaciones Java. Se encarga de la configuración "aburrida" y repetitiva, permitiendo al desarrollador centrarse en la lógica de negocio. Lo usamos porque nos da un servidor web, acceso a bases de datos y un sistema de dependencias, todo en un paquete fácil de ejecutar.

**P: ¿Qué es una API REST?**
**R:** Es un estilo de arquitectura para construir servicios web. Se basa en los principios del protocolo HTTP (los verbos `GET`, `POST`, `PUT`, `DELETE`) para la comunicación entre un cliente (nuestro frontend) y un servidor (nuestro backend). Los datos se intercambian comúnmente en formato JSON.

**P: ¿Por qué separamos el frontend del backend?**
**R:** Esta separación (arquitectura desacoplada) es una práctica moderna y muy recomendada. Permite que los dos equipos (o desarrolladores) trabajen de forma independiente. Además, hace que la aplicación sea más escalable: podríamos crear una aplicación móvil para Android o iOS que consumiera la misma API REST sin cambiar una sola línea del backend.

**P: ¿Qué es JPA y la base de datos H2?**
**R:** **JPA (Java Persistence API)** es una especificación que nos permite trabajar con bases de datos relacionales como si estuviéramos manejando objetos de Java, sin necesidad de escribir código SQL manualmente. A esto se le llama Mapeo Objeto-Relacional (ORM). **H2** es una base de datos escrita en Java que puede funcionar en memoria. Es extremadamente rápida y perfecta para desarrollo, ya que no requiere instalación y se reinicia con la aplicación.

**P: ¿Para qué sirven los DTOs (Data Transfer Objects)?**
**R:** Los DTOs son un "contrato" entre el frontend y el backend. Sirven para dos propósitos principales: 1) **Seguridad:** Evitan que expongamos accidentalmente campos sensibles de nuestra base de datos (como contraseñas o datos internos). 2) **Eficiencia:** Nos permiten modelar la información exactamente como el frontend la necesita, combinando datos de varias entidades en un solo objeto para reducir el número de peticiones a la API.

**P: ¿Cómo funciona la comunicación entre el frontend y el backend?**
**R:** 1. El usuario realiza una acción en el navegador (ej. hace clic en "Guardar Manga").
   2. El JavaScript (`app.js`) captura este evento.
   3. Se crea una petición `fetch` a una URL del backend (ej. `POST /api/mangas`). Los datos del manga se convierten a una cadena de texto en formato JSON y se envían en el cuerpo de la petición.
   4. El servidor Spring Boot recibe la petición, la dirige al `MangaController`, que procesa los datos y los guarda en la base de datos.
   5. El servidor responde con un código de estado (ej. `201 Created`) para indicar que todo fue bien.
   6. El `fetch` en el frontend recibe la respuesta y, si fue exitosa, ejecuta la lógica correspondiente (ej. cerrar el modal y recargar la lista de mangas).
