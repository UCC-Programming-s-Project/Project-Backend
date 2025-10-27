package com.proyectoucc.alquilermangas.repositories;

import com.proyectoucc.alquilermangas.entities.Alquiler;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AlquilerRepository extends JpaRepository<Alquiler, Long> {
}
