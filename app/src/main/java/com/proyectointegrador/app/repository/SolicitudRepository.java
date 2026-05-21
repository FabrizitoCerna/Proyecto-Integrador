package com.proyectointegrador.app.repository;

import com.proyectointegrador.app.model.Solicitud;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SolicitudRepository extends JpaRepository<Solicitud, Integer> {

    // Solicitudes de un cliente
    List<Solicitud> findByClienteId(int clienteId);

    // Solicitudes por categoría (para que el especialista vea las de su área)
    List<Solicitud> findByCategoriaId(int categoriaId);

    // Solicitudes pendientes por categoría
    List<Solicitud> findByCategoriaIdAndEstado(int categoriaId, Solicitud.EstadoSolicitud estado);
    

    // Solicitudes pendientes de una lista de categorías
@Query("SELECT s FROM Solicitud s WHERE s.categoria.id IN :categoriaIds AND s.estado = 'pendiente'")
List<Solicitud> findPendientesByCategoriaIds(@Param("categoriaIds") List<Integer> categoriaIds);

@Query("SELECT s FROM Solicitud s WHERE s.categoria.id IN :categoriaIds AND s.estado IN :estados")
List<Solicitud> findByCategoriaIdsAndEstados(
    @Param("categoriaIds") List<Integer> categoriaIds,
    @Param("estados") List<Solicitud.EstadoSolicitud> estados
);

}