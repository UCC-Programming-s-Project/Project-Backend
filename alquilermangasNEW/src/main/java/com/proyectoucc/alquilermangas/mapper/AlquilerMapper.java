package com.proyectoucc.alquilermangas.mapper;

import com.proyectoucc.alquilermangas.dto.AlquilerDTO;
import com.proyectoucc.alquilermangas.dto.ClienteDTO;
import com.proyectoucc.alquilermangas.dto.MangaDTO;
import com.proyectoucc.alquilermangas.entities.Alquiler;
import com.proyectoucc.alquilermangas.entities.Cliente;
import com.proyectoucc.alquilermangas.entities.Manga;

public class AlquilerMapper {

    public static ClienteDTO toClienteDTO(Cliente cliente) {
        // Corregido: Se eliminó la referencia a getCorreo()
        return new ClienteDTO(cliente.getId(), cliente.getNombre());
    }

    public static MangaDTO toMangaDTO(Manga manga) {
        // Corregido: Se cambió isDisponible() por getDisponible()
        return new MangaDTO(manga.getId(), manga.getTitulo(), manga.getAutor(), manga.getDisponible());
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
