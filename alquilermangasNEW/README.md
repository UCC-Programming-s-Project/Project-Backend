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
2.  Asegúrate de que los parámetros de conexión sean los siguientes:
    - **Driver Class:** `org.h2.Driver`
    - **JDBC URL:** `jdbc:h2:mem:alquilerdb`
    - **User Name:** `sa`
    - **Password:** (dejar en blanco)
3.  Haz clic en **Connect** para acceder. **Nota:** El nombre de la base de datos (`alquilerdb`) se define en el archivo `src/main/resources/application.properties` y debe coincidir en esta pantalla.

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

---

## Análisis de Código Relevante

Esta sección destaca fragmentos importantes para entender las decisiones de diseño.

### 1. La Transacción de Devolución (`AlquilerService.java`)

```java
@Transactional
public Alquiler devolver(Long id) {
    Alquiler alquiler = getById(id); // (1)

    if (alquiler.isDevuelto()) { // (2)
        throw new IllegalStateException("Este alquiler ya ha sido devuelto.");
    }

    Manga manga = alquiler.getManga(); // (3)
    manga.setDisponible(true);
    mangaRepository.save(manga); // (4)

    alquiler.setDevuelto(true); // (5)
    return alquilerRepository.save(alquiler);
}
```

-   **`@Transactional`**: Esta es la anotación más importante aquí. Asegura que todas las operaciones de base de datos dentro del método (`save` en `mangaRepository` y `save` en `alquilerRepository`) se ejecuten como una única unidad. **O ambas tienen éxito, o ninguna lo tiene**. Si la actualización del manga funcionara pero la del alquiler fallara, `@Transactional` revertiría el cambio del manga, manteniendo los datos consistentes.
-   **(1)** y **(3)**: Se recuperan las entidades de la base de datos.
-   **(2)**: Se añade lógica de negocio para evitar que un alquiler ya devuelto se procese de nuevo.
-   **(4)** y **(5)**: Se actualizan las dos entidades relacionadas en la misma operación: el manga vuelve a estar disponible y el alquiler se marca como devuelto.

### 2. Petición de Creación con DTO (`AlquilerController.java`)

```java
@PostMapping
public ResponseEntity<AlquilerDTO> create(@RequestBody AlquilerCreateRequestDTO requestDTO) {
    Alquiler nuevoAlquiler = alquilerService.create(requestDTO);
    return ResponseEntity.status(HttpStatus.CREATED).body(AlquilerMapper.toAlquilerDTO(nuevoAlquiler));
}
```

-   **`@RequestBody AlquilerCreateRequestDTO`**: Aquí está la mejora. El endpoint ya no recibe la entidad `Alquiler` completa. Recibe un DTO simple que solo contiene los IDs y las fechas. Esto desacopla la API de la estructura interna de la base de datos.
-   **`alquilerService.create(requestDTO)`**: Se pasa el DTO al servicio, que es el encargado de la lógica compleja de buscar las entidades por ID y crear el alquiler.
-   **`AlquilerMapper.toAlquilerDTO(...)`**: Antes de devolver la respuesta, la entidad `Alquiler` recién creada se convierte a un `AlquilerDTO`. Esto asegura que la respuesta de la API sea limpia y solo exponga los datos necesarios, ocultando detalles de la base de datos.

### 3. El DTO de Creación (`AlquilerCreateRequestDTO.java`)

```java
public record AlquilerCreateRequestDTO(
    Long clienteId,
    Long mangaId,
    LocalDateTime fechaInicio,
    LocalDateTime fechaFin
) {}
```

-   **`record`**: Se utiliza un `record` de Java, que es una forma moderna y concisa de crear clases que son simples contenedores de datos inmutables. Es perfecto para definir DTOs.
-   **Campos**: Nota cómo los campos son solo los IDs (`clienteId`, `mangaId`), no los objetos `Cliente` y `Manga` completos. Esto hace que la petición `POST` sea mucho más ligera y simple para el cliente de la API.

---

## Mejoras Clave Implementadas (Resumen)

1.  **Funcionalidad de Devolución Transaccional**: Se garantiza la consistencia de los datos al devolver un manga, actualizando tanto el alquiler como el inventario del manga de forma atómica.

2.  **Refactorización a DTOs (Data Transfer Objects)**:
    - **Problema Solucionado**: Se evitó exponer las entidades JPA directamente, una mala práctica de seguridad y diseño.
    - **Solución**: Se crearon DTOs (`MangaDTO`, `AlquilerDTO`) para definir un "contrato" claro y seguro para la API.
    - **Petición Optimizada**: Se simplificó la creación de alquileres con `AlquilerCreateRequestDTO`, requiriendo solo los IDs.

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

### 4. Devolver el Manga Alquilado
- **Método:** `POST`
- **URL:** `http://localhost:8080/alquileres/1/devolver` (Usa el ID del alquiler)

### 5. Probar Caso de Error: Devolver un Alquiler ya Devuelto
- **Método:** `POST`
- **URL:** `http://localhost:8080/alquileres/1/devolver`
- **Resultado Esperado:** Status `409 Conflict` o `500 Internal Server Error` con el mensaje `"Este alquiler ya ha sido devuelto."`.
