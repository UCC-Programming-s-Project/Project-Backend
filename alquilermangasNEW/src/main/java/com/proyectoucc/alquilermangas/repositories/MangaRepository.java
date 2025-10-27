package com.proyectoucc.alquilermangas.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import com.proyectoucc.alquilermangas.entities.Manga;

public interface MangaRepository extends JpaRepository<Manga, Long> {}
