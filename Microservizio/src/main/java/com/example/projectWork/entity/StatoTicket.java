package com.example.projectWork.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "stato_ticket")
public class StatoTicket {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String stato;

    // Costruttore vuoto
    public StatoTicket() {
    }

    // Getter e setter
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getStato() {
        return stato;
    }

    public void setStato(String stato) {
        this.stato = stato;
    }

    // Metodo statico per ottenere un StatoTicket a partire da una stringa (stato)
    public static StatoTicket valueOf(String stato, EntityManager entityManager) {
        // Usando una query JPQL per cercare un StatoTicket per stato
        try {
            Query query = entityManager.createQuery("SELECT s FROM StatoTicket s WHERE s.stato = :stato");
            query.setParameter("stato", stato);
            return (StatoTicket) query.getSingleResult();
        } catch (NoResultException e) {
            throw new IllegalArgumentException("Stato non trovato per: " + stato);
        }
    }
}
