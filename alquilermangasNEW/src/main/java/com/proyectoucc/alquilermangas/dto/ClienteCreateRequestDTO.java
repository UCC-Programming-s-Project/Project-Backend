
package com.proyectoucc.alquilermangas.dto;

// Usaremos Lombok para reducir el código repetitivo
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClienteCreateRequestDTO {
    private String nombre;
}
