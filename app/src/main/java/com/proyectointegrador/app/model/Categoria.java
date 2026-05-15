package com.proyectointegrador.app.model;

import jakarta.persistence.*;

@Entity
@Table(name = "categorias")
public class Categoria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false)
    private String nombre;

    private String iconoUrl;

    public Categoria() {}

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getIconoUrl() { return iconoUrl; }
    public void setIconoUrl(String iconoUrl) { this.iconoUrl = iconoUrl; }
}