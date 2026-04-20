// Adapted from Lil-Chen05/sustainify dashboard.js. Pure: (score) -> SVG string.

const WIDTH = 100;
const HEIGHT = 360;
const CENTER_X = WIDTH / 2;

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * Math.max(0, Math.min(1, t));
}

interface Pt {
  x: number;
  y: number;
}

function bezier(t: number, p0: Pt, p1: Pt, p2: Pt, p3: Pt): Pt {
  const cX = 3 * (p1.x - p0.x);
  const bX = 3 * (p2.x - p1.x) - cX;
  const aX = p3.x - p0.x - cX - bX;
  const cY = 3 * (p1.y - p0.y);
  const bY = 3 * (p2.y - p1.y) - cY;
  const aY = p3.y - p0.y - cY - bY;
  return {
    x: aX * t ** 3 + bX * t ** 2 + cX * t + p0.x,
    y: aY * t ** 3 + bY * t ** 2 + cY * t + p0.y,
  };
}

function tangentAngle(t: number, p0: Pt, p1: Pt, p2: Pt, p3: Pt): number {
  const dx =
    3 * (1 - t) ** 2 * (p1.x - p0.x) +
    6 * (1 - t) * t * (p2.x - p1.x) +
    3 * t * t * (p3.x - p2.x);
  const dy =
    3 * (1 - t) ** 2 * (p1.y - p0.y) +
    6 * (1 - t) * t * (p2.y - p1.y) +
    3 * t * t * (p3.y - p2.y);
  return (Math.atan2(dy, dx) * 180) / Math.PI;
}

function assetDefs(isDark: boolean): string {
  const vein = isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.15)";
  const petalStroke = isDark ? "#fff" : "#000";
  return `<defs>
    <symbol id="asset-leaf" viewBox="0 0 40 40">
      <path d="M 0 20 C 5 15, 15 5, 25 5 C 32 5, 38 12, 40 20 C 38 28, 32 35, 25 35 C 15 35, 5 25, 0 20 Z" fill="currentColor"/>
      <path d="M 0 20 C 10 20, 20 20, 40 20" stroke="${vein}" stroke-width="1.5" stroke-linecap="round" fill="none"/>
    </symbol>
    <symbol id="asset-petal" viewBox="0 0 30 50">
      <path d="M 15 50 C 5 40, 0 25, 0 15 C 0 5, 8 0, 15 0 C 22 0, 30 5, 30 15 C 30 25, 25 40, 15 50" fill="currentColor"/>
      <path d="M 15 50 L 15 10" stroke="${petalStroke}" stroke-width="1" opacity="0.2"/>
    </symbol>
    <symbol id="asset-sepal" viewBox="0 0 20 30">
      <path d="M 10 30 C 5 20, 0 10, 0 5 C 0 2, 4 0, 10 0 C 16 0, 20 2, 20 5 C 20 10, 15 20, 10 30" fill="currentColor"/>
    </symbol>
  </defs>`;
}

// Deterministic pseudo-random for leaf-size jitter. Was Math.sin(i*99).
function leafJitter(i: number): number {
  return 0.8 + Math.sin(i * 99) * 0.2;
}

export function renderPlantSVG(score: number, isDark = false): string {
  const clamped = Math.max(0, Math.min(100, score));
  const t = clamped / 100;

  const startX = CENTER_X;
  const startY = HEIGHT - 70;
  const currentHeight = lerp(40, 260, t);
  const droop = lerp(1.5, 0.2, t);
  const p0: Pt = { x: startX, y: startY };
  const p1: Pt = { x: startX + 30 * droop, y: startY - currentHeight * 0.33 };
  const p2: Pt = { x: startX - 10 * droop, y: startY - currentHeight * 0.66 };
  const tipX = startX + 20 * droop;
  const tipY = startY - currentHeight;
  const p3: Pt = { x: tipX, y: tipY };
  const stemPath = `M ${p0.x} ${p0.y} C ${p1.x} ${p1.y}, ${p2.x} ${p2.y}, ${p3.x} ${p3.y}`;

  const stemHue = lerp(30, 145, t);
  const stemSat = lerp(30, 45, t);
  const stemLight = isDark ? lerp(30, 35, t) : lerp(40, 42, t);
  const stemColor = `hsl(${stemHue} ${stemSat}% ${stemLight}%)`;

  let leavesSvg = "";
  if (clamped >= 10) {
    const leafCount = Math.floor(lerp(1, 10, t));
    for (let i = 0; i < leafCount; i++) {
      const lt = 0.2 + (i / Math.max(leafCount, 1)) * 0.75;
      const pos = bezier(lt, p0, p1, p2, p3);
      const angle = tangentAngle(lt, p0, p1, p2, p3);
      const side = i % 2 === 0 ? 1 : -1;
      const perkyAngle = lerp(130, 60, t);
      const rotation = angle + perkyAngle * side;
      const baseSize = lerp(0.4, 1.0, t);
      const sizeScale = baseSize * leafJitter(i);
      leavesSvg += `<g transform="translate(${pos.x.toFixed(1)}, ${pos.y.toFixed(1)}) rotate(${rotation.toFixed(1)}) scale(${sizeScale.toFixed(2)})"><use href="#asset-leaf" x="0" y="-20" width="40" height="40" style="color:${stemColor}"/></g>`;
    }
  }

  let fHue = lerp(40, -30, t);
  if (fHue < 0) fHue += 360;
  const fSat = lerp(10, 90, t);
  const fLight = isDark ? lerp(20, 60, t) : lerp(30, 70, t);
  const petalColor = `hsl(${fHue} ${fSat}% ${fLight}%)`;
  const innerColor = `hsl(${fHue} ${fSat}% ${Math.max(10, fLight - 15)}%)`;
  const outerColor = `hsl(${fHue} ${fSat}% ${Math.max(10, fLight - 20)}%)`;
  const fScale = lerp(0.2, 1.25, t);
  const sepalColor = stemColor;

  let sepals = "";
  for (let i = 0; i < 5; i++) {
    const r = i * 72;
    sepals += `<use href="#asset-sepal" x="-10" y="-30" width="20" height="30" transform="rotate(${r}) translate(0, 10)" style="color:${sepalColor}"/>`;
  }
  let outerPetals = "";
  if (clamped >= 70) {
    for (let i = 0; i < 10; i++) {
      outerPetals += `<use href="#asset-petal" x="-18" y="-60" width="36" height="60" transform="rotate(${i * 36 + 18})" style="color:${outerColor}"/>`;
    }
  }
  let petals = "";
  for (let i = 0; i < 8; i++) {
    petals += `<use href="#asset-petal" x="-15" y="-50" width="30" height="50" transform="rotate(${i * 45})" style="color:${petalColor}"/>`;
  }
  let innerPetals = "";
  for (let i = 0; i < 6; i++) {
    innerPetals += `<use href="#asset-petal" x="-10" y="-35" width="20" height="35" transform="rotate(${i * 60 + 30})" style="color:${innerColor}"/>`;
  }
  let corePetals = "";
  if (clamped >= 90) {
    for (let i = 0; i < 5; i++) {
      corePetals += `<use href="#asset-petal" x="-6" y="-20" width="12" height="20" transform="rotate(${i * 72})" style="color:${petalColor};filter:brightness(1.2)"/>`;
    }
  }
  const stamenHue = lerp(30, 48, t);
  const stamenSat = lerp(20, 100, t);
  const stamenLight = lerp(30, 60, t);
  const stamenColor = `hsl(${stamenHue} ${stamenSat}% ${stamenLight}%)`;
  const stamenStroke = `hsl(${stamenHue} ${stamenSat}% ${stamenLight * 0.8}%)`;
  const stamen = `<circle cx="0" cy="0" r="6" fill="${stamenColor}" stroke="${stamenStroke}" stroke-width="2"/>`;

  const tipA = tangentAngle(1, p0, p1, p2, p3) - 90;
  const flowerSvg = `<g transform="translate(${p3.x.toFixed(1)}, ${p3.y.toFixed(1)}) rotate(${tipA.toFixed(1)})"><g style="transform:scale(${fScale.toFixed(2)})">${sepals}${outerPetals}${petals}${innerPetals}${corePetals}${stamen}</g></g>`;

  const potY = HEIGHT - 30;
  const potBase = isDark ? "hsl(25 40% 35%)" : "hsl(25 55% 55%)";
  const potShadow = isDark ? "hsl(25 45% 25%)" : "hsl(25 50% 45%)";
  const potRim = isDark ? "hsl(25 45% 42%)" : "hsl(25 55% 62%)";
  const soilColor = isDark ? "hsl(30 25% 20%)" : "hsl(30 35% 35%)";
  const uid = `pg-${isDark ? "d" : "l"}-${clamped}`;

  return `<svg viewBox="0 -80 ${WIDTH} ${HEIGHT + 80}" role="img" aria-hidden="true" style="overflow:hidden;width:100%;height:100%">
    ${assetDefs(isDark)}
    <defs><linearGradient id="${uid}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${potBase}"/><stop offset="1" stop-color="${potShadow}"/></linearGradient></defs>
    <g transform="translate(${CENTER_X}, ${potY})">
      <ellipse cx="0" cy="4" rx="25" ry="5" fill="rgba(0,0,0,0.15)"/>
      <path d="M -18 -40 Q -24 -20, -14 0 L 14 0 Q 24 -20, 18 -40 Z" fill="url(#${uid})"/>
    </g>
    <g style="transform-origin:bottom center">
      <path d="${stemPath}" stroke="${stemColor}" stroke-width="${lerp(3, 5, t)}" fill="none" stroke-linecap="round"/>
      ${leavesSvg}
      ${flowerSvg}
    </g>
    <g transform="translate(${CENTER_X}, ${potY})"><ellipse cx="0" cy="-38" rx="16" ry="4" fill="${soilColor}"/></g>
    <g transform="translate(${CENTER_X}, ${potY})"><rect x="-20" y="-46" width="40" height="8" rx="2" fill="${potRim}"/></g>
  </svg>`;
}
