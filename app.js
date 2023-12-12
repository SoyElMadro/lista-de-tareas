document.addEventListener("DOMContentLoaded", () => {
  const btnAgregarTarea = document.querySelector("button.añadir");
  const listaTareas = document.getElementById("lista");
  const input = document.getElementById("texto-tarea");
  const btnBorrarTodo = document.querySelector("button.btn-limpiar");
  const contenedorAlertas = document.getElementById("alertas");

  const ALERT_TYPES = {
    ADD: "add",
    DELETE: "delete"
  }

  function cambiarClases(elemento, eliminarClase, añadirClase) {
    elemento.classList.remove(eliminarClase);
    elemento.classList.add(añadirClase);
  }

  function tirarError(texto) {
    throw new Error(texto);
  }

  function mostrarAlerta(tipo) {
    const div = document.createElement("div");
    div.classList.add("alerta");

    switch (tipo) {
      case ALERT_TYPES.ADD:
        div.classList.add("tarea-añadida");
        div.innerHTML = `<p>Tarea añadida!</p>`
        break;
      case ALERT_TYPES.DELETE:
        div.classList.add("tarea-eliminada");
        div.innerHTML = `<p>Tarea eliminada!</p>`
        break;
      default:
        tirarError('Este tipo de alerta no existe.');
        return;
    }

    contenedorAlertas.appendChild(div);

    div.classList.add("desaparecer-alerta");

    setTimeout(() => {
      contenedorAlertas.removeChild(div);
    }, 2000);
  }

  function crearTarea(textoTarea) {
    if (textoTarea == "" || !isNaN(textoTarea)) {
      tirarError("Debes escribir algo en el input y que no sean números.");
    } else {
      const tarea = document.createElement("div");
      tarea.classList.add("item");
      tarea.innerHTML = `
      <p>${textoTarea}</p>
      <div class="botones">
        <i class='bx bxs-edit'></i>
        <i class='bx bxs-trash-alt'></i>
      </div>
      `;
      return listaTareas.appendChild(tarea);
    }
  }

  const verificarClase = (elemento, clase) => elemento.classList.contains(clase)

  function handleClick(event) {
    const target = event.target;

    if (
      verificarClase(target, 'bxs-edit') ||
      verificarClase(target, 'bxs-edit-alt') ||
      verificarClase(target, 'bxs-trash-alt')
    ) {
      const textoItem = target.parentElement.parentElement.children[0];

      if (target.classList.contains("bxs-edit")) {
        cambiarClases(target, "bxs-edit", "bxs-edit-alt")
        target.parentElement.children[1].style.display = "none";
        textoItem.contentEditable = true;
        textoItem.focus();

        estiloElemento = target.parentElement.parentElement.children[0].style;
        if (estiloElemento.textDecoration == "line-through") {
          estiloElemento.textDecoration = "none";
          estiloElemento.color = "#000";
        }
       
        textoItem.addEventListener("keydown", (e) => {
          if (e.key == "Enter") {
            textoItem.contentEditable = false;
            cambiarClases(target, "bxs-edit-alt", "bxs-edit")
            target.parentElement.children[1].style.display = "inline-block";
          }
        });
        textoItem.addEventListener(
          "blur",
          () => (textoItem.contentEditable = false)
        );
      } else if (verificarClase(target, 'bxs-edit-alt')) {
        cambiarClases(target, "bxs-edit-alt", "bxs-edit")
        target.parentElement.children[1].style.display = "inline-block";
        textoItem.contentEditable = false;
      }

      if (verificarClase(target, 'bxs-trash-alt')) {
        target.parentElement.parentElement.remove();
        mostrarAlerta(ALERT_TYPES.DELETE);
      }
    } else if (target.localName == "p") {
      if (target.contentEditable == "true") return;
      const estiloElemento = target.style

      if (estiloElemento.textDecoration == "line-through") {
        estiloElemento.textDecoration = "none";
        estiloElemento.color = "#000";
      } else {
        estiloElemento.textDecoration = "line-through";
        estiloElemento.color = "#aaa";
      }
    }
  }

  btnAgregarTarea.addEventListener("click", (e) => {
    e.preventDefault();
    const textoTarea = input.value;
    e.target.parentElement.children[0].value = " ";
    crearTarea(textoTarea);
    mostrarAlerta(ALERT_TYPES.ADD);
  });

  input.addEventListener("keydown", (e) => {
    if (e.key == "Enter") {
      e.preventDefault();
      const textoTarea = input.value;
      e.target.value = " ";
      crearTarea(textoTarea);
      mostrarAlerta(ALERT_TYPES.ADD);
    }
  });

  btnBorrarTodo.addEventListener("click", () => {
    if (listaTareas.children.length == 0) {
      tirarError("No hay tareas a borrar.");
    } else {
      listaTareas.innerHTML = "";
      alert("Lista de tareas borrada.");
    }
  });

  listaTareas.addEventListener("click", handleClick);
});
