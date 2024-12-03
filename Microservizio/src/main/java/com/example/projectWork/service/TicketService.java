package com.example.projectWork.service;

import com.example.projectWork.entity.StatoTicket;
import com.example.projectWork.entity.Ticket;
import com.example.projectWork.entity.Cliente;
import com.example.projectWork.dto.TicketDTO;
import com.example.projectWork.repository.TicketRepository;
import com.example.projectWork.repository.StatoTicketRepository;
import com.example.projectWork.repository.ClienteRepository;
import jakarta.persistence.EntityNotFoundException;
import com.example.projectWork.mapper.TicketMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class TicketService {

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private StatoTicketRepository statoTicketRepository;
    
    @Autowired
    private ClienteRepository clienteRepository;

    public TicketDTO createTicket(TicketDTO ticketDTO, Integer clienteId) {
        Ticket ticket = new Ticket();
        ticket.setDescrizione(ticketDTO.getDescrizione());
        
        // Imposta la data di creazione
        ticket.setDataCreazione(LocalDateTime.now());
        
        // Trova e imposta il cliente
        Cliente cliente = clienteRepository.findById(clienteId)
            .orElseThrow(() -> new EntityNotFoundException("Cliente non trovato con ID: " + clienteId));
        ticket.setCliente(cliente);
        
        // Gestione dello stato
        StatoTicket stato;
        if (ticketDTO.getStatoId() != null) {
            stato = statoTicketRepository.findById(ticketDTO.getStatoId())
                .orElseThrow(() -> new EntityNotFoundException("Stato ticket non trovato con ID: " + ticketDTO.getStatoId()));
        } else {
            // Se non viene specificato uno stato, usa lo stato "Aperto" (assumiamo abbia ID 1)
            stato = statoTicketRepository.findById(1L)
                .orElseThrow(() -> new EntityNotFoundException("Stato 'Aperto' non trovato"));
        }
        ticket.setStato(stato);
        
        Ticket savedTicket = ticketRepository.save(ticket);
        return TicketMapper.toDTO(savedTicket);
    }

    public List<TicketDTO> getAllTickets() {
        List<Ticket> tickets = ticketRepository.findAll();
        return tickets.stream()
                .map(TicketMapper::toDTO)
                .toList();
    }

    public Optional<TicketDTO> getTicketById(Long id) {
        Optional<Ticket> ticket = ticketRepository.findById(id);
        return ticket.map(TicketMapper::toDTO);
    }

    public TicketDTO updateTicket(Long id, TicketDTO ticketDTO) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Ticket non trovato con ID: " + id));
        
        // Aggiorna la descrizione se fornita
        if (ticketDTO.getDescrizione() != null) {
            ticket.setDescrizione(ticketDTO.getDescrizione());
        }
        
        // Aggiorna lo stato se viene fornito un nuovo statoId
        if (ticketDTO.getStatoId() != null) {
            StatoTicket nuovoStato = statoTicketRepository.findById(ticketDTO.getStatoId())
                .orElseThrow(() -> new EntityNotFoundException("Stato ticket non trovato con ID: " + ticketDTO.getStatoId()));
            ticket.setStato(nuovoStato);
        }
        
        // La data di creazione non dovrebbe essere modificabile
        // ticket.setDataCreazione(ticketDTO.getDataCreazione());
        
        Ticket updatedTicket = ticketRepository.save(ticket);
        return TicketMapper.toDTO(updatedTicket);
    }

    public void deleteTicket(Long id) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Ticket non trovato con ID: " + id));
        
        ticketRepository.delete(ticket);
    }
}
