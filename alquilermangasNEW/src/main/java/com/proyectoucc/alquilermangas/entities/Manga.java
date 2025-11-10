package com.proyectoucc.alquilermangas.entities;

import jakarta.persistence.*;

@Entity
public class Manga {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titulo;
    private String autor;
    private String imagenUrl; // <-- NUEVO CAMPO
    private boolean disponible = true;

    // Constructor sin argumentos requerido por JPA
    public Manga() {}

    // Constructor opcional para facilitar la creación
    public Manga(String titulo, String autor, String imagenUrl) {
        this.titulo = titulo;
        this.autor = autor;
        this.imagenUrl = imagenUrl;
    }

    // Getters y setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }

    public String getAutor() { return autor; }
    public void setAutor(String autor) { this.autor = autor; }

    public String getImagenUrl() { return imagenUrl; }
    public void setImagenUrl(String imagenUrl) { this.imagenUrl = imagenUrl; }

    public boolean getDisponible() { return disponible; }
    public void setDisponible(boolean disponible) { this.disponible = disponible; }
}
