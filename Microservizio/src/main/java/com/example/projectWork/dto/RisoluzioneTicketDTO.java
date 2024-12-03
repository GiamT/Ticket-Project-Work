package com.example.projectWork.dto;

import java.time.LocalDateTime;

public class RisoluzioneTicketDTO {
    private Integer id;          
    private Integer ticketId;    
    private Integer tecnicoId;
    private String note;
    private LocalDateTime dataRisoluzione;
    private String tecnicoNome;

    // Costruttore
    public RisoluzioneTicketDTO() {}

    // Getter e Setter
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getTicketId() {
        return ticketId;
    }

    public void setTicketId(Integer ticketId) {
        this.ticketId = ticketId;
    }

    public Integer getTecnicoId() {
        return tecnicoId;
    }

    public void setTecnicoId(Integer tecnicoId) {
        this.tecnicoId = tecnicoId;
    }

    public String getNote() {
        return note;
    }
    
    public void setNote(String note) {
        this.note = note;
    }
    
    public LocalDateTime getDataRisoluzione() {
        return dataRisoluzione;
    }
    
    public void setDataRisoluzione(LocalDateTime dataRisoluzione) {
        this.dataRisoluzione = dataRisoluzione;
    }
    
    public String getTecnicoNome() {
        return tecnicoNome;
    }
    
    public void setTecnicoNome(String tecnicoNome) {
        this.tecnicoNome = tecnicoNome;
    }
    
}