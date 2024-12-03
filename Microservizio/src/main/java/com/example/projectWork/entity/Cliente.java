package com.example.projectWork.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "clienti")
public class Cliente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 100)
    private String nome;

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Column(name = "partita_iva", unique = true, length = 11)
    private String partitaIva;

    @Column(name = "cf", nullable = false, unique = true, length = 16)
    private String codiceFiscale;

    @Column(nullable = false)
    private String indirizzo;

    @Column(nullable = false, unique = true, length = 15)
    private String telefono;

    // Costruttore, getter e setter

    public Cliente() {
    }

    public Cliente(String nome, String email, String partitaIva, String codiceFiscale, String indirizzo,
            String telefono) {
        this.nome = nome;
        this.email = email;
        this.partitaIva = partitaIva;
        this.codiceFiscale = codiceFiscale;
        this.indirizzo = indirizzo;
        this.telefono = telefono;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPartitaIva() {
        return partitaIva;
    }

    public void setPartitaIva(String partitaIva) {
        this.partitaIva = partitaIva;
    }

    public String getCodiceFiscale() {
        return codiceFiscale;
    }

    public void setCodiceFiscale(String codiceFiscale) {
        this.codiceFiscale = codiceFiscale;
    }

    public String getIndirizzo() {
        return indirizzo;
    }

    public void setIndirizzo(String indirizzo) {
        this.indirizzo = indirizzo;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

}
