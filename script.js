document.addEventListener("DOMContentLoaded", () => {
  const video = document.getElementById("bg-video");
  const muteBtn = document.getElementById("muteToggle");
  const form = document.getElementById("commentForm");
  const display = document.getElementById("commentsDisplay");
  const toastContainer = document.getElementById("toastContainer");
  const nav = document.querySelector(".navbar-blur");

  /* === VIDEO MUTE / UNMUTE === */
  video.muted = true;
  muteBtn.addEventListener("click", () => {
    video.muted = !video.muted;
    muteBtn.textContent = video.muted ? "🔇" : "🔊";
  });

  // Autoplay fix (untuk mobile & browser modern)
  const tryPlay = () => {
    video.play().catch(() => {});
    document.removeEventListener("click", tryPlay);
  };
  document.addEventListener("click", tryPlay);

  /* === TOAST NOTIFICATION === */
  function showToast(msg, color = "#4da3ff") {
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.style.background = color;
    toast.textContent = msg;
    toastContainer.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }

  /* === KOMENTAR KE GOOGLE SHEETS === */
  const scriptURL =
    "https://script.google.com/macros/s/AKfycbzIdRZNdPs4KS2zToy_FaBS9IwZ322VDijeNvxUuwDi9RYuxP5n3tBk41qNl4RN-Vxo/exec";

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value.trim();
    const comment = document.getElementById("comment").value.trim();

    if (!name || !comment) {
      showToast("Isi nama dan komentar!", "crimson");
      return;
    }

    const data = { name, comment };
    try {
      const res = await fetch(scriptURL, {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        const div = document.createElement("div");
        div.className = "comment-item fade-in";
        div.innerHTML = `<b>${name}</b><p>${comment}</p>`;
        display.appendChild(div);
        form.reset();
        showToast("Komentar berhasil dikirim!");
      } else {
        showToast("Gagal mengirim komentar.", "orange");
      }
    } catch (err) {
      showToast("Koneksi bermasalah!", "red");
    }
  });

  /* === ANIMASI SCROLL === */
  const animatedElems = document.querySelectorAll(
    ".fade-in, .fade-in-up, .slide-left, .slide-right, .slide-up, .zoom-in, .fade-in-top"
  );

  const revealOnScroll = () => {
    const windowHeight = window.innerHeight;
    animatedElems.forEach((el) => {
      const position = el.getBoundingClientRect().top;
      if (position < windowHeight - 100) {
        el.classList.add("show");
      }
    });
  };

  window.addEventListener("scroll", revealOnScroll);
  revealOnScroll();

  /* === SCROLL HALUS NAVBAR === */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        window.scrollTo({
          top: target.offsetTop - 55,
          behavior: "smooth",
        });
      }
    });
  });

  /* === NAVBAR SHRINK SAAT SCROLL === */
  window.addEventListener("scroll", () => {
    if (window.scrollY > 60) {
      nav.style.height = "48px";
      nav.style.background = "rgba(0,0,0,0.8)";
      nav.style.boxShadow = "0 0 25px rgba(77,163,255,0.3)";
    } else {
      nav.style.height = "55px";
      nav.style.background = "rgba(0,0,0,0.55)";
      nav.style.boxShadow = "0 0 15px rgba(77,163,255,0.2)";
    }
  });

  /* === ACTIVE LINK EFFECT === */
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll(".nav-links li a");

  window.addEventListener("scroll", () => {
    let current = "";
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 150;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  });
});
