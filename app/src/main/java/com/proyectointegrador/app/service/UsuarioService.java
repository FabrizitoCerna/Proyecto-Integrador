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

    // LISTAR
    public List<Usuario> listarUsuarios() {
        return usuarioRepository.findAll();
    }

    // GUARDAR general
    public Usuario guardarUsuario(Usuario usuario) {
        return usuarioRepository.save(usuario);
    }

    // BUSCAR POR EMAIL
    public Usuario buscarPorEmail(String email) {
        return usuarioRepository.findByEmail(email);
    }

    // REGISTRO
    public ResponseEntity<?> registrarUsuario(Usuario usuario) {

        // Validar campos obligatorios
        if (usuario.getNombre() == null || usuario.getNombre().isBlank()) {
            return ResponseEntity.badRequest().body("El nombre es obligatorio");
        }

        if (usuario.getEmail() == null || usuario.getEmail().isBlank()) {
            return ResponseEntity.badRequest().body("El email es obligatorio");
        }

        if (usuario.getPassword() == null || usuario.getPassword().length() < 6) {
            return ResponseEntity.badRequest().body("La contraseña debe tener mínimo 6 caracteres");
        }

        if (usuario.getDni() == null || !usuario.getDni().matches("\\d{8}")) {
            return ResponseEntity.badRequest().body("El DNI debe tener exactamente 8 dígitos");
        }

        if (usuario.getTelefono() == null || !usuario.getTelefono().matches("\\d{9}")) {
            return ResponseEntity.badRequest().body("El teléfono debe tener exactamente 9 dígitos");
        }

        if (usuario.getTipo() == null) {
            return ResponseEntity.badRequest().body("El tipo de usuario es obligatorio (cliente o especialista)");
        }

        // Validar duplicados
        if (usuarioRepository.existsByEmail(usuario.getEmail())) {
            return ResponseEntity.badRequest().body("El email ya está registrado");
        }

        if (usuarioRepository.existsByDni(usuario.getDni())) {
            return ResponseEntity.badRequest().body("El DNI ya está registrado");
        }

        // Guardar
        Usuario nuevo = usuarioRepository.save(usuario);

        // No devolver la contraseña
        nuevo.setPassword(null);

        return ResponseEntity.ok(nuevo);
    }
}