package com.proyectointegrador.app.service;

import com.proyectointegrador.app.model.*;
import com.proyectointegrador.app.repository.*;

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
    private UsuarioRepository usuarioRepository;

    @Autowired
    private EspecialistaRepository especialistaRepository;

    @Autowired
    private OfertaRepository ofertaRepository;

    // LISTAR calificaciones de un especialista
    public List<Calificacion> listarPorEspecialista(int especialistaId) {
        return calificacionRepository.findByEspecialistaId(especialistaId);
    }

    // CALIFICAR
    public ResponseEntity<?> calificar(int solicitudId, int clienteId, int estrellas, String comentario) {

        // Validar solicitud
        Solicitud solicitud = solicitudRepository.findById(solicitudId).orElse(null);
        if (solicitud == null) {
            return ResponseEntity.badRequest().body("Solicitud no encontrada");
        }

        // Validar que esté completada
        if (solicitud.getEstado() != Solicitud.EstadoSolicitud.completada) {
            return ResponseEntity.badRequest().body("Solo puedes calificar servicios completados");
        }

        // Validar que sea el cliente de la solicitud
        if (solicitud.getCliente().getId() != clienteId) {
            return ResponseEntity.badRequest().body("No eres el cliente de esta solicitud");
        }

        // Validar que no haya calificado ya
        if (calificacionRepository.existsBySolicitudId(solicitudId)) {
            return ResponseEntity.badRequest().body("Ya calificaste este servicio");
        }

        // Validar estrellas
        if (estrellas < 1 || estrellas > 5) {
            return ResponseEntity.badRequest().body("Las estrellas deben ser entre 1 y 5");
        }

        // Buscar cliente
        Usuario cliente = usuarioRepository.findById(clienteId).orElse(null);
        if (cliente == null) {
            return ResponseEntity.badRequest().body("Cliente no encontrado");
        }

        // Obtener especialista desde la oferta aceptada
        Oferta ofertaAceptada = ofertaRepository.findBySolicitudIdAndEstado(
            solicitudId, Oferta.EstadoOferta.aceptada
        );
        if (ofertaAceptada == null) {
            return ResponseEntity.badRequest().body("No se encontró la oferta aceptada");
        }

        Usuario usuarioEspecialista = ofertaAceptada.getEspecialista().getUsuario();

        // Crear calificación
        Calificacion calificacion = new Calificacion();
        calificacion.setSolicitud(solicitud);
        calificacion.setCliente(cliente);
        calificacion.setEspecialista(usuarioEspecialista);
        calificacion.setEstrellas(estrellas);
        calificacion.setComentario(comentario);

        Calificacion nueva = calificacionRepository.save(calificacion);

        // Actualizar promedio del especialista
        actualizarPromedio(usuarioEspecialista.getId());

        return ResponseEntity.ok(nueva);
    }

    // ACTUALIZAR promedio del especialista
    private void actualizarPromedio(int especialistaUserId) {
        Double promedio = calificacionRepository.promedioEstrellas(especialistaUserId);
        Especialista especialista = especialistaRepository.findByUsuarioId(especialistaUserId);
        if (especialista != null && promedio != null) {
            especialista.setCalificacionPromedio(promedio);
            especialistaRepository.save(especialista);
        }
    }
}