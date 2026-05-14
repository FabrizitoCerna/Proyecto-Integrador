package com.proyectointegrador.app.service;

import com.proyectointegrador.app.model.Categoria;
import com.proyectointegrador.app.model.Especialista;
import com.proyectointegrador.app.model.Usuario;
import com.proyectointegrador.app.repository.CategoriaRepository;
import com.proyectointegrador.app.repository.EspecialistaRepository;
import com.proyectointegrador.app.repository.UsuarioRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

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
    // ACTUALIZAR especialista
    public ResponseEntity<?> actualizarEspecialista(int id, Map<String, Object> body) {
        Especialista esp = especialistaRepository.findById(id).orElse(null);
        if (esp == null) return ResponseEntity.status(404).body("Especialista no encontrado");
        
        if (body.get("descripcion") != null) esp.setDescripcion(body.get("descripcion").toString());
        if (body.get("precioReferencial") != null) esp.setPrecioReferencial(Double.parseDouble(body.get("precioReferencial").toString()));
        if (body.get("distrito") != null) esp.setDistrito(body.get("distrito").toString());
        if (body.get("disponible") != null) esp.setDisponible((Boolean) body.get("disponible"));
        
        return ResponseEntity.ok(especialistaRepository.save(esp));
    }
    public ResponseEntity<?> eliminarEspecialista(int id) {
        Especialista esp = especialistaRepository.findById(id).orElse(null);
        if (esp == null) return ResponseEntity.status(404).body("Especialista no encontrado");
        especialistaRepository.deleteById(id);
        return ResponseEntity.ok("Especialista eliminado");
    }
}