package com.proyectointegrador.app.repository;

import com.proyectointegrador.app.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {

    Usuario findByEmail(String email); //  necesario para login

    
}