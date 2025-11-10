package com.proyectoucc.alquilermangas.services;

import com.proyectoucc.alquilermangas.dto.MangaDTO;
import com.proyectoucc.alquilermangas.dto.StatsDTO;
import com.proyectoucc.alquilermangas.entities.Manga;
import com.proyectoucc.alquilermangas.mapper.AlquilerMapper;
import com.proyectoucc.alquilermangas.repositories.AlquilerRepository;
import com.proyectoucc.alquilermangas.repositories.MangaRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class StatService {

    private final MangaRepository mangaRepository;
    private final AlquilerRepository alquilerRepository;

    public StatService(MangaRepository mangaRepository, AlquilerRepository alquilerRepository) {
        this.mangaRepository = mangaRepository;
        this.alquilerRepository = alquilerRepository;
    }

    public StatsDTO getStats() {
        long totalMangas = mangaRepository.count();
        // CORRECCIÓN: Cambiado de m.isDisponible() a m.getDisponible()
        long mangasAlquilados = mangaRepository.findAll().stream().filter(m -> !m.getDisponible()).count();
        long mangasDisponibles = totalMangas - mangasAlquilados;

        MangaDTO mangaMasPopular = alquilerRepository.findMangaMasAlquiladoId()
                .flatMap(mangaRepository::findById)
                .map(AlquilerMapper::toMangaDTO)
                .orElse(null);

        return new StatsDTO(totalMangas, mangasDisponibles, mangasAlquilados, mangaMasPopular);
    }
}
