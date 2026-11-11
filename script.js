const stars = document.getElementById("stars");
const starCount = window.innerWidth < 600 ? 75 : 130;

for (let i = 0; i < starCount; i++) {
  const star = document.createElement("span");
  star.className = "star";
  star.style.left = `${Math.random() * 100}%`;
  star.style.top = `${Math.random() * 100}%`;
  star.style.setProperty("--duration", `${2 + Math.random() * 4}s`);
  star.style.animationDelay = `${Math.random() * 4}s`;
  if (Math.random() > 0.8) {
    star.style.width = "3px";
    star.style.height = "3px";
  }
  stars.appendChild(star);
}

function makeHeart(x, y) {
  const heart = document.createElement("span");
  heart.className = "floating-heart";
  heart.textContent = Math.random() > 0.5 ? "♡" : "✦";
  heart.style.left = `${x}px`;
  heart.style.top = `${y}px`;
  heart.style.fontSize = `${14 + Math.random() * 17}px`;
  document.body.appendChild(heart);
  setTimeout(() => heart.remove(), 1800);
}

document.getElementById("openLetter").addEventListener("click", () => {
  document.getElementById("carta").scrollIntoView({ behavior: "smooth" });
  const rect = document.getElementById("openLetter").getBoundingClientRect();
  for (let i = 0; i < 9; i++) {
    setTimeout(() => makeHeart(rect.left + rect.width / 2 + (Math.random() - .5) * 90, rect.top), i * 65);
  }
});

document.getElementById("wishButton").addEventListener("click", (event) => {
  document.getElementById("wishReveal").classList.add("show");
  const rect = event.currentTarget.getBoundingClientRect();
  for (let i = 0; i < 18; i++) {
    setTimeout(() => makeHeart(rect.left + rect.width / 2 + (Math.random() - .5) * 180, rect.top + 10), i * 45);
  }
  const toast = document.getElementById("toast");
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2600);
});

// Música ambiental opcional: crea un tono suave usando Web Audio, sin archivos externos.
// El navegador solo permite iniciarla después de que la persona pulse el botón.
let audioContext = null;
let oscillators = [];
let musicOn = false;
const musicButton = document.getElementById("musicToggle");

function startAmbientMusic() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) {
    musicButton.querySelector(".music-label").textContent = "No disponible";
    return;
  }
  audioContext = new AudioContext();
  const master = audioContext.createGain();
  master.gain.value = 0.025;
  master.connect(audioContext.destination);

  // Acorde ambiental suave; no reproduce una canción comercial.
  [261.63, 329.63, 392.00, 523.25].forEach((frequency, index) => {
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = frequency;
    gain.gain.value = index === 0 ? 0.30 : 0.13;
    oscillator.connect(gain);
    gain.connect(master);
    oscillator.start();
    oscillators.push(oscillator);
  });
  musicOn = true;
  musicButton.querySelector(".music-label").textContent = "Pausar";
  musicButton.setAttribute("aria-label", "Pausar música ambiental");
}

function stopAmbientMusic() {
  oscillators.forEach(oscillator => {
    try { oscillator.stop(); } catch (_) {}
  });
  oscillators = [];
  if (audioContext) {
    audioContext.close();
    audioContext = null;
  }
  musicOn = false;
  musicButton.querySelector(".music-label").textContent = "Música";
  musicButton.setAttribute("aria-label", "Activar música ambiental");
}

musicButton.addEventListener("click", () => {
  if (musicOn) stopAmbientMusic();
  else startAmbientMusic();
});

document.addEventListener("click", (event) => {
  if (event.target.closest("button")) return;
  if (Math.random() > 0.55) makeHeart(event.clientX, event.clientY);
});
