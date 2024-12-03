package com.example.projectWork.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.projectWork.dto.AdminDTO;
import com.example.projectWork.entity.Admin;
import com.example.projectWork.mapper.AdminMapper;
import com.example.projectWork.repository.AdminRepository;

@Service
public class AdminService {

    @Autowired
    private AdminRepository adminRepository;

    private final AdminMapper adminMapper = new AdminMapper(); // Instanzia il mapper

    // Metodo per ottenere un Admin tramite ID
    public AdminDTO getAdminById(Long id) {
        Admin admin = adminRepository.findById(id).orElseThrow(() -> new RuntimeException("Admin non trovato"));
        return adminMapper.adminToAdminDTO(admin);  // Usa il mapper per la conversione
    }

    // Metodo per ottenere un Admin tramite Email
    public AdminDTO getAdminByEmail(String email) {
        Admin admin = adminRepository.findByEmail(email);
               // .orElseThrow(() -> new RuntimeException("Admin con email " + email + " non trovato"));
        return adminMapper.adminToAdminDTO(admin);  // Usa il mapper per la conversione
    }
    

    // Metodo per recuperare tutti gli admin
    public List<AdminDTO> getAllAdmins() {
        List<Admin> admins = adminRepository.findAll();
        return admins.stream()
                     .map(adminMapper::adminToAdminDTO)  // Usa il mapper per la conversione
                    .collect(Collectors.toList());
    }

    // Metodo per creare un nuovo Admin
    public AdminDTO createAdmin(AdminDTO adminDTO) {
        Admin admin = adminMapper.adminDTOToAdmin(adminDTO);  // Converte il DTO in entità
        admin = adminRepository.save(admin);
        return adminMapper.adminToAdminDTO(admin);  // Restituisce il DTO
    }

    // Metodo per aggiornare un Admin
    public AdminDTO updateAdmin(Long id, AdminDTO adminDTO) {
        Admin admin = adminRepository.findById(id).orElseThrow(() -> new RuntimeException("Admin non trovato"));
        admin.setNome(adminDTO.getNome());
        admin.setEmail(adminDTO.getEmail());
        admin = adminRepository.save(admin);
        return adminMapper.adminToAdminDTO(admin);  // Restituisce il DTO aggiornato
    }

    // Metodo per eliminare un Admin tramite email
    public boolean deleteAdmin(String email) {
        Admin admin = adminRepository.findByEmail(email);//.orElse(null);
        if (admin != null) {
            adminRepository.delete(admin);
            return true;
        }
        return false;
    }
}
