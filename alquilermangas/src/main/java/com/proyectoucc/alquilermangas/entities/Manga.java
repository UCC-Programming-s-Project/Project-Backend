package com.proyectoucc.alquilermangas.entities;

import jakarta.persistence.*;

@Entity
public class Manga {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titulo;
    private String autor;
    private String genero;
    private double precio;

    @Enumerated(EnumType.STRING)
    private MangaStatus status;

    // Constructor sin argumentos requerido por JPA
    public Manga() {}

    // Al crear un manga, siempre estara disponible
    @PrePersist
    protected void onCreate() {
        this.status = MangaStatus.DISPONIBLE;
    }

    // Getters y setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }

    public String getAutor() { return autor; }
    public void setAutor(String autor) { this.autor = autor; }

    public String getGenero() { return genero; }
    public void setGenero(String genero) { this.genero = genero; }

    public double getPrecio() { return precio; }
    public void setPrecio(double precio) { this.precio = precio; }

    public MangaStatus getStatus() { return status; }
    public void setStatus(MangaStatus status) { this.status = status; }
}
