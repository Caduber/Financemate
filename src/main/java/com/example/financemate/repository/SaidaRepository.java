package com.example.financemate.repository;
import com.example.financemate.model.Saida;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SaidaRepository extends JpaRepository<Saida, Integer> {
}
