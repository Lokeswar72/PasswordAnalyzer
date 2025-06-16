const passwordInput = document.getElementById('password');
const strengthText = document.getElementById('strength-text');
const crackTimeText = document.getElementById('crack-time');
const barFill = document.getElementById('bar-fill');
const checkBtn = document.getElementById('check-btn');
const togglePassword = document.getElementById('toggle-password');

checkBtn.addEventListener('click', () => {
  const password = passwordInput.value.trim();
  
  // Check if password is empty
  if (!password) {
    // Add glitch effect to input to indicate error
    passwordInput.classList.add('glitch');
    setTimeout(() => {
        passwordInput.classList.remove('glitch');
    }, 300);
    
    // Show error message
    updateStrengthText('ERROR: PASSWORD REQUIRED ⚠️');
    crackTimeText.textContent = 'WAITING FOR INPUT...';
    
    // Reset progress bar
    barFill.style.width = "0%";
    barFill.style.backgroundColor = "#ff0000";
    return;
  }

  const score = calculateStrength(password);
  const crackTime = estimateCrackTime(password);

  const strengths = ["CRITICAL", "WEAK", "MODERATE", "STRONG", "MAXIMUM"];
  const colors = ["#ff0000", "#ff4d00", "#ffff00", "#00ff00", "#00ff99"];
  const widths = ["20%", "40%", "60%", "80%", "100%"];

  updateStrengthText(`SECURITY LEVEL: ${strengths[score]}`);
  crackTimeText.textContent = `ESTIMATED CRACK TIME: ${crackTime}`;
  
  // Animate the bar fill
  barFill.style.width = "0%";
  setTimeout(() => {
      barFill.style.width = widths[score];
      barFill.style.backgroundColor = colors[score];
  }, 100);

  // Add glitch effect
  container.style.transform = "glitch(5)";
  setTimeout(() => {
      container.style.transform = "none";
  }, 200);
});

togglePassword.addEventListener('click', function() {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    
    // Add glitch animation to input
    passwordInput.classList.add('glitch');
    setTimeout(() => {
        passwordInput.classList.remove('glitch');
    }, 300);
    
    // Update toggle button state with matrix effect
    this.setAttribute('data-visible', type === 'text');
    this.querySelector('.eye-icon').textContent = type === 'text' ? '[X]' : '[/]';
    
    // Add glitch effect to button
    this.style.transform = 'scale(1.2) rotate(15deg)';
    this.style.textShadow = '0 0 15px #0f0';
    
    setTimeout(() => {
        this.style.transform = 'scale(1) rotate(0deg)';
        this.style.textShadow = '0 0 5px #0f0';
    }, 200);
    
    // Add matrix effect burst
    const burst = document.createElement('div');
    burst.className = 'matrix-burst';
    this.appendChild(burst);
    setTimeout(() => burst.remove(), 500);
});

function calculateStrength(password) {
    let score = 0;
    const minLength = 8;
    const goodLength = 12;
    const excellentLength = 16;

    // Length check
    if (password.length >= minLength) score += 1;
    if (password.length >= goodLength) score += 0.5;
    if (password.length >= excellentLength) score += 0.5;

    // Character variety checks
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    // Advanced patterns
    if (/[^A-Za-z0-9].*[^A-Za-z0-9]/.test(password)) score += 0.5; // Multiple special chars
    if (/[0-9].*[0-9]/.test(password)) score += 0.5; // Multiple numbers
    if (!/^[A-Za-z0-9]*$/.test(password)) score += 0.5; // Not just alphanumeric
    if (!/(.)\1\1/.test(password)) score += 0.5; // No triple repeating characters

    // Common patterns penalty
    if (/password/i.test(password)) score -= 2;
    if (/123/.test(password)) score -= 1;
    if (/qwerty/i.test(password)) score -= 1;
    if (/abc/i.test(password)) score -= 1;

    return Math.min(Math.floor(score), 4);
}

function estimateCrackTime(password) {
    const charset = getCharsetSize(password);
    const guessesPerSecond = 1e9; // 1 billion guesses per second
    
    // Additional factors
    let complexity = 1;
    
    // Add complexity for pattern variations
    if (/[^A-Za-z0-9]/.test(password)) complexity *= 1.5;
    if (/[A-Z].*[a-z]|[a-z].*[A-Z]/.test(password)) complexity *= 1.3;
    if (/\d.*[A-Za-z]|[A-Za-z].*\d/.test(password)) complexity *= 1.3;
    
    // Calculate total possible combinations
    const combinations = Math.pow(charset, password.length) * complexity;
    const seconds = combinations / guessesPerSecond;
    
    return formatTime(seconds);
}

function getCharsetSize(password) {
    let size = 0;
    if (/[a-z]/.test(password)) size += 26;
    if (/[A-Z]/.test(password)) size += 26;
    if (/[0-9]/.test(password)) size += 10;
    if (/[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(password)) size += 33;
    if (/[\u0080-\uFFFF]/.test(password)) size += 100; // Unicode characters
    return size || 26; // Default to lowercase if nothing matches
}

function formatTime(seconds) {
    if (seconds < 1) return "INSTANT CRACK! ⚠️";
    if (seconds < 60) return `${Math.round(seconds)} SECONDS ⚠️`;
    if (seconds < 3600) return `${Math.round(seconds / 60)} MINUTES 🔍`;
    if (seconds < 86400) return `${Math.round(seconds / 3600)} HOURS 🔍`;
    if (seconds < 2592000) return `${Math.round(seconds / 86400)} DAYS 🔒`;
    if (seconds < 31536000) return `${Math.round(seconds / 2592000)} MONTHS 🔒`;
    if (seconds < 315360000) return `${Math.round(seconds / 31536000)} YEARS 💪`;
    return "CENTURIES+ 🚀";
}

// Add Matrix background effect
const canvas = document.getElementById('matrix-bg');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*";
const fontSize = 14;
const columns = canvas.width / fontSize;
const drops = [];

for (let i = 0; i < columns; i++) {
    drops[i] = 1;
}

function drawMatrix() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#0F0";
    ctx.font = fontSize + "px monospace";

    for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        drops[i]++;
    }
}

// Handle window resize
function handleResize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    // Recalculate matrix columns
    const columns = canvas.width / fontSize;
    drops.length = 0;
    for (let i = 0; i < columns; i++) {
        drops[i] = 1;
    }
}

// Add resize event listener
window.addEventListener('resize', handleResize);

// Optimize matrix animation for mobile
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
const animationInterval = isMobile ? 100 : 50; // Slower refresh on mobile

// Update the matrix animation interval
setInterval(drawMatrix, animationInterval);

// Add typing effect to strength text
let currentTypingInterval = null;

function updateStrengthText(text) {
    // Clear any existing typing animation
    if (currentTypingInterval) {
        clearInterval(currentTypingInterval);
    }
    
    let i = 0;
    strengthText.textContent = "";
    
    currentTypingInterval = setInterval(() => {
        if (i < text.length) {
            strengthText.textContent += text.charAt(i);
            i++;
        } else {
            clearInterval(currentTypingInterval);
            currentTypingInterval = null;
        }
    }, 50);
}