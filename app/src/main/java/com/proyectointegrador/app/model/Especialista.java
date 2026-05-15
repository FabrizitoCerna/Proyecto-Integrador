package com.proyectointegrador.app.model;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "especialistas")
public class Especialista {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @OneToOne
    @JoinColumn(name = "usuario_id", nullable = false, unique = true)
    private Usuario usuario;

    private String descripcion;

    @Column(name = "precio_referencial")
    private Double precioReferencial;

    private String distrito;

    private Boolean disponible = true;

    @Column(name = "calificacion_promedio")
    private Double calificacionPromedio = 0.0;

    @ManyToMany
    @JoinTable(
        name = "especialista_categorias",
        joinColumns = @JoinColumn(name = "especialista_id"),
        inverseJoinColumns = @JoinColumn(name = "categoria_id")
    )
    private List<Categoria> categorias;

    public Especialista() {}

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public Double getPrecioReferencial() { return precioReferencial; }
    public void setPrecioReferencial(Double precioReferencial) { this.precioReferencial = precioReferencial; }

    public String getDistrito() { return distrito; }
    public void setDistrito(String distrito) { this.distrito = distrito; }

    public Boolean getDisponible() { return disponible; }
    public void setDisponible(Boolean disponible) { this.disponible = disponible; }

    public Double getCalificacionPromedio() { return calificacionPromedio; }
    public void setCalificacionPromedio(Double calificacionPromedio) { this.calificacionPromedio = calificacionPromedio; }

    public List<Categoria> getCategorias() { return categorias; }
    public void setCategorias(List<Categoria> categorias) { this.categorias = categorias; }
}