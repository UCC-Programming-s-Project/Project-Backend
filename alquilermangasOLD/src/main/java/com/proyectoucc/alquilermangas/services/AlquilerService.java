package com.proyectoucc.alquilermangas.services;

import com.proyectoucc.alquilermangas.dto.AlquilerRequestDTO;
import com.proyectoucc.alquilermangas.dto.AlquilerResponseDTO;
import com.proyectoucc.alquilermangas.entities.Alquiler;
import com.proyectoucc.alquilermangas.entities.Cliente;
import com.proyectoucc.alquilermangas.entities.Manga;
import com.proyectoucc.alquilermangas.entities.MangaStatus;
import com.proyectoucc.alquilermangas.exceptions.BadRequestException;
import com.proyectoucc.alquilermangas.exceptions.ResourceNotFoundException;
import com.proyectoucc.alquilermangas.mappers.AlquilerMapper;
import com.proyectoucc.alquilermangas.repositories.AlquilerRepository;
import com.proyectoucc.alquilermangas.repositories.ClienteRepository;
import com.proyectoucc.alquilermangas.repositories.MangaRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
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

    public List<AlquilerResponseDTO> listarTodos() {
        List<Alquiler> alquileres = alquilerRepository.findAll();
        return AlquilerMapper.toAlquilerResponseDTOList(alquileres);
    }

    @Transactional
    public AlquilerResponseDTO crearAlquiler(AlquilerRequestDTO requestDTO) {
        Cliente cliente = clienteRepository.findById(requestDTO.getClienteId())
                .orElseThrow(() -> new ResourceNotFoundException("Cliente no encontrado con id: " + requestDTO.getClienteId()));

        Manga manga = mangaRepository.findById(requestDTO.getMangaId())
                .orElseThrow(() -> new ResourceNotFoundException("Manga no encontrado con id: " + requestDTO.getMangaId()));

        if (manga.getStatus() == MangaStatus.ALQUILADO) {
            throw new BadRequestException("El manga '" + manga.getTitulo() + "' no esta disponible.");
        }

        manga.setStatus(MangaStatus.ALQUILADO);
        mangaRepository.save(manga);

        Alquiler alquiler = new Alquiler();
        alquiler.setCliente(cliente);
        alquiler.setManga(manga);
        alquiler.setFechaInicio(LocalDate.now());

        Alquiler nuevoAlquiler = alquilerRepository.save(alquiler);
        return AlquilerMapper.toAlquilerResponseDTO(nuevoAlquiler);
    }

    @Transactional
    public AlquilerResponseDTO devolverManga(Long alquilerId) {
        Alquiler alquiler = alquilerRepository.findById(alquilerId)
                .orElseThrow(() -> new ResourceNotFoundException("Alquiler no encontrado con id: " + alquilerId));

        if (alquiler.getFechaFin() != null) {
            throw new BadRequestException("Este alquiler ya ha sido finalizado.");
        }

        Manga manga = alquiler.getManga();
        manga.setStatus(MangaStatus.DISPONIBLE);
        mangaRepository.save(manga);

        alquiler.setFechaFin(LocalDate.now());
        Alquiler alquilerActualizado = alquilerRepository.save(alquiler);
        return AlquilerMapper.toAlquilerResponseDTO(alquilerActualizado);
    }

    public void eliminar(Long id) {
        if (!alquilerRepository.existsById(id)) {
            throw new ResourceNotFoundException("No se puede eliminar. Alquiler no encontrado con id: " + id);
        }
        alquilerRepository.deleteById(id);
    }
}
