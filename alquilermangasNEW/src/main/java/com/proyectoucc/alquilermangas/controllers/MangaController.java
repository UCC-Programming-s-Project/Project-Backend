package com.proyectoucc.alquilermangas.controllers;

import com.proyectoucc.alquilermangas.dto.MangaDTO;
import com.proyectoucc.alquilermangas.entities.Manga;
import com.proyectoucc.alquilermangas.mapper.AlquilerMapper;
import com.proyectoucc.alquilermangas.services.MangaService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/mangas")
public class MangaController {

    private final MangaService mangaService;

    public MangaController(MangaService mangaService) {
        this.mangaService = mangaService;
    }

    @PostMapping
    public ResponseEntity<MangaDTO> create(@RequestBody Manga manga) {
        Manga nuevoManga = mangaService.save(manga);
        return ResponseEntity.status(HttpStatus.CREATED).body(AlquilerMapper.toMangaDTO(nuevoManga));
    }

    @GetMapping
    public ResponseEntity<List<MangaDTO>> getAll() {
        List<MangaDTO> mangas = mangaService.findAll().stream()
                .map(AlquilerMapper::toMangaDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(mangas);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MangaDTO> getById(@PathVariable Long id) {
        Manga manga = mangaService.findById(id);
        return ResponseEntity.ok(AlquilerMapper.toMangaDTO(manga));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MangaDTO> update(@PathVariable Long id, @RequestBody Manga manga) {
        Manga mangaActualizado = mangaService.update(id, manga);
        return ResponseEntity.ok(AlquilerMapper.toMangaDTO(mangaActualizado));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        mangaService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
