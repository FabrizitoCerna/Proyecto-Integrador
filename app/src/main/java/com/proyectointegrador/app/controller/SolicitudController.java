package com.proyectointegrador.app.controller;

import com.proyectointegrador.app.model.Solicitud;
import com.proyectointegrador.app.service.SolicitudService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/solicitudes")
public class SolicitudController {

    @Autowired
    private SolicitudService solicitudService;

    @GetMapping
    public List<Solicitud> listarSolicitudes() {
        return solicitudService.listarSolicitudes();
    }

    @PostMapping
    public Solicitud crearSolicitud(@RequestBody Solicitud solicitud) {
        return solicitudService.crearSolicitud(solicitud);
    }

    @PutMapping("/{id}/estado")
    public Solicitud actualizarEstado(@PathVariable int id, @RequestParam String estado) {
    return solicitudService.actualizarEstado(id, estado);
}
}