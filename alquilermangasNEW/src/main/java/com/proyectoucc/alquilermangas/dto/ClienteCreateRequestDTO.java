
package com.proyectoucc.alquilermangas.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClienteCreateRequestDTO {
    private String nombre;
    private String correo; 
}
