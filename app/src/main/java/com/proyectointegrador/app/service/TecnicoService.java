package com.proyectointegrador.app.service;

import com.proyectointegrador.app.model.Tecnico;
import com.proyectointegrador.app.repository.TecnicoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TecnicoService {

    @Autowired
    private TecnicoRepository tecnicoRepository;

    public List<Tecnico> listarTodos() {
        return tecnicoRepository.findAll();
    }

    public Optional<Tecnico> buscarPorId(int id) {
        return tecnicoRepository.findById(id);
    }

    public Tecnico guardar(Tecnico tecnico) {
        return tecnicoRepository.save(tecnico);
    }

    public void eliminar(int id) {
        tecnicoRepository.deleteById(id);
    }

    public Tecnico actualizarEstado(int id, String nuevoEstado) {
        Tecnico tecnico = tecnicoRepository.findById(id).orElseThrow();
        tecnico.setEstado(nuevoEstado);
        return tecnicoRepository.save(tecnico);
    }
}
