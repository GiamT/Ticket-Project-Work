package com.example.projectWork.repository;

import com.example.projectWork.entity.AggiornamentoTicket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AggiornamentoTicketRepository extends JpaRepository<AggiornamentoTicket, Long> {
    List<AggiornamentoTicket> findByTicketId(Long ticketId);
    List<AggiornamentoTicket> findByTecnicoId(Long tecnicoId);
}
