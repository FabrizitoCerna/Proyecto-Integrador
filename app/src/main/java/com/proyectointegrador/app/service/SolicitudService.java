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

    // LISTAR todas
    public List<Solicitud> listarSolicitudes() {
        return solicitudRepository.findAll();
    }

    // LISTAR por cliente
    public List<Solicitud> listarPorCliente(int clienteId) {
        return solicitudRepository.findByClienteId(clienteId);
    }

    // LISTAR pendientes por categoría
    public List<Solicitud> listarPendientesPorCategoria(int categoriaId) {
        return solicitudRepository.findByCategoriaIdAndEstado(
            categoriaId, Solicitud.EstadoSolicitud.pendiente
        );
    }

    // LISTAR pendientes + en_proceso + iniciado por categorías (para especialista)
    public List<Solicitud> listarPendientesPorCategorias(List<Integer> categoriaIds) {
    List<Solicitud.EstadoSolicitud> estados = List.of(
        Solicitud.EstadoSolicitud.pendiente,
        Solicitud.EstadoSolicitud.en_proceso,
        Solicitud.EstadoSolicitud.iniciado
    );
    return solicitudRepository.findByCategoriaIdsAndEstados(categoriaIds, estados);
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
        solicitud.setEstado(Solicitud.EstadoSolicitud.pendiente);

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
    public ResponseEntity<?> iniciarServicio(int solicitudId) {
        Solicitud solicitud = solicitudRepository.findById(solicitudId).orElse(null);
        if (solicitud == null) {
            return ResponseEntity.status(404).body("Solicitud no encontrada");
        }
        if (solicitud.getEstado() != Solicitud.EstadoSolicitud.en_proceso) {
            return ResponseEntity.badRequest().body("La solicitud debe estar en proceso para iniciar");
        }
        solicitud.setEstado(Solicitud.EstadoSolicitud.iniciado);
        solicitud.setFechaInicio(LocalDateTime.now());
        return ResponseEntity.ok(solicitudRepository.save(solicitud));
    }

    // FINALIZAR servicio
    public ResponseEntity<?> finalizarServicio(int solicitudId) {
        Solicitud solicitud = solicitudRepository.findById(solicitudId).orElse(null);
        if (solicitud == null) {
            return ResponseEntity.status(404).body("Solicitud no encontrada");
        }
        if (solicitud.getEstado() != Solicitud.EstadoSolicitud.iniciado) {
            return ResponseEntity.badRequest().body("El servicio debe estar iniciado para finalizar");
        }
        solicitud.setEstado(Solicitud.EstadoSolicitud.completada);
        solicitud.setFechaFin(LocalDateTime.now());
        return ResponseEntity.ok(solicitudRepository.save(solicitud));
    }
}