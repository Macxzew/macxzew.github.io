// === Pages de transition ===
function resetTransitionPages() {
    document.querySelectorAll('.transition-page').forEach(page => {
        page.style.top = '100%';
    });
}

// === Animation de chargement ===
function toggleLoadingAnimation(show = true) {
    const loading = document.getElementById('loading-animation');
    if (!loading) return;

    if (show) {
        loading.style.display = 'flex';
        requestAnimationFrame(() => loading.style.opacity = '1');
    } else {
        loading.style.opacity = '0';
        loading.addEventListener('transitionend', function handler() {
            loading.style.display = 'none';
            loading.removeEventListener('transitionend', handler);
        });
    }
}

// Gestion du chargement initial et du retour via cache
window.addEventListener('load', () => {
    setTimeout(() => toggleLoadingAnimation(false), 2000);
});

window.addEventListener('pageshow', (e) => {
    resetTransitionPages();
    if (e.persisted) {
        toggleLoadingAnimation(true);
        setTimeout(() => toggleLoadingAnimation(false), 2000);
    }
});

// === Transitions réseaux sociaux ===
function setupSocialMediaTransitions() {
    const links = document.querySelectorAll('.social-media a');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            const icon = link.querySelector('iconify-icon');
            const platform = icon?.getAttribute('icon')?.split(':')[1];
            const transitionPage = document.getElementById(`${platform}Page`);

            if (transitionPage) {
                transitionPage.style.top = '0';
                setTimeout(() => window.location.href = link.href, 1500);
            } else {
                window.location.href = link.href;
            }
        });
    });
}

// === Carte 3D (effet tilt) ===
function setupCardTiltEffect(card) {
    let inactivityTimer;
    const INACTIVITY_DELAY = 2000;
    const maxRotation = 15;
    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;

    function updateRotation() {
        currentX += (targetX - currentX) * 0.05;
        currentY += (targetY - currentY) * 0.05;

        card.style.transform = `rotateX(${-currentY}deg) rotateY(${currentX}deg)`;

        requestAnimationFrame(updateRotation);
    }

    function handleMouseMove(e) {
        if (
            e.clientX < 0 || e.clientY < 0 ||
            e.clientX > window.innerWidth ||
            e.clientY > window.innerHeight
        ) {
            return;
        }

        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        let percentX = (x / rect.width - 0.5) * 2;
        let percentY = (y / rect.height - 0.5) * 2;

        percentX = Math.max(-1, Math.min(1, percentX));
        percentY = Math.max(-1, Math.min(1, percentY));

        targetX = percentX * maxRotation;
        targetY = percentY * maxRotation;

        clearTimeout(inactivityTimer);
        inactivityTimer = setTimeout(() => {
            targetX = 0;
            targetY = 0;
        }, INACTIVITY_DELAY);
    }


    function resetRotation() {
        targetX = 0;
        targetY = 0;
    }

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', resetRotation);
    updateRotation();
}

// === Affichage de l'âge ===
function toggleAgeDisplay() {
    const ageText = document.getElementById('ageText');
    if (!ageText) return;

    const visible = ageText.classList.toggle('visible');
    ageText.style.transform = visible ? 'translate(50%, -50%)' : 'translate(-50%, 50%)';
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
    const ageText = document.getElementById('ageText');
    if (ageText) ageText.textContent = `${age}yo`;
}

// === Initialisation globale ===
document.addEventListener('DOMContentLoaded', () => {
    const card = document.querySelector('.profile-card');
    if (!('ontouchstart' in window || navigator.maxTouchPoints)) {
        setupCardTiltEffect(card);
    }
    setupSocialMediaTransitions();
    updateAge('2003-06-30');
});

window.addEventListener('mouseleave', () => {
    targetX = 0;
    targetY = 0;
});
