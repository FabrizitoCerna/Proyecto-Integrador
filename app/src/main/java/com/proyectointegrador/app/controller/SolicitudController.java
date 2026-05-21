package com.proyectointegrador.app.controller;

import com.proyectointegrador.app.model.Especialista;
import com.proyectointegrador.app.model.Solicitud;
import com.proyectointegrador.app.repository.EspecialistaRepository;
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

    @Autowired
    private EspecialistaRepository especialistaRepository;

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

    // GET → solicitudes pendientes por categoría
    @GetMapping("/categoria/{categoriaId}/pendientes")
    public List<Solicitud> listarPendientes(@PathVariable int categoriaId) {
        return solicitudService.listarPendientesPorCategoria(categoriaId);
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

    // GET → solicitudes pendientes para especialista
    @GetMapping("/especialista/{usuarioId}/pendientes")
    public ResponseEntity<?> listarPendientesParaEspecialista(@PathVariable int usuarioId) {
        Especialista especialista = especialistaRepository.findByUsuarioId(usuarioId);
        if (especialista == null) {
            return ResponseEntity.status(404).body("Especialista no encontrado");
        }

        List<Integer> categoriaIds = especialista.getCategorias()
            .stream()
            .map(c -> c.getId())
            .collect(java.util.stream.Collectors.toList());

        return ResponseEntity.ok(solicitudService.listarPendientesPorCategorias(categoriaIds));
    }


    // PUT → iniciar servicio
@PutMapping("/{id}/iniciar")
public ResponseEntity<?> iniciar(@PathVariable int id) {
    return solicitudService.iniciarServicio(id);
}

// PUT → finalizar servicio
@PutMapping("/{id}/finalizar")
public ResponseEntity<?> finalizar(@PathVariable int id) {
    return solicitudService.finalizarServicio(id);
}
}

