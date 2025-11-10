package com.proyectoucc.alquilermangas.dto;

// No se necesitan fechas aquí, el servidor las generará
public record AlquilerCreateRequestDTO(
    Long clienteId,
    Long mangaId
) {}
