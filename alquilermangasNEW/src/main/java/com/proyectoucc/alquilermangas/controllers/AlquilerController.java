package com.proyectoucc.alquilermangas.controllers;

import com.proyectoucc.alquilermangas.dto.AlquilerCreateRequestDTO;
import com.proyectoucc.alquilermangas.dto.AlquilerDTO;
import com.proyectoucc.alquilermangas.entities.Alquiler;
import com.proyectoucc.alquilermangas.mapper.AlquilerMapper;
import com.proyectoucc.alquilermangas.services.AlquilerService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/alquileres")
public class AlquilerController {

    private final AlquilerService alquilerService;

    public AlquilerController(AlquilerService alquilerService) {
        this.alquilerService = alquilerService;
    }

    @GetMapping
    public ResponseEntity<List<AlquilerDTO>> getAll() {
        List<AlquilerDTO> alquileres = alquilerService.getAll().stream()
                .map(AlquilerMapper::toAlquilerDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(alquileres);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AlquilerDTO> getById(@PathVariable Long id) {
        Alquiler alquiler = alquilerService.getById(id);
        return ResponseEntity.ok(AlquilerMapper.toAlquilerDTO(alquiler));
    }

    @PostMapping
    public ResponseEntity<AlquilerDTO> create(@RequestBody AlquilerCreateRequestDTO requestDTO) {
        Alquiler nuevoAlquiler = alquilerService.create(requestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(AlquilerMapper.toAlquilerDTO(nuevoAlquiler));
    }

    @PostMapping("/{id}/devolver")
    public ResponseEntity<AlquilerDTO> devolverAlquiler(@PathVariable Long id) {
        Alquiler alquilerDevuelto = alquilerService.devolver(id);
        return ResponseEntity.ok(AlquilerMapper.toAlquilerDTO(alquilerDevuelto));
    }

    // El método PUT para actualizar un alquiler completo se vuelve más complejo y
    // podría requerir su propio DTO. Por simplicidad y al no ser un requisito
    // principal, lo comentamos para enfocarnos en la limpieza de la API actual.
    /*
    @PutMapping("/{id}")
    public ResponseEntity<Alquiler> update(@PathVariable Long id, @RequestBody Alquiler alquiler) {
        Alquiler alquilerExistente = alquilerService.getById(id);
        alquilerExistente.setCliente(alquiler.getCliente());
        alquilerExistente.setManga(alquiler.getManga());
        alquilerExistente.setFechaInicio(alquiler.getFechaInicio());
        alquilerExistente.setFechaFin(alquiler.getFechaFin());
        // Ojo: el método create tiene otra firma ahora.
        // Alquiler alquilerActualizado = alquilerService.create(alquilerExistente);
        // return ResponseEntity.ok(alquilerActualizado);
        return null; // Placeholder
    }
    */

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        alquilerService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
