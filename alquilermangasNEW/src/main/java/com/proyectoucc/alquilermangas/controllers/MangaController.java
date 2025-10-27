package com.proyectoucc.alquilermangas.controllers;

import com.proyectoucc.alquilermangas.entities.Manga;
import com.proyectoucc.alquilermangas.services.MangaService;
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
    public List<Manga> listarTodos() {
        return mangaService.listarTodos();
    }

    @PostMapping
    public Manga crear(@RequestBody Manga manga) {
        return mangaService.guardar(manga);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        mangaService.eliminar(id);
    }
}
