package com.example.projectWork.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.projectWork.dto.UtenteDTO;
import com.example.projectWork.entity.Utente;
import com.example.projectWork.repository.UtenteRepository;
import com.example.projectWork.mapper.UtenteMapper;
import com.example.projectWork.entity.Cliente;
import com.example.projectWork.repository.ClienteRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UtenteService {

    @Autowired
    private UtenteRepository utenteRepository;

    @Autowired
    private ClienteRepository clienteRepository;

    private final UtenteMapper utenteMapper = new UtenteMapper(); // Instanzia il mapper

    // Metodo per ottenere un utente tramite username
    public UtenteDTO getUtenteByUsername(String username) {
        Utente utente = utenteRepository.findByUsername(username);
        if (utente != null) {
            return utenteMapper.utenteToUtenteDTO(utente); // Usa il mapper per la conversione
        }
        throw new RuntimeException("Utente non trovato");
    }

    // Metodo per creare un nuovo utente con cliente esistente
    public UtenteDTO createUtente(UtenteDTO utenteDTO, Integer clienteId) {
        // Verifica se esiste già un utente con lo stesso username
        if (utenteRepository.findByUsername(utenteDTO.getUsername()) != null) {
            throw new RuntimeException("Username già in uso");
        }

        // Trova il cliente esistente
        Cliente cliente = clienteRepository.findById(clienteId)
                .orElseThrow(() -> new RuntimeException("Cliente non trovato con ID: " + clienteId));

        Utente utente = new Utente();
        utente.setUsername(utenteDTO.getUsername());
        utente.setPassword(utenteDTO.getPassword());
        utente.setAmministratore(utenteDTO.getAmministratore());
        utente.setCliente(cliente);
        
        // Salva l'utente
        utente = utenteRepository.save(utente);
        return utenteMapper.utenteToUtenteDTO(utente);
    }

    // Metodo per ottenere tutti gli utenti
    public List<UtenteDTO> getAllUtenti() {
        List<Utente> utenti = utenteRepository.findAll();
        return utenti.stream()
                .map(utenteMapper::utenteToUtenteDTO)
                .collect(Collectors.toList());
    }

    // Metodo per aggiornare un utente
    public UtenteDTO updateUtente(String username, UtenteDTO utenteDTO) {
        Utente utente = utenteRepository.findByUsername(username);
        if (utente != null) {
            utente.setUsername(utenteDTO.getUsername());
            utente.setPassword(utenteDTO.getPassword());
            utente.setAmministratore(utenteDTO.getAmministratore());
            utente = utenteRepository.save(utente);
            return utenteMapper.utenteToUtenteDTO(utente);
        }
        throw new RuntimeException("Utente non trovato");
    }

    // Metodo per eliminare un utente
    public boolean deleteUtente(String username) {
        Utente utente = utenteRepository.findByUsername(username);
        if (utente != null) {
            utenteRepository.delete(utente);
            return true;
        }
        return false; // Utente non trovato
    }

    // Metodo per verificare le credenziali dell'utente
    public UtenteDTO checkCredentials(String username, String password) {
        Utente utente = utenteRepository.findByUsername(username);
        if (utente != null && utente.getPassword().equals(password)) {
            return utenteMapper.utenteToUtenteDTO(utente);
        }
        throw new RuntimeException("Credenziali non valide");
    }
}
