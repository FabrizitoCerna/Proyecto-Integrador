package com.proyectointegrador.app.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "solicitudes")
public class Solicitud {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "cliente_id", nullable = false)
    private Usuario cliente;

    @ManyToOne
    @JoinColumn(name = "categoria_id", nullable = false)
    private Categoria categoria;

    @Column(nullable = false)
    private String descripcion;

    private String direccion;
    private Double latitud;
    private Double longitud;

    @Enumerated(EnumType.STRING)
    private EstadoSolicitud estado = EstadoSolicitud.buscando;

    @ManyToOne
    @JoinColumn(name = "especialista_ganador_id")
    private Especialista especialistaGanador;

    @Column(updatable = false)
    private LocalDateTime fechaCreacion;

    private LocalDateTime fechaInicio;
    private LocalDateTime fechaFin;

    @PrePersist
    protected void onCreate() {
        this.fechaCreacion = LocalDateTime.now();
    }

    public enum EstadoSolicitud {
        buscando,
        oferta_aceptada,
        en_progreso,
        finalizado,
        completado,
        cancelado
    }

    public Solicitud() {}

    public int getId() { return id; }

    public Usuario getCliente() { return cliente; }
    public void setCliente(Usuario cliente) { this.cliente = cliente; }

    public Categoria getCategoria() { return categoria; }
    public void setCategoria(Categoria categoria) { this.categoria = categoria; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public String getDireccion() { return direccion; }
    public void setDireccion(String direccion) { this.direccion = direccion; }

    public Double getLatitud() { return latitud; }
    public void setLatitud(Double latitud) { this.latitud = latitud; }

    public Double getLongitud() { return longitud; }
    public void setLongitud(Double longitud) { this.longitud = longitud; }

    public EstadoSolicitud getEstado() { return estado; }
    public void setEstado(EstadoSolicitud estado) { this.estado = estado; }

    public Especialista getEspecialistaGanador() { return especialistaGanador; }
    public void setEspecialistaGanador(Especialista especialistaGanador) { this.especialistaGanador = especialistaGanador; }

    public LocalDateTime getFechaCreacion() { return fechaCreacion; }

    public LocalDateTime getFechaInicio() { return fechaInicio; }
    public void setFechaInicio(LocalDateTime fechaInicio) { this.fechaInicio = fechaInicio; }

    public LocalDateTime getFechaFin() { return fechaFin; }
    public void setFechaFin(LocalDateTime fechaFin) { this.fechaFin = fechaFin; }
}