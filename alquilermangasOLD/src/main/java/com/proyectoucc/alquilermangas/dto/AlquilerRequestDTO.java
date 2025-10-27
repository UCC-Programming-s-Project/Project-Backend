package com.proyectoucc.alquilermangas.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class AlquilerRequestDTO {

    @NotNull(message = "El ID del cliente no puede ser nulo.")
    @Positive(message = "El ID del cliente debe ser un número positivo.")
    private Long clienteId;

    @NotNull(message = "El ID del manga no puede ser nulo.")
    @Positive(message = "El ID del manga debe ser un número positivo.")
    private Long mangaId;

    // Getters y Setters
    public Long getClienteId() {
        return clienteId;
    }

    public void setClienteId(Long clienteId) {
        this.clienteId = clienteId;
    }

    public Long getMangaId() {
        return mangaId;
    }

    public void setMangaId(Long mangaId) {
        this.mangaId = mangaId;
    }
}
