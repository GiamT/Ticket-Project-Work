package com.example.projectWork.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.projectWork.entity.StatoTicket;

@Repository
public interface StatoTicketRepository extends JpaRepository<StatoTicket, Long> {
} 