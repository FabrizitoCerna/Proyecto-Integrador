package com.proyectointegrador.app.service;

import com.proyectointegrador.app.model.Antecedente;
import com.proyectointegrador.app.repository.AntecedenteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class AntecedenteService {

    @Autowired
    private AntecedenteRepository antecedenteRepository;

    public List<Antecedente> listarAntecedentes() {
        return antecedenteRepository.findAll();
    }

    public List<Antecedente> obtenerPendientes() {
        return antecedenteRepository.findByEstado("PENDIENTE");
    }

    public Optional<Antecedente> obtenerPorId(Long id) {
        return antecedenteRepository.findById(id);
    }

    public List<Antecedente> obtenerPorUsuario(Long usuarioId) {
        return antecedenteRepository.findByUsuarioId(usuarioId);
    }

    public Antecedente crear(Long usuarioId) {
        Antecedente antecedente = new Antecedente(usuarioId);
        return antecedenteRepository.save(antecedente);
    }

    public Antecedente verificar(Long id, String resultado, String observaciones) {
        Optional<Antecedente> opt = antecedenteRepository.findById(id);
        if (opt.isPresent()) {
            Antecedente antecedente = opt.get();
            antecedente.setEstado("VERIFICADO");
            antecedente.setResultado(resultado);
            antecedente.setObservaciones(observaciones);
            antecedente.setFechaVerificacion(LocalDateTime.now());
            return antecedenteRepository.save(antecedente);
        }
        return null;
    }

    public Antecedente rechazar(Long id, String razon) {
        Optional<Antecedente> opt = antecedenteRepository.findById(id);
        if (opt.isPresent()) {
            Antecedente antecedente = opt.get();
            antecedente.setEstado("RECHAZADO");
            antecedente.setResultado("RECHAZADO");
            antecedente.setObservaciones(razon);
            antecedente.setFechaVerificacion(LocalDateTime.now());
            return antecedenteRepository.save(antecedente);
        }
        return null;
    }
}