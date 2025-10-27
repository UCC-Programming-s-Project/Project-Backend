package com.proyectoucc.alquilermangas.services;

import com.proyectoucc.alquilermangas.entities.Alquiler;
import com.proyectoucc.alquilermangas.entities.Cliente;
import com.proyectoucc.alquilermangas.entities.Manga;
import com.proyectoucc.alquilermangas.repositories.AlquilerRepository;
import com.proyectoucc.alquilermangas.repositories.ClienteRepository;
import com.proyectoucc.alquilermangas.repositories.MangaRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AlquilerService {

    private final AlquilerRepository alquilerRepository;
    private final ClienteRepository clienteRepository;
    private final MangaRepository mangaRepository;

    public AlquilerService(AlquilerRepository alquilerRepository, ClienteRepository clienteRepository, MangaRepository mangaRepository) {
        this.alquilerRepository = alquilerRepository;
        this.clienteRepository = clienteRepository;
        this.mangaRepository = mangaRepository;
    }

    @Transactional
    public Alquiler create(Alquiler alquiler) {
        // Validar que el cliente exista
        Cliente cliente = clienteRepository.findById(alquiler.getCliente().getId())
                .orElseThrow(() -> new EntityNotFoundException("Cliente no encontrado"));

        // Validar que el manga exista y esté disponible
        Manga manga = mangaRepository.findById(alquiler.getManga().getId())
                .orElseThrow(() -> new EntityNotFoundException("Manga no encontrado"));

        if (!manga.isDisponible()) {
            throw new IllegalStateException("El manga no está disponible para alquilar");
        }

        // Actualizar el estado del manga y guardar el alquiler
        manga.setDisponible(false);
        mangaRepository.save(manga);

        alquiler.setCliente(cliente);
        alquiler.setManga(manga);

        return alquilerRepository.save(alquiler);
    }

    public List<Alquiler> getAll() {
        return alquilerRepository.findAll();
    }

    public Alquiler getById(Long id) {
        return alquilerRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Alquiler no encontrado"));
    }

    public void delete(Long id) {
        if (!alquilerRepository.existsById(id)) {
            throw new EntityNotFoundException("Alquiler no encontrado");
        }
        alquilerRepository.deleteById(id);
    }
}
