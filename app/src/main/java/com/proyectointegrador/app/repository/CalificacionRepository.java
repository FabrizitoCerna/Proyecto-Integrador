package com.proyectointegrador.app.repository;

import com.proyectointegrador.app.model.Calificacion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CalificacionRepository extends JpaRepository<Calificacion, Integer> {

    boolean existsBySolicitudId(int solicitudId);

    // Calificación de una solicitud (para mostrarla en el historial del especialista)
    Calificacion findBySolicitudId(int solicitudId);

    // Reseñas recibidas por un especialista (id de su Usuario), más recientes primero
    List<Calificacion> findByEspecialistaIdOrderByFechaDesc(int especialistaId);
}
