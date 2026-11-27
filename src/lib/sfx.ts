const SFX_STORAGE_KEY = 'sukamcd_sfx_enabled';

let audioCtx: AudioContext | null = null;
let unlockHooked = false;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return null;
    audioCtx = new Ctx();
  }
  return audioCtx;
}

function ensureUnlocked(): void {
  if (typeof window === 'undefined' || unlockHooked) return;
  unlockHooked = true;
  const unlock = () => {
    const ctx = getAudioContext();
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
  };
  window.addEventListener('pointerdown', unlock, { passive: true });
  window.addEventListener('keydown', unlock, { passive: true });
}

if (typeof window !== 'undefined') {
  ensureUnlocked();
}

function withAudio(fn: (ctx: AudioContext, now: number) => void): void {
  const ctx = getAudioContext();
  if (!ctx) return;
  if (ctx.state === 'suspended') {
    ctx
      .resume()
      .then(() => fn(ctx, ctx.currentTime))
      .catch(() => {});
  } else {
    fn(ctx, ctx.currentTime);
  }
}

export function isSfxEnabled(): boolean {
  return typeof window !== 'undefined';
}

export function setSfxEnabled(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SFX_STORAGE_KEY, String(enabled));
  } catch {}
  window.dispatchEvent(new CustomEvent('sfx-change', { detail: enabled }));
}

export function toggleSfx(): boolean {
  const next = !isSfxEnabled();
  setSfxEnabled(next);
  if (next) {
    playClick(true);
  }
  return next;
}

export function playClick(force = false): void {
  if (!force && !isSfxEnabled()) return;
  withAudio((ctx, now) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1050, now);
    osc.frequency.exponentialRampToValueAtTime(280, now + 0.04);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.048);
  });
}

export function playTabFlip(): void {
  if (!isSfxEnabled()) return;
  withAudio((ctx, now) => {
    const bufferSize = Math.floor(ctx.sampleRate * 0.055);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.35));
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1500, now);
    filter.Q.setValueAtTime(1.2, now);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.16, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.055);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start(now);
  });
}

export function playThemeSwitch(toDark: boolean): void {
  if (!isSfxEnabled()) return;
  withAudio((ctx, now) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(toDark ? 480 : 320, now);
    osc.frequency.exponentialRampToValueAtTime(toDark ? 290 : 540, now + 0.085);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.095);
  });
}

export function playModalOpen(): void {
  if (!isSfxEnabled()) return;
  withAudio((ctx, now) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(260, now);
    osc.frequency.exponentialRampToValueAtTime(580, now + 0.06);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.065);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.07);
  });
}

export function playModalClose(): void {
  if (!isSfxEnabled()) return;
  withAudio((ctx, now) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(460, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.055);

    gain.gain.setValueAtTime(0.14, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.065);
  });
}
