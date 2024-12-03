package com.example.projectWork.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.projectWork.entity.Cliente;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Integer> {
    // Metodo per trovare un cliente tramite la sua email
    Cliente findByEmail(String email);
}
