package com.example.projectWork.controller;

import com.example.projectWork.dto.AggiornamentoTicketDTO;
import com.example.projectWork.service.AggiornamentoTicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/aggiornamenti")
public class AggiornamentoTicketController {

    @Autowired
    private AggiornamentoTicketService aggiornamentoService;

    @GetMapping("/ticket/{ticketId}")
    public ResponseEntity<List<AggiornamentoTicketDTO>> getAggiornamentiByTicket(@PathVariable Long ticketId) {
        List<AggiornamentoTicketDTO> aggiornamenti = aggiornamentoService.getAggiornamentiByTicket(ticketId);
        return ResponseEntity.ok(aggiornamenti);
    }

    @PostMapping
    public ResponseEntity<AggiornamentoTicketDTO> createAggiornamento(@RequestBody AggiornamentoTicketDTO dto) {
        try {
            AggiornamentoTicketDTO created = aggiornamentoService.createAggiornamento(dto);
            return new ResponseEntity<>(created, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}