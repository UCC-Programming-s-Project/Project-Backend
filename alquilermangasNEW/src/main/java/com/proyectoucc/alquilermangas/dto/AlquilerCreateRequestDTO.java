package com.proyectoucc.alquilermangas.dto;


public record AlquilerCreateRequestDTO(
    Long clienteId,
    Long mangaId
) {}
