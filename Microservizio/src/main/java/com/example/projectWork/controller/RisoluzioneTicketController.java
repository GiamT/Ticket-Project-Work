package com.example.projectWork.controller;

import com.example.projectWork.dto.RisoluzioneTicketDTO;
import com.example.projectWork.service.RisoluzioneTicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/risoluzioni")
public class RisoluzioneTicketController {

    @Autowired
    private RisoluzioneTicketService risoluzioneService;

    @GetMapping("/ticket/{ticketId}")
    public ResponseEntity<RisoluzioneTicketDTO> getRisoluzioneByTicket(@PathVariable Long ticketId) {
        return risoluzioneService.getRisoluzioneByTicket(ticketId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<RisoluzioneTicketDTO> createRisoluzione(@RequestBody RisoluzioneTicketDTO dto) {
        try {
            RisoluzioneTicketDTO created = risoluzioneService.createRisoluzione(dto);
            return new ResponseEntity<>(created, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}