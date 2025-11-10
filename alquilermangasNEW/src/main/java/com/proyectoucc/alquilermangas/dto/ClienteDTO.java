package com.proyectoucc.alquilermangas.dto;

// Un record es una forma moderna y concisa de crear DTOs inmutables.
// Genera automáticamente constructores, getters (sin 'get'), equals, hashCode y toString.
public record ClienteDTO(
    Long id,
    String nombre,
    String correo // <-- AÑADIDO
) {}
