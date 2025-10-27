package com.proyectoucc.alquilermangas.controllers;

import com.proyectoucc.alquilermangas.entities.Alquiler;
import com.proyectoucc.alquilermangas.services.AlquilerService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/alquileres")
public class AlquilerController {

    private final AlquilerService alquilerService;

    public AlquilerController(AlquilerService alquilerService) {
        this.alquilerService = alquilerService;
    }

    @GetMapping
    public ResponseEntity<List<Alquiler>> getAll() {
        return ResponseEntity.ok(alquilerService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Alquiler> getById(@PathVariable Long id) {
        return ResponseEntity.ok(alquilerService.getById(id));
    }

    @PostMapping
    public ResponseEntity<Alquiler> create(@RequestBody Alquiler alquiler) {
        Alquiler nuevoAlquiler = alquilerService.create(alquiler);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoAlquiler);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Alquiler> update(@PathVariable Long id, @RequestBody Alquiler alquiler) {
        Alquiler alquilerExistente = alquilerService.getById(id);
        alquilerExistente.setCliente(alquiler.getCliente());
        alquilerExistente.setManga(alquiler.getManga());
        alquilerExistente.setFechaInicio(alquiler.getFechaInicio());
        alquilerExistente.setFechaFin(alquiler.getFechaFin());
        Alquiler alquilerActualizado = alquilerService.create(alquilerExistente);
        return ResponseEntity.ok(alquilerActualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        alquilerService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
