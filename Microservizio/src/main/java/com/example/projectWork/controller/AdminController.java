package com.example.projectWork.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.projectWork.dto.AdminDTO;
import com.example.projectWork.service.AdminService;

import java.util.List;

@RestController
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    // Recupero di tutti gli admin
    @GetMapping
    public ResponseEntity<List<AdminDTO>> getAllAdmin() {
        List<AdminDTO> admins = adminService.getAllAdmins();
        return new ResponseEntity<>(admins, HttpStatus.OK);
    }

    // Recupero di un admin per email
    @GetMapping("/{email}")
    public ResponseEntity<AdminDTO> getAdminByEmail(@PathVariable String email) {
        try {
            AdminDTO admin = adminService.getAdminByEmail(email);
            return new ResponseEntity<>(admin, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);  // Admin non trovato
        }
    }

    // Eliminazione di un admin per email
    @DeleteMapping("/{email}")
    public ResponseEntity<Void> deleteAdmin(@PathVariable String email) {
        boolean isDeleted = adminService.deleteAdmin(email);
        return isDeleted ? new ResponseEntity<>(HttpStatus.NO_CONTENT)
                         : new ResponseEntity<>(HttpStatus.NOT_FOUND);  // Admin non trovato
    }

    // Creazione di un nuovo Admin
    @PostMapping
    public ResponseEntity<AdminDTO> createAdmin(@RequestBody AdminDTO adminDTO) {
        AdminDTO createdAdmin = adminService.createAdmin(adminDTO);
        return new ResponseEntity<>(createdAdmin, HttpStatus.CREATED);
    }

    // Aggiornamento di un Admin
    @PutMapping("/{id}")
    public ResponseEntity<AdminDTO> updateAdmin(@PathVariable Long id, @RequestBody AdminDTO adminDTO) {
        AdminDTO updatedAdmin = adminService.updateAdmin(id, adminDTO);
        return new ResponseEntity<>(updatedAdmin, HttpStatus.OK);
    }
}
