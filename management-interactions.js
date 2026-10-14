(() => {
  const page = document.querySelector('#page');
  const canvas = page.querySelector('.hero-fluid');
  page.prepend(canvas);

  const title = page.querySelector('.hero-fixed-title');
  const titleLine = document.createElement('span');
  titleLine.className = 'hero-title-line';
  titleLine.innerHTML = '<span>从关键视觉</span><span>到团队<em>交付</em></span>';
  const titleTrack = document.createElement('span');
  titleTrack.className = 'hero-title-track';
  const repeat = titleLine.cloneNode(true);
  repeat.setAttribute('aria-hidden', 'true');
  titleTrack.append(titleLine, repeat);
  title.replaceChildren(titleTrack);

  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(pointer: fine)');
  const hero = page.querySelector('.hero');
  const heroObserver = new IntersectionObserver(entries => {
    hero.classList.toggle('is-visible', entries[0].isIntersecting);
  }, { threshold: 0 });
  heroObserver.observe(hero);
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      entry.target.classList.toggle('is-visible', entry.isIntersecting);
    });
  }, { threshold: .06, rootMargin: '0px 0px -12% 0px' });
  page.querySelectorAll('#decisions,#transfer,.end').forEach(node => {
    node.classList.add('cover-enter');
    observer.observe(node);
  });
  const imageObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.intersectionRatio >= .2) entry.target.classList.add('is-visible');
      else if (!entry.isIntersecting) entry.target.classList.remove('is-visible');
    });
  }, { threshold: [0, .2], rootMargin: '0px 0px -10% 0px' });
  page.querySelectorAll('.artifact,.proof-images figure').forEach(node => imageObserver.observe(node));
  page.classList.add('motion-ready');

  const verticalProgress = document.createElement('div');
  verticalProgress.className = 'management-progress-vertical';
  verticalProgress.setAttribute('aria-hidden', 'true');
  const bottomProgress = document.createElement('div');
  bottomProgress.className = 'management-progress-bottom';
  bottomProgress.setAttribute('aria-hidden', 'true');
  bottomProgress.innerHTML = '<span></span>';
  page.append(verticalProgress, bottomProgress);
  let progressIdle;
  function updateProgress() {
    const max = document.documentElement.scrollHeight - innerHeight;
    const ratio = max > 0 ? Math.min(1, scrollY / max) : 0;
    verticalProgress.style.transform = `translateY(${ratio * (innerHeight - verticalProgress.offsetHeight)}px)`;
    bottomProgress.style.setProperty('--green-width', `${20 + ratio * 80}%`);
    bottomProgress.style.setProperty('--blue-width', `${20 * (1 - ratio)}%`);
    verticalProgress.classList.add('is-scrolling');
    clearTimeout(progressIdle);
    progressIdle = setTimeout(() => verticalProgress.classList.remove('is-scrolling'), 1100);
  }
  addEventListener('scroll', updateProgress, { passive: true });
  addEventListener('resize', updateProgress);
  updateProgress();

  if (reducedMotion.matches || !finePointer.matches) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const field = document.createElement('canvas');
  const fieldCtx = field.getContext('2d');
  const fw = 144, fh = 90, size = fw * fh;
  field.width = fw;
  field.height = fh;
  const density = new Float32Array(size);
  const pixels = fieldCtx.createImageData(fw, fh);
  let scale = 1, pattern, pointer = null, head = null, drops = [];
  let frame = 0, last = 0, release = 0, distance = 0;

  function resize() {
    scale = Math.min(devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(innerWidth * scale);
    canvas.height = Math.round(innerHeight * scale);
    const tile = document.createElement('canvas');
    tile.width = tile.height = Math.round(6 * scale);
    const tileCtx = tile.getContext('2d');
    tileCtx.scale(tile.width / 16, tile.height / 16);
    tileCtx.fillStyle = '#fff';
    tileCtx.beginPath();
    tileCtx.moveTo(8, 5);
    tileCtx.bezierCurveTo(2, -1, -1, 2, 5, 8);
    tileCtx.bezierCurveTo(-1, 14, 2, 17, 8, 11);
    tileCtx.bezierCurveTo(14, 17, 17, 14, 11, 8);
    tileCtx.bezierCurveTo(17, 2, 14, -1, 8, 5);
    tileCtx.closePath();
    tileCtx.fill();
    pattern = ctx.createPattern(tile, 'repeat');
  }
  addEventListener('resize', resize);
  resize();

  function addDrop(drop, radius, weight, stretch, time) {
    const angle = Math.atan2(drop.vy, drop.vx), cs = Math.cos(angle), sn = Math.sin(angle);
    const aspect = canvas.height / fh / (canvas.width / fw), ry = radius / aspect;
    for (let y = Math.max(0, Math.floor(drop.y - ry * 1.6)); y < Math.min(fh, drop.y + ry * 1.6); y++) {
      for (let x = Math.max(0, Math.floor(drop.x - radius * 1.6)); x < Math.min(fw, drop.x + radius * 1.6); x++) {
        const dx = x - drop.x, dy = (y - drop.y) * aspect;
        const u = (dx * cs + dy * sn) / (radius * stretch);
        const v = (-dx * sn + dy * cs) / (radius / stretch);
        const edge = 1 + .075 * Math.sin(Math.atan2(v, u) * 3 + time * 2.1) + .04 * Math.sin(time * 3.2 + v * 4);
        density[y * fw + x] += Math.exp(-(u * u + v * v) * 2.8 / (edge * edge)) * weight;
      }
    }
  }

  function clear() {
    cancelAnimationFrame(frame);
    frame = 0; last = 0; pointer = null; head = null; drops = []; distance = 0;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  function tick(time) {
    frame = 0;
    if (!page.classList.contains('open') || document.hidden || reducedMotion.matches || !finePointer.matches) { clear(); return; }
    const dt = Math.min(.05, (time - (last || time - 16.7)) / 1000);
    last = time;
    density.fill(0);
    let energy = 0;
    if (head) {
      const target = pointer || head, k = 1 - Math.exp(-dt / .035);
      head.x += (target.x - head.x) * k;
      head.y += (target.y - head.y) * k;
      const lag = Math.hypot(target.x - head.x, target.y - head.y);
      if (lag > 7) { head.x = target.x + (head.x - target.x) * 7 / lag; head.y = target.y + (head.y - target.y) * 7 / lag; }
      const age = Math.min(1, Math.max(0, (time - head.moved - 130) / 1200));
      const fade = 1 - age * age * (3 - 2 * age), speed = Math.hypot(head.vx, head.vy);
      addDrop(head, 20 + Math.min(3, speed * .018), fade, 1 + Math.min(.3, speed * .002), time / 1000);
      head.vx *= Math.exp(-dt * 8); head.vy *= Math.exp(-dt * 8);
    }
    drops = drops.filter(drop => time - drop.born < 980);
    for (const drop of drops) {
      const age = Math.max(0, (time - drop.born - 80) / 900);
      drop.x += drop.vx * dt; drop.y += drop.vy * dt;
      drop.vx *= Math.exp(-dt * 7); drop.vy *= Math.exp(-dt * 7);
      addDrop(drop, drop.radius * (1 - .12 * age), .78 * Math.pow(1 - age, 1.1), 1 + .26 * (1 - age), time / 1000 + drop.born);
    }
    const overHero = hero.getBoundingClientRect().bottom > 0;
    const color = overHero ? [20, 20, 215] : [4, 0, 255], strength = overHero ? 175 : 245;
    for (let i = 0; i < size; i++) {
      const j = i * 4, a = Math.min(1, Math.max(0, (density[i] - .018) / .85));
      pixels.data[j] = color[0]; pixels.data[j + 1] = color[1]; pixels.data[j + 2] = color[2];
      pixels.data[j + 3] = a * a * (3 - 2 * a) * strength;
      energy += pixels.data[j + 3];
    }
    fieldCtx.putImageData(pixels, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(field, 0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = 'destination-in';
    ctx.fillStyle = pattern;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = 'source-over';
    if (energy > 1) frame = requestAnimationFrame(tick);
    else { ctx.clearRect(0, 0, canvas.width, canvas.height); last = 0; }
  }

  document.addEventListener('pointermove', event => {
    if (!page.classList.contains('open') || event.pointerType === 'touch') return;
    const x = event.clientX / innerWidth * fw, y = event.clientY / innerHeight * fh;
    const now = performance.now(), dx = pointer ? x - pointer.x : 0, dy = pointer ? y - pointer.y : 0;
    const seconds = pointer ? Math.max(.008, (now - pointer.time) / 1000) : .016;
    const speed = Math.hypot(dx, dy) / seconds, cap = speed > 180 ? 180 / speed : 1;
    const vx = dx / seconds * cap, vy = dy / seconds * cap;
    if (!head) head = { x, y, vx, vy, moved: now };
    distance += Math.hypot(dx, dy);
    if (distance > 17 && now - release > 110) {
      drops.push({ x: head.x, y: head.y, vx: head.vx * .13, vy: head.vy * .13, radius: 12 + (drops.length % 2) * 2, born: now });
      if (drops.length > 10) drops.shift();
      release = now; distance = 0;
    }
    head.vx = vx; head.vy = vy; head.moved = now;
    pointer = { x, y, time: now };
    if (!frame) frame = requestAnimationFrame(tick);
  }, { passive: true });
  document.addEventListener('pointerleave', () => { pointer = null; }, { passive: true });
  reducedMotion.addEventListener('change', () => { if (reducedMotion.matches) clear(); });
})();
