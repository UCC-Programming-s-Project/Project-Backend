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

    public Manga save(Manga manga) {
        return mangaRepository.save(manga);
    }

    public List<Manga> findAll() {
        return mangaRepository.findAll();
    }

    public Manga findById(Long id) {
        return mangaRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Manga no encontrado con ID: " + id));
    }

    public Manga update(Long id, Manga mangaDetails) {
        Manga manga = findById(id);
        manga.setTitulo(mangaDetails.getTitulo());
        manga.setAutor(mangaDetails.getAutor());
        manga.setDisponible(mangaDetails.isDisponible());
        return mangaRepository.save(manga);
    }

    public void deleteById(Long id) {
        if (!mangaRepository.existsById(id)) {
            throw new EntityNotFoundException("Manga no encontrado con ID: " + id);
        }
        mangaRepository.deleteById(id);
    }
}
