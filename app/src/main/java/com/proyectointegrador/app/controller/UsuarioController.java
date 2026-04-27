package com.proyectointegrador.app.controller;

import com.proyectointegrador.app.model.Usuario;
import com.proyectointegrador.app.service.  UsuarioService;

import org.springframework.beans.factory.annotation.Autowired;
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
public Usuario login(@RequestBody Usuario usuario) {
    return usuarioService.login(usuario.getEmail(), usuario.getPassword());

   
}


}