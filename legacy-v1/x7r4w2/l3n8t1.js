// Wait for DOM to be ready
function initGame() {
  const canvas = document.getElementById("c3v7x1");
  const ctx = canvas.getContext("2d");
  const scoreElement = document.getElementById("score");
  const gameOverElement = document.getElementById("game-over");

  if (!canvas || !ctx) {
    console.error("Canvas not found!");
    return;
  }

  let score = 0;
  let gameActive = true;
  let animationId;

  // Initialize character first with default values
  const _0x8b2e = {
    x: 50,
    y: 0,
    width: 40,
    height: 40,
    color: "#00f2ff",
    dy: 0,
    jumpForce: 12,
    gravity: 0.6,
    grounded: false,
  };

  // Responsive canvas sizing
  function resizeCanvas() {
    const container = document.getElementById("game-container");
    const isMobile = window.innerWidth <= 768;
    const padding = isMobile ? 40 : 60;
    const maxWidth = Math.min(800, window.innerWidth - padding);
    // Aspect ratio lebih kecil di mobile untuk membuat canvas lebih tinggi
    const aspectRatio = isMobile ? 3 : 4; // width:height ratio (3:1 di mobile, 4:1 di desktop)
    
    canvas.width = maxWidth;
    canvas.height = maxWidth / aspectRatio;
    
    // Adjust character size for mobile
    if (isMobile) {
      // Increase character size for mobile - lebih tinggi dan lebih besar
      _0x8b2e.width = Math.max(35, maxWidth / 15);
      _0x8b2e.height = Math.max(35, maxWidth / 15);
      _0x8b2e.x = 30;
      // Slightly increase jump force for mobile to help clear obstacles
      _0x8b2e.jumpForce = 13;
    } else {
      _0x8b2e.width = 40;
      _0x8b2e.height = 40;
      _0x8b2e.x = 50;
      _0x8b2e.jumpForce = 12;
    }
    
    // Update character position based on new canvas height
    _0x8b2e.y = canvas.height - _0x8b2e.height - 10;
    _0x8b2e.grounded = true;
    _0x8b2e.dy = 0;
  }

  // Initialize canvas size after character is defined
  resizeCanvas();

  // Update canvas on window resize
  window.addEventListener("resize", () => {
    resizeCanvas();
  });

  const obstacles = [];
  let obstacleTimer = 0;
  const isMobile = window.innerWidth <= 768;
  let speed = isMobile ? 5 : 6; // Sedikit lebih lambat di mobile untuk memberikan lebih banyak waktu

  function _0xf6d1() {
    ctx.fillStyle = _0x8b2e.color;
    ctx.shadowBlur = 10;
    ctx.shadowColor = _0x8b2e.color;
    ctx.fillRect(_0x8b2e.x, _0x8b2e.y, _0x8b2e.width, _0x8b2e.height);
    ctx.shadowBlur = 0;
  }

  function createObstacle() {
    const isMobile = window.innerWidth <= 768;
    const obstacleWidth = isMobile ? 15 : 20;
    
    // Limit obstacle height for mobile - maksimal 40% dari tinggi canvas
    let maxHeight;
    if (isMobile) {
      maxHeight = canvas.height * 0.4; // Maksimal 40% dari tinggi canvas
      const minHeight = canvas.height * 0.15; // Minimal 15% dari tinggi canvas
      const height = minHeight + Math.random() * (maxHeight - minHeight);
      
      obstacles.push({
        x: canvas.width,
        y: canvas.height - height,
        width: obstacleWidth,
        height: height,
        color: "#ff0055",
      });
    } else {
      const baseHeight = 30;
      const randomHeight = 40;
      const height = baseHeight + Math.random() * randomHeight;
      
      obstacles.push({
        x: canvas.width,
        y: canvas.height - height,
        width: obstacleWidth,
        height: height,
        color: "#ff0055",
      });
    }
  }

  function drawObstacles() {
    obstacles.forEach((obs) => {
      ctx.fillStyle = obs.color;
      ctx.shadowBlur = 10;
      ctx.shadowColor = obs.color;
      ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
      ctx.shadowBlur = 0;
    });
  }

  function updateObstacles() {
  for (let i = obstacles.length - 1; i >= 0; i--) {
    obstacles[i].x -= speed;

    // Collision check
    if (
      _0x8b2e.x < obstacles[i].x + obstacles[i].width &&
      _0x8b2e.x + _0x8b2e.width > obstacles[i].x &&
      _0x8b2e.y < obstacles[i].y + obstacles[i].height &&
      _0x8b2e.y + _0x8b2e.height > obstacles[i].y
    ) {
      gameActive = false;
      gameOver();
    }

    if (obstacles[i].x + obstacles[i].width < 0) {
      obstacles.splice(i, 1);
      score++;
      scoreElement.innerText = score;
      // Increase difficulty lebih lambat di mobile
      const isMobile = window.innerWidth <= 768;
      if (score % 5 === 0) {
        speed += isMobile ? 0.15 : 0.2; // Peningkatan lebih lambat di mobile
      }
    }
  }
}

  function jump() {
    if (_0x8b2e.grounded && gameActive) {
      _0x8b2e.dy = -_0x8b2e.jumpForce;
      _0x8b2e.grounded = false;
    } else if (!gameActive) {
      restart();
    }
  }

  function update() {
  if (!gameActive) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Character Physics
  _0x8b2e.dy += _0x8b2e.gravity;
  _0x8b2e.y += _0x8b2e.dy;

  // Ensure character stays within canvas bounds
  if (_0x8b2e.y + _0x8b2e.height > canvas.height) {
    _0x8b2e.y = canvas.height - _0x8b2e.height;
    _0x8b2e.dy = 0;
    _0x8b2e.grounded = true;
  }
  
  // Ensure character doesn't go above canvas
  if (_0x8b2e.y < 0) {
    _0x8b2e.y = 0;
    _0x8b2e.dy = 0;
  }

  // Base Line Decoration
  ctx.strokeStyle = "rgba(0, 242, 255, 0.2)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, canvas.height - 2);
  ctx.lineTo(canvas.width, canvas.height - 2);
  ctx.stroke();

  _0xf6d1();

  // Generator logic - lebih banyak jarak antar rintangan di mobile
  obstacleTimer++;
  const isMobile = window.innerWidth <= 768;
  const obstacleInterval = isMobile ? 120 - speed * 1.5 : 100 - speed * 2; // Lebih banyak jarak di mobile
  if (obstacleTimer > obstacleInterval) {
    createObstacle();
    obstacleTimer = 0;
  }

  updateObstacles();
  drawObstacles();

  animationId = requestAnimationFrame(update);
}

  function gameOver() {
    cancelAnimationFrame(animationId);
    gameOverElement.style.display = "block";
  }

  function restart() {
    score = 0;
    const isMobile = window.innerWidth <= 768;
    speed = isMobile ? 5 : 6; // Reset speed sesuai platform
    obstacles.length = 0;
    gameActive = true;
    gameOverElement.style.display = "none";
    scoreElement.innerText = "0";
    // Reset character position
    _0x8b2e.y = canvas.height - _0x8b2e.height - 10;
    _0x8b2e.dy = 0;
    _0x8b2e.grounded = true;
    update();
  }

  window.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
      e.preventDefault();
      jump();
    }
  });

  // Touch support for mobile
  let touchStartY = 0;
  let touchEndY = 0;

  window.addEventListener("touchstart", (e) => {
    e.preventDefault();
    touchStartY = e.touches[0].clientY;
    jump();
  }, { passive: false });

  window.addEventListener("touchend", (e) => {
    e.preventDefault();
    if (e.changedTouches && e.changedTouches.length > 0) {
      touchEndY = e.changedTouches[0].clientY;
    }
  }, { passive: false });

  // Prevent double-tap zoom on mobile
  let lastTouchEnd = 0;
  document.addEventListener("touchend", (e) => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
      e.preventDefault();
    }
    lastTouchEnd = now;
  }, false);

  // Start game loop
  update();
}

// Initialize game when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initGame);
} else {
  initGame();
}
