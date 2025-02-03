package com.example.financemate.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.financemate.model.Saida;
import com.example.financemate.repository.SaidaRepository;

@RestController
@RequestMapping("/saidas")
@CrossOrigin(origins = "*") 
public class SaidaController {

    @Autowired
    private SaidaRepository saidaRepository;

    // Create a new Saida
    @PostMapping
    public Saida createSaida(@RequestBody Saida saida) {
        return saidaRepository.save(saida);
    }

    // Get all Saidas
    @GetMapping
    public List<Saida> getAllSaidas() {
        return saidaRepository.findAll();
    }

    // Get a Saida by ID
    @GetMapping("/{id}")
    public ResponseEntity<Saida> getSaidaById(@PathVariable(value = "id") Integer id) {
        Optional<Saida> saida = saidaRepository.findById(id);
        return saida.map(ResponseEntity::ok)
                      .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Update a Saida
    @PutMapping("/{id}")
    public ResponseEntity<Saida> updateSaida(@PathVariable(value = "id") Integer id, @RequestBody Saida saidaDetails) {
        Optional<Saida> saida = saidaRepository.findById(id);

        if (saida.isPresent()) {
            Saida updatedSaida = saida.get();
            updatedSaida.setData(saidaDetails.getData());
            updatedSaida.setValor(saidaDetails.getValor());
            updatedSaida.setCategoria(saidaDetails.getCategoria());
            final Saida savedSaida = saidaRepository.save(updatedSaida);
            return ResponseEntity.ok(savedSaida);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Delete a Saida
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSaida(@PathVariable(value = "id") Integer id) {
        Optional<Saida> saida = saidaRepository.findById(id);

        if (saida.isPresent()) {
            saidaRepository.delete(saida.get());
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
