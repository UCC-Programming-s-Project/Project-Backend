package com.proyectoucc.alquilermangas.repositories;

import com.proyectoucc.alquilermangas.entities.Alquiler;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AlquilerRepository extends JpaRepository<Alquiler, Long> {

    /**
     * Encuentra el ID del manga más alquilado.
     * GROUP BY a.manga.id: Agrupa todos los alquileres por el manga al que pertenecen.
     * COUNT(a.manga.id): Cuenta cuántos alquileres hay en cada grupo (cuántas veces se ha alquilado cada manga).
     * ORDER BY COUNT(a.manga.id) DESC: Ordena los resultados de mayor a menor según el número de alquileres.
     * LIMIT 1: Limita el resultado a solo una fila, la primera (que será la más alta por el ordenamiento).
     * SELECT a.manga.id: Finalmente, selecciona solo el ID de ese manga más popular.
     */
    @Query("SELECT a.manga.id FROM Alquiler a GROUP BY a.manga.id ORDER BY COUNT(a.manga.id) DESC LIMIT 1")
    Optional<Long> findMangaMasAlquiladoId();
}
