package com.proyectoucc.alquilermangas.services;

import com.proyectoucc.alquilermangas.entities.Cliente;
import com.proyectoucc.alquilermangas.repositories.ClienteRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClienteService {

    private final ClienteRepository clienteRepository;

    public ClienteService(ClienteRepository clienteRepository) {
        this.clienteRepository = clienteRepository;
    }

    public List<Cliente> getAllClientes() {
        return clienteRepository.findAll();
    }
}
