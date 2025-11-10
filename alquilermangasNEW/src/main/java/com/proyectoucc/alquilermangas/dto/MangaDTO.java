package com.proyectoucc.alquilermangas.dto;

public record MangaDTO(
    Long id,
    String titulo,
    String autor,
    boolean disponible // Corregido: de isDisponible a disponible
) {}
