package com.proyectoucc.alquilermangas.services;

import com.proyectoucc.alquilermangas.entities.Cliente;
import com.proyectoucc.alquilermangas.repositories.ClienteRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClienteService {

    private final ClienteRepository clienteRepository;

    public ClienteService(ClienteRepository clienteRepository) {
        this.clienteRepository = clienteRepository;
    }

    public Cliente save(Cliente cliente) {
        return clienteRepository.save(cliente);
    }

    public List<Cliente> findAll() {
        return clienteRepository.findAll();
    }

    public Cliente findById(Long id) {
        return clienteRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Cliente no encontrado con ID: " + id));
    }

    public Cliente update(Long id, Cliente clienteDetails) {
        Cliente cliente = findById(id);
        cliente.setNombre(clienteDetails.getNombre());
        cliente.setCorreo(clienteDetails.getCorreo());
        return clienteRepository.save(cliente);
    }

    public void deleteById(Long id) {
        if (!clienteRepository.existsById(id)) {
            throw new EntityNotFoundException("Cliente no encontrado con ID: " + id);
        }
        clienteRepository.deleteById(id);
    }
}
