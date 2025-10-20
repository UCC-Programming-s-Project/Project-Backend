package com.proyectoucc.alquilermangas.entities;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
public class Alquiler {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Cliente cliente;

    @ManyToOne
    private Manga manga;

    private LocalDate fechaInicio;
    private LocalDate fechaFin;

    
}
