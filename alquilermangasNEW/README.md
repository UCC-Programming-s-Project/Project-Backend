# API de Alquiler de Mangas - Proyecto UCC

Este proyecto es una API RESTful desarrollada en Java con Spring Boot para gestionar el alquiler de mangas en una tienda. Permite administrar clientes, mangas y el proceso de alquiler y devolución.

## Tecnologías Utilizadas

- **Java 17**: Lenguaje de programación base.
- **Spring Boot 3**: Framework principal para la creación de la API.
- **Spring Web**: Para construir los endpoints RESTful.
- **Spring Data JPA**: Para la persistencia de datos y la interacción con la base de datos.
- **H2 Database**: Base de datos en memoria para facilitar el desarrollo y las pruebas.
- **Maven**: Herramienta para la gestión de dependencias y la construcción del proyecto.

---

## Cómo Ejecutar el Proyecto

### Prerrequisitos
- Tener instalado Java (versión 17 o superior).
- Tener instalado [Apache Maven](https://maven.apache.org/download.cgi).

### Pasos para la Ejecución
1.  **Clonar o descargar el proyecto** en tu máquina local.
2.  **Abrir una terminal** o línea de comandos en el directorio raíz del proyecto (`alquilermangasNEW`).
3.  **Ejecutar el siguiente comando de Maven** para compilar el proyecto e iniciar el servidor:
    ```bash
    mvn spring-boot:run
    ```
4.  Una vez iniciado, la API estará disponible en `http://localhost:8080`.

### Acceder a la Base de Datos H2
La base de datos en memoria H2 proporciona una consola web para visualizar los datos.
1.  Navega a `http://localhost:8080/h2-console` en tu navegador.
2.  Asegúrate de que los parámetros de conexión sean los siguientes (son los valores por defecto de Spring Boot):
    - **Driver Class:** `org.h2.Driver`
    - **JDBC URL:** `jdbc:h2:mem:testdb`
    - **User Name:** `sa`
    - **Password:** (dejar en blanco)
3.  Haz clic en **Connect** para acceder y ejecutar consultas SQL directamente sobre las tablas `CLIENTE`, `MANGA` y `ALQUILER`.

---

## Explicación de la Arquitectura y Código

El proyecto sigue una arquitectura en capas para separar responsabilidades, lo que lo hace más mantenible y escalable.

- `com.proyectoucc.alquilermangas`
  - `controllers`: Responsables de manejar las peticiones HTTP, validarlas y devolver las respuestas al cliente. **No contienen lógica de negocio**.
  - `services`: Contienen la lógica de negocio principal. Orquestan las operaciones, interactúan con los repositorios y realizan validaciones.
  - `repositories`: Interfaces que extienden `JpaRepository`. Spring Data JPA se encarga de implementar los métodos para interactuar con la base de datos (CRUD).
  - `entities`: Clases que modelan las tablas de la base de datos (`Cliente`, `Manga`, `Alquiler`) usando anotaciones de JPA (`@Entity`, `@Table`, `@ManyToOne`, etc.).
  - `dto` (Data Transfer Object): Clases/Records que definen la **forma pública de los datos**. Se usan para controlar la información que se envía y se recibe a través de la API, evitando exponer la estructura interna de las entidades.
  - `mapper`: Clases de utilidad para convertir `Entities` a `DTOs` y viceversa. Esto centraliza la lógica de transformación.

### Mejoras Clave Implementadas

1.  **Funcionalidad de Devolución**:
    - Se creó el endpoint `POST /alquileres/{id}/devolver`.
    - Esta operación es **transaccional (`@Transactional`)**: actualiza el estado `devuelto` del `Alquiler` a `true` y, simultáneamente, actualiza el estado `disponible` del `Manga` a `true`, asegurando la consistencia de los datos.

2.  **Refactorización a DTOs (Data Transfer Objects)**:
    - **Problema Solucionado**: Antes se exponían las entidades JPA directamente, lo cual es una mala práctica (riesgos de seguridad, acoplamiento).
    - **Solución**: Se crearon DTOs como `MangaDTO`, `ClienteDTO` y `AlquilerDTO` para las respuestas. Esto define un "contrato" claro para la API.
    - **Petición Optimizada**: Se creó el `AlquilerCreateRequestDTO`, que simplifica la creación de un alquiler, ya que solo requiere los `IDs` del cliente y el manga, no los objetos completos.

---

## Guía de Pruebas con Postman

A continuación, se presenta un flujo de trabajo para probar la API.

### 1. Crear un Cliente
- **Método:** `POST`
- **URL:** `http://localhost:8080/clientes`
- **Body (raw, JSON):**
  ```json
  {
      "nombre": "Carlos Mendoza",
      "correo": "carlos.mendoza@example.com"
  }
  ```
- **Resultado:** Recibirás el cliente creado con su `id`.

### 2. Crear un Manga
- **Método:** `POST`
- **URL:** `http://localhost:8080/mangas`
- **Body (raw, JSON):**
  ```json
  {
      "titulo": "Jujutsu Kaisen",
      "autor": "Gege Akutami",
      "disponible": true
  }
  ```
- **Resultado:** Recibirás el manga creado con su `id`.

### 3. Crear un Alquiler (¡Usando el DTO!)
- **Método:** `POST`
- **URL:** `http://localhost:8080/alquileres`
- **Body (raw, JSON):** (Usa los IDs del cliente y manga creados anteriormente)
  ```json
  {
      "clienteId": 1,
      "mangaId": 1,
      "fechaInicio": "2024-01-01T10:00:00.000+00:00",
      "fechaFin": "2024-01-08T10:00:00.000+00:00"
  }
  ```
- **Resultado:** Un DTO anidado del alquiler. Notarás que el manga dentro de la respuesta ahora tiene `"isDisponible": false`.

### 4. Verificar el Estado del Manga
- **Método:** `GET`
- **URL:** `http://localhost:8080/mangas/1`
- **Resultado:** El manga "Jujutsu Kaisen" aparecerá con `"isDisponible": false`.

### 5. Devolver el Manga Alquilado
- **Método:** `POST`
- **URL:** `http://localhost:8080/alquileres/1/devolver` (Usa el ID del alquiler, no del manga)
- **Resultado:** El DTO del alquiler con `"isDevuelto": true`. El manga anidado tendrá `"isDisponible": true`.

### 6. Verificar el Estado del Manga de Nuevo
- **Método:** `GET`
- **URL:** `http://localhost:8080/mangas/1`
- **Resultado:** El manga "Jujutsu Kaisen" volverá a aparecer con `"isDisponible": true`. ¡Listo para ser alquilado de nuevo!

### 7. Probar Caso de Error: Devolver un Alquiler ya Devuelto
- **Método:** `POST`
- **URL:** `http://localhost:8080/alquileres/1/devolver`
- **Resultado:**
  - **Status:** `409 Conflict` (o `500 Internal Server Error` si no se ha implementado el manejo de excepciones global).
  - **Mensaje:** `"Este alquiler ya ha sido devuelto."`
