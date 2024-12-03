package com.example.projectWork.mapper;

import com.example.projectWork.dto.RisoluzioneTicketDTO;
import com.example.projectWork.entity.RisoluzioneTicket;
import org.springframework.stereotype.Component;

@Component
public class RisoluzioneTicketMapper {
    
    public RisoluzioneTicketDTO toDTO(RisoluzioneTicket entity) {
        if (entity == null) return null;
        
        RisoluzioneTicketDTO dto = new RisoluzioneTicketDTO();
        dto.setId(entity.getId().intValue());  // Converti da Long a Integer
        dto.setTicketId(entity.getTicket().getId().intValue());
        dto.setTecnicoId(entity.getTecnico() != null ? entity.getTecnico().getId() : null);
        dto.setNote(entity.getNote());
        dto.setDataRisoluzione(entity.getDataRisoluzione());
        dto.setTecnicoNome(entity.getTecnico() != null ? entity.getTecnico().getNome() : null);
        
        return dto;
    }
    
    public RisoluzioneTicket toEntity(RisoluzioneTicketDTO dto) {
        if (dto == null) return null;
        
        RisoluzioneTicket entity = new RisoluzioneTicket();
        entity.setId(dto.getId() != null ? dto.getId().longValue() : null);  // Converti da Integer a Long
        entity.setNote(dto.getNote());
        entity.setDataRisoluzione(dto.getDataRisoluzione());
        
        return entity;
    }
}