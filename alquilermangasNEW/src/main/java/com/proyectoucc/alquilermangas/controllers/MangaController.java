package com.proyectoucc.alquilermangas.controllers;

import com.proyectoucc.alquilermangas.dto.MangaCreateRequestDTO;
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
@RequestMapping("/api/mangas")
@CrossOrigin(origins = "*")
public class MangaController {

    private final MangaService mangaService;

    public MangaController(MangaService mangaService) {
        this.mangaService = mangaService;
    }

    @PostMapping
    public ResponseEntity<MangaDTO> create(@RequestBody MangaCreateRequestDTO mangaDTO) {
        Manga manga = new Manga();
        manga.setTitulo(mangaDTO.getTitulo());
        manga.setAutor(mangaDTO.getAutor());
        manga.setImagenUrl(mangaDTO.getImagenUrl());
        Manga nuevoManga = mangaService.save(manga);
        return ResponseEntity.status(HttpStatus.CREATED).body(AlquilerMapper.toMangaDTO(nuevoManga));
    }

    @GetMapping
    public ResponseEntity<List<MangaDTO>> getAll(@RequestParam(required = false) String titulo) {
        List<Manga> mangas;
        if (titulo != null && !titulo.isEmpty()) {
            mangas = mangaService.searchByTitulo(titulo);
        } else {
            mangas = mangaService.findAll();
        }
        List<MangaDTO> mangaDTOs = mangas.stream()
                .map(AlquilerMapper::toMangaDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(mangaDTOs);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MangaDTO> getById(@PathVariable Long id) {
        Manga manga = mangaService.findById(id);
        return ResponseEntity.ok(AlquilerMapper.toMangaDTO(manga));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MangaDTO> update(@PathVariable Long id, @RequestBody MangaDTO mangaDetails) {
        Manga mangaActualizado = mangaService.update(id, mangaDetails);
        return ResponseEntity.ok(AlquilerMapper.toMangaDTO(mangaActualizado));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        mangaService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
