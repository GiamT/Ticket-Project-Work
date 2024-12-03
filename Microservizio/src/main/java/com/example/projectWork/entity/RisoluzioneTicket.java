package com.example.projectWork.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;

@Entity
@Table(name = "risoluzione_ticket")
public class RisoluzioneTicket {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "id_ticket", nullable = false, unique = true)
    private Ticket ticket;

    @ManyToOne
    @JoinColumn(name = "id_tecnico")
    private Admin tecnico;

    @Column(columnDefinition = "TEXT")
    private String note;

    @Column(nullable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime dataRisoluzione;

    //Costruttore vuoto
    public RisoluzioneTicket() {}

    //Getter e setter
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

    
}
