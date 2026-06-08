package com.proyectointegrador.app.repository;

import com.proyectointegrador.app.model.Tecnico;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TecnicoRepository extends JpaRepository<Tecnico, Integer> {
}
