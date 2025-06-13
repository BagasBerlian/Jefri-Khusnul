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
  const musicControl = document.querySelector(".music-control");
  const weddingMusic = document.getElementById("wedding-music");

  gsap.registerPlugin(ScrollTrigger);

  function startApp() {
    initLoading();
  }

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
        },
      });
    }, 3000);
  }

  function initApp() {
    guestName();
    createFloatingHearts();
    setupEnvelope();
    setupInvitationCard();
  }

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

  function toggleMusicPlayback() {
    if (weddingMusic.paused) {
      const playPromise = weddingMusic.play();
      if (playPromise !== undefined) {
        playPromise
          .then((_) => {
            musicToggle.innerHTML =
              '<i class="fas fa-music"></i> Hentikan Musik';
          })
          .catch((error) => {
            console.error("Autoplay diblokir oleh browser:", error);
            musicToggle.innerHTML = '<i class="fas fa-music"></i> Putar Musik';
          });
      }
    } else {
      weddingMusic.pause();
      musicToggle.innerHTML = '<i class="fas fa-music"></i> Putar Musik';
    }
  }

  function setupMusicPlayer() {
    musicToggle.addEventListener("click", toggleMusicPlayback);
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
    musicControl.classList.add("show");
    toggleMusicPlayback();

    createConfetti();
    gsap.to(invitationCard, {
      duration: 1,
      scale: 0,
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

  function startCountdown() {
    const weddingDate = new Date("2025-06-25T09:00:00").getTime();
    const countdown = setInterval(function () {
      const now = new Date().getTime();
      const distance = weddingDate - now;
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      const format = (num) => (num < 10 ? "0" + num : num);
      if (distance < 0) {
        clearInterval(countdown);
        document.getElementById("countdown-timer").innerHTML =
          "<div class='timer-box' style='width:100%;'><h3>Acara Telah Dimulai</h3></div>";
        return;
      }
      document.getElementById("countdown-days").innerText = format(days);
      document.getElementById("countdown-hours").innerText = format(hours);
      document.getElementById("countdown-minutes").innerText = format(minutes);
      document.getElementById("countdown-seconds").innerText = format(seconds);
    }, 1000);
  }

  function setupRSVPForm() {
    const btnYes = document.getElementById("btn-attend-yes");
    const btnNo = document.getElementById("btn-attend-no");
    const initialChoice = document.getElementById("rsvp-initial-choice");
    const formYes = document.getElementById("rsvp-form-yes");
    const formNo = document.getElementById("rsvp-form-no");
    const successMessage = document.getElementById("rsvp-success-message");
    const SCRIPT_URL =
      "https://script.google.com/macros/s/AKfycbxEDjOaP4T43O9yMfcRBIlNAdxEktzMXU7vNGMHcbhwoZIuHAJk8JSTrTSgnWbEKG0/exec";

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

    btnYes.addEventListener("click", () => showForm(formYes));
    btnNo.addEventListener("click", () => showForm(formNo));

    const showSuccess = () => {
      formYes.style.display = "none";
      formNo.style.display = "none";
      successMessage.style.display = "block";
      gsap.fromTo(
        successMessage,
        { autoAlpha: 0, scale: 0.8 },
        { duration: 0.7, autoAlpha: 1, scale: 1, ease: "back.out(1.7)" }
      );
    };

    const handleFormSubmit = (form, e) => {
      e.preventDefault();
      const submitButton = form.querySelector("button[type='submit']");
      submitButton.disabled = true;
      submitButton.classList.add("is-loading");
      const formData = new FormData(form);
      formData.append(
        "formType",
        form.id === "rsvp-form-yes" ? "kehadiran" : "ucapan"
      );
      fetch(SCRIPT_URL, { method: "POST", body: formData })
        .then((response) => response.json())
        .then((data) => {
          if (data.result === "success") showSuccess();
          else throw new Error(data.error);
        })
        .catch((error) => {
          console.error("Error:", error);
          alert("Terjadi kesalahan.");
        })
        .finally(() => {
          submitButton.disabled = false;
          submitButton.classList.remove("is-loading");
        });
    };

    formYes.addEventListener("submit", (e) => handleFormSubmit(formYes, e));
    formNo.addEventListener("submit", (e) => handleFormSubmit(formNo, e));

    document.querySelectorAll(".copy-btn").forEach((button) => {
      button.addEventListener("click", () => {
        const textToCopy = button.getAttribute("data-copy-text");
        navigator.clipboard
          .writeText(textToCopy)
          .then(() => {
            const originalContent = button.innerHTML;
            button.innerHTML = "Tersalin!";
            setTimeout(() => {
              button.innerHTML = originalContent;
            }, 2000);
          })
          .catch((err) => console.error("Gagal menyalin: ", err));
      });
    });
  }

  function animateLandingContent() {
    setupMusicPlayer();
    startCountdown();
    setupRSVPForm();

    setTimeout(() => {
      AOS.init({ duration: 1000, once: true });
    }, 100);
  }

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
      if (Math.random() < 0.6) confetti.innerHTML = "❤";
      confetti.style.backgroundColor =
        colors[Math.floor(Math.random() * colors.length)];
      confetti.style.width = Math.random() * 12 + 5 + "px";
      confetti.style.height = confetti.style.width;
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

  startApp();
});
