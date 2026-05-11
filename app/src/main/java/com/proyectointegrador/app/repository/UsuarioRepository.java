package com.proyectointegrador.app.repository;

import com.proyectointegrador.app.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {

    Usuario findByEmail(String email);

    Usuario findByDni(String dni);

    boolean existsByEmail(String email);

    boolean existsByDni(String dni);
}