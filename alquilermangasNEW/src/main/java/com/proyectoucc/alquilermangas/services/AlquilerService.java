package com.proyectoucc.alquilermangas.services;

import com.proyectoucc.alquilermangas.dto.AlquilerCreateRequestDTO;
import com.proyectoucc.alquilermangas.entities.Alquiler;
import com.proyectoucc.alquilermangas.entities.Cliente;
import com.proyectoucc.alquilermangas.entities.Manga;
import com.proyectoucc.alquilermangas.repositories.AlquilerRepository;
import com.proyectoucc.alquilermangas.repositories.ClienteRepository;
import com.proyectoucc.alquilermangas.repositories.MangaRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Calendar;
import java.util.Date;
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
    public Alquiler create(AlquilerCreateRequestDTO requestDTO) {
        Cliente cliente = clienteRepository.findById(requestDTO.clienteId())
                .orElseThrow(() -> new EntityNotFoundException("Cliente no encontrado"));

        Manga manga = mangaRepository.findById(requestDTO.mangaId())
                .orElseThrow(() -> new EntityNotFoundException("Manga no encontrado"));

        if (!manga.getDisponible()) {
            throw new IllegalStateException("El manga no está disponible para alquilar");
        }

        manga.setDisponible(false);
        mangaRepository.save(manga);

        Alquiler alquiler = new Alquiler();
        alquiler.setCliente(cliente);
        alquiler.setManga(manga);

        // Generar fechas en el servidor
        Date fechaInicio = new Date();
        Calendar cal = Calendar.getInstance();
        cal.setTime(fechaInicio);
        cal.add(Calendar.DAY_OF_YEAR, 7);
        Date fechaFin = cal.getTime();

        alquiler.setFechaInicio(fechaInicio);
        alquiler.setFechaFin(fechaFin);
        alquiler.setDevuelto(false);

        return alquilerRepository.save(alquiler);
    }

    @Transactional
    public Alquiler devolver(Long id) {
        Alquiler alquiler = getById(id);

        if (alquiler.isDevuelto()) {
            throw new IllegalStateException("Este alquiler ya ha sido devuelto.");
        }

        Manga manga = alquiler.getManga();
        manga.setDisponible(true);
        mangaRepository.save(manga);

        alquiler.setDevuelto(true);
        return alquilerRepository.save(alquiler);
    }

    public List<Alquiler> getAll() {
        return alquilerRepository.findAll();
    }

    public Alquiler getById(Long id) {
        return alquilerRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Alquiler no encontrado con ID: " + id));
    }

    public void delete(Long id) {
        if (!alquilerRepository.existsById(id)) {
            throw new EntityNotFoundException("Alquiler no encontrado con ID: " + id);
        }
        alquilerRepository.deleteById(id);
    }
}
