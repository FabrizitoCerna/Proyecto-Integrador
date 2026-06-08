package com.proyectointegrador.app.service;

import com.proyectointegrador.app.model.*;
import com.proyectointegrador.app.repository.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OfertaService {

    @Autowired
    private OfertaRepository ofertaRepository;

    @Autowired
    private SolicitudRepository solicitudRepository;

    @Autowired
    private EspecialistaRepository especialistaRepository;

    @Autowired
    private NotificacionService notificacionService;

    // LISTAR ofertas de una solicitud
    public List<Oferta> listarPorSolicitud(int solicitudId) {
        return ofertaRepository.findBySolicitudId(solicitudId);
    }

    // CREAR oferta
    public ResponseEntity<?> crearOferta(int solicitudId, int usuarioId, Double precio, String mensaje) {

        Solicitud solicitud = solicitudRepository.findById(solicitudId).orElse(null);
        if (solicitud == null) {
            return ResponseEntity.badRequest().body("Solicitud no encontrada");
        }

        if (solicitud.getEstado() != Solicitud.EstadoSolicitud.buscando) {
            return ResponseEntity.badRequest().body("La solicitud ya no está disponible");
        }

        Especialista especialista = especialistaRepository.findByUsuarioId(usuarioId);
        if (especialista == null) {
            return ResponseEntity.badRequest().body("Especialista no encontrado");
        }

        if (ofertaRepository.existsBySolicitudIdAndEspecialistaId(solicitudId, especialista.getId())) {
            return ResponseEntity.badRequest().body("Ya enviaste una oferta para esta solicitud");
        }

        if (precio == null || precio <= 0) {
            return ResponseEntity.badRequest().body("El precio debe ser mayor a 0");
        }

        Oferta oferta = new Oferta();
        oferta.setSolicitud(solicitud);
        oferta.setEspecialista(especialista);
        oferta.setPrecio(precio);
        oferta.setMensaje(mensaje);
        oferta.setEstado(Oferta.EstadoOferta.pendiente);

        Oferta ofertaGuardada = ofertaRepository.save(oferta);
        notificacionService.notificarNuevaOferta(solicitud.getCliente().getId(), ofertaGuardada);

        return ResponseEntity.ok(ofertaGuardada);
    }

    // ACEPTAR oferta
    public ResponseEntity<?> aceptarOferta(int ofertaId) {

        Oferta oferta = ofertaRepository.findById(ofertaId).orElse(null);
        if (oferta == null) {
            return ResponseEntity.status(404).body("Oferta no encontrada");
        }

        oferta.setEstado(Oferta.EstadoOferta.aceptada);
        ofertaRepository.save(oferta);

        List<Oferta> otrasOfertas = ofertaRepository.findBySolicitudId(oferta.getSolicitud().getId());
        for (Oferta otra : otrasOfertas) {
            if (otra.getId() != ofertaId) {
                otra.setEstado(Oferta.EstadoOferta.rechazada);
                ofertaRepository.save(otra);
            }
        }

        Solicitud solicitud = oferta.getSolicitud();
        solicitud.setEstado(Solicitud.EstadoSolicitud.oferta_aceptada);
        solicitud.setEspecialistaGanador(oferta.getEspecialista());
        Solicitud solicitudGuardada = solicitudRepository.save(solicitud);

        notificacionService.notificarOfertaAceptada(
            oferta.getEspecialista().getUsuario().getId(), solicitudGuardada
        );

        return ResponseEntity.ok(oferta);
    }
}