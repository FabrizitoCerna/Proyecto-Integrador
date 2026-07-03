package com.proyectointegrador.app.repository;

import com.proyectointegrador.app.model.Oferta;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OfertaRepository extends JpaRepository<Oferta, Integer> {

    List<Oferta> findBySolicitudId(int solicitudId);

    List<Oferta> findByEspecialistaId(int especialistaId);

    boolean existsBySolicitudIdAndEspecialistaId(int solicitudId, int especialistaId);

    // Buscar oferta aceptada de una solicitud
    Oferta findBySolicitudIdAndEstado(int solicitudId, Oferta.EstadoOferta estado);
}