
package com.proyectoucc.alquilermangas.controllers;

import com.proyectoucc.alquilermangas.dto.ClienteCreateRequestDTO;
import com.proyectoucc.alquilermangas.dto.ClienteDTO;
import com.proyectoucc.alquilermangas.entities.Cliente;
import com.proyectoucc.alquilermangas.mapper.AlquilerMapper;
import com.proyectoucc.alquilermangas.services.ClienteService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/clientes")
public class ClienteController {

    private final ClienteService clienteService;

    public ClienteController(ClienteService clienteService) {
        this.clienteService = clienteService;
    }

    @PostMapping
    public ResponseEntity<ClienteDTO> create(@RequestBody ClienteCreateRequestDTO clienteDTO) {
        Cliente cliente = new Cliente();
        // Usamos .getNombre() porque ClienteCreateRequestDTO usa Lombok
        cliente.setNombre(clienteDTO.getNombre());

        Cliente nuevoCliente = clienteService.save(cliente);
        return ResponseEntity.status(HttpStatus.CREATED).body(AlquilerMapper.toClienteDTO(nuevoCliente));
    }

    @GetMapping
    public ResponseEntity<List<ClienteDTO>> getAll() {
        List<ClienteDTO> clientes = clienteService.findAll().stream()
                .map(AlquilerMapper::toClienteDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(clientes);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClienteDTO> getById(@PathVariable Long id) {
        Cliente cliente = clienteService.findById(id);
        return ResponseEntity.ok(AlquilerMapper.toClienteDTO(cliente));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ClienteDTO> update(@PathVariable Long id, @RequestBody ClienteDTO clienteDTO) {
        Cliente cliente = new Cliente();
        // Usamos .nombre() porque ClienteDTO es un record
        cliente.setNombre(clienteDTO.nombre());

        Cliente clienteActualizado = clienteService.update(id, cliente);
        return ResponseEntity.ok(AlquilerMapper.toClienteDTO(clienteActualizado));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        clienteService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
