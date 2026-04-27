package com.proyectointegrador.app.service;

import com.proyectointegrador.app.model.Solicitud;
import com.proyectointegrador.app.repository.SolicitudRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SolicitudService {

    @Autowired
    private SolicitudRepository solicitudRepository;

    public List<Solicitud> listarSolicitudes() {
        return solicitudRepository.findAll();
    }

    public Solicitud crearSolicitud(Solicitud solicitud) {
        solicitud.setEstado("pendiente"); // 🔥 automático
        return solicitudRepository.save(solicitud);
    }


    public Solicitud actualizarEstado(int id, String estado) {
    Solicitud solicitud = solicitudRepository.findById(id).orElse(null);

    if (solicitud != null) {
        solicitud.setEstado(estado);
        return solicitudRepository.save(solicitud);
    }

    return null;
}

    
}