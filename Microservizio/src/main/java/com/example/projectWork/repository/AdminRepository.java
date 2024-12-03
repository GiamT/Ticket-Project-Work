package com.example.projectWork.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.projectWork.entity.Admin;

@Repository
public interface AdminRepository extends JpaRepository<Admin, Long> {
    // Metodo per trovare un admin tramite la sua email
    Admin findByEmail(String email);
}
