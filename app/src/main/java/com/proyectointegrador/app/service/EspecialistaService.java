package com.proyectointegrador.app.service;

import com.proyectointegrador.app.model.Calificacion;
import com.proyectointegrador.app.model.Categoria;
import com.proyectointegrador.app.model.Especialista;
import com.proyectointegrador.app.model.Oferta;
import com.proyectointegrador.app.model.Solicitud;
import com.proyectointegrador.app.model.Usuario;
import com.proyectointegrador.app.repository.CalificacionRepository;
import com.proyectointegrador.app.repository.CategoriaRepository;
import com.proyectointegrador.app.repository.EspecialistaRepository;
import com.proyectointegrador.app.repository.OfertaRepository;
import com.proyectointegrador.app.repository.SolicitudRepository;
import com.proyectointegrador.app.repository.UsuarioRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class EspecialistaService {

    @Autowired
    private EspecialistaRepository especialistaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private CategoriaRepository categoriaRepository;

    @Autowired
    private SolicitudRepository solicitudRepository;

    @Autowired
    private OfertaRepository ofertaRepository;

    @Autowired
    private CalificacionRepository calificacionRepository;

    // LISTAR todos
    public List<Especialista> listarEspecialistas() {
        return especialistaRepository.findAll();
    }

    // CREAR perfil de especialista
    public ResponseEntity<?> crearEspecialista(int usuarioId, Especialista datos, List<Integer> categoriaIds) {

        // Validar que el usuario existe
        Usuario usuario = usuarioRepository.findById(usuarioId).orElse(null);
        if (usuario == null) {
            return ResponseEntity.badRequest().body("Usuario no encontrado");
        }

        // Validar que sea de tipo especialista
        if (usuario.getTipo() != Usuario.TipoUsuario.especialista) {
            return ResponseEntity.badRequest().body("El usuario no es de tipo especialista");
        }

        // Validar que no tenga ya un perfil
        if (especialistaRepository.existsByUsuarioId(usuarioId)) {
            return ResponseEntity.badRequest().body("El especialista ya tiene un perfil creado");
        }

        // Validar mínimo 1 y máximo 2 categorías
        if (categoriaIds == null || categoriaIds.isEmpty()) {
            return ResponseEntity.badRequest().body("Debe seleccionar al menos 1 categoría");
        }
        if (categoriaIds.size() > 2) {
            return ResponseEntity.badRequest().body("Puede seleccionar máximo 2 categorías");
        }

        // Buscar categorías
        List<Categoria> categorias = categoriaRepository.findAllById(categoriaIds);
        if (categorias.size() != categoriaIds.size()) {
            return ResponseEntity.badRequest().body("Una o más categorías no existen");
        }

        // Armar y guardar
        datos.setUsuario(usuario);
        datos.setCategorias(categorias);
        datos.setDisponible(true);
        datos.setCalificacionPromedio(0.0);

        Especialista nuevo = especialistaRepository.save(datos);
        return ResponseEntity.ok(nuevo);
    }

    // BUSCAR por usuarioId
    public ResponseEntity<?> obtenerPorUsuario(int usuarioId) {
        Especialista especialista = especialistaRepository.findByUsuarioId(usuarioId);
        if (especialista == null) {
            return ResponseEntity.status(404).body("Especialista no encontrado");
        }
        return ResponseEntity.ok(especialista);
    }

    // HISTORIAL: servicios completados y ganancias totales
    public ResponseEntity<?> obtenerHistorial(int usuarioId) {
        Especialista especialista = especialistaRepository.findByUsuarioId(usuarioId);
        if (especialista == null) {
            return ResponseEntity.status(404).body("Especialista no encontrado");
        }

        List<Solicitud> completados = solicitudRepository.findByEspecialistaGanadorIdAndEstadoIn(
            especialista.getId(), List.of(Solicitud.EstadoSolicitud.completado)
        );

        double totalGanancias = 0;
        List<Map<String, Object>> servicios = new java.util.ArrayList<>();

        for (Solicitud s : completados) {
            Oferta oferta = ofertaRepository.findBySolicitudIdAndEstado(s.getId(), Oferta.EstadoOferta.aceptada);
            double precio = oferta != null ? oferta.getPrecio() : 0;
            totalGanancias += precio;

            Calificacion calificacion = calificacionRepository.findBySolicitudId(s.getId());

            Map<String, Object> item = new HashMap<>();
            item.put("solicitudId", s.getId());
            item.put("categoria", s.getCategoria().getNombre());
            item.put("cliente", s.getCliente().getNombre());
            item.put("descripcion", s.getDescripcion());
            item.put("fechaFin", s.getFechaFin());
            item.put("precio", precio);
            item.put("estrellas", calificacion != null ? calificacion.getEstrellas() : null);
            item.put("comentario", calificacion != null ? calificacion.getComentario() : null);
            servicios.add(item);
        }

        Map<String, Object> resultado = new HashMap<>();
        resultado.put("totalGanancias", totalGanancias);
        resultado.put("totalServicios", servicios.size());
        resultado.put("servicios", servicios);

        return ResponseEntity.ok(resultado);
    }
    
    // ACTUALIZAR especialista por id
    public ResponseEntity<?> actualizarEspecialista(int id, Map<String, Object> datos) {
        Especialista especialista = especialistaRepository.findById(id).orElse(null);
        if (especialista == null) {
            return ResponseEntity.status(404).body("Especialista no encontrado");
        }

        if (datos.get("descripcion") != null)
            especialista.setDescripcion(datos.get("descripcion").toString());
        if (datos.get("precioReferencial") != null)
            especialista.setPrecioReferencial(Double.parseDouble(datos.get("precioReferencial").toString()));
        if (datos.get("distrito") != null)
            especialista.setDistrito(datos.get("distrito").toString());
        if (datos.get("disponible") != null)
            especialista.setDisponible(Boolean.parseBoolean(datos.get("disponible").toString()));

        return ResponseEntity.ok(especialistaRepository.save(especialista));
    }

    // ELIMINAR especialista por id
    public ResponseEntity<?> eliminarEspecialista(int id) {
        if (!especialistaRepository.existsById(id)) {
            return ResponseEntity.status(404).body("Especialista no encontrado");
        }
        especialistaRepository.deleteById(id);
        return ResponseEntity.ok("Especialista eliminado correctamente");
    }
}