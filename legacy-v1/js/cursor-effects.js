/**
 * Cursor Effects Module
 * Berisi Cursor Glow Logic dan ClickSpark
 * Gunakan dengan memanggil initCursorEffects() setelah DOM ready
 */

/**
 * ClickSpark - Vanilla JS Version
 * Creates spark effects on click
 */
class ClickSpark {
  constructor(options = {}) {
    this.sparkColor = options.sparkColor || "white";
    this.sparkSize = options.sparkSize || 10;
    this.sparkRadius = options.sparkRadius || 15;
    this.sparkCount = options.sparkCount || 8;
    this.duration = options.duration || 400;
    this.easing = options.easing || "ease-out";
    this.extraScale = options.extraScale || 1.0;

    this.sparks = [];
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");

    this.init();
  }

  init() {
    this.canvas.id = "click-spark-canvas";
    this.canvas.style.position = "fixed";
    this.canvas.style.top = "0";
    this.canvas.style.left = "0";
    this.canvas.style.pointerEvents = "none";
    this.canvas.style.zIndex = "9999";
    document.body.appendChild(this.canvas);

    this.handleResize();
    window.addEventListener("resize", () => this.handleResize());

    document.addEventListener("mousedown", (e) => this.handleClick(e));

    const animate = (timestamp) => {
      this.draw(timestamp);
      requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }

  handleResize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  easeFunc(t) {
    switch (this.easing) {
      case "linear":
        return t;
      case "ease-in":
        return t * t;
      case "ease-in-out":
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      default:
        return t * (2 - t);
    }
  }

  handleClick(e) {
    const now = performance.now();
    const newSparks = Array.from({ length: this.sparkCount }, (_, i) => ({
      x: e.clientX,
      y: e.clientY,
      angle: (2 * Math.PI * i) / this.sparkCount,
      startTime: now,
    }));
    this.sparks.push(...newSparks);
  }

  draw(timestamp) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.sparks = this.sparks.filter((spark) => {
      const elapsed = timestamp - spark.startTime;
      if (elapsed >= this.duration) return false;

      const progress = elapsed / this.duration;
      const eased = this.easeFunc(progress);

      const distance = eased * this.sparkRadius * this.extraScale;
      const lineLength = this.sparkSize * (1 - eased);

      const x1 = spark.x + distance * Math.cos(spark.angle);
      const y1 = spark.y + distance * Math.sin(spark.angle);
      const x2 = spark.x + (distance + lineLength) * Math.cos(spark.angle);
      const y2 = spark.y + (distance + lineLength) * Math.sin(spark.angle);

      this.ctx.strokeStyle = this.sparkColor;
      this.ctx.lineWidth = 2;
      this.ctx.lineCap = "round";
      this.ctx.beginPath();
      this.ctx.moveTo(x1, y1);
      this.ctx.lineTo(x2, y2);
      this.ctx.stroke();

      return true;
    });
  }
}

/**
 * Initialize Cursor Glow Effect
 */
function initCursorGlow() {
  // Cek apakah sudah ada cursor glow
  if (document.querySelector(".cursor-glow")) {
    return;
  }

  const glow = document.createElement("div");
  glow.className = "cursor-glow";
  document.body.appendChild(glow);

  // Menggunakan jQuery jika tersedia, jika tidak gunakan vanilla JS
  if (typeof $ !== "undefined") {
    $(document).on("mousemove", function (e) {
      const posX = e.clientX;
      const posY = e.clientY;
      glow.style.left = posX + "px";
      glow.style.top = posY + "px";
    });
  } else {
    document.addEventListener("mousemove", function (e) {
      const posX = e.clientX;
      const posY = e.clientY;
      glow.style.left = posX + "px";
      glow.style.top = posY + "px";
    });
  }
}

/**
 * Initialize ClickSpark Effect
 * @param {Object} options - Configuration options for ClickSpark
 */
function initClickSpark(options = {}) {
  const defaultOptions = {
    sparkColor: "white",
    sparkSize: 12,
    sparkRadius: 40,
    sparkCount: 10,
    duration: 500,
  };

  const config = { ...defaultOptions, ...options };
  return new ClickSpark(config);
}

/**
 * Initialize all cursor effects
 * @param {Object} clickSparkOptions - Options for ClickSpark (optional)
 */
function initCursorEffects(clickSparkOptions = {}) {
  initCursorGlow();
  initClickSpark(clickSparkOptions);
}

