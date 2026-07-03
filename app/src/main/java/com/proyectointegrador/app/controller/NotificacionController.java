package com.proyectointegrador.app.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
public class NotificacionController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    // Enviar notificación a un usuario específico
    public void notificar(String usuarioId, String tipo, Object datos) {
        messagingTemplate.convertAndSend("/topic/usuario/" + usuarioId, 
            Map.of("tipo", tipo, "datos", datos)
        );
    }
}