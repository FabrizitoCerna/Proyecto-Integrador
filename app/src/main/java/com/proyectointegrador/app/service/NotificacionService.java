package com.proyectointegrador.app.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class NotificacionService {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    // Notificar nueva solicitud a especialistas
    public void notificarNuevaSolicitud(int categoriaId, Object solicitud) {
        messagingTemplate.convertAndSend(
            "/topic/categoria/" + categoriaId,
            Map.of("tipo", "NUEVA_SOLICITUD", "datos", solicitud)
        );
    }

    // Notificar nueva oferta al cliente
    public void notificarNuevaOferta(int clienteId, Object oferta) {
        messagingTemplate.convertAndSend(
            "/topic/usuario/" + clienteId,
            Map.of("tipo", "NUEVA_OFERTA", "datos", oferta)
        );
    }

    // Notificar oferta aceptada al especialista
    public void notificarOfertaAceptada(int especialistaUserId, Object solicitud) {
        messagingTemplate.convertAndSend(
            "/topic/usuario/" + especialistaUserId,
            Map.of("tipo", "OFERTA_ACEPTADA", "datos", solicitud)
        );
    }

    // Notificar servicio iniciado al cliente
    public void notificarServicioIniciado(int clienteId, Object solicitud) {
        messagingTemplate.convertAndSend(
            "/topic/usuario/" + clienteId,
            Map.of("tipo", "SERVICIO_INICIADO", "datos", solicitud)
        );
    }

    // Notificar servicio finalizado al cliente
    public void notificarServicioFinalizado(int clienteId, Object solicitud) {
        messagingTemplate.convertAndSend(
            "/topic/usuario/" + clienteId,
            Map.of("tipo", "SERVICIO_FINALIZADO", "datos", solicitud)
        );
    }
}