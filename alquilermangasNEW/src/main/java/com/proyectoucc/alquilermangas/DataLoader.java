package com.proyectoucc.alquilermangas;

import com.proyectoucc.alquilermangas.entities.Alquiler;
import com.proyectoucc.alquilermangas.entities.Cliente;
import com.proyectoucc.alquilermangas.entities.Manga;
import com.proyectoucc.alquilermangas.repositories.AlquilerRepository;
import com.proyectoucc.alquilermangas.repositories.ClienteRepository;
import com.proyectoucc.alquilermangas.repositories.MangaRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

@Component
public class DataLoader implements CommandLineRunner {

    private final MangaRepository mangaRepository;
    private final ClienteRepository clienteRepository;
    private final AlquilerRepository alquilerRepository;

    public DataLoader(MangaRepository mangaRepository, ClienteRepository clienteRepository, AlquilerRepository alquilerRepository) {
        this.mangaRepository = mangaRepository;
        this.clienteRepository = clienteRepository;
        this.alquilerRepository = alquilerRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        // Si ya hay mangas, no se ejecuta la carga de datos.
        if (mangaRepository.count() > 0) {
            return;
        }

        // --- CREACIÓN DE MANGAS ---
        Manga m1 = new Manga("Jujutsu Kaisen", "Gege Akutami", true, "https://m.media-amazon.com/images/I/81s+jXq3pLL._AC_UF1000,1000_QL80_.jpg");
        Manga m2 = new Manga("Shingeki no Kyojin", "Hajime Isayama", true, "https://m.media-amazon.com/images/I/81XFBG2hEXL._AC_UF1000,1000_QL80_.jpg");
        Manga m3 = new Manga("One Piece", "Eiichiro Oda", true, "https://m.media-amazon.com/images/I/812c+5a0D9L._AC_UF1000,1000_QL80_.jpg");
        Manga m4 = new Manga("Chainsaw Man", "Tatsuki Fujimoto", true, "https://m.media-amazon.com/images/I/81s7B+Als+L._AC_UF1000,1000_QL80_.jpg");
        Manga m5 = new Manga("Spy x Family", "Tatsuya Endo", true, "https://m.media-amazon.com/images/I/81dG0k2I+gL._AC_UF1000,1000_QL80_.jpg");
        Manga m6 = new Manga("My Hero Academia", "Kohei Horikoshi", true, "https://m.media-amazon.com/images/I/81x22b442hL._AC_UF1000,1000_QL80_.jpg");
        Manga m7 = new Manga("Berserk", "Kentaro Miura", true, "https://m.media-amazon.com/images/I/81GDu4Bw6iL._AC_UF1000,1000_QL80_.jpg");
        Manga m8 = new Manga("Vinland Saga", "Makoto Yukimura", true, "https://m.media-amazon.com/images/I/815E2CM2dCL._AC_UF1000,1000_QL80_.jpg");
        List<Manga> mangas = mangaRepository.saveAll(Arrays.asList(m1, m2, m3, m4, m5, m6, m7, m8));

        // --- CREACIÓN DE CLIENTES ---
        Cliente c1 = new Cliente("Ana Torres", "ana.torres@example.com");
        Cliente c2 = new Cliente("Luis García", "luis.garcia@example.com");
        Cliente c3 = new Cliente("Sofía Ramírez", "sofia.ramirez@example.com");
        Cliente c4 = new Cliente("Carlos Mendoza", "carlos.mendoza@example.com");
        List<Cliente> clientes = clienteRepository.saveAll(Arrays.asList(c1, c2, c3, c4));

        // --- CREACIÓN DE ALQUILERES ---
        LocalDate hoy = LocalDate.now();

        // Alquiler 1: Jujutsu Kaisen (Activo, no vencido)
        alquilarManga(clientes.get(0), mangas.get(0), hoy.minusDays(5), hoy.plusDays(10));

        // Alquiler 2: Shingeki no Kyojin (VENCIDO)
        alquilarManga(clientes.get(1), mangas.get(1), hoy.minusDays(10), hoy.minusDays(2));

        // Alquiler 3: Chainsaw Man (Activo, no vencido)
        alquilarManga(clientes.get(2), mangas.get(3), hoy.minusDays(2), hoy.plusDays(5));

        // Alquiler 4: My Hero Academia (VENCIDO)
        alquilarManga(clientes.get(3), mangas.get(5), hoy.minusDays(8), hoy.minusDays(1));
        
        // Alquileres devueltos para que "Jujutsu Kaisen" sea el más popular
        Alquiler devuelto1 = new Alquiler(clientes.get(2), mangas.get(0), hoy.minusDays(20), hoy.minusDays(10), true);
        Alquiler devuelto2 = new Alquiler(clientes.get(3), mangas.get(0), hoy.minusDays(30), hoy.minusDays(20), true);
        alquilerRepository.saveAll(Arrays.asList(devuelto1, devuelto2));
    }

    private void alquilarManga(Cliente cliente, Manga manga, LocalDate fechaInicio, LocalDate fechaFin) {
        manga.setDisponible(false);
        mangaRepository.save(manga);
        Alquiler alquiler = new Alquiler(cliente, manga, fechaInicio, fechaFin, false);
        alquilerRepository.save(alquiler);
    }
}
