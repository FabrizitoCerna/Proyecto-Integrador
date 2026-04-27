const API = 'http://localhost:8080/tecnicos';

    function mostrarMsg(texto, tipo) {
        const msg = document.getElementById('msg');
        msg.textContent = texto;
        msg.className = 'msg ' + (tipo === 'ok' ? 'msg-ok' : 'msg-error');
        msg.style.display = 'block';
        setTimeout(() => msg.style.display = 'none', 3000);
    }

    async function cargarTecnicos() {
        try {
            const res = await fetch(API);
            const tecnicos = await res.json();
            const tbody = document.getElementById('tablaTecnicos');

            if (tecnicos.length === 0) {
                tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">No hay técnicos registrados</td></tr>';
                return;
            }

            tbody.innerHTML = tecnicos.map(t => `
                <tr>
                    <td>${t.id}</td>
                    <td>${t.nombre}</td>
                    <td>${t.especialidad}</td>
                    <td>${t.telefono}</td>
                    <td><span class="badge badge-${t.estado}">${t.estado}</span></td>
                    <td class="actions">
                        <button class="btn btn-success" onclick="verificar(${t.id})">Verificar</button>
                        <button class="btn btn-danger" onclick="eliminar(${t.id})">Eliminar</button>
                    </td>
                </tr>
            `).join('');
        } catch (e) {
            document.getElementById('tablaTecnicos').innerHTML =
                '<tr><td colspan="6" style="text-align:center; color:red;">Error al conectar con el servidor</td></tr>';
        }
    }

    async function registrarTecnico() {
        const nombre      = document.getElementById('nombre').value.trim();
        const especialidad = document.getElementById('especialidad').value.trim();
        const telefono    = document.getElementById('telefono').value.trim();
        const estado      = document.getElementById('estado').value;

        if (!nombre || !especialidad || !telefono) {
            mostrarMsg('Por favor completa todos los campos.', 'error');
            return;
        }

        try {
            const res = await fetch(API, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre, especialidad, telefono, estado, activo: true })
            });

            if (res.ok) {
                mostrarMsg('Técnico registrado correctamente.', 'ok');
                document.getElementById('nombre').value = '';
                document.getElementById('especialidad').value = '';
                document.getElementById('telefono').value = '';
                document.getElementById('estado').value = 'pendiente';
                cargarTecnicos();
            } else {
                mostrarMsg('Error al registrar el técnico.', 'error');
            }
        } catch (e) {
            mostrarMsg('No se pudo conectar con el servidor.', 'error');
        }
    }

    async function verificar(id) {
        try {
            await fetch(`${API}/${id}/estado?estado=verificado`, { method: 'PUT' });
            cargarTecnicos();
        } catch (e) {
            alert('Error al actualizar estado.');
        }
    }

    async function eliminar(id) {
        if (!confirm('¿Seguro que deseas eliminar este técnico?')) return;
        try {
            await fetch(`${API}/${id}`, { method: 'DELETE' });
            cargarTecnicos();
        } catch (e) {
            alert('Error al eliminar.');
        }
    }

    // Cargar al iniciar
    cargarTecnicos();