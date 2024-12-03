package com.example.projectWork.dto;

public class ClienteDTO {

    private Integer id;
    private String nome;
    private String email;
    private String partitaIva;
    private String codiceFiscale;
    private String indirizzo;
    private String telefono;

    // Costruttore, getter e setter

    public ClienteDTO() {
    }

    public ClienteDTO(Integer id, String nome, String email, String partitaIva, String codiceFiscale, String indirizzo,
            String telefono) {
        this.id = id;
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