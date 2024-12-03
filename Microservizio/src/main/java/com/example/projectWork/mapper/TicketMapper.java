package com.example.projectWork.mapper;

import com.example.projectWork.entity.Ticket;
import com.example.projectWork.dto.TicketDTO;
import java.time.LocalDateTime;

public class TicketMapper {

    public static TicketDTO toDTO(Ticket ticket) {
        TicketDTO ticketDTO = new TicketDTO();
        ticketDTO.setId(ticket.getId());
        ticketDTO.setDescrizione(ticket.getDescrizione());
        ticketDTO.setDataCreazione(ticket.getDataCreazione());
        ticketDTO.setStatoId(ticket.getStato() != null ? ticket.getStato().getId() : null);
        ticketDTO.setClienteId(ticket.getCliente() != null ? ticket.getCliente().getId() : null);
        return ticketDTO;
    }

    public static Ticket toEntity(TicketDTO ticketDTO) {
        Ticket ticket = new Ticket();
        ticket.setId(ticketDTO.getId());
        ticket.setDescrizione(ticketDTO.getDescrizione());
        ticket.setDataCreazione(ticketDTO.getDataCreazione() != null ? 
            ticketDTO.getDataCreazione() : LocalDateTime.now());
        return ticket;
    }
}
