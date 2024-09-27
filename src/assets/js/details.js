document.addEventListener("DOMContentLoaded", function () {
  const menuButton = document.getElementById("menu-button");
  const mobileMenu = document.getElementById("mobile-menu");
  const menuLinks = mobileMenu.querySelectorAll("a");

  if (menuButton && mobileMenu) {
    menuButton.addEventListener("click", function () {
      mobileMenu.classList.toggle("hidden");
    });

    // Agregar la funcionalidad para cerrar el menú cuando se selecciona una sección
    menuLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        mobileMenu.classList.add("hidden");
      });
    });
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const projectId = urlParams.get("id");

  if (!projectId) {
    showError("No se encontró el ID del proyecto en la URL.");
    return;
  }

  fetch("../mocks/projects.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      const project = data.find((p) => p.id === parseInt(projectId));

      if (!project) {
        throw new Error(`Proyecto no encontrado con el ID: ${projectId}`);
      }

      document.getElementById("project-title").textContent = project.titulo;
      document.getElementById("project-title-nav").textContent = project.titulo;
      document.getElementById("project-description").textContent =
        project.detalles;
      // Actualizar el contenido de las especificaciones
      document.querySelector("#dimension-info .data").textContent =
        project.dimension;
      document.querySelector("#material-info .data").textContent =
        project.materials;
      document.querySelector("#time-info .data").textContent = project.time;
      document.querySelector("#sustainability-info .data").textContent =
        project.sustainable;

      // Mostrar si es sustentable o no

      const swiperWrapper = document.querySelector(".swiper-wrapper");
      const thumbnailsContainer = document.querySelector(".swiper-thumbnails");

      // Generar las imágenes del swiper y las miniaturas
      project.imagenes.forEach((src, index) => {
        swiperWrapper.innerHTML += `
          <div class="swiper-slide">
            <img src="${src}" alt="Imagen ${index + 1} del proyecto ${
          project.titulo
        }">
          </div>
        `;
        thumbnailsContainer.innerHTML += `
          <div class="swiper-thumbnail">
            <img src="${src}" alt="Miniatura ${index + 1} del proyecto ${
          project.titulo
        }">
          </div>
        `;
      });

      // Ahora que las miniaturas están generadas, podemos definir 'thumbnails'
      const thumbnails = document.querySelectorAll(".swiper-thumbnail");

      // Configurar el evento de clic en cada miniatura
      thumbnails.forEach((thumb, index) => {
        thumb.addEventListener("click", () => {
          swiper.slideTo(index);
        });
      });

      // Inicializar el swiper después de que todo esté listo
      const swiper = new Swiper(".swiper-container", {
        loop: true,
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
        on: {
          slideChange: function () {
            updateThumbnails(this.realIndex);
          },
        },
      });

      // Definir la función 'updateThumbnails' después de que 'thumbnails' esté definido
      function updateThumbnails(activeIndex) {
        thumbnails.forEach((thumb, index) => {
          if (index === activeIndex) {
            thumb.classList.add("active");
          } else {
            thumb.classList.remove("active");
          }
        });
      }

      // Llamar a 'updateThumbnails' para la inicialización
      updateThumbnails(0);
    })
    .catch((error) => {
      console.error("Error al cargar los detalles del proyecto:", error);
      showError(
        "No se pudo cargar el proyecto. Por favor, inténtelo de nuevo más tarde."
      );
    });
});

function showError(message) {
  const mainContent = document.querySelector("main");
  mainContent.innerHTML = `
    <div class="error-message bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
      <strong class="font-bold">Error:</strong>
      <span class="block sm:inline">${message}</span>
    </div>
  `;
}
