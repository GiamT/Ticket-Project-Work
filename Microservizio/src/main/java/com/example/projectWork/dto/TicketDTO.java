package com.example.projectWork.dto;

import java.time.LocalDateTime;

public class TicketDTO {
    private Long id;
    private String descrizione;
    private LocalDateTime dataCreazione;
    private Long statoId;
    private Integer clienteId;

    // Costruttore vuoto
    public TicketDTO() {
    }

    // Getter e setter

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDescrizione() {
        return descrizione;
    }

    public void setDescrizione(String descrizione) {
        this.descrizione = descrizione;
    }

    public LocalDateTime getDataCreazione() {
        return dataCreazione;
    }

    public void setDataCreazione(LocalDateTime dataCreazione) {
        this.dataCreazione = dataCreazione;
    }

    public Long getStatoId() {
        return statoId;
    }

    public void setStatoId(Long statoId) {
        this.statoId = statoId;
    }

    public Integer getClienteId() {
        return clienteId;
    }

    public void setClienteId(Integer clienteId) {
        this.clienteId = clienteId;
    }
}