import { useCallback, useEffect, useRef, useState } from 'react';
import styles from './styles.module.scss';

type Phase = 'intro' | 'playing' | 'won' | 'gameover';
type PlayerId = 'bora' | 'gozde';

type Player = {
    id: PlayerId;
    name: string;
    x: number;
    y: number;
    vx: number;
    vy: number;
    width: number;
    height: number;
    color: string;
    accent: string;
    direction: 1 | -1;
    grounded: boolean;
    invincibleUntil: number;
    checkpoint: number;
};

type Rect = { x: number; y: number; width: number; height: number };
type Platform = Rect & { kind?: 'ground' | 'brick' | 'cloud' };
type Coin = { x: number; y: number; taken: boolean };
type Enemy = Rect & { vx: number; minX: number; maxX: number; alive: boolean };
type GameSnapshot = { coins: number; lives: number; phase: Phase; sound: boolean };

const GAME_WIDTH = 1440;
const GAME_HEIGHT = 810;
const WORLD_WIDTH = 6650;
const GROUND_Y = 690;
const PLAYER_SPEED = 410;
const JUMP_SPEED = 790;
const GRAVITY = 2100;

const platforms: Platform[] = [
    { x: 0, y: GROUND_Y, width: 940, height: 160, kind: 'ground' },
    { x: 1080, y: GROUND_Y, width: 680, height: 160, kind: 'ground' },
    { x: 1880, y: GROUND_Y, width: 1040, height: 160, kind: 'ground' },
    { x: 3060, y: GROUND_Y, width: 720, height: 160, kind: 'ground' },
    { x: 3920, y: GROUND_Y, width: 910, height: 160, kind: 'ground' },
    { x: 4970, y: GROUND_Y, width: 700, height: 160, kind: 'ground' },
    { x: 5790, y: GROUND_Y, width: 860, height: 160, kind: 'ground' },
    { x: 410, y: 535, width: 180, height: 30, kind: 'brick' },
    { x: 680, y: 430, width: 150, height: 30, kind: 'brick' },
    { x: 970, y: 570, width: 125, height: 26, kind: 'cloud' },
    { x: 1190, y: 500, width: 190, height: 30, kind: 'brick' },
    { x: 1460, y: 390, width: 170, height: 30, kind: 'brick' },
    { x: 1780, y: 565, width: 120, height: 26, kind: 'cloud' },
    { x: 2050, y: 520, width: 190, height: 30, kind: 'brick' },
    { x: 2380, y: 420, width: 170, height: 30, kind: 'brick' },
    { x: 2700, y: 545, width: 180, height: 30, kind: 'brick' },
    { x: 2960, y: 590, width: 125, height: 26, kind: 'cloud' },
    { x: 3220, y: 500, width: 170, height: 30, kind: 'brick' },
    { x: 3500, y: 400, width: 170, height: 30, kind: 'brick' },
    { x: 3830, y: 560, width: 120, height: 26, kind: 'cloud' },
    { x: 4090, y: 510, width: 220, height: 30, kind: 'brick' },
    { x: 4450, y: 400, width: 180, height: 30, kind: 'brick' },
    { x: 4800, y: 565, width: 180, height: 26, kind: 'cloud' },
    { x: 5170, y: 500, width: 180, height: 30, kind: 'brick' },
    { x: 5480, y: 390, width: 160, height: 30, kind: 'brick' },
    { x: 5700, y: 565, width: 120, height: 26, kind: 'cloud' },
    { x: 5980, y: 520, width: 190, height: 30, kind: 'brick' },
];

const coinPositions = [
    [310, 620], [460, 475], [550, 475], [730, 370], [1000, 520], [1235, 440], [1325, 440],
    [1510, 330], [1815, 515], [2100, 460], [2190, 460], [2430, 360], [2750, 485], [2835, 485],
    [3000, 540], [3270, 440], [3550, 340], [3870, 510], [4140, 450], [4230, 450], [4500, 340],
    [4850, 515], [5220, 440], [5525, 330], [5740, 515], [6030, 460], [6120, 460], [6310, 620],
];

const enemyBlueprints = [
    [780, 650, 630, 900], [1330, 650, 1120, 1690], [2150, 650, 1940, 2860],
    [3350, 650, 3110, 3720], [4260, 650, 3980, 4770], [5260, 650, 5030, 5600],
    [6070, 650, 5840, 6400],
];

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));
const intersects = (a: Rect, b: Rect) => a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;

const makePlayer = (id: PlayerId, x: number): Player => ({
    id,
    name: id === 'bora' ? 'Bora' : 'Gözde',
    x,
    y: 570,
    vx: 0,
    vy: 0,
    width: 46,
    height: 66,
    color: id === 'bora' ? '#ef4444' : '#e9448c',
    accent: id === 'bora' ? '#2558d9' : '#7c3aed',
    direction: 1,
    grounded: false,
    invincibleUntil: 0,
    checkpoint: 120,
});

const MarioGame: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const frameRef = useRef<number | null>(null);
    const keysRef = useRef(new Set<string>());
    const touchRef = useRef(new Set<string>());
    const soundRef = useRef(true);
    const audioRef = useRef<AudioContext | null>(null);
    const [snapshot, setSnapshot] = useState<GameSnapshot>({ coins: 0, lives: 5, phase: 'intro', sound: true });
    const [runId, setRunId] = useState(0);

    const beep = useCallback((frequency: number, duration = 0.08, type: OscillatorType = 'square') => {
        if (!soundRef.current) return;
        try {
            const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
            if (!AudioContextClass) return;
            const audio = audioRef.current || new AudioContextClass();
            audioRef.current = audio;
            const oscillator = audio.createOscillator();
            const gain = audio.createGain();
            oscillator.type = type;
            oscillator.frequency.value = frequency;
            gain.gain.setValueAtTime(0.055, audio.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + duration);
            oscillator.connect(gain);
            gain.connect(audio.destination);
            oscillator.start();
            oscillator.stop(audio.currentTime + duration);
        } catch {
            // Sound is decorative; browsers may decline audio before user interaction.
        }
    }, []);

    const startGame = useCallback(() => {
        beep(440, 0.07);
        window.setTimeout(() => beep(660, 0.1), 70);
        setSnapshot({ coins: 0, lives: 5, phase: 'playing', sound: soundRef.current });
        setRunId((value) => value + 1);
    }, [beep]);

    const toggleSound = () => {
        soundRef.current = !soundRef.current;
        setSnapshot((current) => ({ ...current, sound: soundRef.current }));
        if (soundRef.current) beep(520, 0.08);
    };

    useEffect(() => {
        const previousTitle = document.title;
        document.title = 'İki Kişilik Macera • Bora & Gözde';
        return () => { document.title = previousTitle; };
    }, []);

    useEffect(() => {
        const down = (event: KeyboardEvent) => {
            const key = event.key.toLowerCase();
            if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' ', 'w', 'a', 'd'].includes(key)) event.preventDefault();
            keysRef.current.add(key);
            if (key === 'r' && snapshot.phase !== 'intro') startGame();
        };
        const up = (event: KeyboardEvent) => keysRef.current.delete(event.key.toLowerCase());
        const blur = () => keysRef.current.clear();
        window.addEventListener('keydown', down, { passive: false });
        window.addEventListener('keyup', up);
        window.addEventListener('blur', blur);
        return () => {
            window.removeEventListener('keydown', down);
            window.removeEventListener('keyup', up);
            window.removeEventListener('blur', blur);
        };
    }, [snapshot.phase, startGame]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const context = canvas.getContext('2d');
        if (!context) return;

        const players = [makePlayer('bora', 150), makePlayer('gozde', 220)];
        const coins: Coin[] = coinPositions.map(([x, y]) => ({ x, y, taken: false }));
        const enemies: Enemy[] = enemyBlueprints.map(([x, y, minX, maxX], index) => ({
            x, y, minX, maxX, width: 52, height: 40, vx: index % 2 ? 82 : -82, alive: true,
        }));
        let cameraX = 0;
        let coinCount = 0;
        let lives = 5;
        let lastTime = performance.now();
        let active = snapshot.phase === 'playing';
        let finishTimer = 0;
        const particles: { x: number; y: number; vx: number; vy: number; life: number; color: string }[] = [];

        const playTone = (frequency: number, duration?: number, type?: OscillatorType) => beep(frequency, duration, type);

        const burst = (x: number, y: number, color: string, count = 8) => {
            for (let i = 0; i < count; i += 1) {
                const angle = (Math.PI * 2 * i) / count;
                particles.push({ x, y, vx: Math.cos(angle) * (80 + Math.random() * 110), vy: Math.sin(angle) * (80 + Math.random() * 110), life: 0.55, color });
            }
        };

        const respawn = (player: Player) => {
            player.x = player.checkpoint;
            player.y = 570;
            player.vx = 0;
            player.vy = 0;
            player.invincibleUntil = performance.now() + 1800;
        };

        const hurt = (player: Player) => {
            if (performance.now() < player.invincibleUntil || !active) return;
            lives -= 1;
            burst(player.x + player.width / 2, player.y + player.height / 2, player.color, 12);
            playTone(145, 0.22, 'sawtooth');
            if (lives <= 0) {
                active = false;
                setSnapshot((current) => ({ ...current, lives: 0, phase: 'gameover' }));
            } else {
                respawn(player);
                setSnapshot((current) => ({ ...current, lives }));
            }
        };

        const updatePlayer = (player: Player, dt: number) => {
            const keys = keysRef.current;
            const touch = touchRef.current;
            const left = player.id === 'bora' ? keys.has('a') || touch.has('bora-left') : keys.has('arrowleft') || touch.has('gozde-left');
            const right = player.id === 'bora' ? keys.has('d') || touch.has('bora-right') : keys.has('arrowright') || touch.has('gozde-right');
            const jump = player.id === 'bora' ? keys.has('w') || keys.has(' ') || touch.has('bora-jump') : keys.has('arrowup') || touch.has('gozde-jump');

            const direction = Number(right) - Number(left);
            player.vx += direction * 2500 * dt;
            player.vx *= Math.pow(0.0007, dt);
            player.vx = clamp(player.vx, -PLAYER_SPEED, PLAYER_SPEED);
            if (direction) player.direction = direction as 1 | -1;
            if (jump && player.grounded) {
                player.vy = -JUMP_SPEED;
                player.grounded = false;
                playTone(player.id === 'bora' ? 340 : 410, 0.07);
            }

            const previousY = player.y;
            player.vy += GRAVITY * dt;
            player.x += player.vx * dt;
            player.y += player.vy * dt;
            player.x = clamp(player.x, 0, WORLD_WIDTH - player.width);
            player.grounded = false;

            for (const platform of platforms) {
                const wasAbove = previousY + player.height <= platform.y + 10;
                if (wasAbove && player.vy >= 0 && intersects(player, platform)) {
                    player.y = platform.y - player.height;
                    player.vy = 0;
                    player.grounded = true;
                }
            }

            if (player.x > 1750) player.checkpoint = 1900;
            if (player.x > 3800) player.checkpoint = 3950;
            if (player.x > 5650) player.checkpoint = 5820;
            if (player.y > GAME_HEIGHT + 140) hurt(player);
        };

        const update = (dt: number) => {
            if (!active) return;
            players.forEach((player) => updatePlayer(player, dt));

            enemies.forEach((enemy) => {
                if (!enemy.alive) return;
                enemy.x += enemy.vx * dt;
                if (enemy.x <= enemy.minX || enemy.x + enemy.width >= enemy.maxX) enemy.vx *= -1;
                players.forEach((player) => {
                    if (!enemy.alive || !intersects(player, enemy)) return;
                    const landed = player.vy > 120 && player.y + player.height - enemy.y < 24;
                    if (landed) {
                        enemy.alive = false;
                        player.vy = -470;
                        burst(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, '#ffd43b', 9);
                        playTone(185, 0.07);
                        window.setTimeout(() => playTone(265, 0.08), 55);
                    } else hurt(player);
                });
            });

            coins.forEach((coin) => {
                if (coin.taken) return;
                const coinRect = { x: coin.x - 14, y: coin.y - 18, width: 28, height: 36 };
                if (players.some((player) => intersects(player, coinRect))) {
                    coin.taken = true;
                    coinCount += 1;
                    burst(coin.x, coin.y, '#ffe047', 7);
                    playTone(740, 0.06, 'sine');
                    window.setTimeout(() => playTone(980, 0.06, 'sine'), 45);
                    setSnapshot((current) => ({ ...current, coins: coinCount }));
                }
            });

            const bothAtFinish = players.every((player) => player.x > 6320);
            if (bothAtFinish) {
                finishTimer += dt;
                if (finishTimer > 0.7) {
                    active = false;
                    playTone(523, 0.14, 'triangle');
                    window.setTimeout(() => playTone(659, 0.14, 'triangle'), 140);
                    window.setTimeout(() => playTone(784, 0.28, 'triangle'), 280);
                    setSnapshot((current) => ({ ...current, phase: 'won' }));
                }
            } else finishTimer = 0;

            const middle = (players[0].x + players[1].x) / 2;
            const target = clamp(middle - GAME_WIDTH * 0.42, 0, WORLD_WIDTH - GAME_WIDTH);
            cameraX += (target - cameraX) * Math.min(1, dt * 4.5);
            particles.forEach((particle) => {
                particle.x += particle.vx * dt;
                particle.y += particle.vy * dt;
                particle.vy += 320 * dt;
                particle.life -= dt;
            });
            for (let i = particles.length - 1; i >= 0; i -= 1) if (particles[i].life <= 0) particles.splice(i, 1);
        };

        const roundRect = (x: number, y: number, width: number, height: number, radius: number) => {
            context.beginPath();
            context.roundRect(x, y, width, height, radius);
        };

        const drawHill = (x: number, width: number, height: number, color: string) => {
            context.fillStyle = color;
            context.beginPath();
            context.moveTo(x, GROUND_Y);
            context.quadraticCurveTo(x + width / 2, GROUND_Y - height, x + width, GROUND_Y);
            context.closePath();
            context.fill();
            context.fillStyle = 'rgba(255,255,255,.35)';
            context.beginPath();
            context.arc(x + width * 0.42, GROUND_Y - height * 0.38, 18, 0, Math.PI * 2);
            context.fill();
        };

        const drawCloud = (x: number, y: number, scale: number) => {
            context.save();
            context.translate(x, y);
            context.scale(scale, scale);
            context.fillStyle = 'rgba(255,255,255,.92)';
            context.beginPath();
            context.arc(0, 10, 28, Math.PI, 0);
            context.arc(32, 0, 38, Math.PI, 0);
            context.arc(74, 12, 25, Math.PI, 0);
            context.lineTo(98, 30);
            context.lineTo(-27, 30);
            context.closePath();
            context.fill();
            context.restore();
        };

        const drawBackground = () => {
            const gradient = context.createLinearGradient(0, 0, 0, GAME_HEIGHT);
            gradient.addColorStop(0, '#76d7ff');
            gradient.addColorStop(0.72, '#c8f3ff');
            gradient.addColorStop(1, '#fff3c4');
            context.fillStyle = gradient;
            context.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

            context.fillStyle = '#fff1a8';
            context.beginPath();
            context.arc(1160, 135, 62, 0, Math.PI * 2);
            context.fill();
            context.strokeStyle = 'rgba(255,255,255,.55)';
            context.lineWidth = 8;
            context.stroke();

            for (let i = -1; i < 9; i += 1) {
                const parallaxX = i * 360 - (cameraX * 0.13) % 360;
                drawHill(parallaxX, 420, 230 + (i % 2) * 55, i % 2 ? '#77d990' : '#66cb82');
            }
            for (let i = -1; i < 8; i += 1) drawCloud(i * 310 - (cameraX * 0.22) % 310, 120 + (i % 3) * 70, 0.8 + (i % 2) * 0.25);

            context.fillStyle = 'rgba(51, 133, 170, .16)';
            for (let i = -1; i < 16; i += 1) {
                const x = i * 125 - (cameraX * 0.36) % 125;
                context.fillRect(x, 585 - (i % 3) * 15, 58, 105 + (i % 3) * 15);
                context.beginPath();
                context.arc(x + 29, 585 - (i % 3) * 15, 29, Math.PI, 0);
                context.fill();
            }
        };

        const drawPlatform = (platform: Platform) => {
            const x = platform.x - cameraX;
            if (x > GAME_WIDTH || x + platform.width < 0) return;
            if (platform.kind === 'ground') {
                context.fillStyle = '#704022';
                context.fillRect(x, platform.y, platform.width, platform.height);
                context.fillStyle = '#36a852';
                context.fillRect(x, platform.y, platform.width, 28);
                context.fillStyle = '#63cf69';
                for (let tile = 0; tile < platform.width; tile += 36) {
                    context.beginPath();
                    context.arc(x + tile + 18, platform.y + 4, 18, Math.PI, 0);
                    context.fill();
                }
                context.fillStyle = 'rgba(34,18,9,.16)';
                for (let px = 18; px < platform.width; px += 72) context.fillRect(x + px, platform.y + 54 + (px % 3) * 18, 14, 8);
            } else if (platform.kind === 'cloud') {
                context.fillStyle = '#f8fdff';
                roundRect(x, platform.y, platform.width, platform.height, 16);
                context.fill();
                context.strokeStyle = '#78c9e8';
                context.lineWidth = 5;
                context.stroke();
            } else {
                context.fillStyle = '#db7439';
                roundRect(x, platform.y, platform.width, platform.height, 5);
                context.fill();
                context.strokeStyle = '#7f351f';
                context.lineWidth = 4;
                context.stroke();
                context.strokeStyle = 'rgba(255,255,255,.25)';
                context.lineWidth = 3;
                for (let tile = 40; tile < platform.width; tile += 40) {
                    context.beginPath(); context.moveTo(x + tile, platform.y); context.lineTo(x + tile, platform.y + platform.height); context.stroke();
                }
            }
        };

        const drawCoin = (coin: Coin, time: number) => {
            if (coin.taken) return;
            const x = coin.x - cameraX;
            if (x < -30 || x > GAME_WIDTH + 30) return;
            const squash = 0.35 + Math.abs(Math.cos(time * 0.004 + coin.x)) * 0.65;
            context.save();
            context.translate(x, coin.y + Math.sin(time * 0.004 + coin.x) * 5);
            context.scale(squash, 1);
            context.fillStyle = '#ffd51f';
            context.strokeStyle = '#9f6711';
            context.lineWidth = 4 / squash;
            context.beginPath();
            context.ellipse(0, 0, 16, 22, 0, 0, Math.PI * 2);
            context.fill();
            context.stroke();
            context.fillStyle = '#fff09a';
            context.fillRect(-4, -13, 5, 17);
            context.restore();
        };

        const drawEnemy = (enemy: Enemy) => {
            if (!enemy.alive) return;
            const x = enemy.x - cameraX;
            if (x < -80 || x > GAME_WIDTH + 80) return;
            context.save();
            context.translate(x, enemy.y);
            context.fillStyle = '#7c4b2b';
            roundRect(0, 5, enemy.width, enemy.height - 5, 16);
            context.fill();
            context.strokeStyle = '#3b2418';
            context.lineWidth = 4;
            context.stroke();
            context.fillStyle = '#fff';
            context.beginPath(); context.arc(17, 18, 8, 0, Math.PI * 2); context.arc(35, 18, 8, 0, Math.PI * 2); context.fill();
            context.fillStyle = '#202020';
            context.beginPath(); context.arc(19, 20, 3, 0, Math.PI * 2); context.arc(37, 20, 3, 0, Math.PI * 2); context.fill();
            context.fillStyle = '#3b2418';
            context.fillRect(6, 36, 15, 5); context.fillRect(31, 36, 15, 5);
            context.restore();
        };

        const drawPlayer = (player: Player, time: number) => {
            if (performance.now() < player.invincibleUntil && Math.floor(time / 85) % 2) return;
            const x = player.x - cameraX;
            const walking = Math.abs(player.vx) > 30 && player.grounded;
            const bob = walking ? Math.sin(time * 0.018) * 3 : 0;
            context.save();
            context.translate(x + player.width / 2, player.y + bob);
            context.scale(player.direction, 1);
            context.translate(-player.width / 2, 0);

            context.fillStyle = '#f4bb8a';
            roundRect(9, 11, 29, 28, 10);
            context.fill();
            context.fillStyle = player.color;
            roundRect(4, 0, 39, 17, 8);
            context.fill();
            context.fillRect(4, 10, 45, 8);
            context.fillStyle = '#24201f';
            context.fillRect(31, 20, 5, 5);
            context.fillRect(38, 31, 8, 5);

            context.fillStyle = player.accent;
            roundRect(7, 36, 34, 26, 7);
            context.fill();
            context.fillStyle = player.color;
            context.fillRect(8, 32, 32, 14);
            context.fillStyle = '#fff';
            context.beginPath(); context.arc(13, 47, 4, 0, Math.PI * 2); context.arc(36, 47, 4, 0, Math.PI * 2); context.fill();

            context.fillStyle = '#302722';
            const leg = walking ? Math.sin(time * 0.018) * 5 : 0;
            roundRect(3, 58 + leg, 19, 8, 4); context.fill();
            roundRect(26, 58 - leg, 19, 8, 4); context.fill();

            context.fillStyle = '#fff';
            context.font = '900 12px Arial';
            context.textAlign = 'center';
            context.fillText(player.id === 'bora' ? 'B' : 'G', 23, 13);
            context.restore();

            context.save();
            context.fillStyle = 'rgba(20, 31, 50, .78)';
            context.font = '700 14px Arial';
            context.textAlign = 'center';
            context.fillText(player.name, x + player.width / 2, player.y - 13 + bob);
            context.restore();
        };

        const drawFinish = (time: number) => {
            const x = 6370 - cameraX;
            context.fillStyle = '#ede8dc';
            context.fillRect(x + 100, 455, 210, 235);
            context.fillStyle = '#d84f4f';
            for (let i = 0; i < 3; i += 1) {
                context.beginPath();
                context.moveTo(x + 92 + i * 85, 455);
                context.lineTo(x + 135 + i * 85, 390);
                context.lineTo(x + 178 + i * 85, 455);
                context.fill();
            }
            context.fillStyle = '#384255';
            roundRect(x + 176, 602, 56, 88, 28); context.fill();
            context.fillStyle = '#f0c64b';
            context.fillRect(x + 22, 390, 9, 300);
            context.fillStyle = '#ef445f';
            context.beginPath();
            context.moveTo(x + 31, 405);
            context.lineTo(x + 112 + Math.sin(time * 0.004) * 5, 426);
            context.lineTo(x + 31, 455);
            context.closePath();
            context.fill();
            context.fillStyle = '#fff';
            context.font = '900 21px Arial';
            context.fillText('♥', x + 52, 435);
        };

        const drawSign = (worldX: number, lines: string[]) => {
            const x = worldX - cameraX;
            if (x < -250 || x > GAME_WIDTH + 100) return;
            context.fillStyle = '#77472b';
            context.fillRect(x + 87, 590, 14, 100);
            context.fillStyle = '#fff5cf';
            context.strokeStyle = '#77472b';
            context.lineWidth = 5;
            roundRect(x, 515, 190, 86, 10); context.fill(); context.stroke();
            context.fillStyle = '#55311f';
            context.textAlign = 'center';
            context.font = '800 16px Arial';
            lines.forEach((line, index) => context.fillText(line, x + 95, 547 + index * 22));
        };

        const draw = (time: number) => {
            drawBackground();
            drawFinish(time);
            platforms.forEach(drawPlatform);
            drawSign(80, ['Birlikte ilerle,', 'birlikte kazan!']);
            drawSign(1850, ['Kontrol noktası', '1 / 3']);
            drawSign(3850, ['Kontrol noktası', '2 / 3']);
            drawSign(5680, ['Son düzlük!', 'İkiniz de gelin']);
            coins.forEach((coin) => drawCoin(coin, time));
            enemies.forEach(drawEnemy);
            players.forEach((player) => drawPlayer(player, time));
            particles.forEach((particle) => {
                context.globalAlpha = clamp(particle.life * 2, 0, 1);
                context.fillStyle = particle.color;
                context.fillRect(particle.x - cameraX - 4, particle.y - 4, 8, 8);
            });
            context.globalAlpha = 1;

            const distance = Math.abs(players[0].x - players[1].x);
            if (distance > 1050) {
                context.fillStyle = 'rgba(24, 33, 55, .86)';
                roundRect(GAME_WIDTH / 2 - 175, 92, 350, 54, 18); context.fill();
                context.fillStyle = '#fff';
                context.font = '800 20px Arial';
                context.textAlign = 'center';
                context.fillText('Birbirinizden çok uzaklaşmayın!', GAME_WIDTH / 2, 126);
            }
        };

        const loop = (time: number) => {
            const dt = Math.min((time - lastTime) / 1000, 0.033);
            lastTime = time;
            update(dt);
            draw(time);
            frameRef.current = requestAnimationFrame(loop);
        };
        frameRef.current = requestAnimationFrame(loop);
        return () => {
            if (frameRef.current) cancelAnimationFrame(frameRef.current);
        };
    }, [runId, snapshot.phase, beep]);

    const touchStart = (control: string) => (event: React.PointerEvent<HTMLButtonElement>) => {
        event.preventDefault();
        event.currentTarget.setPointerCapture(event.pointerId);
        touchRef.current.add(control);
    };
    const touchEnd = (control: string) => (event: React.PointerEvent<HTMLButtonElement>) => {
        event.preventDefault();
        touchRef.current.delete(control);
    };

    return (
        <main className={styles.page}>
            <header className={styles.header}>
                <a className={styles.backLink} href="/" aria-label="Ana sayfaya dön">← <span>borabilir.github.io</span></a>
                <div className={styles.logo}><span>İKİ KİŞİLİK</span><strong>MACERA</strong></div>
                <button className={styles.iconButton} onClick={toggleSound} aria-label={snapshot.sound ? 'Sesi kapat' : 'Sesi aç'}>
                    {snapshot.sound ? '♪' : '×'}
                </button>
            </header>

            <section className={styles.gameFrame}>
                <div className={styles.hud}>
                    <div className={`${styles.playerBadge} ${styles.boraBadge}`}><i>B</i><span>BORA<small>A D + W</small></span></div>
                    <div className={styles.score}><span className={styles.coinIcon}>●</span><strong>{String(snapshot.coins).padStart(2, '0')}</strong><em>/ {coinPositions.length}</em></div>
                    <div className={styles.lives} aria-label={`${snapshot.lives} can`}>{Array.from({ length: 5 }, (_, index) => <span className={index < snapshot.lives ? styles.live : ''} key={index}>♥</span>)}</div>
                    <div className={`${styles.playerBadge} ${styles.gozdeBadge}`}><span>GÖZDE<small>← → + ↑</small></span><i>G</i></div>
                </div>

                <div className={styles.canvasWrap}>
                    <canvas ref={canvasRef} width={GAME_WIDTH} height={GAME_HEIGHT} aria-label="Bora ve Gözde için iki kişilik platform oyunu" />

                    {snapshot.phase === 'intro' && (
                        <div className={styles.overlay}>
                            <div className={styles.introCard}>
                                <p className={styles.eyebrow}>AYNI KLAVYE · TEK MACERA</p>
                                <h1>Yan yana.<br /><em>Sonuna kadar.</em></h1>
                                <p className={styles.lead}>Paraları toplayın, minik engelleri aşın ve kaleye <strong>birlikte</strong> ulaşın.</p>
                                <div className={styles.controls}>
                                    <div><i className={styles.redToken}>B</i><p><strong>Bora</strong><span><kbd>A</kbd><kbd>D</kbd> hareket · <kbd>W</kbd> zıpla</span></p></div>
                                    <div><i className={styles.pinkToken}>G</i><p><strong>Gözde</strong><span><kbd>←</kbd><kbd>→</kbd> hareket · <kbd>↑</kbd> zıpla</span></p></div>
                                </div>
                                <button className={styles.primaryButton} onClick={startGame}>MACERAYI BAŞLAT <span>→</span></button>
                                <small className={styles.tip}>İpucu: Düşmanların üstüne zıplayabilirsiniz.</small>
                            </div>
                        </div>
                    )}

                    {snapshot.phase === 'won' && (
                        <div className={styles.overlay}>
                            <div className={`${styles.resultCard} ${styles.winCard}`}>
                                <div className={styles.bigHeart}>♥</div>
                                <p className={styles.eyebrow}>BÖLÜM TAMAMLANDI</p>
                                <h2>En güzel takım<br />yine sizsiniz!</h2>
                                <p>{snapshot.coins} altın topladınız ve kaleye birlikte ulaştınız.</p>
                                <button className={styles.primaryButton} onClick={startGame}>TEKRAR OYNA <span>↻</span></button>
                            </div>
                        </div>
                    )}

                    {snapshot.phase === 'gameover' && (
                        <div className={styles.overlay}>
                            <div className={styles.resultCard}>
                                <p className={styles.eyebrow}>BU TUR OLMADI</p>
                                <h2>Bir kez daha?</h2>
                                <p>Yan yana olduğunuz sürece her bölüm geçilir.</p>
                                <button className={styles.primaryButton} onClick={startGame}>YENİDEN DENE <span>↻</span></button>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            <div className={styles.mobileControls} aria-label="Dokunmatik kontroller">
                <div><button onPointerDown={touchStart('bora-left')} onPointerUp={touchEnd('bora-left')} onPointerCancel={touchEnd('bora-left')}>←</button><button onPointerDown={touchStart('bora-right')} onPointerUp={touchEnd('bora-right')} onPointerCancel={touchEnd('bora-right')}>→</button><button className={styles.jump} onPointerDown={touchStart('bora-jump')} onPointerUp={touchEnd('bora-jump')} onPointerCancel={touchEnd('bora-jump')}>↑</button></div>
                <div><button onPointerDown={touchStart('gozde-left')} onPointerUp={touchEnd('gozde-left')} onPointerCancel={touchEnd('gozde-left')}>←</button><button onPointerDown={touchStart('gozde-right')} onPointerUp={touchEnd('gozde-right')} onPointerCancel={touchEnd('gozde-right')}>→</button><button className={styles.jump} onPointerDown={touchStart('gozde-jump')} onPointerUp={touchEnd('gozde-jump')} onPointerCancel={touchEnd('gozde-jump')}>↑</button></div>
            </div>

            <footer className={styles.footer}><span>Bora & Gözde için yapıldı</span><span>Yeniden başlat: <kbd>R</kbd></span></footer>
        </main>
    );
};

export default MarioGame;
