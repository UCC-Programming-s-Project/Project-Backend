package com.proyectoucc.alquilermangas.dto;

public record MangaDTO(
    Long id,
    String titulo,
    String autor,
    boolean isDisponible
) {}
