package com.proyectointegrador.app.controller;

import com.proyectointegrador.app.model.Tecnico;
import com.proyectointegrador.app.service.TecnicoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/tecnicos")
public class TecnicoController {

    @Autowired
    private TecnicoService tecnicoService;

    @GetMapping
    public List<Tecnico> listar() {
        return tecnicoService.listarTodos();
    }

    @GetMapping("/{id}")
    public Optional<Tecnico> buscar(@PathVariable int id) {
        return tecnicoService.buscarPorId(id);
    }

    @PostMapping
    public Tecnico crear(@RequestBody Tecnico tecnico) {
        return tecnicoService.guardar(tecnico);
    }

    @PutMapping("/{id}/estado")
    public Tecnico actualizarEstado(@PathVariable int id, @RequestParam String estado) {
        return tecnicoService.actualizarEstado(id, estado);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable int id) {
        tecnicoService.eliminar(id);
    }

    @PutMapping("/{id}")
    public Tecnico actualizar(@PathVariable int id, @RequestBody Tecnico tecnico) {
        tecnico.setId(id);
        return tecnicoService.guardar(tecnico);
    }
}
