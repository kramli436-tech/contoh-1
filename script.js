document.addEventListener("DOMContentLoaded", () => {
  const video = document.getElementById("bg-video");
  const muteBtn = document.getElementById("muteToggle");
  const form = document.getElementById("commentForm");
  const display = document.getElementById("commentsDisplay");
  const toastContainer = document.getElementById("toastContainer");
  const nav = document.querySelector(".navbar-blur");

  /* === FIX AUTOPLAY SUARA DI HP ===
     Browser mobile memblokir autoplay dengan suara aktif,
     jadi kita mulai dengan mute = true, lalu aktifkan suara 
     setelah user menyentuh layar satu kali (click atau touch).
  */
  video.muted = true;
  video.play().catch(() => {});

  const enableAudio = () => {
    video.muted = false;
    video.play().catch(() => {});
    muteBtn.textContent = "🔊";
    document.removeEventListener("touchstart", enableAudio);
    document.removeEventListener("click", enableAudio);
  };
  document.addEventListener("touchstart", enableAudio);
  document.addEventListener("click", enableAudio);

  /* === MUTE / UNMUTE BUTTON === */
  muteBtn.addEventListener("click", () => {
    video.muted = !video.muted;
    muteBtn.textContent = video.muted ? "🔇" : "🔊";
    if (!video.paused) video.play().catch(() => {});
  });

  /* === TOAST === */
  function showToast(msg, color = "#4da3ff") {
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.style.background = color;
    toast.textContent = msg;
    toastContainer.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }

  /* === KOMENTAR KE GOOGLE SHEETS === */
  const scriptURL ="https://script.google.com/macros/s/AKfycbyJoPMZI2xoQSenqFO2E9oAu3mcnYHG9Aeygb9YPdLWP5a54if5geKzVeyFWuG5ddFg/exec";

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

  /* === SCROLL REVEAL ANIMATION === */
  const animatedElems = document.querySelectorAll(
    ".fade-in, .fade-in-up, .slide-left, .slide-right, .slide-up, .zoom-in, .fade-in-top"
  );
  const revealOnScroll = () => {
    const windowHeight = window.innerHeight;
    animatedElems.forEach((el) => {
      const position = el.getBoundingClientRect().top;
      if (position < windowHeight - 100) el.classList.add("show");
    });
  };
  window.addEventListener("scroll", revealOnScroll);
  revealOnScroll();

  /* === SMOOTH SCROLL NAV === */
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

  /* === NAVBAR SHRINK === */
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

  /* === ACTIVE LINK HIGHLIGHT === */
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll(".nav-links li a");
  window.addEventListener("scroll", () => {
    let current = "";
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 150;
      if (window.scrollY >= sectionTop) current = section.getAttribute("id");
    });
    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`)
        link.classList.add("active");
    });
  });
});
