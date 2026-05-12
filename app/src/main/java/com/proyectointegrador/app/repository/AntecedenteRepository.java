package com.proyectointegrador.app.repository;

import com.proyectointegrador.app.model.Antecedente;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AntecedenteRepository extends JpaRepository<Antecedente, Long> {
    List<Antecedente> findByEstado(String estado);
    List<Antecedente> findByUsuarioId(Long usuarioId);
}