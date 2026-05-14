package com.proyectointegrador.app.controller;

import com.proyectointegrador.app.model.Antecedente;
import com.proyectointegrador.app.model.Usuario;
import com.proyectointegrador.app.model.Solicitud;
import com.proyectointegrador.app.service.AntecedenteService;
import com.proyectointegrador.app.service.UsuarioService;
import com.proyectointegrador.app.service.SolicitudService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpSession;
import java.util.List;
import java.util.Optional;

@Controller
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private SolicitudService solicitudService;

    @Autowired
    private AntecedenteService antecedenteService;

    @GetMapping("/login")
    public String loginPage() {
        return "AdminLogin";
    }

    @PostMapping("/login")
    public String procesarLogin(@RequestParam String email, 
                                @RequestParam String password, 
                               HttpSession session, Model model) {
        Usuario usuario = usuarioService.login(email, password);
        
        if (usuario != null && "admin".equals(usuario.getTipo())) {
            session.setAttribute("usuarioAdmin", usuario);
            return "redirect:/admin/dashboard";
        }
        
        model.addAttribute("error", "Email o contraseña inválidos o no tienes permisos de admin");
        return "AdminLogin";
    }

    @GetMapping("/dashboard")
    public String dashboard(HttpSession session, Model model) {
        Usuario admin = (Usuario) session.getAttribute("usuarioAdmin");
        if (admin == null) {
            return "redirect:/admin/login";
        }

        List<Usuario> usuarios = usuarioService.listarUsuarios();
        List<Solicitud> solicitudes = solicitudService.listarSolicitudes();
        List<Antecedente> antecedentes = antecedenteService.listarAntecedentes();
        
        long totalUsuarios = usuarios.size();
        long solicitudesPendientes = solicitudes.stream()
            .filter(s -> "PENDIENTE".equals(s.getEstado())).count();
        long antecedentesVerificados = antecedentes.stream()
            .filter(a -> "VERIFICADO".equals(a.getEstado())).count();

        model.addAttribute("totalUsuarios", totalUsuarios);
        model.addAttribute("solicitudesPendientes", solicitudesPendientes);
        model.addAttribute("antecedentesVerificados", antecedentesVerificados);
        model.addAttribute("usuarios", usuarios);
        model.addAttribute("solicitudes", solicitudes);
        model.addAttribute("usuarioAdmin", admin);

        return "AdminDashboard";
    }

    @GetMapping("/antecedentes")
    public String antecedentes(HttpSession session, Model model) {
        Usuario admin = (Usuario) session.getAttribute("usuarioAdmin");
        if (admin == null) {
            return "redirect:/admin/login";
        }

        List<Antecedente> antecedentes = antecedenteService.listarAntecedentes();
        List<Usuario> usuarios = usuarioService.listarUsuarios();

        model.addAttribute("antecedentes", antecedentes);
        model.addAttribute("usuarios", usuarios);
        model.addAttribute("usuarioAdmin", admin);

        return "AdminAntecedentes";
    }

    @PostMapping("/verificar/{id}")
    public String verificarAntecedente(@PathVariable Long id,
                                      @RequestParam String resultado,
                                      @RequestParam String observaciones,
                                      HttpSession session) {
        Usuario admin = (Usuario) session.getAttribute("usuarioAdmin");
        if (admin == null) {
            return "redirect:/admin/login";
        }

        antecedenteService.verificar(id, resultado, observaciones);
        return "redirect:/admin/antecedentes";
    }

    @PostMapping("/rechazar/{id}")
    public String rechazarAntecedente(@PathVariable Long id,
                                     @RequestParam String razon,
                                     HttpSession session) {
        Usuario admin = (Usuario) session.getAttribute("usuarioAdmin");
        if (admin == null) {
            return "redirect:/admin/login";
        }

        antecedenteService.rechazar(id, razon);
        return "redirect:/admin/antecedentes";
    }

    @GetMapping("/logout")
    public String logout(HttpSession session) {
        session.removeAttribute("usuarioAdmin");
        return "redirect:/admin/login";
    }
    @GetMapping("/recuperar")
    public String recuperarPage() {
        return "AdminLogin";
    }

    @PostMapping("/recuperar/enviar-codigo")
    public String enviarCodigo(@RequestParam String email, Model model) {
        Optional<Usuario> usuario = usuarioService.findByEmail(email);
        
        if (usuario.isPresent() && "admin".equals(usuario.get().getTipo())) {
            String codigo = generarCodigoAleatorio();
            guardarCodigoRecuperacion(usuario.get().getId(), codigo);
            
            // En producción, enviarías por email. Por ahora solo lo guardamos.
            model.addAttribute("codigoEnviado", true);
            model.addAttribute("emailRecuperacion", email);
            model.addAttribute("success", "Código enviado. Usa: " + codigo);
            return "AdminLogin";
        }
        
        model.addAttribute("error", "Email no encontrado o no es administrador");
        return "AdminLogin";
    }

    private String generarCodigoAleatorio() {
        return String.format("%06d", (int)(Math.random() * 1000000));
    }

    private void guardarCodigoRecuperacion(int usuarioId, String codigo) {
        // Aquí guardarías en la tabla rec_contraseña
        // Por ahora es un placeholder
    }

    @PostMapping("/recuperar/verificar-codigo")
    public String verificarCodigo(@RequestParam String email, @RequestParam String codigo, Model model) {
        model.addAttribute("emailVerificado", email);
        model.addAttribute("codigoVerificado", codigo);
        return "AdminLogin";
    }

    @PostMapping("/recuperar/cambiar-password")
    public String cambiarPassword(@RequestParam String email, @RequestParam String codigo, 
                                 @RequestParam String password, @RequestParam String passwordConfirm, 
                                 Model model) {
        if (!password.equals(passwordConfirm)) {
            model.addAttribute("error", "Las contraseñas no coinciden");
            return "AdminLogin";
        }
        
        Optional<Usuario> usuario = usuarioService.findByEmail(email);
        if (usuario.isPresent()) {
            Usuario u = usuario.get();
            u.setPassword(password);
            usuarioService.guardarUsuario(u);
            
            model.addAttribute("success", "Contraseña actualizada. Inicia sesión con tu nueva contraseña");
            return "AdminLogin";
        }
        
        model.addAttribute("error", "Error al actualizar la contraseña");
        return "AdminLogin";
    }
}
