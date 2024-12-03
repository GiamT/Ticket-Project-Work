package com.example.projectWork.mapper;

import com.example.projectWork.dto.AdminDTO;
import com.example.projectWork.entity.Admin;

public class AdminMapper {

    // Metodo per convertire Admin in AdminDTO
    public AdminDTO adminToAdminDTO(Admin admin) {
        AdminDTO adminDTO = new AdminDTO();
        adminDTO.setNome(admin.getNome());
        adminDTO.setEmail(admin.getEmail());
        return adminDTO;
    }

    // Metodo per convertire AdminDTO in Admin
    public Admin adminDTOToAdmin(AdminDTO adminDTO) {
        Admin admin = new Admin();
        admin.setNome(adminDTO.getNome());
        admin.setEmail(adminDTO.getEmail());
        return admin;
    }
}
