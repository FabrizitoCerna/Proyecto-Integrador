package com.proyectointegrador.app.repository;



import com.proyectointegrador.app.model.Servicio;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ServicioRepository extends JpaRepository<Servicio, Integer> {
}