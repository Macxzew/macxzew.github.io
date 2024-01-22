// Réinitialisation des pages de transition
function resetTransitionPages() {
    const transitionPages = document.querySelectorAll('.transition-page');
    transitionPages.forEach(page => page.style.top = '100%');
}

// Fonctions d'aide pour l'animation de chargement
function hideLoadingAnimation() {
    const loadingAnimation = document.getElementById('loading-animation');
    loadingAnimation.style.opacity = '0';
    setTimeout(() => loadingAnimation.style.display = 'none', 1000);
}

function showLoadingAnimation() {
    const loadingAnimation = document.getElementById('loading-animation');
    loadingAnimation.style.display = 'flex';
    setTimeout(() => loadingAnimation.style.opacity = '1', 10);
}

// Gestion de l'animation de chargement au chargement de la page et lors du retour
window.addEventListener('load', () => setTimeout(hideLoadingAnimation, 2000));
window.addEventListener('pageshow', (event) => {
    resetTransitionPages();
    if (event.persisted) {
        showLoadingAnimation();
        setTimeout(hideLoadingAnimation, 2000);
    }
});

// Génération et animation de flocons de neige
function createSnowflake() {
    const snowflake = document.createElement('div');
    snowflake.classList.add('snowflake');
    Object.assign(snowflake.style, {
        width: `${Math.random() * 5 + 5}px`,
        height: `${Math.random() * 5 + 5}px`,
        right: `${Math.random() * window.innerWidth}px`,
        animationDuration: `${Math.random() * 3 + 2}s`,
        animationName: 'fall',
        animationIterationCount: '1'
    });

    const snowContainer = document.getElementById('snow-container');
    snowContainer.appendChild(snowflake);
    setTimeout(() => snowflake.remove(), 5000);
}
setInterval(createSnowflake, 100);

document.addEventListener('DOMContentLoaded', setupSocialMediaTransitions);

// Gestion des transitions de page et des liens des médias sociaux
function setupSocialMediaTransitions() {
    const card = document.querySelector('.profile-card');
    const socialMediaLinks = document.querySelectorAll('.social-media a');

    socialMediaLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const platform = link.querySelector('iconify-icon').getAttribute('icon').split(':')[1];
            const transitionPage = document.getElementById(`${platform}Page`);
            if (transitionPage) {
                transitionPage.style.top = '0';
                setTimeout(() => window.location.href = link.href, 1500);
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', setupSocialMediaTransitions);

// Gestion de l'effet 3D pour la carte sur les appareils non tactiles
function setupCard3DEffect(card) {
    document.addEventListener('mousemove', (e) => {
        const [widthCenter, heightCenter] = [window.innerWidth / 2, window.innerHeight / 2];
        const [rotateX, rotateY] = [(e.clientY - heightCenter) / heightCenter * 20, (e.clientX - widthCenter) / widthCenter * 20];
        card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener('mouseleave', () => card.style.transform = 'rotateY(0deg) rotateX(0deg)');
}

// Gestion de l'affichage de l'âge
function toggleAgeDisplay() {
    const ageText = document.getElementById("ageText");
    ageText.classList.toggle('visible');
    ageText.style.transform = ageText.classList.contains('visible') ? 'translate(50%, -50%)' : 'translate(-50%, 50%)';
}

// Calcul et mise à jour de l'âge
function calculateAge(birthDate) {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDifference = today.getMonth() - birth.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    return age;
}

function updateAge(birthDate) {
    const age = calculateAge(birthDate);
    document.getElementById("ageText").textContent = `${age}yo`;
}

// Initialisation des effets spéciaux
document.addEventListener('DOMContentLoaded', () => {
    const card = document.querySelector('.profile-card');
    if (!('ontouchstart' in window || navigator.maxTouchPoints)) {
        setupCard3DEffect(card);
    }
    updateAge('2003-06-30');
});