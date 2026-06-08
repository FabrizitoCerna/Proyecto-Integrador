package com.proyectointegrador.app.controller;

import com.proyectointegrador.app.model.Oferta;
import com.proyectointegrador.app.service.OfertaService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/ofertas")
@CrossOrigin(origins = "*")
public class OfertaController {

    @Autowired
    private OfertaService ofertaService;

    // GET → ofertas de una solicitud
    @GetMapping("/solicitud/{solicitudId}")
    public List<Oferta> listarPorSolicitud(@PathVariable int solicitudId) {
        return ofertaService.listarPorSolicitud(solicitudId);
    }

    // POST → crear oferta
    // Body: { "solicitudId": 1, "usuarioId": 2, "precio": 150.0, "mensaje": "..." }
    @PostMapping
    public ResponseEntity<?> crear(@RequestBody Map<String, Object> body) {
        int solicitudId = Integer.parseInt(body.get("solicitudId").toString());
        int usuarioId = Integer.parseInt(body.get("usuarioId").toString());
        Double precio = Double.parseDouble(body.get("precio").toString());
        String mensaje = body.getOrDefault("mensaje", "").toString();

        return ofertaService.crearOferta(solicitudId, usuarioId, precio, mensaje);
    }

    // PUT → aceptar oferta
    @PutMapping("/{id}/aceptar")
    public ResponseEntity<?> aceptar(@PathVariable int id) {
        return ofertaService.aceptarOferta(id);
    }
}