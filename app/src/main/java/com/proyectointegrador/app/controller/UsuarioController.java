package com.proyectointegrador.app.controller;

import com.proyectointegrador.app.model.Usuario;
import com.proyectointegrador.app.service.  UsuarioService;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    // GET → listar usuarios
    @GetMapping
    public List<Usuario> listarUsuarios() {
        return usuarioService.listarUsuarios();
    }

    // POST → crear usuario
    @PostMapping
    public Usuario guardarUsuario(@RequestBody Usuario usuario) {
        return usuarioService.guardarUsuario(usuario);
    }


    
@PostMapping("/login")
public ResponseEntity<?> login(@RequestBody Usuario usuario) {

    Usuario usuarioEncontrado = usuarioService.buscarPorEmail(usuario.getEmail());

    // ❌ Usuario no existe
    if (usuarioEncontrado == null) {
        return ResponseEntity
                .status(404)
                .body("Usuario no existe");
    }

    // ❌ Contraseña incorrecta
    if (!usuarioEncontrado.getPassword().equals(usuario.getPassword())) {
        return ResponseEntity
                .status(401)
                .body("Contraseña incorrecta");
    }

    // ✅ Login correcto
    return ResponseEntity.ok(usuarioEncontrado);
}
   
}


