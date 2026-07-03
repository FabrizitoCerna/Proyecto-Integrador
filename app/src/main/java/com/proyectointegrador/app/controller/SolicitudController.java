package com.proyectointegrador.app.controller;

import com.proyectointegrador.app.model.Solicitud;
import com.proyectointegrador.app.service.SolicitudService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/solicitudes")
@CrossOrigin(origins = "*")
public class SolicitudController {

    @Autowired
    private SolicitudService solicitudService;

    // GET → todas las solicitudes
    @GetMapping
    public List<Solicitud> listar() {
        return solicitudService.listarSolicitudes();
    }

    // GET → solicitudes de un cliente
    @GetMapping("/cliente/{clienteId}")
    public List<Solicitud> listarPorCliente(@PathVariable int clienteId) {
        return solicitudService.listarPorCliente(clienteId);
    }

    // GET → solicitudes para especialista (buscando + propias activas)
    @GetMapping("/especialista/{usuarioId}")
    public ResponseEntity<?> listarParaEspecialista(@PathVariable int usuarioId) {
        return ResponseEntity.ok(solicitudService.listarSolicitudesParaEspecialista(usuarioId));
    }

    // POST → crear solicitud
    @PostMapping
    public ResponseEntity<?> crear(@RequestBody Map<String, Object> body) {
        int clienteId = Integer.parseInt(body.get("clienteId").toString());
        int categoriaId = Integer.parseInt(body.get("categoriaId").toString());
        String descripcion = body.get("descripcion").toString();
        String direccion = body.getOrDefault("direccion", "").toString();
        return solicitudService.crearSolicitud(clienteId, categoriaId, descripcion, direccion);
    }

    // PUT → actualizar estado
    @PutMapping("/{id}/estado")
    public ResponseEntity<?> actualizarEstado(@PathVariable int id, @RequestParam String estado) {
        return solicitudService.actualizarEstado(id, estado);
    }

    // PUT → iniciar servicio
    @PutMapping("/{id}/iniciar")
    public ResponseEntity<?> iniciar(@PathVariable int id, @RequestBody Map<String, Object> body) {
        int usuarioId = Integer.parseInt(body.get("usuarioId").toString());
        return solicitudService.iniciarServicio(id, usuarioId);
    }

    // PUT → finalizar servicio
    @PutMapping("/{id}/finalizar")
    public ResponseEntity<?> finalizar(@PathVariable int id, @RequestBody Map<String, Object> body) {
        int usuarioId = Integer.parseInt(body.get("usuarioId").toString());
        return solicitudService.finalizarServicio(id, usuarioId);
    }
}