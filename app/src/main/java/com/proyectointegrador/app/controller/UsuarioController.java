package com.proyectointegrador.app.controller;

import com.proyectointegrador.app.model.Usuario;
import com.proyectointegrador.app.service.UsuarioService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // GET → listar usuarios
    @GetMapping
    public List<Usuario> listarUsuarios() {
        return usuarioService.listarUsuarios();
    }

    // POST → guardar general
    @PostMapping
    public Usuario guardarUsuario(@RequestBody Usuario usuario) {
        return usuarioService.guardarUsuario(usuario);
    }

    // LOGIN 
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Usuario usuario) {

        if (usuario.getEmail() == null || usuario.getPassword() == null) {
            return ResponseEntity.badRequest().body("Email y contraseña son obligatorios");
        }

        Usuario encontrado = usuarioService.buscarPorEmail(usuario.getEmail());

        if (encontrado == null) {
            return ResponseEntity.status(404).body("Usuario no encontrado");
        }

        if (!passwordEncoder.matches(usuario.getPassword(), encontrado.getPassword())) {
            // Migración de cuentas antiguas guardadas con contraseña en texto plano
            if (!encontrado.getPassword().equals(usuario.getPassword())) {
                return ResponseEntity.status(401).body("Contraseña incorrecta");
            }
            encontrado.setPassword(passwordEncoder.encode(usuario.getPassword()));
            usuarioService.guardarUsuario(encontrado);
        }

        // No devolver la contraseña
        encontrado.setPassword(null);

        return ResponseEntity.ok(encontrado);
    }

    // REGISTRO
    @PostMapping("/registro")
    public ResponseEntity<?> registrar(@RequestBody Usuario usuario) {
        return usuarioService.registrarUsuario(usuario);
    }
}