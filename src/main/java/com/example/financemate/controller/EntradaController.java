package  com.example.financemate.controller;

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

import com.example.financemate.model.Entrada;
import com.example.financemate.repository.EntradaRepository;


@RestController
@RequestMapping("/entradas")
@CrossOrigin(origins = "*") 
public class EntradaController {

    @Autowired
    private EntradaRepository entradaRepository;

    @PostMapping
    public ResponseEntity<Entrada> createEntrada(@RequestBody Entrada entrada) {
        Entrada novaEntrada = entradaRepository.save(entrada);
        return ResponseEntity.ok(novaEntrada);
    }

    // Listar todas as Entradas
    @GetMapping
    public List<Entrada> getAllEntradas() {
        return entradaRepository.findAll();
    }

    // Buscar uma Entrada pelo ID
    @GetMapping("/{id}")
    public ResponseEntity<Entrada> getEntradaById(@PathVariable Integer id) {
        Optional<Entrada> entrada = entradaRepository.findById(id);
        return entrada.map(ResponseEntity::ok)
                      .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Update an Entrada
    @PutMapping("/{id}")
    public ResponseEntity<Entrada> updateEntrada(@PathVariable(value = "id") Integer id, @RequestBody Entrada entradaDetails) {
        Optional<Entrada> entrada = entradaRepository.findById(id);

        if (entrada.isPresent()) {
            Entrada updatedEntrada = entrada.get();
            updatedEntrada.setData(entradaDetails.getData());
            updatedEntrada.setValor(entradaDetails.getValor());
            updatedEntrada.setCategoria(entradaDetails.getCategoria());
            final Entrada savedEntrada = entradaRepository.save(updatedEntrada);
            return ResponseEntity.ok(savedEntrada);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Delete an Entrada
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEntrada(@PathVariable(value = "id") Integer id) {
        Optional<Entrada> entrada = entradaRepository.findById(id);

        if (entrada.isPresent()) {
            entradaRepository.delete(entrada.get());
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
