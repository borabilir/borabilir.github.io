type Rect = { x: number; y: number; width: number; height: number };
type Hero = Rect & { id: 'bora' | 'gozde'; vx: number; vy: number; grounded: boolean; direction: 1 | -1; invincibleUntil: number };
type Attack = 'dash' | 'pounce' | 'poop' | 'rage';
type BossAction = 'waiting' | 'idle' | 'windup' | Attack | 'stunned' | 'defeated';
export const KESTIL_WIDTH = 5040;
export const ARENA_START = 3600;
export const SURPU_MAX_HEALTH = 8;
export const SURPU_HIT_COOLDOWN = 2.4;
const FLOOR = 690;
export const KESTIL_PLATFORMS = [
    { x: 0, y: FLOOR, width: 900, height: 160, kind: 'ground' as const },
    { x: 1060, y: FLOOR, width: 700, height: 160, kind: 'ground' as const },
    { x: 1920, y: FLOOR, width: 720, height: 160, kind: 'ground' as const },
    { x: 2790, y: FLOOR, width: KESTIL_WIDTH - 2790, height: 160, kind: 'ground' as const },
    // Solid ceiling, floor steps and hanging fire bars form an enclosed passage.
    { x: 0, y: 0, width: 560, height: 350, kind: 'ground' as const },
    { x: 560, y: 0, width: 560, height: 380, kind: 'ground' as const },
    { x: 1120, y: 0, width: 640, height: 410, kind: 'ground' as const },
    { x: 1920, y: 0, width: 720, height: 350, kind: 'ground' as const },
    { x: 2790, y: 0, width: 530, height: 390, kind: 'ground' as const },
    { x: 3480, y: 0, width: KESTIL_WIDTH - 3480, height: 92, kind: 'ground' as const },
    { x: 504, y: 634, width: 168, height: 56, kind: 'ground' as const },
    { x: 672, y: 578, width: 112, height: 112, kind: 'ground' as const },
    { x: 1410, y: 634, width: 168, height: 56, kind: 'ground' as const },
    { x: 1578, y: 578, width: 112, height: 112, kind: 'ground' as const },
    { x: 2268, y: 634, width: 112, height: 56, kind: 'ground' as const },
    { x: 2380, y: 578, width: 112, height: 112, kind: 'ground' as const },
    { x: 3080, y: 634, width: 168, height: 56, kind: 'ground' as const },
];
export const KESTIL_BLOCK_ROWS = [
    { x: 300, y: 500, pattern: 'bmb' },
    { x: 1160, y: 500, pattern: 'bqub' },
    { x: 1990, y: 500, pattern: 'bmb' },
    { x: 2840, y: 500, pattern: 'bqub' },
];
export const KESTIL_COINS = [[300, 450], [420, 450], [800, 560], [980, 540], [1190, 450], [1320, 450],
    [1660, 550], [1840, 540], [2070, 450], [2290, 570], [2560, 540], [2720, 540], [2880, 450], [3010, 450], [3420, 570]];
export const KESTIL_SIGNS = [
    { x: 70, y: 515, lines: ['Şurpu Kestıl', 'Alevlere dikkat!'] },
    { x: 3380, y: 515, lines: ['ŞURPU İLERİDE', 'Başına zıplayın!'] },
];
const PITS = [{ x: 900, width: 160 }, { x: 1760, width: 160 }, { x: 2640, width: 150 }];
const BARS = [{ x: 760, y: 408, count: 4, offset: 0 }, { x: 1550, y: 438, count: 4, offset: 2 }, { x: 2490, y: 378, count: 5, offset: 4 }, { x: 3190, y: 418, count: 6, offset: 1 }];
const JETS = [{ x: 1370, offset: 0 }, { x: 2250, offset: 1.2 }, { x: 3270, offset: .6 }];
const overlap = (a: Rect, b: Rect) => a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

export const rotatingFlames = (time: number) => BARS.flatMap(bar => Array.from({ length: bar.count }, (_, i) => {
    const angle = time * 1.35 + bar.offset;
    const radius = (i + 1) * 26;
    return { x: bar.x + Math.cos(angle) * radius, y: bar.y + Math.sin(angle) * radius, radius: 13 };
}));
export const flameJets = (time: number) => JETS.map(jet => {
    const cycle = (time + jet.offset) % 3.5;
    return { x: jet.x, y: FLOOR - 168, width: 34, height: 168, active: cycle >= 1.3 && cycle < 2.5, warning: cycle >= .8 && cycle < 1.3 };
});
export const touchesKestilFire = (hero: Rect, time: number) => rotatingFlames(time).some(flame => {
    const dx = flame.x - clamp(flame.x, hero.x, hero.x + hero.width);
    const dy = flame.y - clamp(flame.y, hero.y, hero.y + hero.height);
    return dx * dx + dy * dy < flame.radius * flame.radius;
}) || flameJets(time).some(jet => jet.active && overlap(hero, jet));
export const inKestilLava = (hero: Rect) => hero.y + hero.height > FLOOR + 15
    && PITS.some(pit => hero.x + hero.width / 2 > pit.x && hero.x + hero.width / 2 < pit.x + pit.width);

export class KestilEncounter {
    boss = { x: 4550, y: FLOOR - 148, width: 136, height: 148, vx: 0, vy: 0, direction: -1 as 1 | -1,
        health: SURPU_MAX_HEALTH, action: 'waiting' as BossAction, attack: 'pounce' as Attack, timer: 0, invulnerable: 0 };
    projectiles: (Rect & { vx: number; vy: number; life: number; angle: number })[] = [];
    entered = false;
    endingTime: number | null = null;
    private attackIndex = 0;
    private shots = 0;
    private chaseStarted = false;
    private rageTarget = 0;
    get cageY() { return this.endingTime === null ? 175 : 175 + clamp(this.endingTime / 3, 0, 1) * 371; }
    get rescued() { return this.endingTime !== null && this.endingTime >= 4; }
    get chasing() { return this.endingTime !== null && this.endingTime >= 9.5; }
    get finished() { return this.endingTime !== null && this.endingTime >= 14; }
    get caption() {
        if (this.endingTime !== null) {
            if (this.endingTime < 3.5) return 'Kafes iniyor… SüngerBob ve Patrick, geliyoruz!';
            if (this.endingTime < 5) return 'Oyuncaklarımızı kurtardık!';
            if (this.endingTime < 8) return 'Bora & Gözde: Bıktık senden Şurup!';
            if (this.endingTime < 9.5) return 'Şurpu: MİYAAAV!';
            return 'Bora & Gözde: AAAAA!';
        }
        if (!this.entered) return '';
        if (this.boss.action === 'windup') return this.boss.attack === 'poop' ? 'Şurpu arkasını dönüyor… Bok geliyor!' : this.boss.attack === 'rage' ? 'Şurpu çıldırdı! MİYAVV!! Zıpla!' : this.boss.attack === 'dash' ? 'Pati hücumu! Zıpla!' : 'Şurpu sıçrayacak! Altından uzaklaşın!';
        if (this.boss.invulnerable > 0) return 'Şurpu şu an hasar almıyor! Saldırıdan kaçının.';
        return 'Başına zıplayın! Patiye ve boklara dikkat.';
    }
    update<T extends Hero>(dt: number, heroes: T[], previousFeet: number[], hurt: (hero: T) => void,
        healthChanged: (health: number) => void, defeated: () => void) {
        if (this.endingTime !== null) {
            this.endingTime += dt;
            const endingTime = this.endingTime;
            this.projectiles.length = 0;
            if (this.chasing && !this.chaseStarted) {
                this.boss.x = Math.max(...heroes.map(h => h.x)) + 130;
                this.chaseStarted = true;
            }
            heroes.forEach((hero, i) => {
                hero.vx = 0; hero.vy = 0; hero.grounded = true; hero.y = FLOOR - hero.height;
                if (endingTime < 5) {
                    const target = 4685 + i * 85;
                    hero.x += clamp(target - hero.x, -230 * dt, 230 * dt);
                    hero.direction = 1;
                } else if (this.chasing && !this.finished) {
                    hero.direction = -1; hero.x -= 350 * dt; hero.vx = -350;
                    this.boss.direction = -1;
                }
            });
            if (this.chasing && !this.finished) {
                this.boss.x -= 330 * dt;
                this.boss.action = 'dash';
                this.boss.y = FLOOR - this.boss.height;
            }
            return;
        }
        if (!this.entered) {
            if (!heroes.every(hero => hero.x >= ARENA_START + 15)) return;
            this.entered = true;
            this.boss.action = 'idle'; this.boss.timer = .8;
        }
        const boss = this.boss;
        const oldTop = boss.y;
        boss.invulnerable = Math.max(0, boss.invulnerable - dt);
        boss.timer -= dt;
        const target = heroes.reduce((near, hero) => Math.abs(hero.x - boss.x) < Math.abs(near.x - boss.x) ? hero : near);
        if (boss.action === 'idle' && boss.timer <= 0) {
            const attacks: Attack[] = ['poop', 'rage', 'poop', 'pounce', 'dash', 'poop'];
            boss.attack = attacks[this.attackIndex++ % attacks.length];
            boss.direction = target.x < boss.x ? -1 : 1;
            this.rageTarget = clamp(target.x + target.width / 2 - boss.width / 2, ARENA_START + 180, KESTIL_WIDTH - boss.width - 120);
            boss.action = 'windup'; boss.timer = boss.attack === 'poop' || boss.attack === 'rage' ? .65 : .55;
        } else if (boss.action === 'windup' && boss.timer <= 0) {
            boss.action = boss.attack;
            boss.timer = boss.attack === 'rage' ? Math.max(.12, Math.abs(this.rageTarget - boss.x) / 760) : boss.attack === 'poop' ? 1.1 : boss.attack === 'dash' ? .65 : 1.05;
            boss.vx = boss.direction * (boss.attack === 'rage' ? 760 : boss.attack === 'dash' ? 480 : boss.attack === 'pounce' ? 260 : 0);
            boss.vy = boss.attack === 'pounce' ? -640 : 0;
            this.shots = 0;
        } else if ((boss.action === 'pounce' || boss.action === 'dash' || boss.action === 'rage' || boss.action === 'poop' || boss.action === 'stunned') && boss.timer <= 0) {
            boss.action = 'idle'; boss.timer = boss.health <= 4 ? .35 : .55; boss.vx = 0;
        }
        if (boss.action === 'poop') {
            const expected = Math.min(4, Math.floor((1.1 - boss.timer) / .22) + 1);
            while (this.shots < expected) {
                this.projectiles.push({ x: boss.x + boss.width / 2 + boss.direction * 55, y: boss.y + 94,
                    width: 28, height: 28, vx: boss.direction * (390 + this.shots * 45), vy: -440 - this.shots * 45, life: 4, angle: 0 });
                this.shots++;
            }
        }
        boss.vy += 1500 * dt;
        boss.x = clamp(boss.x + boss.vx * dt, ARENA_START + 180, KESTIL_WIDTH - boss.width - 120);
        if (boss.action === 'rage' && (boss.direction === -1 ? boss.x <= this.rageTarget : boss.x >= this.rageTarget)) {
            boss.x = this.rageTarget; boss.vx = 0; boss.timer = 0;
        }
        boss.y = Math.min(FLOOR - boss.height, boss.y + boss.vy * dt);
        if (boss.y + boss.height >= FLOOR) boss.vy = 0;
        for (let index = 0; index < heroes.length; index++) {
            const hero = heroes[index];
            if (!overlap(hero, boss)) continue;
            const stomp = hero.vy > 0 && previousFeet[index] <= Math.max(oldTop, boss.y) + 24 && hero.y < boss.y;
            if (stomp) {
                hero.y = boss.y - hero.height;
                hero.vy = -700; hero.grounded = false;
                hero.invincibleUntil = performance.now() + 900;
                if (boss.invulnerable > 0) continue;
                boss.health = Math.max(0, boss.health - 1);
                boss.invulnerable = SURPU_HIT_COOLDOWN;
                boss.action = 'stunned'; boss.timer = .35; boss.vx = 0;
                healthChanged(boss.health);
                if (boss.health === 0) {
                    boss.action = 'defeated'; boss.y = FLOOR - boss.height; boss.vy = 0; boss.invulnerable = 0;
                    this.endingTime = 0; this.projectiles.length = 0; defeated(); return;
                }
            } else if (boss.invulnerable <= 0) hurt(hero);
        }
        this.projectiles.forEach(projectile => {
            projectile.life -= dt; projectile.vy += 900 * dt;
            projectile.x += projectile.vx * dt; projectile.y += projectile.vy * dt; projectile.angle += dt * 6;
            for (const hero of heroes) if (overlap(hero, projectile)) { hurt(hero); projectile.life = 0; break; }
        });
        this.projectiles = this.projectiles.filter(p => p.life > 0 && p.y < FLOOR - 8 && p.x > ARENA_START && p.x < KESTIL_WIDTH);
    }
}

const ellipse = (c: CanvasRenderingContext2D, x: number, y: number, rx: number, ry: number, color: string, stroke = true) => {
    c.fillStyle = color; c.beginPath(); c.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); c.fill(); if (stroke) c.stroke();
};
const rect = (c: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, color: string, radius = 0) => {
    c.fillStyle = color; c.beginPath(); c.roundRect(x, y, w, h, radius); c.fill(); c.stroke();
};
const line = (c: CanvasRenderingContext2D, points: number[]) => {
    c.beginPath(); c.moveTo(points[0], points[1]); for (let i = 2; i < points.length; i += 2) c.lineTo(points[i], points[i + 1]); c.stroke();
};
export const drawSurpu = (c: CanvasRenderingContext2D, encounter: KestilEncounter, camera: number, time: number) => {
    const b = encounter.boss;
    const rear = b.action === 'poop' || (b.action === 'windup' && b.attack === 'poop');
    c.save(); c.translate(b.x - camera + 68, b.y); c.scale(rear ? -b.direction : b.direction, 1);
    if (b.invulnerable > 0) {
        c.strokeStyle = '#ffda87'; c.lineWidth = 4; c.setLineDash([9, 7]);
        c.beginPath(); c.ellipse(0, 76, 70, 80, 0, 0, Math.PI * 2); c.stroke(); c.setLineDash([]);
    }
    if (b.invulnerable > 0 && Math.floor(time * 18) % 2) c.globalAlpha = .55;
    c.strokeStyle = '#493e39'; c.lineWidth = 3.5; c.lineCap = 'round';
    c.strokeStyle = '#8a7966'; c.lineWidth = 12;
    c.beginPath(); c.moveTo(-30, 113); c.bezierCurveTo(-85, 135, -79, 50, -56, rear ? 16 : 78); c.stroke();
    c.strokeStyle = '#493e39'; c.lineWidth = 3.5;
    ellipse(c, 0, 95, 40, 48, '#fcf6e9');
    const stride = b.action === 'dash' || b.action === 'rage' ? Math.sin(time * 22) * 6 : 0;
    ellipse(c, -25, 137 + stride, 18, 9, '#fffaf0'); ellipse(c, 27, 137 - stride, 18, 9, '#fffaf0');
    if (rear) {
        ellipse(c, 0, 110, 34, 26, '#fffaf0');
        c.strokeStyle = '#df9c9d'; c.lineWidth = 3;
        line(c, [-5, 110, 5, 110]); line(c, [-3, 106, 3, 114]); line(c, [-3, 114, 3, 106]);
        c.strokeStyle = '#493e39';
    }
    const headX = rear ? 21 : 5;
    c.fillStyle = '#8a7966'; c.beginPath(); c.moveTo(headX - 43, 47); c.lineTo(headX - 47, 3); c.lineTo(headX - 17, 22);
    c.lineTo(headX + 18, 22); c.lineTo(headX + 46, 3); c.lineTo(headX + 42, 48); c.closePath(); c.fill(); c.stroke();
    c.fillStyle = '#d79f97'; c.beginPath(); c.moveTo(headX - 40, 12); c.lineTo(headX - 34, 35); c.lineTo(headX - 22, 25);
    c.moveTo(headX + 22, 25); c.lineTo(headX + 39, 12); c.lineTo(headX + 34, 35); c.fill();
    ellipse(c, headX, 53, 45, 36, '#faf4e8');
    c.fillStyle = '#8a7966'; c.beginPath(); c.moveTo(headX - 43, 45); c.quadraticCurveTo(headX - 40, 11, headX - 12, 20);
    c.lineTo(headX + 1, 44); c.lineTo(headX + 17, 21); c.quadraticCurveTo(headX + 43, 15, headX + 43, 47);
    c.lineTo(headX + 25, 51); c.lineTo(headX + 12, 39); c.lineTo(headX, 51); c.lineTo(headX - 16, 38); c.lineTo(headX - 28, 53); c.closePath(); c.fill();
    c.strokeStyle = '#514a43'; line(c, [headX - 29, 24, headX - 22, 35]); line(c, [headX - 16, 23, headX - 9, 33]); line(c, [headX + 29, 26, headX + 23, 36]);
    c.strokeStyle = '#493e39';
    if (!rear) {
        ellipse(c, headX - 20, 53, 13, 15, '#b6ae7e'); ellipse(c, headX + 21, 53, 13, 15, '#b6ae7e');
        ellipse(c, headX - 18, 54, 10, 12, '#24262a', false); ellipse(c, headX + 19, 54, 10, 12, '#24262a', false);
        ellipse(c, headX - 15, 49, 3, 3, '#fff', false); ellipse(c, headX + 22, 49, 3, 3, '#fff', false);
        ellipse(c, headX, 69, 6, 4, '#df9c9d');
        c.lineWidth = 2; line(c, [headX, 73, headX, 78]); line(c, [headX - 35, 65, headX - 59, 62]); line(c, [headX - 34, 73, headX - 57, 78]);
        line(c, [headX + 34, 65, headX + 55, 61]); line(c, [headX + 35, 73, headX + 57, 78]);
    }
    if (b.action === 'windup') {
        c.fillStyle = '#ffdc77'; c.font = '900 32px Arial'; c.textAlign = 'center'; c.fillText(rear ? '?!' : '!', 0, -15);
    }
    c.restore();
    if (b.action === 'rage' || (b.action === 'windup' && b.attack === 'rage')) {
        c.save(); c.fillStyle = '#ffdd94'; c.strokeStyle = '#7c2534'; c.lineWidth = 5;
        c.font = '900 27px Arial'; c.textAlign = 'center';
        c.strokeText('MİYAVV!!', b.x - camera + 68, b.y - 22); c.fillText('MİYAVV!!', b.x - camera + 68, b.y - 22); c.restore();
    }
};

export const drawToy = (c: CanvasRenderingContext2D, kind: 'sponge' | 'patrick', x: number, y: number, scale = 1) => {
    c.save(); c.translate(x, y); c.scale(scale, scale); c.strokeStyle = '#674731'; c.lineWidth = 2.5;
    if (kind === 'sponge') {
        rect(c, 0, 0, 44, 48, '#ffe35d', 6);
        ellipse(c, 8, 8, 3, 3, '#dfba36', false); ellipse(c, 36, 31, 4, 4, '#dfba36', false);
        ellipse(c, 14, 18, 8, 8, '#fff'); ellipse(c, 30, 18, 8, 8, '#fff');
        ellipse(c, 16, 18, 3, 4, '#499ace', false); ellipse(c, 28, 18, 3, 4, '#499ace', false);
        c.beginPath(); c.moveTo(11, 31); c.quadraticCurveTo(24, 41, 35, 31); c.stroke();
        rect(c, 0, 42, 44, 12, '#aa713e'); c.strokeStyle = '#fff'; c.lineWidth = 5; line(c, [0, 40, 44, 40]);
        c.strokeStyle = '#ed5b50'; line(c, [22, 43, 22, 50]); c.strokeStyle = '#30374c'; c.lineWidth = 6;
        line(c, [8, 54, 8, 64, 15, 64]); line(c, [34, 54, 34, 64, 41, 64]);
    } else {
        c.fillStyle = '#f6a0a6'; c.beginPath(); c.moveTo(24, 0); c.lineTo(34, 24); c.lineTo(54, 30); c.lineTo(39, 42);
        c.lineTo(42, 67); c.lineTo(25, 57); c.lineTo(7, 66); c.lineTo(11, 41); c.lineTo(-3, 30); c.lineTo(16, 24); c.closePath(); c.fill(); c.stroke();
        c.fillStyle = '#badd79'; c.beginPath(); c.moveTo(11, 44); c.quadraticCurveTo(25, 49, 39, 44); c.lineTo(42, 58);
        c.quadraticCurveTo(26, 66, 8, 58); c.closePath(); c.fill(); c.stroke();
        c.strokeStyle = '#a67fc4'; c.lineWidth = 5; line(c, [13, 52, 20, 51, 23, 57]); line(c, [31, 55, 35, 50]); c.strokeStyle = '#674731'; c.lineWidth = 2;
        ellipse(c, 21, 25, 4, 6, '#fff'); ellipse(c, 30, 25, 4, 6, '#fff');
        ellipse(c, 22, 26, 1.5, 2, '#30374c', false); ellipse(c, 29, 26, 1.5, 2, '#30374c', false);
        c.beginPath(); c.moveTo(18, 36); c.quadraticCurveTo(26, 42, 34, 35); c.stroke();
    }
    c.restore();
};

const drawFlame = (c: CanvasRenderingContext2D, x: number, y: number, radius: number, time: number) => {
    const pulse = Math.sin(time * 10 + x) * 2;
    ellipse(c, x, y, radius + 9, radius + 11 + pulse, 'rgba(255,119,36,.16)', false);
    ellipse(c, x, y, radius, radius + 3 + pulse, '#f86824', false);
    ellipse(c, x, y + 2, radius * .65, radius * .8, '#ffcd52', false);
    ellipse(c, x, y + 5, radius * .3, radius * .48, '#fff2aa', false);
};
export const drawKestilBackground = (c: CanvasRenderingContext2D, camera: number, time: number) => {
    const sky = c.createLinearGradient(0, 0, 0, 810); sky.addColorStop(0, '#171629'); sky.addColorStop(.75, '#333146'); sky.addColorStop(1, '#7b3434');
    c.fillStyle = sky; c.fillRect(0, 0, 1440, 810);
    c.strokeStyle = 'rgba(133,122,153,.18)'; c.lineWidth = 3;
    for (let y = 0; y < 690; y += 72) for (let x = -180 - camera * .3 % 144 + (y % 144 ? 72 : 0); x < 1440; x += 144) c.strokeRect(x, y, 144, 72);
    for (let i = -1; i < 17; i++) {
        const x = i * 340 - camera * .6 % 340;
        c.strokeStyle = '#514b61'; c.lineWidth = 12; rect(c, x + 60, 185, 130, 330, '#211e31', 65);
        c.strokeStyle = '#7b6362'; c.lineWidth = 4; line(c, [x + 125, 185, x + 125, 515]); line(c, [x + 60, 340, x + 190, 340]);
        c.strokeStyle = '#342d38'; c.lineWidth = 9; line(c, [x + 265, 295, x + 265, 350]);
        drawFlame(c, x + 265, 288, 15, time);
    }
    c.fillStyle = '#ac3927'; c.fillRect(0, FLOOR + 12, 1440, 810 - FLOOR);
    c.fillStyle = '#ffc453';
    for (let x = -40; x < 1460; x += 65) { c.beginPath(); c.ellipse(x, FLOOR + 19 + Math.sin(time * 2 + x) * 4, 36, 12, 0, 0, Math.PI * 2); c.fill(); }
    for (const pit of PITS) for (let i = 0; i < 4; i++) drawFlame(c, pit.x - camera + 18 + i * 40, FLOOR + 35, 13, time);
    c.save(); c.fillStyle = '#ffe4a1'; c.font = '900 33px Arial'; c.textAlign = 'center';
    c.fillText('ŞURPU KESTIL', 4320 - camera, 235); c.restore();
};
export const drawKestilEncounter = (c: CanvasRenderingContext2D, encounter: KestilEncounter, camera: number, time: number) => {
    if (encounter.endingTime === null) {
        c.strokeStyle = '#787081'; c.lineWidth = 4;
        BARS.forEach(bar => { rect(c, bar.x - camera - 28, bar.y - 28, 56, 56, '#a68b60', 5); });
        rotatingFlames(time).forEach(flame => drawFlame(c, flame.x - camera, flame.y, flame.radius, time));
        flameJets(time).forEach(jet => {
            c.strokeStyle = '#4a3030'; c.lineWidth = 3; rect(c, jet.x - camera - 6, FLOOR - 14, 46, 14, '#5e4244', 4);
            if (jet.active) for (let y = FLOOR - 22; y > jet.y; y -= 28) drawFlame(c, jet.x - camera + 17, y, 17, time);
            else if (jet.warning) { c.fillStyle = '#ffcc63'; c.font = '900 26px Arial'; c.textAlign = 'center'; c.fillText('!', jet.x - camera + 17, FLOOR - 38); }
        });
    }
    const cageX = 4660 - camera, cageY = encounter.cageY;
    c.save(); c.strokeStyle = '#9b96a8'; c.lineWidth = 5;
    for (const x of [cageX + 28, cageX + 162]) { line(c, [x, 0, x, cageY]); for (let y = 12; y < cageY; y += 24) c.strokeRect(x - 5, y, 10, 14); }
    c.strokeStyle = '#38333f'; rect(c, cageX, cageY, 190, 140, '#c9bb93', 12);
    if (!encounter.rescued) { drawToy(c, 'sponge', cageX + 35, cageY + 57, .85); drawToy(c, 'patrick', cageX + 110, cageY + 56, .85); }
    c.strokeStyle = '#555364'; c.lineWidth = 7;
    if (!encounter.rescued) for (let x = 16; x < 185; x += 26) line(c, [cageX + x, cageY + 8, cageX + x, cageY + 130]);
    else { line(c, [cageX, cageY + 6, cageX - 30, cageY + 18, cageX - 30, cageY + 134, cageX, cageY + 140]); }
    c.strokeStyle = '#322d3b'; c.lineWidth = 5; rect(c, cageX - 7, cageY - 5, 204, 17, '#8f8896', 4); rect(c, cageX - 7, cageY + 126, 204, 18, '#8f8896', 4);
    if (!encounter.rescued) { rect(c, cageX + 83, cageY + 83, 26, 30, '#e4bb5f', 5); ellipse(c, cageX + 96, cageY + 97, 3, 5, '#4d3541', false); }
    c.restore();
    drawSurpu(c, encounter, camera, time);
    encounter.projectiles.forEach(p => {
        c.save(); c.translate(p.x - camera + 14, p.y + 14); c.rotate(p.angle); c.strokeStyle = '#49301f'; c.lineWidth = 2;
        ellipse(c, 0, 6, 15, 8, '#8a5730'); ellipse(c, 0, 0, 11, 7, '#a3703d'); ellipse(c, 0, -6, 7, 5, '#bb8954'); c.restore();
    });
};
export const drawKestilStory = (c: CanvasRenderingContext2D, encounter: KestilEncounter, camera: number, heroes: Hero[]) => {
    if (encounter.rescued) heroes.forEach((hero, i) => drawToy(c, i === 0 ? 'sponge' : 'patrick', hero.x - camera + (hero.direction < 0 ? -19 : 28), hero.y + 22, .55));
    if (encounter.chasing) heroes.forEach(hero => {
        c.fillStyle = '#fff5d6'; c.font = '900 26px Arial'; c.textAlign = 'center'; c.fillText('AAAA!', hero.x - camera + 23, hero.y - 57);
    });
    if (encounter.caption && encounter.endingTime === null) {
        c.save(); c.strokeStyle = '#e9bd69'; c.lineWidth = 2; rect(c, 280, 732, 880, 56, 'rgba(22,18,33,.95)', 16);
        c.fillStyle = '#fff2cf'; c.font = '800 21px Arial'; c.textAlign = 'center'; c.fillText(encounter.caption, 720, 767); c.restore();
    }
};
