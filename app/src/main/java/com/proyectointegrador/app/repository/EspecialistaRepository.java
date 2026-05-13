package com.proyectointegrador.app.repository;

import com.proyectointegrador.app.model.Especialista;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EspecialistaRepository extends JpaRepository<Especialista, Integer> {

    Especialista findByUsuarioId(int usuarioId);

    boolean existsByUsuarioId(int usuarioId);
}