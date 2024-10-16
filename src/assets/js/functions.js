document.addEventListener("DOMContentLoaded", function () {
  // Menú móvil
  const menuButton = document.getElementById("menu-button");
  const mobileMenu = document.getElementById("mobile-menu");
  const menuLinks = mobileMenu.querySelectorAll("a");

  if (menuButton && mobileMenu) {
    menuButton.addEventListener("click", function () {
      mobileMenu.classList.toggle("hidden");
    });

    // Cerrar el menú cuando se selecciona una sección
    menuLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        mobileMenu.classList.add("hidden");
      });
    });
  }

  // Observador de intersección para las secciones
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll(".navbar-link");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const index = Array.from(sections).indexOf(entry.target);
        if (entry.isIntersecting) {
          navLinks.forEach((link) => link.classList.remove("active"));
          navLinks[index].classList.add("active");
        }
      });
    },
    {
      threshold: 0.8,
    }
  );

  sections.forEach((section) => {
    observer.observe(section);
  });

  // Cargar servicios
  fetch("../../mocks/servicios.json")
    .then((response) => response.json())
    .then((data) => {
      const categorias = ["construccion", "soldadura", "instalaciones"];

      categorias.forEach((categoria) => {
        const categoriaContainer = document.getElementById(categoria);

        const serviciosFiltrados = data.filter(
          (servicio) => servicio.categoria === categoria
        );

        categoriaContainer.innerHTML = serviciosFiltrados
          .map(
            (servicio) => `
            <div class="bg-slate-800 rounded-lg p-4 2xl:p-8 text-center flex flex-col items-center shadow-lg transition transform duration-300 hover:scale-105 mx-auto w-10/12">
              <img src="${servicio.imagen}" alt="${servicio.titulo}" class="w-24 h-24 2xl:h-32 2xl:w-32 object-cover rounded-full mb-2 2xl:mb-4">
              <h3 class="text-white font-bold text-xl 2xl:text-2xl mb-2">${servicio.titulo}</h3>
              <p class="text-white 2xl:text-lg text-sm leading-relaxed">${servicio.descripcion}</p>
            </div>
            `
          )
          .join("");
      });
    })
    .catch((error) => console.error("Error cargando los servicios:", error));

  // Cargar proyectos
  fetch("../../mocks/projects.json")
    .then((response) => response.json())
    .then((data) => {
      const swiperWrapper = document.getElementById("swiper-wrapper");

      data.forEach((project) => {
        const projectSlide = `
        <div class="swiper-slide flex justify-center mt-4">
          <div class="shadow-lg project-card bg-gradient-to-b from-white via-gray-200 to-gray-300 text-slate-800 rounded-lg p-6 w-full max-w-4xl mx-auto flex md:flex-row items-center md:space-x-6">
            <div class="w-full h-64 md:h-auto md:w-1/2 2xl:h-72">
              <img src="${project.imagen}" alt="${project.titulo}" class="w-full h-full object-cover rounded-lg">
            </div>
            <div class="w-full md:w-1/2 flex flex-col justify-between">
              <div>
                <h3 class="text-2xl md:text-3xl font-bold mb-4 2xl:text-4xl 2xl:mb-8">${project.titulo}</h3>
                <p class="text-sm md:text-lg mb-2 2xl:text-xl 2xl:mb-6">
                  ${project.descripcion}
                </p>
              </div>
              <div>
                <a href="../../pages/projects-details.html?id=${project.id}" class="inline-block bg-yellow-500 text-slate-800 font-bold py-2 px-4 md:py-3 md:px-6 rounded 2xl:px-8 2xl:py-4 2xl:text-lg hover:bg-slate-800 hover:text-yellow-500 transition-colors duration-300">Ver Detalles</a>
              </div>
            </div>
          </div>
        </div>
      `;

        swiperWrapper.innerHTML += projectSlide;
      });

      initSwiper();
    })
    .catch((error) => console.error("Error al cargar los proyectos:", error));

  // Inicializar Swiper.js
  function initSwiper() {
    const swiper = new Swiper(".proyectos-swiper", {
      loop: true,
      slidesPerView: 1,
      spaceBetween: 30,
      navigation: {
        nextEl: ".proyectos-button-next",
        prevEl: ".proyectos-button-prev",
      },
      pagination: {
        el: ".proyectos-pagination",
        clickable: true,
      },
      breakpoints: {
        640: {
          slidesPerView: 1,
        },
        768: {
          slidesPerView: 1,
        },
        1024: {
          slidesPerView: 1,
        },
      },
    });
  }

  // Validación del formulario
  const form = document.getElementById("contactForm");
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const phoneInput = document.getElementById("phone");
  const subjectInput = document.getElementById("subject");
  const messageInput = document.getElementById("message");

  const nameError = document.getElementById("nameError");
  const emailError = document.getElementById("emailError");
  const phoneError = document.getElementById("phoneError");
  const subjectError = document.getElementById("subjectError");
  const messageError = document.getElementById("messageError");

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    let isValid = true;

    clearMessages();

    if (!validateName(nameInput)) isValid = false;
    if (!validateEmail(emailInput)) isValid = false;
    if (!validatePhone(phoneInput)) isValid = false;
    if (!validateField(subjectInput, subjectError, "El asunto es obligatorio."))
      isValid = false;
    if (
      !validateField(messageInput, messageError, "El mensaje es obligatorio.")
    )
      isValid = false;

    if (isValid) {
      alert("Formulario enviado correctamente!");
      form.reset();
      form.submit();
    }
  });

  function validateName(input) {
    const namePattern = /^[a-zA-Z\s]+$/;
    if (input.value.trim() === "") {
      showError(input, nameError, "El nombre es obligatorio.");
      return false;
    } else if (!namePattern.test(input.value)) {
      showError(
        input,
        nameError,
        "El nombre no debe contener números ni caracteres especiales."
      );
      return false;
    } else {
      showSuccess(input, nameError);
      return true;
    }
  }

  function validateEmail(input) {
    const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
    if (input.value.trim() === "") {
      showError(input, emailError, "El correo electrónico es obligatorio.");
      return false;
    } else if (!emailPattern.test(input.value)) {
      showError(input, emailError, "El correo electrónico no es válido.");
      return false;
    } else {
      showSuccess(input, emailError);
      return true;
    }
  }

  function validatePhone(input) {
    const phonePattern = /^[0-9]+$/;
    if (input.value.trim() === "") {
      showError(input, phoneError, "El teléfono es obligatorio.");
      return false;
    } else if (!phonePattern.test(input.value)) {
      showError(input, phoneError, "El teléfono solo debe contener números.");
      return false;
    } else {
      showSuccess(input, phoneError);
      return true;
    }
  }

  function validateField(input, errorElement, message) {
    if (input.value.trim() === "") {
      showError(input, errorElement, message);
      return false;
    } else {
      showSuccess(input, errorElement);
      return true;
    }
  }

  function showError(input, errorElement, message) {
    input.classList.remove("border-gray-300", "border-green-500");
    input.classList.add("border-red-500");
    errorElement.textContent = message;
  }

  function showSuccess(input, errorElement) {
    input.classList.remove("border-gray-300", "border-red-500");
    input.classList.add("border-green-500");
    errorElement.textContent = "";
  }

  function clearMessages() {
    nameError.textContent = "";
    emailError.textContent = "";
    phoneError.textContent = "";
    subjectError.textContent = "";
    messageError.textContent = "";
  }
});

// Función para alternar categorías
function toggleCategory(categoria) {
  const categoryDiv = document.getElementById(categoria);
  const categorias = ["construccion", "soldadura", "instalaciones"];

  categorias.forEach((c) => {
    const div = document.getElementById(c);
    if (c !== categoria && !div.classList.contains("hidden")) {
      div.classList.remove("grid");
      div.classList.add("hidden");
    }
  });

  if (categoryDiv.classList.contains("hidden")) {
    categoryDiv.classList.remove("hidden");
    categoryDiv.classList.add("grid");

    const cards = categoryDiv.children;

    Array.from(cards).forEach((card, index) => {
      card.classList.remove("opacity-100");
      card.classList.add("opacity-0");

      setTimeout(() => {
        card.classList.remove("opacity-0");
        card.classList.add("opacity-100");
      }, index * 300);
    });
  } else {
    categoryDiv.classList.remove("grid");
    categoryDiv.classList.add("hidden");
  }
}
