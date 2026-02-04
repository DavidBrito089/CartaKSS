// Elementos del DOM
const envelopeContainer = document.getElementById('envelope');
const blurOverlay = document.getElementById('blurOverlay');
const expandedLetter = document.getElementById('expandedLetter');
const closeBtn = document.getElementById('closeBtn');
const container = document.querySelector('.container');
const bgDecoration = document.getElementById('bgDecoration');

// Estado de la carta
let isOpen = false;

// Evento de clic en el sobre
envelopeContainer.addEventListener('click', openEnvelope);

// Evento para cerrar
closeBtn.addEventListener('click', closeEnvelope);
blurOverlay.addEventListener('click', closeEnvelope);

function openEnvelope() {
    if (isOpen) return;
    isOpen = true;

    // Abrir el sobre
    envelopeContainer.classList.add('opened');

    // Crear efecto de partículas
    createSparkles();

    // Después de un breve momento, mostrar la carta expandida
    // Esperamos 2500ms: ~1s para que salga la carta + 1.5s de pausa para que se vea bien la "Gift Card"
    setTimeout(() => {
        // Activar desenfoque y carta expandida
        blurOverlay.classList.add('active');
        expandedLetter.classList.add('active');
        container.classList.add('blurred');
        bgDecoration.classList.add('blurred');

        // Ocultar suavemente el sobre original para evitar duplicados visuales
        setTimeout(() => {
            envelopeContainer.style.opacity = '0';
            envelopeContainer.style.pointerEvents = 'none';
        }, 300);

    }, 2500); // Pausa solicitada por el usuario
}

function closeEnvelope() {
    if (!isOpen) return;

    // Restaurar visibilidad del sobre antes de cerrar
    envelopeContainer.style.opacity = '1';
    envelopeContainer.style.pointerEvents = 'auto';

    // Ocultar carta expandida
    expandedLetter.classList.remove('active');
    blurOverlay.classList.remove('active');
    container.classList.remove('blurred');
    bgDecoration.classList.remove('blurred');

    // Cerrar el sobre después de que termine la transición de salida
    setTimeout(() => {
        envelopeContainer.classList.remove('opened');
        isOpen = false;
    }, 500);
}

// Crear efecto de partículas brillantes cuando se abre
function createSparkles() {
    const sparkleContainer = document.createElement('div');
    sparkleContainer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        overflow: visible;
        z-index: 10;
    `;

    envelopeContainer.appendChild(sparkleContainer);

    // Crear varias partículas
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const sparkle = document.createElement('div');
            const x = Math.random() * 100;
            const y = Math.random() * 50;
            const size = Math.random() * 10 + 6;
            const duration = Math.random() * 1.5 + 0.8;

            sparkle.innerHTML = ['✨', '⭐', '💫', '✦', '💕'][Math.floor(Math.random() * 5)];
            sparkle.style.cssText = `
                position: absolute;
                left: ${x}%;
                top: ${y}%;
                font-size: ${size}px;
                animation: sparkleFloat ${duration}s ease-out forwards;
                opacity: 0;
            `;

            sparkleContainer.appendChild(sparkle);

            // Remover partícula después de la animación
            setTimeout(() => sparkle.remove(), duration * 1000);
        }, i * 80);
    }

    // Remover contenedor después de todas las animaciones
    setTimeout(() => sparkleContainer.remove(), 3000);
}

// Agregar estilos de animación dinámicamente
const style = document.createElement('style');
style.textContent = `
    @keyframes sparkleFloat {
        0% {
            opacity: 0;
            transform: translateY(0) scale(0);
        }
        20% {
            opacity: 1;
            transform: translateY(-20px) scale(1);
        }
        100% {
            opacity: 0;
            transform: translateY(-80px) scale(0.5);
        }
    }
`;
document.head.appendChild(style);

// Efecto de hover suave en el sobre
envelopeContainer.addEventListener('mouseenter', () => {
    if (!isOpen) {
        const heartSeal = document.getElementById('heartSeal');
        if (heartSeal) {
            heartSeal.style.transform = 'translate(-50%, -50%) scale(1.2)';
        }
    }
});

envelopeContainer.addEventListener('mouseleave', () => {
    if (!isOpen) {
        const heartSeal = document.getElementById('heartSeal');
        if (heartSeal) {
            heartSeal.style.transform = 'translate(-50%, -50%) scale(1)';
        }
    }
});

// Agregar efecto de tecla Enter o Espacio para accesibilidad
envelopeContainer.setAttribute('tabindex', '0');
envelopeContainer.setAttribute('role', 'button');
envelopeContainer.setAttribute('aria-label', 'Presione para abrir la carta');

envelopeContainer.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openEnvelope();
    }
});

// Cerrar con tecla Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) {
        closeEnvelope();
    }
});

// Animación inicial al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    // Pequeña animación de entrada
    envelopeContainer.style.opacity = '0';
    envelopeContainer.style.transform = 'translateY(30px)';

    setTimeout(() => {
        envelopeContainer.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        envelopeContainer.style.opacity = '1';
        envelopeContainer.style.transform = 'translateY(0)';
    }, 300);
});

// Prevenir scroll del body cuando la carta está abierta
expandedLetter.addEventListener('wheel', (e) => {
    e.stopPropagation();
});

// Contador Regresivo
function updateCountdown() {
    // Fecha objetivo: 07/02/2026 09:00 AM
    const targetDate = new Date('2026-02-07T09:00:00').getTime();

    function update() {
        const now = new Date().getTime();
        const distance = targetDate - now;

        if (distance < 0) {
            // Si ya pasó la fecha
            document.getElementById('days').textContent = '00';
            document.getElementById('hours').textContent = '00';
            document.getElementById('minutes').textContent = '00';
            document.getElementById('seconds').textContent = '00';
            return;
        }

        // Calcular tiempo restante
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Formatear con ceros a la izquierda
        document.getElementById('days').textContent = String(days).padStart(2, '0');
        document.getElementById('hours').textContent = String(hours).padStart(2, '0');
        document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
    }

    // Actualizar inmediatamente
    update();

    // Actualizar cada segundo
    setInterval(update, 1000);
}

// Iniciar contador cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    updateCountdown();
    initMusicPlayer();
});

// Reproductor de Música
function initMusicPlayer() {
    const audio = document.getElementById('audioPlayer');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const playIcon = playPauseBtn.querySelector('.play-icon');
    const pauseIcon = playPauseBtn.querySelector('.pause-icon');
    const progressBar = document.getElementById('progressBar');
    const progressFill = document.getElementById('progressFill');
    const currentTimeDisplay = document.getElementById('currentTime');
    const durationDisplay = document.getElementById('duration');
    const volumeBtn = document.getElementById('volumeBtn');

    let isPlaying = false;

    // Formatear tiempo
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    // Play/Pause
    playPauseBtn.addEventListener('click', () => {
        if (isPlaying) {
            audio.pause();
            playIcon.style.display = 'block';
            pauseIcon.style.display = 'none';
        } else {
            audio.play();
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'block';
        }
        isPlaying = !isPlaying;
    });

    // Actualizar duración cuando se carga
    audio.addEventListener('loadedmetadata', () => {
        durationDisplay.textContent = formatTime(audio.duration);
    });

    // Actualizar progreso
    audio.addEventListener('timeupdate', () => {
        const progress = (audio.currentTime / audio.duration) * 100;
        progressFill.style.width = `${progress}%`;
        currentTimeDisplay.textContent = formatTime(audio.currentTime);
    });

    // Hacer click en la barra de progreso
    progressBar.addEventListener('click', (e) => {
        const rect = progressBar.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const percentage = clickX / rect.width;
        audio.currentTime = percentage * audio.duration;
    });

    // Cuando la canción termina
    audio.addEventListener('ended', () => {
        isPlaying = false;
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
        progressFill.style.width = '0%';
        audio.currentTime = 0;
    });

    // Control de volumen
    let isMuted = false;
    volumeBtn.addEventListener('click', () => {
        isMuted = !isMuted;
        audio.muted = isMuted;
        volumeBtn.querySelector('.volume-icon').textContent = isMuted ? '🔇' : '🔊';
    });
}
