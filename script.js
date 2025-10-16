document.addEventListener("DOMContentLoaded", () => {
  const video = document.getElementById("bg-video");
  const muteBtn = document.getElementById("muteToggle");
  const form = document.getElementById("commentForm");
  const display = document.getElementById("commentList");
  const toastContainer = document.getElementById("toastContainer");
  const nav = document.querySelector(".navbar-blur");

  const scriptURL = "https://script.google.com/macros/s/AKfycbxqya8pqaf8GgtQ5amiPR7x4eJbpJ3jWwXEUbsvbA2Ug-PqXtB8aOJy982z9pmIEA22/exec";

  video.muted = true;
  video.play().catch(() => {});
  const enableAudio = () => {
    video.muted = false;
    video.play().catch(() => {});
    muteBtn.textContent = "🔊";
    document.removeEventListener("click", enableAudio);
    document.removeEventListener("touchstart", enableAudio);
  };
  document.addEventListener("click", enableAudio);
  document.addEventListener("touchstart", enableAudio);
  muteBtn.addEventListener("click", () => {
    video.muted = !video.muted;
    muteBtn.textContent = video.muted ? "🔇" : "🔊";
  });

  function showToast(msg, color = "#4da3ff") {
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.style.background = color;
    toast.textContent = msg;
    toastContainer.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }

  async function loadKomentar() {
    try {
      const res = await fetch(scriptURL);
      const data = await res.json();

      display.innerHTML = "";
      data.reverse().forEach((item) => {
        const div = document.createElement("div");
        div.className = "comment-item fade-in";
        div.innerHTML = `
          <b>${item.name}</b>
          <p>${item.comment}</p>
          <small>${new Date(item.time).toLocaleString()}</small>
        `;
        display.appendChild(div);
      });
    } catch (err) {
      console.error("Gagal memuat komentar:", err);
      showToast("Gagal memuat komentar!", "crimson");
    }
  }

  loadKomentar();

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const comment = document.getElementById("comment").value.trim();
    if (!name || !comment) {
      showToast("Isi nama dan komentar!", "crimson");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("comment", comment);

    try {
      const res = await fetch(scriptURL, { method: "POST", body: formData });
      const text = await res.text();

      if (text.includes("OK")) {
        form.reset();
        showToast("Komentar berhasil dikirim!");
        loadKomentar();
      } else {
        showToast("Gagal mengirim komentar.", "orange");
      }
    } catch (err) {
      showToast("Koneksi bermasalah!", "red");
    }
  });

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

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        window.scrollTo({ top: target.offsetTop - 55, behavior: "smooth" });
      }
    });
  });

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
      if (link.getAttribute("href") === `#${current}`) link.classList.add("active");
    });
  });
});
