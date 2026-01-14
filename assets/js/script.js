// === Pages de transition ===
function resetTransitionPages() {
  document.querySelectorAll(".transition-page").forEach((page) => {
    page.style.top = "100%";
  });
}

// === Animation de chargement ===
function toggleLoadingAnimation(show = true) {
  const loading = document.getElementById("loading-animation");
  if (!loading) return;

  if (show) {
    loading.style.display = "flex";
    requestAnimationFrame(() => (loading.style.opacity = "1"));
  } else {
    loading.style.opacity = "0";
    loading.addEventListener(
      "transitionend",
      function handler() {
        loading.style.display = "none";
        loading.removeEventListener("transitionend", handler);
      },
      { once: true }
    );
  }
}

// Gestion du chargement initial et du retour via cache
window.addEventListener("load", () => {
  setTimeout(() => toggleLoadingAnimation(false), 2000);
});

window.addEventListener("pageshow", (e) => {
  resetTransitionPages();
  if (e.persisted) {
    toggleLoadingAnimation(true);
    setTimeout(() => toggleLoadingAnimation(false), 2000);
  }
});

// === Transitions réseaux sociaux ===
function setupSocialMediaTransitions() {
  const links = document.querySelectorAll(".social-media a");

  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();

      const icon = link.querySelector("iconify-icon");
      const platform = icon?.getAttribute("icon")?.split(":")[1];
      const transitionPage = document.getElementById(`${platform}Page`);

      if (transitionPage) {
        transitionPage.style.top = "0";
        setTimeout(() => (window.location.href = link.href), 1500);
      } else {
        window.location.href = link.href;
      }
    });
  });
}

// === Carte 3D (effet tilt) ===
function setupCardTiltEffect() {
  const wrapper = document.querySelector(".card-wrapper");
  const card = document.querySelector(".profile-card");
  if (!wrapper || !card) return;

  const maxRotation = 15;
  const INACTIVITY_DELAY = 2000;
  let currentX = 0,
    currentY = 0;
  let targetX = 0,
    targetY = 0;
  let inactivityTimer;

  function updateRotation() {
    currentX += (targetX - currentX) * 0.1;
    currentY += (targetY - currentY) * 0.1;
    card.style.transform = `rotateX(${-currentY}deg) rotateY(${currentX}deg)`;
    requestAnimationFrame(updateRotation);
  }

  function handleMouseMove(e) {
    const rect = wrapper.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const percentX = Math.max(-1, Math.min(1, (x / rect.width - 0.5) * 2));
    const percentY = Math.max(-1, Math.min(1, (y / rect.height - 0.5) * 2));

    targetX = percentX * maxRotation;
    targetY = percentY * maxRotation;

    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => {
      targetX = 0;
      targetY = 0;
    }, INACTIVITY_DELAY);
  }

  wrapper.addEventListener("mousemove", handleMouseMove);
  wrapper.addEventListener("mouseleave", () => {
    targetX = 0;
    targetY = 0;
  });

  updateRotation();
}

// === Touch detect (pour click mobile uniquement) ===
function isTouchDevice() {
  return (
    window.matchMedia?.("(hover: none)").matches ||
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0
  );
}

// === Affichage de l'âge (click mobile/tablette) ===
function toggleAgeDisplay() {
  const ageText = document.getElementById("ageText");
  if (!ageText) return;

  const visible = ageText.classList.toggle("visible");
  ageText.style.transform = visible ? "translate(50%, -50%)" : "translate(-50%, 50%)";
}

function calculateAge(birthDate) {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();

  if (
    today.getMonth() < birth.getMonth() ||
    (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())
  ) {
    age--;
  }
  return age;
}

function updateAge(birthDate) {
  const age = calculateAge(birthDate);
  const ageText = document.getElementById("ageText");
  if (ageText) ageText.textContent = `${age}yo`;
}

// === Initialisation globale ===
document.addEventListener("DOMContentLoaded", () => {
  const avatar = document.getElementById("avatar"); // <- mets bien id="avatar" en HTML

  // Tilt uniquement sur PC
  if (!isTouchDevice()) setupCardTiltEffect();

  // Click uniquement sur mobile/tablette
  if (isTouchDevice() && avatar) {
    avatar.addEventListener("click", toggleAgeDisplay, { passive: true });
  }

  setupSocialMediaTransitions();
  updateAge("2003-06-30");
});
