package com.example.projectWork.repository;

import com.example.projectWork.entity.RisoluzioneTicket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RisoluzioneTicketRepository extends JpaRepository<RisoluzioneTicket, Long> {
    Optional<RisoluzioneTicket> findByTicketId(Long ticketId);
}