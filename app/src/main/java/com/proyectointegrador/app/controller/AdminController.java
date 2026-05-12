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
        return "Adminlogin";
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
}
