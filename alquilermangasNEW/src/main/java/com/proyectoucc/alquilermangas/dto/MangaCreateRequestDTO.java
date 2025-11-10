package com.proyectoucc.alquilermangas.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MangaCreateRequestDTO {
    private String titulo;
    private String autor;
    private String imagenUrl;
}
