package com.example.financemate.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.financemate.model.Usuario;
import com.example.financemate.repository.UsuarioRepository;


@RestController
@RequestMapping("/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {
    
    @Autowired
    private UsuarioRepository usuarioRepository;

    @PostMapping
    public ResponseEntity<Usuario> createUsuario(@RequestBody Usuario usuario) {
        Usuario novoUsuario = usuarioRepository.save(usuario);
        return ResponseEntity.ok(novoUsuario);
    }

     // Listar todas os Usuarios
     @GetMapping
     public List<Usuario> getAllUsuarios() {
        return usuarioRepository.findAll();
    }
 
     // Buscar um Usuario pelo ID
     @GetMapping("/{id}")
     public ResponseEntity<Usuario> getEntradaById(@PathVariable Integer id) {
         Optional<Usuario> usuario = usuarioRepository.findById(id);
         return usuario.map(ResponseEntity::ok)
                       .orElseGet(() -> ResponseEntity.notFound().build());
     }

     // Update no Usuario
    @PutMapping("/{id}")
    public ResponseEntity<Usuario> updateUsuario(@PathVariable(value = "id") Integer id, @RequestBody Usuario usuarioDetails) {
        Optional<Usuario> usuario = usuarioRepository.findById(id);

        if (usuario.isPresent()) {
            Usuario updatedUsuario = usuario.get();
            updatedUsuario.setEmail(usuarioDetails.getEmail());
            updatedUsuario.setNome(usuarioDetails.getNome());
            updatedUsuario.setPreferencia(usuarioDetails.getPreferencia());
            updatedUsuario.setSenha(usuarioDetails.getSenha());
            final Usuario savedUsuario = usuarioRepository.save(updatedUsuario);
            return ResponseEntity.ok(savedUsuario);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Delete no Usuario
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUsuario(@PathVariable(value = "id") Integer id) {
        Optional<Usuario> usuario = usuarioRepository.findById(id);

        if (usuario.isPresent()) {
            usuarioRepository.delete(usuario.get());
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
