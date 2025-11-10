package com.proyectoucc.alquilermangas.repositories;

import com.proyectoucc.alquilermangas.entities.Manga;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MangaRepository extends JpaRepository<Manga, Long> {
    // Nuevo método para buscar mangas por título (ignorando mayúsculas/minúsculas)
    List<Manga> findByTituloContainingIgnoreCase(String titulo);
}
