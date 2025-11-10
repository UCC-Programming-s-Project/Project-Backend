package com.proyectoucc.alquilermangas.entities;

import jakarta.persistence.*;

@Entity
public class Manga {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titulo;
    private String autor;
    // Corregido: Inicializado a true por defecto
    private boolean disponible = true;

    // Constructor sin argumentos requerido por JPA
    public Manga() {}

    // Constructor opcional
    public Manga(String titulo, String autor, boolean disponible) {
        this.titulo = titulo;
        this.autor = autor;
        this.disponible = disponible;
    }

    // Getters y setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }

    public String getAutor() { return autor; }
    public void setAutor(String autor) { this.autor = autor; }

    // Corregido: Renombrado a getDisponible() para una correcta serialización JSON
    public boolean getDisponible() { return disponible; }
    public void setDisponible(boolean disponible) { this.disponible = disponible; }
}
