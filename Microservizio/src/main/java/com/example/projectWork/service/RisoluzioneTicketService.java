package com.example.projectWork.service;

import com.example.projectWork.dto.RisoluzioneTicketDTO;
import com.example.projectWork.entity.RisoluzioneTicket;
import com.example.projectWork.entity.Admin;
import com.example.projectWork.entity.Ticket;
import com.example.projectWork.mapper.RisoluzioneTicketMapper;
import com.example.projectWork.repository.RisoluzioneTicketRepository;
import com.example.projectWork.repository.AdminRepository;
import com.example.projectWork.repository.TicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class RisoluzioneTicketService {
    
    @Autowired
    private RisoluzioneTicketRepository risoluzioneRepository;
    
    @Autowired
    private TicketRepository ticketRepository;
    
    @Autowired
    private AdminRepository adminRepository;
    
    @Autowired
    private RisoluzioneTicketMapper mapper;
    
    public Optional<RisoluzioneTicketDTO> getRisoluzioneByTicket(Long ticketId) {
        return risoluzioneRepository.findByTicketId(ticketId.longValue())
            .map(mapper::toDTO);
    }
    
    public RisoluzioneTicketDTO createRisoluzione(RisoluzioneTicketDTO dto) {
        Ticket ticket = ticketRepository.findById(dto.getTicketId().longValue())
            .orElseThrow(() -> new RuntimeException("Ticket non trovato"));
            
        Admin tecnico = null;
        if (dto.getTecnicoId() != null) {
            tecnico = adminRepository.findById(dto.getTecnicoId().longValue()) // Convertito a Long
                .orElseThrow(() -> new RuntimeException("Tecnico non trovato"));
        }
        
        RisoluzioneTicket entity = mapper.toEntity(dto);
        entity.setTicket(ticket);
        entity.setTecnico(tecnico);
        
        return mapper.toDTO(risoluzioneRepository.save(entity));
    }
}