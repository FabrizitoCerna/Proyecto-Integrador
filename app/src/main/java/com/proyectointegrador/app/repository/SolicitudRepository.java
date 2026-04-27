package com.proyectointegrador.app.repository;

import com.proyectointegrador.app.model.Solicitud;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SolicitudRepository extends JpaRepository<Solicitud, Integer> {
}