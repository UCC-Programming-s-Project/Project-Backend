package com.proyectoucc.alquilermangas.entities;

import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "alquileres")
public class Alquiler {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "cliente_id", nullable = false)
    private Cliente cliente;

    @ManyToOne
    @JoinColumn(name = "manga_id", nullable = false)
    private Manga manga;

    private Date fechaInicio;
    private Date fechaFin;

    @Column(nullable = false)
    private boolean devuelto = false;

    // Constructores
    public Alquiler() {
    }

    public Alquiler(Cliente cliente, Manga manga, Date fechaInicio, Date fechaFin) {
        this.cliente = cliente;
        this.manga = manga;
        this.fechaInicio = fechaInicio;
        this.fechaFin = fechaFin;
        this.devuelto = false; // Aseguramos que siempre sea falso al crear
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Cliente getCliente() {
        return cliente;
    }

    public void setCliente(Cliente cliente) {
        this.cliente = cliente;
    }

    public Manga getManga() {
        return manga;
    }

    public void setManga(Manga manga) {
        this.manga = manga;
    }

    public Date getFechaInicio() {
        return fechaInicio;
    }

    public void setFechaInicio(Date fechaInicio) {
        this.fechaInicio = fechaInicio;
    }

    public Date getFechaFin() {
        return fechaFin;
    }

    public void setFechaFin(Date fechaFin) {
        this.fechaFin = fechaFin;
    }

    public boolean isDevuelto() {
        return devuelto;
    }

    public void setDevuelto(boolean devuelto) {
        this.devuelto = devuelto;
    }
}
