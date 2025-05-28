document.addEventListener("DOMContentLoaded", () => {
  // Obtener referencias a elementos del DOM
  const API_URL    = "http://localhost:3001/api";   // ajusta puerto si lo necesitas
  const token      = localStorage.getItem("token");
  const usuario    = JSON.parse(localStorage.getItem("usuario") || "{}");
  const form       = document.getElementById("form-editar-perfil");
  const fotoInput  = document.getElementById("foto_perfil");
  const avatarImg  = document.getElementById("foto-perfil");
  const nombreTxt  = document.getElementById("nombre-usuario");
  const emailTxt   = document.getElementById("email-usuario");
  const rolTxt     = document.getElementById("rol-usuario");
  const camposCli  = document.getElementById("campos-cliente");
  const mensaje    = document.getElementById("mensaje-estado");

  if (!token || !usuario.id_usuario) {
    alert("Debes iniciar sesión");
    return window.location.href = "mi-cuenta.html";
  }

  const headersAuth = { "Authorization": `Bearer ${token}` };

  // 1) Carga datos básicos del usuario
  async function cargarUsuario() {
    try {
      const res = await fetch(`${API_URL}/usuarios/${usuario.id_usuario}`, { headers: headersAuth });
      if (!res.ok) throw new Error("No se pudo traer tu perfil");
      const u = await res.json();

      // Pinta datos en el DOM
      nombreTxt.textContent = u.nombre_usuario;
      emailTxt.textContent  = u.email_usuario;
      rolTxt.textContent    = `Rol: ${u.rol.charAt(0).toUpperCase() + u.rol.slice(1)}`;

      form.nombre_usuario.value = u.nombre_usuario;
      form.email_usuario.value  = u.email_usuario;

      if (u.foto_perfil) {
        avatarImg.src = `${API_URL.replace("/api","")}/uploads/${u.foto_perfil}`;
      }

      // Si es cliente, carga sus datos específicos
      if (u.rol === "cliente") {
        camposCli.style.display = "block";
        const res2 = await fetch(`${API_URL}/clientes?usuario_id=${u.id_usuario}`, { headers: headersAuth });
        if (res2.ok) {
          const [cli] = await res2.json();
          if (cli) {
            form.telefono.value   = cli.telefono_cliente || "";
            form.direccion.value  = cli.direccion_cliente || "";
          }
        }
      }
    } catch (err) {
      console.error(err);
      mostrarMensaje(err.message, "error");
    }
  }

  // 2) Vista previa de la foto
  fotoInput.addEventListener("change", () => {
    const file = fotoInput.files[0];
    if (!file) return;
    if (!["image/jpeg","image/png"].includes(file.type) || file.size > 2*1024*1024) {
      mostrarMensaje("Solo JPG/PNG ≤2 MB", "error");
      fotoInput.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = e => avatarImg.src = e.target.result;
    reader.readAsDataURL(file);
  });

  // 3) Envío del formulario
  form.addEventListener("submit", async e => {
    e.preventDefault();
    mostrarMensaje("Actualizando…","info");

    try {
      const fd = new FormData(form);
      // id_usuario ya lo incluye tu form hidden
      const res = await fetch(`${API_URL}/usuarios/${usuario.id_usuario}`, {
        method: "PATCH",
        headers: { "Authorization": `Bearer ${token}` },
        body: fd
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error||data.message);

      // Actualiza localStorage
      const nuevo = {
        ...usuario,
        nombre_usuario: form.nombre_usuario.value,
        email_usuario:  form.email_usuario.value,
        foto_perfil:    data.foto_perfil || usuario.foto_perfil
      };
      localStorage.setItem("usuario", JSON.stringify(nuevo));

      mostrarMensaje("Perfil actualizado","success");
      nombreTxt.textContent = nuevo.nombre_usuario;
      emailTxt.textContent  = nuevo.email_usuario;

    } catch (err) {
      console.error(err);
      mostrarMensaje(err.message,"error");
    }
  });

  function mostrarMensaje(texto, tipo) {
    mensaje.textContent = texto;
    mensaje.className = `mensaje-estado mensaje-${tipo}`;
    mensaje.scrollIntoView({ behavior: "smooth" });
  }

  cargarUsuario();
});