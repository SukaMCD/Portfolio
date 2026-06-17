$(document).ready(function () {
  // Simulate loading delay for Skeleton UI
  setTimeout(() => {
    renderProjects();
    renderBlogs();
    initMobileCarousels();
  }, 1000);

  initTypingEffect();

  // Glassmorphism Navbar Logic
  $(window).scroll(function () {
    if ($(this).scrollTop() > 50) {
      $(".navbar").addClass("scrolled");
    } else {
      $(".navbar").removeClass("scrolled");
    }
  });

  // Initialize Cursor Effects (Glow + ClickSpark)
  if (typeof initCursorEffects !== "undefined") {
    initCursorEffects({
      sparkColor: "white",
      sparkSize: 12,
      sparkRadius: 40,
      sparkCount: 10,
      duration: 500,
    });
  }

  // Module X14 Configuration
  const _0x1a2b = document.getElementById("u9p2v5");
  const _0x3c4d = document.getElementById("k3j8w1");

  if (_0x1a2b) {
    _0x1a2b.addEventListener("click", () => {
      $("#m7k4x9").modal("show");
      setTimeout(() => {
        if (_0x3c4d) _0x3c4d.focus();
      }, 500);
    });
  }

  if (_0x3c4d) {
    _0x3c4d.addEventListener("input", (e) => {
      if (e.target.value.toLowerCase() === "dino") {
        _0x3c4d.style.color = "#000";
        _0x3c4d.style.background = "#0f0";
        sessionStorage.setItem("_0xd1n0_4cc3ss", "v4l1d_" + Date.now());
        setTimeout(() => {
          window.location.href = "x7r4w2/v7b2m9";
        }, 800);
      }
    });
  }
});

function initTypingEffect() {
  const textElement = document.getElementById("typing-text");
  const words = ["Software Engineer Student", "Web Developer", "Programmer"];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typeSpeed = 100;

  function type() {
    const currentWord = words[wordIndex];
    if (isDeleting) {
      charIndex--;
      typeSpeed = 50;
    } else {
      charIndex++;
      typeSpeed = 150;
    }

    textElement.textContent = currentWord.substring(0, charIndex);

    if (!isDeleting && charIndex === currentWord.length) {
      isDeleting = true;
      typeSpeed = 2000; // Pause at end
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typeSpeed = 500;
    }

    // Add cursor
    textElement.innerHTML += '<span class="typing-cursor"></span>';

    setTimeout(type, typeSpeed);
  }

  if (textElement) type();
}

function initMobileCarousels() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 3000,
    mobileFirst: true,
    responsive: [
      {
        breakpoint: 991, // Disable on desktop
        settings: "unslick",
      },
    ],
  };

  // Tech Stack Carousel
  const $techRow = $("#services .row");
  if ($(window).width() < 992) {
    if (!$techRow.hasClass("slick-initialized")) {
      $techRow.slick(settings);
    }
  }

  // Portfolio Carousel (Wait for projects to render)
  setTimeout(() => {
    const $portRow = $("#portfolio-grid");
    if ($(window).width() < 992) {
      if (!$portRow.hasClass("slick-initialized")) {
        $portRow.slick(settings);
      }
    }
  }, 100);

  // Re-check on resize with debouncing
  $(window).on(
    "resize",
    debounce(function () {
      if ($(window).width() < 992) {
        if (!$techRow.hasClass("slick-initialized")) $techRow.slick(settings);
        const $portRow = $("#portfolio-grid");
        if (!$portRow.hasClass("slick-initialized")) $portRow.slick(settings);
      }
    }, 250)
  );
}

// Debounce helper function
function debounce(func, wait) {
  let timeout;
  return function () {
    const context = this,
      args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}

function renderProjects() {
  const container = document.getElementById("portfolio-grid");
  if (!container) return;

  if (typeof portfolioProjects === "undefined") {
    console.error("Portfolio data (projects.js) not found!");
    container.innerHTML =
      '<div class="col-12 text-center text-danger">Data project tidak dapat dimuat. Pastikan projects.js sudah di-upload.</div>';
    return;
  }

  container.innerHTML = portfolioProjects
    .map((project, index) => {
      let animation = "fade-up";
      if (index % 3 === 0) animation = "fade-right";
      if (index % 3 === 2) animation = "fade-left";

      // Use the first tag as the category badge
      const category =
        project.tags && project.tags.length > 0 ? project.tags[0] : "Project";

      return `
      <div class="col-lg-4 mb-4">
        <div class="blog-card" data-aos="${animation}" data-aos-duration="1000"
          data-title="${project.title}"
          data-description="${project.description}"
          data-tags="${project.tags.join(",")}"
          data-links='${JSON.stringify(project.links)}'
          data-image="${project.image}"
          onclick="openPortfolioModal(this)">
          <div class="blog-img-container">
            <img src="${project.image}" class="img-fluid" alt="${
        project.alt || project.title
      }" loading="lazy">
            <span class="blog-category">${project.category}</span>
          </div>
          <div class="blog-content">
            <div class="blog-date"><i class="far fa-calendar-alt mr-2"></i>${
              project.date
            }</div>
            <h5 class="blog-title">${project.title}</h5>
            <p class="blog-desc">${project.description}</p>
            <a href="javascript:void(0)" class="blog-read-more">
              View Project Details <i class="fas fa-arrow-right ml-1"></i>
            </a>
          </div>
        </div>
      </div>
    `;
    })
    .join("");

  if (typeof AOS !== "undefined") {
    AOS.init({
      once: true,
    });
    AOS.refresh();
  }
}

document.addEventListener("DOMContentLoaded", function () {
  emailjs.init("U85vb-TLi4QCplmwy");

  const form = document.getElementById("contact-form");
  form.addEventListener("submit", function (event) {
    event.preventDefault();

    emailjs.sendForm("service_i0zo3zo", "template_m8ajqzd", this).then(
      function () {
        alert("Message sent successfully!");
        form.reset();
      },
      function (error) {
        alert("Failed to send message: " + JSON.stringify(error));
      }
    );
  });
});

function openPortfolioModal(element) {
  const title = element.getAttribute("data-title");
  const description = element.getAttribute("data-description");
  const tags = element.getAttribute("data-tags");
  const linksData = element.getAttribute("data-links");
  const image = element.getAttribute("data-image");
  const alt = element.querySelector(".blog-img-container img").alt;

  document.getElementById("modal-title").textContent = title;
  document.getElementById("modal-description").textContent = description;
  document.getElementById("modal-image").src = image;
  document.getElementById("modal-image").alt = alt;

  // Handle tags
  const tagsContainer = document.getElementById("modal-tags");
  tagsContainer.innerHTML = "";
  if (tags) {
    tags.split(",").forEach((tag) => {
      const tagElement = document.createElement("span");
      tagElement.className = "badge";
      tagElement.textContent = tag.trim();
      tagsContainer.appendChild(tagElement);
    });
  }

  // Handle multiple links
  const linksContainer = document.getElementById("modal-links-container");
  linksContainer.innerHTML = "";
  if (linksData) {
    const links = JSON.parse(linksData);
    links.forEach((link) => {
      const btn = document.createElement("a");
      btn.href = link.url;
      btn.target = "_blank";
      btn.className = "btn-github-modern mb-2 mr-2";

      // Use GitHub icon for "View Project", globe for others
      const iconClass = link.label.toLowerCase().includes("project")
        ? "fab fa-github"
        : "fas fa-globe";

      btn.innerHTML = `
        <i class="${iconClass}"></i>
        <span>${link.label}</span>
      `;
      linksContainer.appendChild(btn);
    });
  }

  $("#portfoliomodal").modal("show");
}

function renderBlogs() {
  const container = document.getElementById("blogs-grid");
  if (!container || typeof blogPosts === "undefined") return;

  container.innerHTML = blogPosts
    .map((post, index) => {
      let animation = "fade-up";
      if (index % 3 === 0) animation = "fade-right";
      if (index % 3 === 2) animation = "fade-left";

      return `
      <div class="col-lg-4 mb-4">
        <div class="blog-card" data-aos="${animation}" data-aos-duration="1000">
          <div class="blog-img-container">
            <img src="${post.image}" class="img-fluid" alt="${
        post.alt || post.title
      }" loading="lazy">
            <span class="blog-category">${post.category}</span>
          </div>
          <div class="blog-content">
            <div class="blog-date"><i class="far fa-calendar-alt mr-2"></i>${
              post.date
            }</div>
            <h5 class="blog-title">${post.title}</h5>
            <p class="blog-desc">${post.description}</p>
            <a href="${post.link}" class="blog-read-more">
              Read More <i class="fas fa-arrow-right ml-1"></i>
            </a>
          </div>
        </div>
      </div>
    `;
    })
    .join("");
}

document.querySelectorAll(".scroll-link").forEach((link) => {
  link.addEventListener("click", function (e) {
    e.preventDefault();
    const targetId = this.getAttribute("href");
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: "smooth",
      });
    }
  });
});

// ClickSpark class sudah dipindahkan ke js/cursor-effects.js
