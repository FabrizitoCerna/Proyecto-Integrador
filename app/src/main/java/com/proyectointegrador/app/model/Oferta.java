package com.proyectointegrador.app.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "ofertas")
public class Oferta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "solicitud_id", nullable = false)
    private Solicitud solicitud;

    @ManyToOne
    @JoinColumn(name = "especialista_id", nullable = false)
    private Especialista especialista;

    @Column(nullable = false)
    private Double precio;

    private String mensaje;

    @Enumerated(EnumType.STRING)
    private EstadoOferta estado = EstadoOferta.pendiente;

    @Column(updatable = false)
    private LocalDateTime fechaOferta;

    @PrePersist
    protected void onCreate() {
        this.fechaOferta = LocalDateTime.now();
    }

    public enum EstadoOferta {
        pendiente, aceptada, rechazada
    }

    public Oferta() {}

    public int getId() { return id; }

    public Solicitud getSolicitud() { return solicitud; }
    public void setSolicitud(Solicitud solicitud) { this.solicitud = solicitud; }

    public Especialista getEspecialista() { return especialista; }
    public void setEspecialista(Especialista especialista) { this.especialista = especialista; }

    public Double getPrecio() { return precio; }
    public void setPrecio(Double precio) { this.precio = precio; }

    public String getMensaje() { return mensaje; }
    public void setMensaje(String mensaje) { this.mensaje = mensaje; }

    public EstadoOferta getEstado() { return estado; }
    public void setEstado(EstadoOferta estado) { this.estado = estado; }

    public LocalDateTime getFechaOferta() { return fechaOferta; }
}