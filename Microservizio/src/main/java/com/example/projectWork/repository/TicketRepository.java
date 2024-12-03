package com.example.projectWork.repository;

import com.example.projectWork.entity.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {
    // Puoi aggiungere query personalizzate se necessarie
}
