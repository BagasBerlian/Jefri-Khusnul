document.addEventListener("DOMContentLoaded", function () {
  const loadingScreen = document.querySelector(".loading-screen");
  const envelopeSection = document.querySelector(".envelope-section");
  const invitationCardSection = document.querySelector(
    ".invitation-card-section"
  );
  const weddingLanding = document.querySelector(".wedding-landing");
  const envelope = document.querySelector(".envelope");
  const envelopeWrapper = document.querySelector(".envelope-wrapper");
  const invitationCard = document.querySelector(".invitation-card");
  const openBtn = document.querySelector(".open-invitation-btn");
  const musicToggle = document.getElementById("music-toggle");
  const weddingMusic = document.getElementById("wedding-music");

  // Animate sections below the fold
  gsap.registerPlugin(ScrollTrigger);

  // Simulate loading with animation
  function initLoading() {
    gsap.to(".heart-shape", {
      duration: 2,
      scale: 1.2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    setTimeout(() => {
      gsap.to(loadingScreen, {
        duration: 1,
        opacity: 0,
        onComplete: () => {
          loadingScreen.style.display = "none";
          initApp();
          //   showLandingPage();
        },
      });
    }, 3000);
  }

  // Initialize the application
  function initApp() {
    createFloatingHearts();
    setupMusicPlayer();
    guestName();
    setupEnvelope();
    setupInvitationCard();
  }

  // Create floating hearts animation
  function createFloatingHearts() {
    const heartsContainer = document.querySelector(".hearts");

    for (let i = 0; i < 5; i++) {
      const heart = document.createElement("div");
      heart.innerHTML = "❤";
      heart.style.position = "absolute";
      heart.style.fontSize = Math.random() * 20 + 15 + "px";
      heart.style.color = `rgba(212, 165, 195, ${Math.random() * 0.5 + 0.3})`;
      heart.style.left = Math.random() * 100 + "%";
      heart.style.top = Math.random() * 100 + "%";
      heart.style.opacity = "0";
      heartsContainer.appendChild(heart);

      gsap.to(heart, {
        duration: Math.random() * 5 + 5,
        y: -200,
        x: Math.random() * 100 - 50,
        rotation: Math.random() * 360,
        opacity: 0.8,
        delay: Math.random() * 5,
        ease: "sine.inOut",
        onComplete: () => heart.remove(),
        repeat: -1,
        repeatDelay: Math.random() * 5,
      });
    }
  }

  // Setup music player functionality
  function setupMusicPlayer() {
    musicToggle.addEventListener("click", function () {
      if (weddingMusic.paused) {
        weddingMusic.play();
        musicToggle.innerHTML = '<i class="fas fa-music"></i> Hentikan Musik';
        gsap.to(musicToggle, {
          scale: 1.1,
          duration: 0.3,
          yoyo: true,
          repeat: 1,
        });
      } else {
        weddingMusic.pause();
        musicToggle.innerHTML = '<i class="fas fa-music"></i> Putar Musik';
      }
    });
  }

  function guestName() {
    const urlParams = new URLSearchParams(window.location.search);
    const p = urlParams.get("p");
    const n = urlParams.get("n");

    let guestName = "Anda";
    if (p && n) {
      guestName = `${p} ${n}`;
    } else if (n) {
      guestName = n;
    }

    document.getElementById("guest-name").textContent = guestName;

    gsap.fromTo(
      "#guest-name",
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "back.out" }
    );
  }

  function setupEnvelope() {
    envelope.addEventListener("click", openEnvelope);
  }

  function openEnvelope() {
    envelope.style.pointerEvents = "none";
    gsap.to(".stamp", { y: 100, opacity: 0, duration: 0.8, ease: "back.in" });
    gsap.to(envelope, {
      duration: 1,
      y: -50,
      rotateX: 180,
      ease: "back.inOut",
    });
    gsap.to(".envelope-flap", {
      duration: 0.8,
      rotateX: 180,
      ease: "back.inOut",
      delay: 0.2,
    });
    setTimeout(() => {
      gsap.to(envelopeWrapper, {
        duration: 0.8,
        opacity: 0,
        y: -50,
        ease: "back.in",
        onComplete: () => {
          envelopeSection.style.display = "none";
          showInvitationCard();
        },
      });
    }, 1000);
  }

  function showInvitationCard() {
    invitationCardSection.style.display = "flex";
    gsap.fromTo(
      invitationCardSection,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "back.out",
        onComplete: () => {
          gsap.fromTo(
            ".card-content",
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 1, ease: "back.out" }
          );
          gsap.to(".card-decoration", {
            duration: 1.5,
            rotation: 360,
            opacity: 0.2,
            ease: "elastic.out(1, 0.5)",
            stagger: 0.2,
            delay: 0.5,
          });
        },
      }
    );
  }

  function setupInvitationCard() {
    openBtn.addEventListener("click", openInvitation);
  }

  function openInvitation() {
    if (weddingMusic.paused) {
      weddingMusic.play();
      musicToggle.innerHTML = '<i class="fas fa-music"></i> Pause Musik';
      gsap.to(musicToggle, {
        scale: 1.1,
        duration: 0.3,
        yoyo: true,
        repeat: 1,
      });
    }

    createConfetti();

    // Animasi zoom out pada kartu undangan
    gsap.to(invitationCard, {
      duration: 1,
      scale: 0, // << PERUBAHAN UTAMA: ZOOM OUT
      opacity: 0,
      ease: "power2.in",
      onComplete: () => {
        invitationCardSection.style.display = "none";
        showLandingPage();
      },
    });
  }

  function showLandingPage() {
    weddingLanding.style.display = "block";

    gsap.fromTo(
      weddingLanding,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 1,
        ease: "sine.out",
        onComplete: animateLandingContent,
      }
    );
  }

  // --- FUNGSI BARU UNTUK COUNTDOWN ---
  function startCountdown() {
    const weddingDate = new Date("June 25, 2025 09:00:00").getTime();

    const countdown = setInterval(function () {
      const now = new Date().getTime();
      const distance = weddingDate - now;

      // Perhitungan waktu
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      // Tambahkan '0' di depan jika angka < 10
      const format = (num) => (num < 10 ? "0" + num : num);

      // Tampilkan di elemen
      document.getElementById("countdown-days").innerText = format(days);
      document.getElementById("countdown-hours").innerText = format(hours);
      document.getElementById("countdown-minutes").innerText = format(minutes);
      document.getElementById("countdown-seconds").innerText = format(seconds);

      // Jika waktu habis
      if (distance < 0) {
        clearInterval(countdown);
        document.getElementById("countdown-timer").innerHTML =
          "<div class='timer-box' style='width:100%;'><h3>The Wedding Has Begun!</h3></div>";
      }
    }, 1000);
  }

  function setupProfileCardHover() {
    const profileCards = document.querySelectorAll(".profile-card");

    profileCards.forEach((card) => {
      // Saat mouse masuk ke area kartu
      card.addEventListener("mouseenter", () => {
        gsap.to(card, {
          duration: 0.4,
          y: -10, // Mengangkat kartu ke atas
          boxShadow: "0 15px 40px rgba(0, 0, 0, 0.12)", // Bayangan lebih tebal
          ease: "power2.out",
        });
      });

      // Saat mouse keluar dari area kartu
      card.addEventListener("mouseleave", () => {
        gsap.to(card, {
          duration: 0.4,
          y: 0, // Mengembalikan posisi kartu
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.07)", // Bayangan normal
          ease: "power2.out",
        });
      });
    });
  }

  function startGallerySpotlightAnimation() {
    const galleryItems = gsap.utils.toArray(
      ".gallery-item:not(.gallery-text-item)"
    );
    const spotlightTimeline = gsap.timeline({
      repeat: -1,
      defaults: { ease: "power2.inOut", duration: 0.5 },
    });

    galleryItems.forEach((item) => {
      const image = item.querySelector("img");

      spotlightTimeline
        .to(
          item,
          {
            scale: 1.08,
            borderColor: "#d4a5c3",
            boxShadow: "0 20px 55px rgba(0,0,0,0.35)",
            zIndex: 10,
          },
          "+=0.5"
        )
        .to(
          image,
          {
            filter: "brightness(100%)", // UBAH DI SINI: Foto menjadi terang penuh
          },
          "<"
        )

        .to(item, {
          scale: 1,
          borderColor: "#fff",
          boxShadow: "0 8px 25px rgba(142, 108, 136, 0.2)",
          zIndex: 1,
          delay: 2,
        })
        .to(
          image,
          {
            filter: "brightness(75%)", // UBAH DI SINI: Foto kembali ke kondisi sedikit redup
          },
          "<"
        );
    });
  }

  function setupRSVPForm() {
    const btnYes = document.getElementById("btn-attend-yes");
    const btnNo = document.getElementById("btn-attend-no");
    const initialChoice = document.getElementById("rsvp-initial-choice");
    const formYes = document.getElementById("rsvp-form-yes");
    const formNo = document.getElementById("rsvp-form-no");
    const successMessage = document.getElementById("rsvp-success-message");
    const rsvpContainer = document.querySelector(".rsvp-container");

    // Fungsi untuk menampilkan form dengan animasi
    const showForm = (elementToShow) => {
      gsap.to(initialChoice, {
        duration: 0.5,
        autoAlpha: 0,
        onComplete: () => (initialChoice.style.display = "none"),
      });

      elementToShow.style.display = "block";
      gsap.fromTo(
        elementToShow,
        { autoAlpha: 0, y: 20 },
        { duration: 0.5, autoAlpha: 1, y: 0, delay: 0.5 }
      );
    };

    // Ketika tombol "Ya, hadir" diklik
    btnYes.addEventListener("click", () => {
      btnYes.classList.add("active");
      btnNo.classList.remove("active");
      showForm(formYes);
    });

    // Ketika tombol "Maaf, tidak bisa" diklik
    btnNo.addEventListener("click", () => {
      btnNo.classList.add("active");
      btnYes.classList.remove("active");
      showForm(formNo);
    });

    // Fungsi untuk menampilkan pesan sukses
    const showSuccess = () => {
      // Sembunyikan semua form
      formYes.style.display = "none";
      formNo.style.display = "none";

      // Tampilkan pesan sukses dengan animasi
      successMessage.style.display = "block";
      gsap.fromTo(
        successMessage,
        { autoAlpha: 0, scale: 0.8 },
        { duration: 0.7, autoAlpha: 1, scale: 1, ease: "back.out(1.7)" }
      );
    };

    // Ketika form "Hadir" disubmit
    formYes.addEventListener("submit", (e) => {
      e.preventDefault(); // Mencegah form reload halaman
      // Di sini Anda bisa menambahkan kode untuk mengirim data ke Google Sheets/backend
      showSuccess();
    });

    // Ketika tombol "Kirim Ucapan" diklik
    document.getElementById("submit-ucapan").addEventListener("click", (e) => {
      e.preventDefault();
      showSuccess();
    });

    // Fungsionalitas untuk tombol Salin/Copy
    document.querySelectorAll(".copy-btn").forEach((button) => {
      button.addEventListener("click", () => {
        const textToCopy = button.getAttribute("data-copy-text");
        navigator.clipboard
          .writeText(textToCopy)
          .then(() => {
            const originalText = button.innerHTML;
            button.innerHTML = "Tersalin!";
            setTimeout(() => {
              button.innerHTML = originalText;
            }, 2000);
          })
          .catch((err) => {
            console.error("Gagal menyalin: ", err);
          });
      });
    });
  }

  // Animate landing page content
  function animateLandingContent() {
    startCountdown();
    setupRSVPForm();

    gsap.to(".header-content", { duration: 1, opacity: 1, ease: "power2.out" });
    gsap.from(".intro-text", {
      duration: 1,
      y: -30,
      opacity: 0,
      ease: "back.out",
      delay: 0.5,
    });
    gsap.from(".wedding-title", {
      duration: 1,
      scale: 0.5,
      opacity: 0,
      ease: "back.out",
      delay: 0.8,
    });
    gsap.from(".countdown-timer .timer-box", {
      duration: 0.8,
      y: 50,
      opacity: 0,
      stagger: 0.2,
      ease: "back.out",
      delay: 1.2,
    });
    gsap.from(".wedding-date", {
      duration: 1,
      y: 30,
      opacity: 0,
      ease: "back.out",
      delay: 1.5,
    });

    setTimeout(() => {
      // --- Animasi untuk Verse Section (Tidak berubah) ---
      gsap.from(".verse-section > *", {
        scrollTrigger: {
          trigger: ".verse-section",
          scroller: ".wedding-landing",
          start: "top 80%",
          once: true,
        },
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        stagger: 0.2,
      });

      // --- ANIMASI BARU: Judul Section Profil Mempelai ---
      gsap.from(
        ".couple-profile-section .section-title, .couple-profile-section .section-subtitle",
        {
          scrollTrigger: {
            trigger: ".couple-profile-section",
            scroller: ".wedding-landing",
            start: "top 80%",
            once: true,
          },
          y: -50,
          opacity: 0,
          duration: 1.5,
          ease: "power3.out",
          stagger: 0.3,
        }
      );

      // --- ANIMASI BARU: Setiap Elemen di Dalam Profile Card ---
      const profileCards = gsap.utils.toArray(".profile-card");
      profileCards.forEach((card) => {
        const cardTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: card,
            scroller: ".wedding-landing",
            start: "top 85%",
            once: true,
          },
        });

        cardTimeline
          .from(card, {
            autoAlpha: 0,
            y: 50,
            scale: 0.9,
            duration: 0.8,
            ease: "power3.out",
          })
          .from(
            card.querySelector(".profile-image-container"),
            { scale: 0, opacity: 0, duration: 0.6, ease: "back.out(1.7)" },
            "-=0.5"
          )
          .from(
            card.querySelector(".profile-name"),
            { x: -30, opacity: 0, duration: 0.5, ease: "power2.out" },
            "-=0.3"
          )
          .from(
            card.querySelector(".profile-parents"),
            { x: -30, opacity: 0, duration: 0.5, ease: "power2.out" },
            "-=0.4"
          )
          .from(
            card.querySelector(".profile-address"),
            { x: -30, opacity: 0, duration: 0.5, ease: "power2.out" },
            "-=0.4"
          );
      });

      // --- ANIMASI BARU: Galeri dengan Efek Berbeda-beda ---
      const galleryItems = gsap.utils.toArray(".gallery-item");

      // Buat beberapa preset animasi
      const animations = [
        { y: 100, rotation: 5, autoAlpha: 0, ease: "power3.out" },
        { x: -100, autoAlpha: 0, ease: "power3.out" },
        { scale: 0.5, autoAlpha: 0, ease: "back.out(1.7)" },
        { y: -100, rotation: -5, autoAlpha: 0, ease: "power3.out" },
        { x: 100, autoAlpha: 0, ease: "power3.out" },
        { scale: 0.5, rotation: 15, autoAlpha: 0, ease: "back.out(1.7)" },
      ];

      galleryItems.forEach((item, index) => {
        // Terapkan animasi preset secara bergantian
        const animProps = animations[index % animations.length];

        gsap.from(item, {
          ...animProps,
          scrollTrigger: {
            trigger: item,
            scroller: ".wedding-landing",
            start: "top 90%",
            once: true,
          },
          duration: 0.8,
        });
      });

      const eventInfoTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: ".event-info-section",
          scroller: ".wedding-landing",
          start: "top 75%",
          once: true,
        },
      });

      eventInfoTimeline
        .from(".event-info-section .section-title", {
          y: -50,
          opacity: 0,
          duration: 1.2,
          ease: "power3.out",
        })
        .from(
          ".event-frame",
          { scale: 0.9, opacity: 0, duration: 1, ease: "power2.out" },
          "-=0.8"
        )
        .from(
          ".event-card",
          { y: 30, opacity: 0, stagger: 0.3, duration: 0.8 },
          "-=0.5"
        )
        .from(".event-actions", { y: 20, opacity: 0, duration: 0.8 }, "-=0.4")
        .from(
          ".floral-decoration",
          {
            scale: 0.5,
            opacity: 0,
            duration: 1.5,
            ease: "power3.out",
            stagger: 0.2,
          },
          "-=1"
        );

      gsap.from(".rsvp-section > *", {
        scrollTrigger: {
          trigger: ".rsvp-section",
          scroller: ".wedding-landing",
          start: "top 80%",
          once: true,
        },
        y: 40,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
        stagger: 0.2,
      });

      gsap.from(".wedding-footer > *", {
        scrollTrigger: {
          trigger: ".wedding-footer",
          scroller: ".wedding-landing",
          start: "top 90%",
          once: true,
        },
        y: 50,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
        stagger: 0.3, // Membuat setiap elemen muncul satu per satu
      });

      // Panggil fungsi hover (tidak berubah)
      // setupProfileCardHover(); // Fungsi ini mungkin sudah tidak ada jika Anda mengikuti instruksi sebelumnya
      // Panggil animasi spotlight jika Anda masih ingin menggunakannya
      // startGallerySpotlightAnimation();

      // Refresh ScrollTrigger di akhir
      ScrollTrigger.refresh();
    }, 100);
  }

  // Create confetti effect
  function createConfetti() {
    const colors = [
      "#d4a5c3",
      "#b3889e",
      "#8e6c88",
      "#a5d4b3",
      "#d4a5a5",
      "#d4c3a5",
    ];
    const container = invitationCardSection;
    for (let i = 0; i < 150; i++) {
      const confetti = document.createElement("div");
      confetti.className = "confetti";
      const shape = Math.random();
      if (shape < 0.3) {
        confetti.style.borderRadius = "50%";
      } else if (shape < 0.6) {
        confetti.innerHTML = "❤";
        confetti.style.fontSize = Math.random() * 10 + 10 + "px";
        confetti.style.lineHeight = "1";
        confetti.style.textAlign = "center";
      }
      confetti.style.backgroundColor =
        colors[Math.floor(Math.random() * colors.length)];
      confetti.style.width = Math.random() * 12 + 5 + "px";
      confetti.style.height =
        shape < 0.6 ? confetti.style.width : Math.random() * 5 + 5 + "px";
      confetti.style.position = "absolute";
      confetti.style.left = "50%";
      confetti.style.top = "50%";
      container.appendChild(confetti);
      gsap.to(confetti, {
        x: Math.random() * 400 - 200,
        y: Math.random() * 500 - 250,
        rotation: Math.random() * 360,
        opacity: 0,
        duration: Math.random() * 2 + 2,
        delay: Math.random() * 0.5,
        ease: "power1.out",
        onComplete: () => confetti.remove(),
      });
    }
  }

  // Start the application
  initLoading();
});
