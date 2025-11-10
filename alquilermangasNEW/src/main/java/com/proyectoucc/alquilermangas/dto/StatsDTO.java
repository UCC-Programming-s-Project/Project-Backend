package com.proyectoucc.alquilermangas.dto;

public record StatsDTO(
    long totalMangas,
    long mangasDisponibles,
    long mangasAlquilados,
    MangaDTO mangaMasPopular
) {}
