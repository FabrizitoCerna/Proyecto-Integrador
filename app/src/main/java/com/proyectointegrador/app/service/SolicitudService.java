package com.proyectointegrador.app.service;

import com.proyectointegrador.app.model.*;
import com.proyectointegrador.app.repository.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class SolicitudService {

    @Autowired
    private SolicitudRepository solicitudRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private CategoriaRepository categoriaRepository;

    @Autowired
    private EspecialistaRepository especialistaRepository;

    // LISTAR todas
    public List<Solicitud> listarSolicitudes() {
        return solicitudRepository.findAll();
    }

    // LISTAR por cliente
    public List<Solicitud> listarPorCliente(int clienteId) {
        return solicitudRepository.findByClienteId(clienteId);
    }

    // LISTAR por categoría
    public List<Solicitud> listarPendientesPorCategoria(int categoriaId) {
        return solicitudRepository.findByCategoriaIdAndEstado(
            categoriaId, Solicitud.EstadoSolicitud.buscando
        );
    }

    // LISTAR solicitudes para especialista
    public List<Solicitud> listarSolicitudesParaEspecialista(int usuarioId) {
        Especialista especialista = especialistaRepository.findByUsuarioId(usuarioId);
        if (especialista == null) return List.of();

        // IDs de sus categorías
        List<Integer> categoriaIds = especialista.getCategorias()
            .stream()
            .map(c -> c.getId())
            .collect(java.util.stream.Collectors.toList());

        // Estados que puede ver en general (solicitudes buscando de su categoría)
        List<Solicitud.EstadoSolicitud> estadosBuscando = List.of(
            Solicitud.EstadoSolicitud.buscando
        );

        // Solicitudes buscando de su categoría
        List<Solicitud> solicitudesBuscando = solicitudRepository
            .findByCategoriaIdsAndEstados(categoriaIds, estadosBuscando);

        // Sus propias solicitudes activas (oferta_aceptada, en_progreso, finalizado)
        List<Solicitud.EstadoSolicitud> estadosPropios = List.of(
            Solicitud.EstadoSolicitud.oferta_aceptada,
            Solicitud.EstadoSolicitud.en_progreso,
            Solicitud.EstadoSolicitud.finalizado
        );

        List<Solicitud> solicitudesPropias = solicitudRepository
            .findByEspecialistaGanadorIdAndEstadoIn(especialista.getId(), estadosPropios);

        // Combinar ambas listas
        List<Solicitud> todas = new java.util.ArrayList<>();
        todas.addAll(solicitudesBuscando);
        todas.addAll(solicitudesPropias);

        return todas;
    }

    // CREAR solicitud
    public ResponseEntity<?> crearSolicitud(int clienteId, int categoriaId, String descripcion, String direccion) {

        Usuario cliente = usuarioRepository.findById(clienteId).orElse(null);
        if (cliente == null) {
            return ResponseEntity.badRequest().body("Cliente no encontrado");
        }
        if (cliente.getTipo() != Usuario.TipoUsuario.cliente) {
            return ResponseEntity.badRequest().body("Solo los clientes pueden crear solicitudes");
        }

        Categoria categoria = categoriaRepository.findById(categoriaId).orElse(null);
        if (categoria == null) {
            return ResponseEntity.badRequest().body("Categoría no encontrada");
        }

        if (descripcion == null || descripcion.isBlank()) {
            return ResponseEntity.badRequest().body("La descripción es obligatoria");
        }

        Solicitud solicitud = new Solicitud();
        solicitud.setCliente(cliente);
        solicitud.setCategoria(categoria);
        solicitud.setDescripcion(descripcion);
        solicitud.setDireccion(direccion);
        solicitud.setEstado(Solicitud.EstadoSolicitud.buscando);

        return ResponseEntity.ok(solicitudRepository.save(solicitud));
    }

    // ACTUALIZAR estado
    public ResponseEntity<?> actualizarEstado(int id, String estado) {
        Solicitud solicitud = solicitudRepository.findById(id).orElse(null);
        if (solicitud == null) {
            return ResponseEntity.status(404).body("Solicitud no encontrada");
        }
        try {
            solicitud.setEstado(Solicitud.EstadoSolicitud.valueOf(estado));
            return ResponseEntity.ok(solicitudRepository.save(solicitud));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Estado inválido.");
        }
    }

    // INICIAR servicio
    public ResponseEntity<?> iniciarServicio(int solicitudId, int usuarioId) {
        Solicitud solicitud = solicitudRepository.findById(solicitudId).orElse(null);
        if (solicitud == null) {
            return ResponseEntity.status(404).body("Solicitud no encontrada");
        }

        // Validar estado
        if (solicitud.getEstado() != Solicitud.EstadoSolicitud.oferta_aceptada) {
            return ResponseEntity.badRequest().body("La solicitud debe tener oferta aceptada para iniciar");
        }

        // Validar que sea el especialista ganador
        Especialista especialista = especialistaRepository.findByUsuarioId(usuarioId);
        if (especialista == null || solicitud.getEspecialistaGanador().getId() != especialista.getId()) {
            return ResponseEntity.status(403).body("No tienes permiso para iniciar este servicio");
        }

        solicitud.setEstado(Solicitud.EstadoSolicitud.en_progreso);
        solicitud.setFechaInicio(LocalDateTime.now());
        return ResponseEntity.ok(solicitudRepository.save(solicitud));
    }

    // FINALIZAR servicio
    public ResponseEntity<?> finalizarServicio(int solicitudId, int usuarioId) {
        Solicitud solicitud = solicitudRepository.findById(solicitudId).orElse(null);
        if (solicitud == null) {
            return ResponseEntity.status(404).body("Solicitud no encontrada");
        }

        // Validar estado
        if (solicitud.getEstado() != Solicitud.EstadoSolicitud.en_progreso) {
            return ResponseEntity.badRequest().body("El servicio debe estar en progreso para finalizar");
        }

        // Validar que sea el especialista ganador
        Especialista especialista = especialistaRepository.findByUsuarioId(usuarioId);
        if (especialista == null || solicitud.getEspecialistaGanador().getId() != especialista.getId()) {
            return ResponseEntity.status(403).body("No tienes permiso para finalizar este servicio");
        }

        solicitud.setEstado(Solicitud.EstadoSolicitud.finalizado);
        solicitud.setFechaFin(LocalDateTime.now());
        return ResponseEntity.ok(solicitudRepository.save(solicitud));
    }
}