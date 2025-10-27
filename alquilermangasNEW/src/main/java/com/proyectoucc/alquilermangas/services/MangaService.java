package com.proyectoucc.alquilermangas.services;

import com.proyectoucc.alquilermangas.entities.Manga;
import com.proyectoucc.alquilermangas.repositories.MangaRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MangaService {
    private final MangaRepository mangaRepository;

    public MangaService(MangaRepository mangaRepository) {
        this.mangaRepository = mangaRepository;
    }

    public List<Manga> listarTodos() {
        return mangaRepository.findAll();
    }

    public Manga guardar(Manga manga) {
        return mangaRepository.save(manga);
    }

    public void eliminar(Long id) {
        if (!mangaRepository.existsById(id)) {
            throw new EntityNotFoundException("No se encontró un manga con el ID: " + id);
        }
        mangaRepository.deleteById(id);
    }

    public Manga obtenerPorId(Long id) {
        return mangaRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Manga no encontrado con ID: " + id));
    }
}
