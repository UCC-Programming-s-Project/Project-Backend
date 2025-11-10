package com.proyectoucc.alquilermangas.mapper;

import com.proyectoucc.alquilermangas.dto.AlquilerDTO;
import com.proyectoucc.alquilermangas.dto.ClienteDTO;
import com.proyectoucc.alquilermangas.dto.MangaDTO;
import com.proyectoucc.alquilermangas.entities.Alquiler;
import com.proyectoucc.alquilermangas.entities.Cliente;
import com.proyectoucc.alquilermangas.entities.Manga;

public class AlquilerMapper {

    public static ClienteDTO toClienteDTO(Cliente cliente) {
        // CORREGIDO: Añadido getCorreo()
        return new ClienteDTO(cliente.getId(), cliente.getNombre(), cliente.getCorreo());
    }

    public static MangaDTO toMangaDTO(Manga manga) {
        // CORREGIDO: Añadido getImagenUrl()
        return new MangaDTO(manga.getId(), manga.getTitulo(), manga.getAutor(), manga.getImagenUrl(), manga.getDisponible());
    }

    public static AlquilerDTO toAlquilerDTO(Alquiler alquiler) {
        return new AlquilerDTO(
            alquiler.getId(),
            toClienteDTO(alquiler.getCliente()),
            toMangaDTO(alquiler.getManga()),
            alquiler.getFechaInicio(),
            alquiler.getFechaFin(),
            alquiler.isDevuelto()
        );
    }
}
