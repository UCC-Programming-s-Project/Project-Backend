package com.proyectoucc.alquilermangas.services;

import com.proyectoucc.alquilermangas.entities.Manga;
import com.proyectoucc.alquilermangas.repositories.MangaRepository;
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
        mangaRepository.deleteById(id);
    }
}
