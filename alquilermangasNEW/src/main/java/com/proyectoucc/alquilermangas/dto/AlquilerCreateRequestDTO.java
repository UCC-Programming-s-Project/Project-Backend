package com.proyectoucc.alquilermangas.dto;

import java.util.Date;

public record AlquilerCreateRequestDTO(
    Long clienteId,
    Long mangaId,
    Date fechaInicio,
    Date fechaFin
) {}
