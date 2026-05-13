package com.proyectointegrador.app.repository;

import com.proyectointegrador.app.model.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoriaRepository extends JpaRepository<Categoria, Integer> {
    
}