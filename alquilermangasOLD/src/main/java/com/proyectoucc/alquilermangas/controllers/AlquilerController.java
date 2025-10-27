package com.proyectoucc.alquilermangas.controllers;

import com.proyectoucc.alquilermangas.dto.AlquilerRequestDTO;
import com.proyectoucc.alquilermangas.dto.AlquilerResponseDTO;
import com.proyectoucc.alquilermangas.services.AlquilerService;
import jakarta.validation.Valid;
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
    public ResponseEntity<List<AlquilerResponseDTO>> listarTodos() {
        List<AlquilerResponseDTO> alquileres = alquilerService.listarTodos();
        return new ResponseEntity<>(alquileres, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<AlquilerResponseDTO> crear(@Valid @RequestBody AlquilerRequestDTO requestDTO) {
        AlquilerResponseDTO nuevoAlquiler = alquilerService.crearAlquiler(requestDTO);
        return new ResponseEntity<>(nuevoAlquiler, HttpStatus.CREATED);
    }

    @PostMapping("/{id}/devolver")
    public ResponseEntity<AlquilerResponseDTO> devolver(@PathVariable Long id) {
        AlquilerResponseDTO alquilerActualizado = alquilerService.devolverManga(id);
        return new ResponseEntity<>(alquilerActualizado, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        alquilerService.eliminar(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
