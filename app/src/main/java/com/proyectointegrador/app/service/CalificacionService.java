package com.proyectointegrador.app.service;

import com.proyectointegrador.app.model.Calificacion;
import com.proyectointegrador.app.model.Especialista;
import com.proyectointegrador.app.model.Solicitud;
import com.proyectointegrador.app.repository.CalificacionRepository;
import com.proyectointegrador.app.repository.EspecialistaRepository;
import com.proyectointegrador.app.repository.SolicitudRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CalificacionService {

    @Autowired
    private CalificacionRepository calificacionRepository;

    @Autowired
    private SolicitudRepository solicitudRepository;

    @Autowired
    private EspecialistaRepository especialistaRepository;

    // CREAR calificación de un servicio finalizado
    public ResponseEntity<?> crearCalificacion(int solicitudId, int clienteId, int estrellas, String comentario) {

        if (estrellas < 1 || estrellas > 5) {
            return ResponseEntity.badRequest().body("La calificación debe ser entre 1 y 5 estrellas");
        }

        Solicitud solicitud = solicitudRepository.findById(solicitudId).orElse(null);
        if (solicitud == null) {
            return ResponseEntity.badRequest().body("Solicitud no encontrada");
        }

        if (solicitud.getCliente().getId() != clienteId) {
            return ResponseEntity.status(403).body("No tienes permiso para calificar esta solicitud");
        }

        if (solicitud.getEstado() != Solicitud.EstadoSolicitud.finalizado) {
            return ResponseEntity.badRequest().body("Solo puedes calificar servicios finalizados");
        }

        if (calificacionRepository.existsBySolicitudId(solicitudId)) {
            return ResponseEntity.badRequest().body("Esta solicitud ya fue calificada");
        }

        Especialista especialista = solicitud.getEspecialistaGanador();

        Calificacion calificacion = new Calificacion();
        calificacion.setSolicitud(solicitud);
        calificacion.setCliente(solicitud.getCliente());
        calificacion.setEspecialista(especialista.getUsuario());
        calificacion.setEstrellas(estrellas);
        calificacion.setComentario(comentario);

        Calificacion guardada = calificacionRepository.save(calificacion);

        actualizarPromedio(especialista);

        return ResponseEntity.ok(guardada);
    }

    // LISTAR reseñas recibidas por un especialista (id de su Usuario)
    public List<Calificacion> listarPorEspecialista(int especialistaUsuarioId) {
        return calificacionRepository.findByEspecialistaIdOrderByFechaDesc(especialistaUsuarioId);
    }

    // Recalcular calificacionPromedio del especialista en base a sus reseñas
    private void actualizarPromedio(Especialista especialista) {
        List<Calificacion> resenas = calificacionRepository
            .findByEspecialistaIdOrderByFechaDesc(especialista.getUsuario().getId());

        double promedio = resenas.stream()
            .mapToInt(Calificacion::getEstrellas)
            .average()
            .orElse(0.0);

        especialista.setCalificacionPromedio(promedio);
        especialistaRepository.save(especialista);
    }
}
