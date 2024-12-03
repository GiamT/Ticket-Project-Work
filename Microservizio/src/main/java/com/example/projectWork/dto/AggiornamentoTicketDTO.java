package com.example.projectWork.dto;

import java.time.LocalDateTime;

public class AggiornamentoTicketDTO {
    private Integer id;          
    private Integer ticketId;    
    private Integer tecnicoId;
    private String descrizione;
    private LocalDateTime dataAggiornamento;
    private String tecnicoNome;

    // Costruttore
    public AggiornamentoTicketDTO() {}

    // Getter e Setter aggiornati
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

    public String getDescrizione() {
        return descrizione;
    }
    
    public void setDescrizione(String descrizione) {
        this.descrizione = descrizione;
    }
    
    public LocalDateTime getDataAggiornamento() {
        return dataAggiornamento;
    }
    
    public void setDataAggiornamento(LocalDateTime dataAggiornamento) {
        this.dataAggiornamento = dataAggiornamento;
    }
    
    public String getTecnicoNome() {
        return tecnicoNome;
    }
    
    public void setTecnicoNome(String tecnicoNome) {
        this.tecnicoNome = tecnicoNome;
    }
    
}