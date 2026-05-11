package com.proyectointegrador.app.service;

import com.proyectointegrador.app.model.Usuario;
import com.proyectointegrador.app.repository.UsuarioRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    // LISTAR celeste
    public List<Usuario> listarUsuarios() {
        return usuarioRepository.findAll();
    }

    // GUARDAR
    public Usuario guardarUsuario(Usuario usuario) {
        return usuarioRepository.save(usuario);
    }

    // BUSCAR POR EMAIL
    public Usuario buscarPorEmail(String email) {
        return usuarioRepository.findByEmail(email);
    }

    // REGISTRO
    public ResponseEntity<?> registrarUsuario(Usuario usuario) {

        // VALIDAR SI YA EXISTE
        if (usuarioRepository.findByEmail(usuario.getEmail()) != null) {
            return ResponseEntity
                    .badRequest()
                    .body("El email ya está registrado");
        }

        // GUARDAR
        Usuario nuevo = usuarioRepository.save(usuario);

        return ResponseEntity.ok(nuevo);
    }
}