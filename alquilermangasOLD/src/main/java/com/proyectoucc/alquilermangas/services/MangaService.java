package com.proyectoucc.alquilermangas.services;

import com.proyectoucc.alquilermangas.dto.MangaResponseDTO;
import com.proyectoucc.alquilermangas.entities.Manga;
import com.proyectoucc.alquilermangas.mappers.AlquilerMapper; // Usaremos el mapper existente por ahora
import com.proyectoucc.alquilermangas.repositories.MangaRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MangaService {

    private final MangaRepository mangaRepository;

    public MangaService(MangaRepository mangaRepository) {
        this.mangaRepository = mangaRepository;
    }

    public List<Manga> getAllMangas() {
        return mangaRepository.findAll();
    }
}
