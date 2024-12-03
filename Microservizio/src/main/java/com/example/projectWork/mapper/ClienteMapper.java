package com.example.projectWork.mapper;

import com.example.projectWork.dto.ClienteDTO;
import com.example.projectWork.entity.Cliente;

public class ClienteMapper {

    // Metodo per convertire Cliente in ClienteDTO
    public ClienteDTO clienteToClienteDTO(Cliente cliente) {
        ClienteDTO clienteDTO = new ClienteDTO();
        clienteDTO.setId(cliente.getId());
        clienteDTO.setNome(cliente.getNome());
        clienteDTO.setEmail(cliente.getEmail());
        clienteDTO.setPartitaIva(cliente.getPartitaIva());
        clienteDTO.setCodiceFiscale(cliente.getCodiceFiscale());
        clienteDTO.setIndirizzo(cliente.getIndirizzo());
        clienteDTO.setTelefono(cliente.getTelefono());
        return clienteDTO;
    }

    // Metodo per convertire ClienteDTO in Cliente
    public Cliente clienteDTOToCliente(ClienteDTO clienteDTO) {
        Cliente cliente = new Cliente();
        cliente.setNome(clienteDTO.getNome());
        cliente.setEmail(clienteDTO.getEmail());
        cliente.setPartitaIva(clienteDTO.getPartitaIva());
        cliente.setCodiceFiscale(clienteDTO.getCodiceFiscale());
        cliente.setIndirizzo(clienteDTO.getIndirizzo());
        cliente.setTelefono(clienteDTO.getTelefono());
        return cliente;
    }
}
