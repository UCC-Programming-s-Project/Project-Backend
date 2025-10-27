package com.proyectoucc.alquilermangas.dto;

import java.time.LocalDate;

public class AlquilerResponseDTO {
    private Long id;
    private ClienteResponseDTO cliente;
    private MangaResponseDTO manga;
    private LocalDate fechaInicio;
    private LocalDate fechaFin;

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ClienteResponseDTO getCliente() {
        return cliente;
    }

    public void setCliente(ClienteResponseDTO cliente) {
        this.cliente = cliente;
    }

    public MangaResponseDTO getManga() {
        return manga;
    }

    public void setManga(MangaResponseDTO manga) {
        this.manga = manga;
    }

    public LocalDate getFechaInicio() {
        return fechaInicio;
    }

    public void setFechaInicio(LocalDate fechaInicio) {
        this.fechaInicio = fechaInicio;
    }

    public LocalDate getFechaFin() {
        return fechaFin;
    }

    public void setFechaFin(LocalDate fechaFin) {
        this.fechaFin = fechaFin;
    }
}
