package com.proyectoucc.alquilermangas.mappers;

import com.proyectoucc.alquilermangas.dto.AlquilerResponseDTO;
import com.proyectoucc.alquilermangas.dto.ClienteResponseDTO;
import com.proyectoucc.alquilermangas.dto.MangaResponseDTO;
import com.proyectoucc.alquilermangas.entities.Alquiler;
import com.proyectoucc.alquilermangas.entities.Cliente;
import com.proyectoucc.alquilermangas.entities.Manga;

import java.util.stream.Collectors;
import java.util.List;

public class AlquilerMapper {

    public static AlquilerResponseDTO toAlquilerResponseDTO(Alquiler alquiler) {
        if (alquiler == null) {
            return null;
        }

        AlquilerResponseDTO dto = new AlquilerResponseDTO();
        dto.setId(alquiler.getId());
        dto.setFechaInicio(alquiler.getFechaInicio());
        dto.setFechaFin(alquiler.getFechaFin());
        dto.setCliente(toClienteResponseDTO(alquiler.getCliente()));
        dto.setManga(toMangaResponseDTO(alquiler.getManga()));

        return dto;
    }

    public static List<AlquilerResponseDTO> toAlquilerResponseDTOList(List<Alquiler> alquileres) {
        return alquileres.stream()
                .map(AlquilerMapper::toAlquilerResponseDTO)
                .collect(Collectors.toList());
    }

    private static ClienteResponseDTO toClienteResponseDTO(Cliente cliente) {
        if (cliente == null) {
            return null;
        }
        ClienteResponseDTO dto = new ClienteResponseDTO();
        dto.setId(cliente.getId());
        dto.setNombre(cliente.getNombre());
        dto.setCorreo(cliente.getCorreo());
        return dto;
    }

    private static MangaResponseDTO toMangaResponseDTO(Manga manga) {
        if (manga == null) {
            return null;
        }
        MangaResponseDTO dto = new MangaResponseDTO();
        dto.setId(manga.getId());
        dto.setTitulo(manga.getTitulo());
        dto.setAutor(manga.getAutor());
        dto.setGenero(manga.getGenero());
        dto.setPrecio(manga.getPrecio());
        dto.setStatus(manga.getStatus().name()); // Convertir enum a String
        return dto;
    }
}
