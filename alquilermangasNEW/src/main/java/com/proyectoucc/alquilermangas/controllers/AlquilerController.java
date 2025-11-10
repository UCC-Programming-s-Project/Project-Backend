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
@RequestMapping("/api/alquileres") 
@CrossOrigin(origins = "*")
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

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        alquilerService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
