package com.example.projectWork.mapper;

import com.example.projectWork.dto.AggiornamentoTicketDTO;
import com.example.projectWork.entity.AggiornamentoTicket;
import org.springframework.stereotype.Component;

@Component
public class AggiornamentoTicketMapper {
    
    public AggiornamentoTicketDTO toDTO(AggiornamentoTicket entity) {
        if (entity == null) return null;
        
        AggiornamentoTicketDTO dto = new AggiornamentoTicketDTO();
        dto.setId(entity.getId().intValue());  // Converti da Long a Integer
        dto.setTicketId(entity.getTicket().getId().intValue());
        dto.setTecnicoId(entity.getTecnico() != null ? entity.getTecnico().getId() : null);
        dto.setDescrizione(entity.getDescrizione());
        dto.setDataAggiornamento(entity.getDataAggiornamento());
        dto.setTecnicoNome(entity.getTecnico() != null ? entity.getTecnico().getNome() : null);
        
        return dto;
    }
    
    public AggiornamentoTicket toEntity(AggiornamentoTicketDTO dto) {
        if (dto == null) return null;
        
        AggiornamentoTicket entity = new AggiornamentoTicket();
        entity.setId(dto.getId() != null ? dto.getId().longValue() : null);  // Converti da Integer a Long
        entity.setDescrizione(dto.getDescrizione());
        entity.setDataAggiornamento(dto.getDataAggiornamento());
        
        return entity;
    }
}