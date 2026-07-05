package com.proyectointegrador.app.controller;

import com.proyectointegrador.app.model.Especialista;
import com.proyectointegrador.app.service.EspecialistaService;
import com.proyectointegrador.app.service.CategoriaService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/especialistas")
@CrossOrigin(origins = "*")
public class EspecialistaController {

    @Autowired
    private EspecialistaService especialistaService;

    @Autowired
    private CategoriaService categoriaService;

    // GET → listar todos los especialistas
    @GetMapping
    public ResponseEntity<?> listar() {
        return ResponseEntity.ok(especialistaService.listarEspecialistas());
    }

    // GET → obtener especialista por usuarioId
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<?> obtenerPorUsuario(@PathVariable int usuarioId) {
        return especialistaService.obtenerPorUsuario(usuarioId);
    }

    // GET → historial de servicios completados y ganancias totales
    @GetMapping("/{usuarioId}/historial")
    public ResponseEntity<?> obtenerHistorial(@PathVariable int usuarioId) {
        return especialistaService.obtenerHistorial(usuarioId);
    }

    // GET → listar categorías (para el frontend)
    @GetMapping("/categorias")
    public ResponseEntity<?> listarCategorias() {
        return ResponseEntity.ok(categoriaService.listarCategorias());
    }

    // POST → crear perfil especialista
    // Body: { "datos": {...}, "categoriaIds": [1, 2] }
    @PostMapping("/crear/{usuarioId}")
    public ResponseEntity<?> crear(
            @PathVariable int usuarioId,
            @RequestBody Map<String, Object> body) {

        // Extraer datos del especialista
        Especialista datos = new Especialista();
        if (body.get("descripcion") != null)
            datos.setDescripcion(body.get("descripcion").toString());
        if (body.get("precioReferencial") != null)
            datos.setPrecioReferencial(Double.parseDouble(body.get("precioReferencial").toString()));
        if (body.get("distrito") != null)
            datos.setDistrito(body.get("distrito").toString());

        // Extraer categoriaIds
        List<Integer> categoriaIds = (List<Integer>) body.get("categoriaIds");

        return especialistaService.crearEspecialista(usuarioId, datos, categoriaIds);
    }
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable int id, @RequestBody Map<String, Object> body) {
        return especialistaService.actualizarEspecialista(id, body);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable int id) {
        return especialistaService.eliminarEspecialista(id);
    }
}