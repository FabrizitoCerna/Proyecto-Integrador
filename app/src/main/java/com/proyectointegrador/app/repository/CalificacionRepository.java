package com.proyectointegrador.app.repository;

import com.proyectointegrador.app.model.Calificacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CalificacionRepository extends JpaRepository<Calificacion, Integer> {

    // Calificaciones de un especialista
    List<Calificacion> findByEspecialistaId(int especialistaId);

    // Verificar si ya calificó esta solicitud
    boolean existsBySolicitudId(int solicitudId);

    // Promedio de estrellas de un especialista
    @Query("SELECT AVG(c.estrellas) FROM Calificacion c WHERE c.especialista.id = :especialistaId")
    Double promedioEstrellas(@Param("especialistaId") int especialistaId);
}