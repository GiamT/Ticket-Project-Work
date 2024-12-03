package com.example.projectWork.service;

import com.example.projectWork.dto.AggiornamentoTicketDTO;
import com.example.projectWork.entity.AggiornamentoTicket;
import com.example.projectWork.entity.Admin;
import com.example.projectWork.entity.Ticket;
import com.example.projectWork.mapper.AggiornamentoTicketMapper;
import com.example.projectWork.repository.AggiornamentoTicketRepository;
import com.example.projectWork.repository.AdminRepository;
import com.example.projectWork.repository.TicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AggiornamentoTicketService {
    
    @Autowired
    private AggiornamentoTicketRepository aggiornamentoRepository;
    
    @Autowired
    private TicketRepository ticketRepository;
    
    @Autowired
    private AdminRepository adminRepository;
    
    @Autowired
    private AggiornamentoTicketMapper mapper;
    
    public List<AggiornamentoTicketDTO> getAggiornamentiByTicket(Long ticketId) {
        return aggiornamentoRepository.findByTicketId(ticketId.longValue())
            .stream()
            .map(mapper::toDTO)
            .collect(Collectors.toList());
    }
    
    public AggiornamentoTicketDTO createAggiornamento(AggiornamentoTicketDTO dto) {
        Ticket ticket = ticketRepository.findById(dto.getTicketId().longValue())
            .orElseThrow(() -> new RuntimeException("Ticket non trovato"));
            
        Admin tecnico = null;
        if (dto.getTecnicoId() != null) {
            tecnico = adminRepository.findById(dto.getTecnicoId().longValue()) // Convertito a Long
                .orElseThrow(() -> new RuntimeException("Tecnico non trovato"));
        }
        
        AggiornamentoTicket entity = mapper.toEntity(dto);
        entity.setTicket(ticket);
        entity.setTecnico(tecnico);
        
        return mapper.toDTO(aggiornamentoRepository.save(entity));
    }
}