package com.proyectointegrador.app.controller;

import com.proyectointegrador.app.model.Calificacion;
import com.proyectointegrador.app.service.CalificacionService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/calificaciones")
@CrossOrigin(origins = "*")
public class CalificacionController {

    @Autowired
    private CalificacionService calificacionService;

    // POST → calificar un servicio finalizado
    // Body: { "solicitudId": 1, "clienteId": 2, "estrellas": 5, "comentario": "..." }
    @PostMapping
    public ResponseEntity<?> crear(@RequestBody Map<String, Object> body) {
        int solicitudId = Integer.parseInt(body.get("solicitudId").toString());
        int clienteId = Integer.parseInt(body.get("clienteId").toString());
        int estrellas = Integer.parseInt(body.get("estrellas").toString());
        String comentario = body.getOrDefault("comentario", "").toString();

        return calificacionService.crearCalificacion(solicitudId, clienteId, estrellas, comentario);
    }

    // GET → reseñas recibidas por un especialista (id de su Usuario)
    @GetMapping("/especialista/{usuarioId}")
    public List<Calificacion> listarPorEspecialista(@PathVariable int usuarioId) {
        return calificacionService.listarPorEspecialista(usuarioId);
    }
}
