package com.proyectoucc.alquilermangas.dto;

import java.util.Date;

public record AlquilerDTO(
    Long id,
    ClienteDTO cliente,
    MangaDTO manga,
    Date fechaInicio,
    Date fechaFin,
    boolean isDevuelto
) {}
