package com.example.projectWork.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;

@Entity
@Table(name = "aggiornamenti_ticket")
public class AggiornamentoTicket {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_ticket", nullable = false)
    private Ticket ticket;

    @ManyToOne
    @JoinColumn(name = "id_tecnico")
    private Admin tecnico;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String descrizione;

    @Column(nullable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime dataAggiornamento;

    // Costruttore vuoto
    public AggiornamentoTicket() {
    }

    // Getter e setter
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Ticket getTicket() {
        return ticket;
    }

    public void setTicket(Ticket ticket) {
        this.ticket = ticket;
    }

    public Admin getTecnico() {
        return tecnico;
    }

    public void setTecnico(Admin tecnico) {
        this.tecnico = tecnico;
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
}
