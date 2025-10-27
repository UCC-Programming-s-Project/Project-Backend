package com.proyectoucc.alquilermangas.controllers;

import com.proyectoucc.alquilermangas.entities.Manga;
import com.proyectoucc.alquilermangas.services.MangaService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/mangas")
public class MangaController {

    private final MangaService mangaService;

    public MangaController(MangaService mangaService) {
        this.mangaService = mangaService;
    }

    @GetMapping
    public ResponseEntity<List<Manga>> getAll() {
        return ResponseEntity.ok(mangaService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Manga> getById(@PathVariable Long id) {
        return ResponseEntity.ok(mangaService.obtenerPorId(id));
    }

    @PostMapping
    public ResponseEntity<Manga> create(@RequestBody Manga manga) {
        Manga nuevoManga = mangaService.guardar(manga);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoManga);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Manga> update(@PathVariable Long id, @RequestBody Manga manga) {
        Manga mangaExistente = mangaService.obtenerPorId(id);
        mangaExistente.setTitulo(manga.getTitulo());
        mangaExistente.setAutor(manga.getAutor());
        mangaExistente.setDisponible(manga.isDisponible());
        Manga mangaActualizado = mangaService.guardar(mangaExistente);
        return ResponseEntity.ok(mangaActualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        mangaService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
