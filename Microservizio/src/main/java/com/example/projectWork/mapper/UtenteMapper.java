package com.example.projectWork.mapper;

// import java.sql.Timestamp;
// import java.text.ParseException;
// import java.text.SimpleDateFormat;

import com.example.projectWork.dto.AdminDTO;
import com.example.projectWork.dto.ClienteDTO;
import com.example.projectWork.dto.UtenteDTO;
import com.example.projectWork.entity.Admin;
import com.example.projectWork.entity.Cliente;
import com.example.projectWork.entity.Utente;

public class UtenteMapper {

    // Metodo per convertire Utente in UtenteDTO
    public UtenteDTO utenteToUtenteDTO(Utente utente) {
        UtenteDTO utenteDTO = new UtenteDTO();
        utenteDTO.setUsername(utente.getUsername());
        utenteDTO.setPassword(utente.getPassword());
        utenteDTO.setAmministratore(utente.isAmministratore());

        // Mappa il cliente se presente
        if (utente.getCliente() != null) {
            ClienteDTO clienteDTO = new ClienteDTO();
            Cliente cliente = utente.getCliente();
            
            clienteDTO.setId(cliente.getId());
            clienteDTO.setNome(cliente.getNome());
            clienteDTO.setEmail(cliente.getEmail());
            clienteDTO.setPartitaIva(cliente.getPartitaIva());
            clienteDTO.setCodiceFiscale(cliente.getCodiceFiscale());
            clienteDTO.setIndirizzo(cliente.getIndirizzo());
            clienteDTO.setTelefono(cliente.getTelefono());
            
            utenteDTO.setCliente(clienteDTO);
        }

        // Mappa l'admin se presente
        if (utente.getAdmin() != null) {
            AdminDTO adminDTO = new AdminDTO();
            adminDTO.setNome(utente.getAdmin().getNome());
            adminDTO.setEmail(utente.getAdmin().getEmail());
            utenteDTO.setAdmin(adminDTO);
        }

        return utenteDTO;
    }

    public Utente utenteDTOToUtente(UtenteDTO utenteDTO) {
        Utente utente = new Utente();
        utente.setUsername(utenteDTO.getUsername());
        utente.setPassword(utenteDTO.getPassword());
        utente.setAmministratore(utenteDTO.getAmministratore());
    
        // // Se il campo lastAccess è presente, convertilo
        // if (utenteDTO.getLastAccess() != null) {
        //     try {
        //         Timestamp lastAccess = convertStringToTimestamp(utenteDTO.getLastAccess());
        //         utente.setLastAccess(lastAccess);
        //     } catch (ParseException e) {
        //         utente.setLastAccess(null);  // Imposta lastAccess a null in caso di errore
        //         System.out.println("Errore durante la conversione della data: " + e.getMessage());
        //     }
        // }

        if (utenteDTO.getAdmin() != null) {
            Admin admin = new Admin();
            admin.setNome(utenteDTO.getAdmin().getNome());
            admin.setEmail(utenteDTO.getAdmin().getEmail());
            utente.setAdmin(admin);
        }
    
        if (utenteDTO.getCliente() != null) {
            Cliente cliente = new Cliente();
            cliente.setNome(utenteDTO.getCliente().getNome());
            cliente.setEmail(utenteDTO.getCliente().getEmail());
            utente.setCliente(cliente);
        }
    
        return utente;
    }
}
