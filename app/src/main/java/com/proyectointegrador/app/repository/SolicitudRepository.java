package com.proyectointegrador.app.repository;

import com.proyectointegrador.app.model.Solicitud;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SolicitudRepository extends JpaRepository<Solicitud, Integer> {

    // Solicitudes de un cliente
    List<Solicitud> findByClienteId(int clienteId);

    // Solicitudes por categoría
    List<Solicitud> findByCategoriaId(int categoriaId);

    // Solicitudes por categoría y estado
    List<Solicitud> findByCategoriaIdAndEstado(int categoriaId, Solicitud.EstadoSolicitud estado);

    // Solicitudes de una lista de categorías con estados específicos
    @Query("SELECT s FROM Solicitud s WHERE s.categoria.id IN :categoriaIds AND s.estado IN :estados")
    List<Solicitud> findByCategoriaIdsAndEstados(
        @Param("categoriaIds") List<Integer> categoriaIds,
        @Param("estados") List<Solicitud.EstadoSolicitud> estados
    );

    // Solicitudes propias del especialista ganador con estados específicos
    @Query("SELECT s FROM Solicitud s WHERE s.especialistaGanador.id = :especialistaId AND s.estado IN :estados")
    List<Solicitud> findByEspecialistaGanadorIdAndEstadoIn(
        @Param("especialistaId") int especialistaId,
        @Param("estados") List<Solicitud.EstadoSolicitud> estados
    );
}