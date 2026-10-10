import { useCallback, useEffect, useRef, useState } from 'react';
import styles from './styles.module.scss';

type Phase = 'intro' | 'playing' | 'won' | 'gameover';
type PlayerId = 'bora' | 'gozde';
type LevelId = '1-1' | '1-2' | '1-3' | '1-4' | '1-5';

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
    isBig: boolean;
    hasFire: boolean;
    fireCooldown: number;
    swimCooldown: number;
    invincibleUntil: number;
    checkpoint: number;
};

type Rect = { x: number; y: number; width: number; height: number };
type Platform = Rect & { kind?: 'ground' | 'pipe' | 'treetop' | 'sidePipe'; travel?: 'bonusIn' | 'bonusOut' | 'levelExit' | 'waterIn' | 'waterExit' };
type Coin = { x: number; y: number; taken: boolean };
type EnemyKind = 'goomba' | 'turtle' | 'fish';
type EnemyState = 'walking' | 'shellStill' | 'shellMoving';
type Enemy = Rect & { kind: EnemyKind; state: EnemyState; vx: number; vy: number; minX: number; maxX: number; alive: boolean; dangerousAt: number; swimPhase: number; baseY: number };
type WorldBlock = Rect & { kind: 'brick' | 'question'; reward: 'none' | 'coin' | 'growth' | 'upgrade'; used: boolean; destroyed: boolean; bump: number; coinAnimation: number };
type PowerUp = Rect & { kind: 'growth' | 'fire'; target: PlayerId; vx: number; vy: number; emerging: number; active: boolean; color: string };
type Fireball = Rect & { owner: PlayerId; vx: number; vy: number; active: boolean; life: number; color: string };
type PlayerCounter = Record<PlayerId, number>;
type GameSnapshot = { coins: PlayerCounter; lives: PlayerCounter; phase: Phase; sound: boolean };

const GAME_WIDTH = 1440;
const GAME_HEIGHT = 810;
const MAIN_WORLD_WIDTH = 6650;
const BONUS_START = 6900;
const BONUS_END = 8420;
const UNDERGROUND_WORLD_WIDTH = 7400;
const SKY_WORLD_WIDTH = 6600;
const WATER_WORLD_WIDTH = 7200;
const WATER_START = 1800;
const GROUND_Y = 690;
const PLAYER_SPEED = 410;
const JUMP_SPEED = 960;
const GRAVITY = 2100;

const platforms: Platform[] = [
    { x: 0, y: GROUND_Y, width: 940, height: 160, kind: 'ground' },
    { x: 1080, y: GROUND_Y, width: 680, height: 160, kind: 'ground' },
    { x: 1880, y: GROUND_Y, width: 1040, height: 160, kind: 'ground' },
    { x: 3060, y: GROUND_Y, width: 720, height: 160, kind: 'ground' },
    { x: 3920, y: GROUND_Y, width: 910, height: 160, kind: 'ground' },
    { x: 4970, y: GROUND_Y, width: 700, height: 160, kind: 'ground' },
    { x: 5790, y: GROUND_Y, width: 860, height: 160, kind: 'ground' },
    { x: 750, y: 578, width: 88, height: 112, kind: 'pipe' },
    { x: 1605, y: 548, width: 92, height: 142, kind: 'pipe', travel: 'bonusIn' },
    { x: 2510, y: 590, width: 86, height: 100, kind: 'pipe' },
    { x: 4240, y: 562, width: 92, height: 128, kind: 'pipe' },
    { x: 5250, y: 590, width: 86, height: 100, kind: 'pipe' },
    { x: 6010, y: 570, width: 92, height: 120, kind: 'pipe' },
    { x: BONUS_START - 40, y: GROUND_Y, width: BONUS_END - BONUS_START + 80, height: 160, kind: 'ground' },
    { x: 6960, y: 560, width: 94, height: 130, kind: 'pipe' },
    { x: 8140, y: 560, width: 94, height: 130, kind: 'pipe', travel: 'bonusOut' },
];

const coinPositions = [
    [310, 620], [460, 475], [550, 475], [730, 370], [1000, 520], [1235, 440], [1325, 440],
    [1510, 330], [1815, 515], [2100, 460], [2190, 460], [2430, 360], [2750, 485], [2835, 485],
    [3000, 540], [3270, 440], [3550, 340], [3870, 510], [4140, 450], [4230, 450], [4500, 340],
    [4850, 515], [5220, 440], [5525, 330], [5740, 515], [6030, 460], [6120, 460], [6310, 620],
    [7080, 610], [7160, 555], [7240, 515], [7320, 555], [7400, 610],
    [7570, 515], [7650, 455], [7730, 425], [7810, 455], [7890, 515], [8010, 610],
];

const enemyBlueprints: [number, number, number, number, EnemyKind?][] = [
    [780, 650, 630, 900], [1330, 636, 1120, 1690, 'turtle'], [2150, 650, 1940, 2860],
    [3350, 650, 3110, 3720], [4260, 636, 3980, 4770, 'turtle'], [5260, 650, 5030, 5600],
    [6070, 636, 5840, 6400, 'turtle'],
];

const blockRows: { x: number; y: number; pattern: string }[] = [
    { x: 360, y: 500, pattern: 'bqbmb' },
    { x: 472, y: 330, pattern: 'q' },
    { x: 1120, y: 485, pattern: 'bbqbb' },
    { x: 1390, y: 315, pattern: 'bqb' },
    { x: 2020, y: 500, pattern: 'bqub' },
    { x: 2250, y: 320, pattern: 'bbqb' },
    { x: 2680, y: 500, pattern: 'bqb' },
    { x: 3190, y: 490, pattern: 'bbqbb' },
    { x: 3470, y: 310, pattern: 'bqb' },
    { x: 3900, y: 490, pattern: 'bubbb' },
    { x: 4430, y: 310, pattern: 'bqb' },
    { x: 4920, y: 485, pattern: 'bbqbb' },
    { x: 5430, y: 315, pattern: 'bqb' },
    { x: 6140, y: 475, pattern: 'bbbqb' },
    { x: 7310, y: 505, pattern: 'bqbub' },
    { x: 7590, y: 305, pattern: 'bqbbqb' },
];

const undergroundPlatforms: Platform[] = [
    { x: 0, y: GROUND_Y, width: 1210, height: 160, kind: 'ground' },
    { x: 1330, y: GROUND_Y, width: 1180, height: 160, kind: 'ground' },
    { x: 2650, y: GROUND_Y, width: 950, height: 160, kind: 'ground' },
    { x: 3740, y: GROUND_Y, width: 1010, height: 160, kind: 'ground' },
    { x: 4890, y: GROUND_Y, width: 1040, height: 160, kind: 'ground' },
    { x: 6070, y: GROUND_Y, width: 1330, height: 160, kind: 'ground' },
    { x: 900, y: 580, width: 88, height: 110, kind: 'pipe' },
    { x: 1840, y: 550, width: 92, height: 140, kind: 'pipe' },
    { x: 3130, y: 575, width: 88, height: 115, kind: 'pipe' },
    { x: 4370, y: 545, width: 94, height: 145, kind: 'pipe' },
    { x: 5480, y: 575, width: 88, height: 115, kind: 'pipe' },
    { x: 7080, y: 540, width: 98, height: 150, kind: 'pipe', travel: 'levelExit' },
];

const undergroundCoinPositions = [
    [250, 610], [330, 555], [410, 520], [490, 555], [570, 610], [760, 455],
    [1110, 600], [1390, 610], [1480, 550], [1570, 510], [1660, 550],
    [2060, 450], [2150, 450], [2240, 450], [2420, 610], [2720, 610],
    [2820, 540], [2920, 500], [3020, 540], [3420, 610], [3810, 610],
    [3920, 540], [4030, 500], [4140, 540], [4620, 610], [4960, 610],
    [5070, 545], [5180, 500], [5290, 545], [5760, 610], [6130, 610],
    [6240, 535], [6350, 485], [6460, 535], [6710, 610], [6880, 590],
];

const undergroundEnemyBlueprints: [number, number, number, number, EnemyKind?][] = [
    [620, 650, 510, 860], [1080, 650, 1010, 1190], [1500, 650, 1360, 1790],
    [2210, 636, 1960, 2460, 'turtle'], [2860, 650, 2700, 3070], [3370, 650, 3240, 3550],
    [3970, 636, 3790, 4320, 'turtle'], [4580, 650, 4490, 4710], [5100, 650, 4940, 5430],
    [5700, 650, 5600, 5890], [6280, 636, 6120, 6760, 'turtle'], [6740, 650, 6500, 7010],
];

const undergroundBlockRows: { x: number; y: number; pattern: string }[] = [
    { x: 300, y: 500, pattern: 'bmbqqb' },
    { x: 650, y: 315, pattern: 'bqb' },
    { x: 1060, y: 485, pattern: 'bbq' },
    { x: 1420, y: 500, pattern: 'bqbbb' },
    { x: 2030, y: 490, pattern: 'bbubbb' },
    { x: 2320, y: 305, pattern: 'bqbb' },
    { x: 2740, y: 500, pattern: 'bqbbb' },
    { x: 3300, y: 315, pattern: 'bbqbb' },
    { x: 3820, y: 500, pattern: 'bubqb' },
    { x: 4510, y: 310, pattern: 'bbbq' },
    { x: 4950, y: 500, pattern: 'bqbb' },
    { x: 5660, y: 480, pattern: 'bbubb' },
    { x: 6200, y: 315, pattern: 'bqbbqb' },
    { x: 6610, y: 500, pattern: 'bbqbb' },
];

const skyPlatforms: Platform[] = [
    { x: 0, y: 690, width: 650, height: 180, kind: 'treetop' },
    { x: 760, y: 600, width: 300, height: 270, kind: 'treetop' },
    { x: 1160, y: 515, width: 260, height: 355, kind: 'treetop' },
    { x: 1510, y: 625, width: 360, height: 245, kind: 'treetop' },
    { x: 2000, y: 470, width: 260, height: 400, kind: 'treetop' },
    { x: 2390, y: 585, width: 320, height: 285, kind: 'treetop' },
    { x: 2840, y: 415, width: 270, height: 455, kind: 'treetop' },
    { x: 3230, y: 560, width: 380, height: 310, kind: 'treetop' },
    { x: 3760, y: 450, width: 300, height: 420, kind: 'treetop' },
    { x: 4210, y: 610, width: 340, height: 260, kind: 'treetop' },
    { x: 4690, y: 500, width: 260, height: 370, kind: 'treetop' },
    { x: 5080, y: 385, width: 300, height: 485, kind: 'treetop' },
    { x: 5500, y: 560, width: 420, height: 310, kind: 'treetop' },
    { x: 6040, y: 650, width: 560, height: 220, kind: 'treetop' },
];

const skyCoinPositions = [
    [350, 620], [450, 590], [550, 620], [810, 520], [900, 485], [990, 520],
    [1200, 435], [1285, 395], [1370, 435], [1580, 545], [1670, 510], [1760, 545],
    [2035, 390], [2125, 350], [2210, 390], [2435, 505], [2535, 465], [2635, 505],
    [2880, 335], [2975, 295], [3070, 335], [3290, 480], [3400, 440], [3510, 480],
    [3805, 370], [3905, 330], [4005, 370], [4250, 530], [4360, 490], [4470, 530],
    [4730, 420], [4820, 380], [4910, 420], [5120, 305], [5225, 265], [5330, 305],
    [5560, 480], [5670, 440], [5780, 480], [6100, 575], [6200, 540], [6300, 575],
];

const skyEnemyBlueprints: [number, number, number, number, EnemyKind?][] = [
    [420, 650, 300, 610], [850, 546, 790, 1030, 'turtle'], [1220, 475, 1180, 1400],
    [1600, 571, 1540, 1840, 'turtle'], [2050, 430, 2020, 2240], [2470, 545, 2420, 2680],
    [2910, 361, 2870, 3090, 'turtle'], [3320, 520, 3270, 3580], [3820, 396, 3790, 4030, 'turtle'],
    [4290, 570, 4240, 4520], [4740, 446, 4720, 4930, 'turtle'], [5150, 345, 5110, 5360],
    [5600, 506, 5540, 5890, 'turtle'], [6160, 610, 6080, 6490],
];

const skyBlockRows: { x: number; y: number; pattern: string }[] = [
    { x: 250, y: 500, pattern: 'bqmb' },
    { x: 790, y: 405, pattern: 'bqb' },
    { x: 1190, y: 310, pattern: 'bub' },
    { x: 1580, y: 430, pattern: 'bqbb' },
    { x: 2020, y: 265, pattern: 'bqb' },
    { x: 2420, y: 390, pattern: 'bqmb' },
    { x: 2870, y: 215, pattern: 'bub' },
    { x: 3290, y: 365, pattern: 'bbqb' },
    { x: 3790, y: 250, pattern: 'bqbb' },
    { x: 4250, y: 415, pattern: 'bqb' },
    { x: 4710, y: 300, pattern: 'bub' },
    { x: 5120, y: 185, pattern: 'bqbb' },
    { x: 5580, y: 365, pattern: 'bqmb' },
];

const waterPlatforms: Platform[] = [
    { x: 0, y: GROUND_Y, width: 1100, height: 180, kind: 'ground' },
    { x: 900, y: 550, width: 200, height: 140, kind: 'sidePipe', travel: 'waterIn' },
    { x: WATER_START, y: 0, width: WATER_WORLD_WIDTH - WATER_START, height: 72, kind: 'ground' },
    { x: WATER_START, y: 720, width: WATER_WORLD_WIDTH - WATER_START, height: 150, kind: 'ground' },
    { x: 2250, y: 590, width: 220, height: 130, kind: 'ground' },
    { x: 2680, y: 72, width: 180, height: 250, kind: 'ground' },
    { x: 3090, y: 540, width: 230, height: 180, kind: 'ground' },
    { x: 3530, y: 72, width: 190, height: 300, kind: 'ground' },
    { x: 3970, y: 575, width: 210, height: 145, kind: 'ground' },
    { x: 4420, y: 72, width: 200, height: 270, kind: 'ground' },
    { x: 4870, y: 520, width: 250, height: 200, kind: 'ground' },
    { x: 5350, y: 72, width: 200, height: 315, kind: 'ground' },
    { x: 5790, y: 570, width: 240, height: 150, kind: 'ground' },
    { x: 6260, y: 72, width: 190, height: 250, kind: 'ground' },
    { x: 6810, y: 305, width: 260, height: 190, kind: 'sidePipe', travel: 'waterExit' },
];

const waterCoinPositions = [
    [2050, 390], [2130, 345], [2210, 390], [2370, 500], [2450, 455],
    [2580, 400], [2730, 390], [2820, 440], [2950, 500], [3060, 440],
    [3200, 400], [3330, 340], [3450, 410], [3600, 455], [3740, 500],
    [3890, 450], [4050, 410], [4180, 350], [4320, 410], [4480, 440],
    [4630, 500], [4780, 430], [4950, 390], [5100, 340], [5250, 410],
    [5410, 455], [5570, 505], [5730, 450], [5900, 400], [6070, 345],
    [6220, 400], [6370, 455], [6510, 410], [6640, 390],
];

const waterEnemyBlueprints: [number, number, number, number, EnemyKind?][] = [
    [2140, 270, 2020, 2480, 'fish'], [2480, 500, 2320, 2700, 'fish'],
    [2890, 220, 2760, 3180, 'fish'], [3280, 470, 3140, 3500, 'fish'],
    [3740, 260, 3600, 3970, 'fish'], [4160, 490, 4020, 4380, 'fish'],
    [4590, 220, 4440, 4820, 'fish'], [5080, 440, 4900, 5300, 'fish'],
    [5530, 250, 5390, 5750, 'fish'], [6020, 470, 5850, 6230, 'fish'],
    [6450, 230, 6290, 6700, 'fish'],
];

const waterBlockRows: { x: number; y: number; pattern: string }[] = [
    { x: 2360, y: 350, pattern: 'bqb' },
    { x: 3000, y: 275, pattern: 'bmb' },
    { x: 3860, y: 330, pattern: 'bub' },
    { x: 4720, y: 255, pattern: 'bqb' },
    { x: 5650, y: 320, pattern: 'bmb' },
    { x: 6380, y: 410, pattern: 'bqb' },
];

const COIN_BLOCK_COUNT = blockRows.reduce((total, row) => total + row.pattern.split('').filter((kind) => kind === 'q').length, 0);
const TOTAL_COINS = coinPositions.length + COIN_BLOCK_COUNT;
const UNDERGROUND_COIN_BLOCK_COUNT = undergroundBlockRows.reduce((total, row) => total + row.pattern.split('').filter((kind) => kind === 'q').length, 0);
const UNDERGROUND_TOTAL_COINS = undergroundCoinPositions.length + UNDERGROUND_COIN_BLOCK_COUNT;
const SKY_COIN_BLOCK_COUNT = skyBlockRows.reduce((total, row) => total + row.pattern.split('').filter((kind) => kind === 'q').length, 0);
const SKY_TOTAL_COINS = skyCoinPositions.length + SKY_COIN_BLOCK_COUNT;
const WATER_COIN_BLOCK_COUNT = waterBlockRows.reduce((total, row) => total + row.pattern.split('').filter((kind) => kind === 'q').length, 0);
const WATER_TOTAL_COINS = waterCoinPositions.length + WATER_COIN_BLOCK_COUNT;

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
    isBig: false,
    hasFire: false,
    fireCooldown: 0,
    swimCooldown: 0,
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
    const [snapshot, setSnapshot] = useState<GameSnapshot>({
        coins: { bora: 0, gozde: 0 },
        lives: { bora: 5, gozde: 5 },
        phase: 'intro',
        sound: true,
    });
    const [runId, setRunId] = useState(0);
    const [selectedLevel, setSelectedLevel] = useState<LevelId>('1-1');
    const [showLevelSelect, setShowLevelSelect] = useState(false);
    const isUndergroundLevel = selectedLevel === '1-2';
    const isSkyLevel = selectedLevel === '1-3';
    const isWaterLevel = selectedLevel === '1-4';
    const totalCoins = isUndergroundLevel ? UNDERGROUND_TOTAL_COINS : isSkyLevel ? SKY_TOTAL_COINS : isWaterLevel ? WATER_TOTAL_COINS : TOTAL_COINS;

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
        setSnapshot({ coins: { bora: 0, gozde: 0 }, lives: { bora: 5, gozde: 5 }, phase: 'playing', sound: soundRef.current });
        setRunId((value) => value + 1);
    }, [beep]);

    const toggleSound = () => {
        soundRef.current = !soundRef.current;
        setSnapshot((current) => ({ ...current, sound: soundRef.current }));
        if (soundRef.current) beep(520, 0.08);
    };

    const chooseLevel = (level: LevelId) => {
        if (level === '1-5') return;
        setSelectedLevel(level);
        setSnapshot({ coins: { bora: 0, gozde: 0 }, lives: { bora: 5, gozde: 5 }, phase: 'intro', sound: soundRef.current });
        setRunId((value) => value + 1);
        setShowLevelSelect(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    useEffect(() => {
        const previousTitle = document.title;
        document.title = `İki Kişilik Macera ${selectedLevel} • Bora & Gözde`;
        return () => { document.title = previousTitle; };
    }, [selectedLevel]);

    useEffect(() => {
        const down = (event: KeyboardEvent) => {
            const key = event.key.toLowerCase();
            if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'enter', ' ', 'w', 'a', 's', 'd', 'f'].includes(key)) event.preventDefault();
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

        const activePlatforms = (isUndergroundLevel ? undergroundPlatforms : isSkyLevel ? skyPlatforms : isWaterLevel ? waterPlatforms : platforms).map((platform) => ({ ...platform }));
        const activeCoinPositions = isUndergroundLevel ? undergroundCoinPositions : isSkyLevel ? skyCoinPositions : isWaterLevel ? waterCoinPositions : coinPositions;
        const activeBlockRows = isUndergroundLevel ? undergroundBlockRows : isSkyLevel ? skyBlockRows : isWaterLevel ? waterBlockRows : blockRows;
        const activeEnemyBlueprints = isUndergroundLevel ? undergroundEnemyBlueprints : isSkyLevel ? skyEnemyBlueprints : isWaterLevel ? waterEnemyBlueprints : enemyBlueprints;
        const activeWorldWidth = isUndergroundLevel ? UNDERGROUND_WORLD_WIDTH : isSkyLevel ? SKY_WORLD_WIDTH : isWaterLevel ? WATER_WORLD_WIDTH : MAIN_WORLD_WIDTH;
        const finishWorldX = isSkyLevel ? 6240 : 6370;
        const finishBaseY = isSkyLevel ? 650 : GROUND_Y;
        const players = [makePlayer('bora', 150), makePlayer('gozde', 220)];
        if (isUndergroundLevel) players.forEach((player) => { player.y = 90; });
        const coins: Coin[] = activeCoinPositions.map(([x, y]) => ({ x, y, taken: false }));
        const blocks = activeBlockRows.reduce<WorldBlock[]>((result, row) => {
            row.pattern.split('').forEach((kind, index) => result.push({
                x: row.x + index * 56,
                y: row.y,
                width: 56,
                height: 56,
                kind: kind === 'q' || kind === 'm' || kind === 'u' ? 'question' : 'brick',
                reward: kind === 'u' ? 'upgrade' : kind === 'm' ? 'growth' : kind === 'q' ? 'coin' : 'none',
                used: false,
                destroyed: false,
                bump: 0,
                coinAnimation: 0,
            }));
            return result;
        }, []);
        const powerUps: PowerUp[] = [];
        const fireballs: Fireball[] = [];
        const enemies: Enemy[] = activeEnemyBlueprints.map(([x, y, minX, maxX, kind = 'goomba'], index) => ({
            x,
            y,
            minX,
            maxX,
            kind,
            state: 'walking',
            width: kind === 'turtle' ? 50 : kind === 'fish' ? 54 : 52,
            height: kind === 'turtle' ? 54 : kind === 'fish' ? 34 : 40,
            vx: index % 2 ? 82 : -82,
            vy: 0,
            alive: true,
            dangerousAt: 0,
            swimPhase: index * 0.9,
            baseY: y,
        }));
        let cameraX = 0;
        let coinCount = 0;
        const playerCoins: PlayerCounter = { bora: 0, gozde: 0 };
        const playerLives: PlayerCounter = { bora: 5, gozde: 5 };
        let lastTime = performance.now();
        let active = snapshot.phase === 'playing';
        let finishTimer = 0;
        let inBonus = false;
        let inWater = false;
        let pipeCooldown = 0;
        let pipeFlash = 0;
        let pipeTransition: {
            pipe: Platform;
            travel: Exclude<Platform['travel'], undefined>;
            direction: 'down' | 'right';
            elapsed: number;
            starts: { x: number; y: number }[];
        } | null = null;
        const particles: { x: number; y: number; vx: number; vy: number; life: number; color: string }[] = [];

        const playTone = (frequency: number, duration?: number, type?: OscillatorType) => beep(frequency, duration, type);

        const burst = (x: number, y: number, color: string, count = 8) => {
            for (let i = 0; i < count; i += 1) {
                const angle = (Math.PI * 2 * i) / count;
                particles.push({ x, y, vx: Math.cos(angle) * (80 + Math.random() * 110), vy: Math.sin(angle) * (80 + Math.random() * 110), life: 0.55, color });
            }
        };

        const respawn = (player: Player) => {
            player.isBig = false;
            player.hasFire = false;
            player.fireCooldown = 0;
            player.swimCooldown = 0;
            player.height = 66;
            player.x = player.checkpoint;
            if (isWaterLevel && inWater) {
                player.y = 360;
            } else {
                const spawnCenter = player.checkpoint + player.width / 2;
                const spawnPlatform = activePlatforms
                    .filter((platform) => spawnCenter >= platform.x && spawnCenter <= platform.x + platform.width)
                    .sort((a, b) => a.y - b.y)[0];
                player.y = (spawnPlatform?.y ?? GROUND_Y) - player.height;
            }
            player.vx = 0;
            player.vy = 0;
            player.invincibleUntil = performance.now() + 1800;
        };

        const hurt = (player: Player, fell = false) => {
            if (!active) return;
            if (!fell && performance.now() < player.invincibleUntil) return;
            if (!fell && player.hasFire) {
                player.hasFire = false;
                player.invincibleUntil = performance.now() + 1800;
                burst(player.x + player.width / 2, player.y + player.height / 2, '#ffdd65', 16);
                playTone(310, 0.12, 'sawtooth');
                window.setTimeout(() => playTone(220, 0.17, 'sawtooth'), 85);
                return;
            }
            if (!fell && player.isBig) {
                const feet = player.y + player.height;
                player.isBig = false;
                player.height = 66;
                player.y = feet - player.height;
                player.invincibleUntil = performance.now() + 1800;
                burst(player.x + player.width / 2, player.y + player.height / 2, '#fff4a8', 14);
                playTone(220, 0.16, 'sawtooth');
                window.setTimeout(() => playTone(165, 0.18, 'sawtooth'), 90);
                return;
            }
            playerLives[player.id] -= 1;
            burst(player.x + player.width / 2, player.y + player.height / 2, player.color, 12);
            playTone(145, 0.22, 'sawtooth');
            if (playerLives[player.id] <= 0) {
                active = false;
                setSnapshot((current) => ({ ...current, lives: { ...playerLives }, phase: 'gameover' }));
            } else {
                respawn(player);
                setSnapshot((current) => ({ ...current, lives: { ...playerLives } }));
            }
        };

        const spawnPowerUpPair = (block: WorldBlock, isUpgrade: boolean) => {
            players.forEach((player, index) => {
                const kind: PowerUp['kind'] = isUpgrade && player.isBig ? 'fire' : 'growth';
                powerUps.push({
                    kind,
                    target: player.id,
                    x: block.x + 8,
                    y: block.y,
                    width: 40,
                    height: 40,
                    vx: index === 0 ? -125 : 125,
                    vy: 0,
                    emerging: 0.62,
                    active: true,
                    color: player.color,
                });
            });
            burst(block.x + block.width / 2, block.y - 8, '#fff4a8', 12);
            playTone(392, 0.08, 'triangle');
            window.setTimeout(() => playTone(523, 0.08, 'triangle'), 80);
            window.setTimeout(() => playTone(659, 0.14, 'triangle'), 160);
        };

        const updatePlayer = (player: Player, dt: number) => {
            const keys = keysRef.current;
            const touch = touchRef.current;
            const left = player.id === 'bora' ? keys.has('a') || touch.has('bora-left') : keys.has('arrowleft') || touch.has('gozde-left');
            const right = player.id === 'bora' ? keys.has('d') || touch.has('bora-right') : keys.has('arrowright') || touch.has('gozde-right');
            const jump = player.id === 'bora' ? keys.has('w') || keys.has(' ') || touch.has('bora-jump') : keys.has('arrowup') || touch.has('gozde-jump');
            const fire = player.id === 'bora' ? keys.has('f') || touch.has('bora-fire') : keys.has('enter') || touch.has('gozde-fire');
            const swimming = isWaterLevel && inWater;

            const direction = Number(right) - Number(left);
            player.vx += direction * (swimming ? 1450 : 2500) * dt;
            player.vx *= Math.pow(swimming ? 0.025 : 0.0007, dt);
            const maximumSpeed = swimming ? PLAYER_SPEED * 0.72 : PLAYER_SPEED;
            player.vx = clamp(player.vx, -maximumSpeed, maximumSpeed);
            if (direction) player.direction = direction as 1 | -1;
            player.swimCooldown = Math.max(0, player.swimCooldown - dt);
            if (swimming && jump && player.swimCooldown <= 0) {
                player.vy = Math.max(player.vy - 360, -520);
                player.swimCooldown = 0.28;
                playTone(player.id === 'bora' ? 440 : 520, 0.055, 'sine');
                burst(player.x + player.width / 2, player.y + player.height, 'rgba(210,245,255,.85)', 4);
            } else if (!swimming && jump && player.grounded) {
                player.vy = -JUMP_SPEED;
                player.grounded = false;
                playTone(player.id === 'bora' ? 340 : 410, 0.07);
            }
            player.fireCooldown = Math.max(0, player.fireCooldown - dt);
            if (fire && player.hasFire && player.fireCooldown <= 0 && fireballs.filter((fireball) => fireball.active && fireball.owner === player.id).length < 2) {
                fireballs.push({
                    owner: player.id,
                    x: player.direction === 1 ? player.x + player.width - 2 : player.x - 16,
                    y: player.y + player.height * 0.42,
                    width: 18,
                    height: 18,
                    vx: player.direction * 590,
                    vy: -175,
                    active: true,
                    life: 3.2,
                    color: player.color,
                });
                player.fireCooldown = 0.34;
                playTone(player.id === 'bora' ? 620 : 720, 0.055, 'square');
            }

            const previousX = player.x;
            const previousY = player.y;
            player.vy += GRAVITY * (swimming ? 0.16 : 1) * dt;
            if (swimming) player.vy = clamp(player.vy, -520, 250);
            player.x += player.vx * dt;
            player.y += player.vy * dt;
            const minimumX = inBonus ? BONUS_START : swimming ? WATER_START : 0;
            const maximumX = (inBonus ? BONUS_END : activeWorldWidth) - player.width;
            player.x = clamp(player.x, minimumX, maximumX);
            player.grounded = false;

            for (const platform of activePlatforms) {
                const wasAbove = previousY + player.height <= platform.y + 10;
                const wasBelow = previousY >= platform.y + platform.height - 10;
                if (wasAbove && player.vy >= 0 && intersects(player, platform)) {
                    player.y = platform.y - player.height;
                    player.vy = 0;
                    player.grounded = true;
                } else if (swimming && wasBelow && player.vy < 0 && intersects(player, platform)) {
                    player.y = platform.y + platform.height;
                    player.vy = 0;
                } else if ((platform.kind === 'pipe' || platform.kind === 'sidePipe' || swimming) && intersects(player, platform)) {
                    if (previousX + player.width <= platform.x + 10) player.x = platform.x - player.width;
                    else if (previousX >= platform.x + platform.width - 10) player.x = platform.x + platform.width;
                    player.vx = 0;
                }
            }

            for (const block of blocks) {
                if (block.destroyed) continue;
                const wasAbove = previousY + player.height <= block.y + 10;
                const wasBelow = previousY >= block.y + block.height - 10;
                if (wasAbove && player.vy >= 0 && intersects(player, block)) {
                    player.y = block.y - player.height;
                    player.vy = 0;
                    player.grounded = true;
                } else if (wasBelow && player.vy < 0 && intersects(player, block)) {
                    player.y = block.y + block.height;
                    player.vy = 95;
                    if (block.kind === 'brick' && player.isBig) {
                        block.destroyed = true;
                        block.bump = 0;
                        burst(block.x + block.width / 2, block.y + block.height / 2, isUndergroundLevel ? '#6f8bc7' : '#d77a43', 18);
                        playTone(125, 0.07, 'square');
                        window.setTimeout(() => playTone(92, 0.09, 'square'), 45);
                        continue;
                    }
                    block.bump = 0.18;
                    if (block.kind === 'question' && !block.used) {
                        block.used = true;
                        if (block.reward === 'growth' || block.reward === 'upgrade') {
                            spawnPowerUpPair(block, block.reward === 'upgrade');
                        } else {
                            block.coinAnimation = 0.65;
                            const updatedCoinCount = coinCount + 1;
                            coinCount = updatedCoinCount;
                            playerCoins[player.id] += 1;
                            burst(block.x + block.width / 2, block.y - 8, '#ffe047', 8);
                            playTone(740, 0.06, 'sine');
                            window.setTimeout(() => playTone(980, 0.06, 'sine'), 45);
                            setSnapshot((current) => ({ ...current, coins: { ...playerCoins } }));
                        }
                    } else playTone(165, 0.05, 'square');
                } else if (intersects(player, block)) {
                    if (previousX + player.width <= block.x + 10) player.x = block.x - player.width;
                    else if (previousX >= block.x + block.width - 10) player.x = block.x + block.width;
                    player.vx = 0;
                }
            }

            if (!inBonus && isUndergroundLevel) {
                if (player.x > 1320) player.checkpoint = 1380;
                if (player.x > 3730) player.checkpoint = 3790;
                if (player.x > 6060) player.checkpoint = 6120;
            } else if (isWaterLevel && inWater) {
                if (player.x > 3000) player.checkpoint = 3000;
                if (player.x > 4750) player.checkpoint = 4750;
                if (player.x > 6200) player.checkpoint = 6200;
            } else if (isSkyLevel) {
                if (player.x > 1750) player.checkpoint = 1600;
                if (player.x > 3550) player.checkpoint = 3300;
                if (player.x > 5700) player.checkpoint = 5570;
            } else if (!inBonus) {
                if (player.x > 1750) player.checkpoint = 1900;
                if (player.x > 3800) player.checkpoint = 3950;
                if (player.x > 5650) player.checkpoint = 5820;
            }
            if (player.y > GAME_HEIGHT + 140) hurt(player, true);
        };

        const update = (dt: number) => {
            if (!active) return;
            pipeCooldown = Math.max(0, pipeCooldown - dt);
            pipeFlash = Math.max(0, pipeFlash - dt);

            const transition = pipeTransition;
            if (transition) {
                transition.elapsed += dt;
                const enterDuration = 0.62;
                const progress = clamp(transition.elapsed / enterDuration, 0, 1);
                const eased = progress * progress * (3 - 2 * progress);
                players.forEach((player, index) => {
                    const targetX = transition.direction === 'right'
                        ? transition.pipe.x + 48 + index * 32
                        : transition.pipe.x + 3 + index * (transition.pipe.width - 6 - player.width);
                    const targetY = transition.direction === 'right'
                        ? transition.pipe.y + (transition.pipe.height - player.height) / 2 + (index === 0 ? -18 : 18)
                        : transition.pipe.y + 8;
                    player.x = transition.starts[index].x + (targetX - transition.starts[index].x) * eased;
                    player.y = transition.starts[index].y + (targetY - transition.starts[index].y) * eased;
                    player.vx = 0;
                    player.vy = 0;
                    player.grounded = false;
                });

                if (transition.elapsed > 0.48) {
                    pipeFlash = Math.max(pipeFlash, clamp((transition.elapsed - 0.48) * 2.2, 0, 0.55));
                }

                if (transition.elapsed >= 0.78) {
                    if (transition.travel === 'levelExit' || transition.travel === 'waterExit') {
                        active = false;
                        playTone(523, 0.12, 'triangle');
                        window.setTimeout(() => playTone(659, 0.12, 'triangle'), 110);
                        window.setTimeout(() => playTone(784, 0.24, 'triangle'), 220);
                        setSnapshot((current) => ({ ...current, phase: 'won' }));
                    } else if (transition.travel === 'waterIn') {
                        inWater = true;
                        players.forEach((player, index) => {
                            player.x = WATER_START + 120 + index * 82;
                            player.y = 330 + index * 100;
                            player.vx = 0;
                            player.vy = 0;
                            player.checkpoint = WATER_START + 120;
                            player.invincibleUntil = performance.now() + 1100;
                        });
                        cameraX = WATER_START;
                        pipeCooldown = 1;
                        pipeFlash = 0.55;
                        playTone(260, 0.1, 'sine');
                        window.setTimeout(() => playTone(195, 0.16, 'sine'), 100);
                    } else {
                        inBonus = transition.travel === 'bonusIn';
                        const destinations = inBonus ? [7070, 7140] : [1930, 2000];
                        players.forEach((player, index) => {
                            player.x = destinations[index];
                            player.y = GROUND_Y - player.height;
                            player.vx = 0;
                            player.vy = 0;
                            player.checkpoint = inBonus ? BONUS_START + 120 : 1900;
                            player.invincibleUntil = performance.now() + 900;
                        });
                        cameraX = inBonus ? BONUS_START : 1820;
                        pipeCooldown = 1;
                        pipeFlash = 0.55;
                        playTone(inBonus ? 240 : 330, 0.1, 'triangle');
                        window.setTimeout(() => playTone(inBonus ? 180 : 440, 0.14, 'triangle'), 90);
                    }
                    pipeTransition = null;
                }
                return;
            }

            players.forEach((player) => updatePlayer(player, dt));

            if (pipeCooldown <= 0) {
                const travelPipe = activePlatforms.find((platform) => {
                    if (!platform.travel) return false;
                    if (platform.travel === 'waterIn' || platform.travel === 'waterExit') return false;
                    if (platform.travel === 'bonusIn' && inBonus) return false;
                    if (platform.travel === 'bonusOut' && !inBonus) return false;
                    if (platform.travel === 'levelExit' && (!isUndergroundLevel || inBonus)) return false;
                    return players.some((player) => {
                        const standingOnPipe = Math.abs(player.y + player.height - platform.y) < 8
                            && player.x + player.width > platform.x + 8
                            && player.x < platform.x + platform.width - 8;
                        const pressingDown = player.id === 'bora'
                            ? keysRef.current.has('s') || touchRef.current.has('bora-down')
                            : keysRef.current.has('arrowdown') || touchRef.current.has('gozde-down');
                        return standingOnPipe && pressingDown;
                    });
                });

                if (travelPipe) {
                    pipeTransition = {
                        pipe: travelPipe,
                        travel: travelPipe.travel!,
                        direction: 'down',
                        elapsed: 0,
                        starts: players.map((player) => ({ x: player.x, y: player.y })),
                    };
                    pipeCooldown = 1.2;
                    players.forEach((player) => { player.vx = 0; player.vy = 0; });
                    playTone(285, 0.08, 'triangle');
                }
            }

            if (pipeCooldown <= 0 && isWaterLevel && !pipeTransition) {
                const sidePipe = activePlatforms.find((platform) => {
                    if (platform.kind !== 'sidePipe') return false;
                    if (platform.travel === 'waterIn' && inWater) return false;
                    if (platform.travel === 'waterExit' && !inWater) return false;
                    return players.every((player) => {
                        const atMouth = Math.abs(player.x + player.width - platform.x) < 14;
                        const insideOpening = player.y + player.height > platform.y + 12
                            && player.y < platform.y + platform.height - 12;
                        return atMouth && insideOpening;
                    });
                });
                if (sidePipe) {
                    pipeTransition = {
                        pipe: sidePipe,
                        travel: sidePipe.travel!,
                        direction: 'right',
                        elapsed: 0,
                        starts: players.map((player) => ({ x: player.x, y: player.y })),
                    };
                    pipeCooldown = 1.2;
                    players.forEach((player) => { player.vx = 0; player.vy = 0; });
                    playTone(300, 0.08, 'triangle');
                }
            }

            enemies.forEach((enemy) => {
                if (!enemy.alive) return;
                const previousEnemyX = enemy.x;
                const previousEnemyY = enemy.y;

                if (enemy.kind === 'fish') {
                    if (!inWater) return;
                    enemy.swimPhase += dt * 2.35;
                    enemy.x += enemy.vx * dt;
                    enemy.y = enemy.baseY + Math.sin(enemy.swimPhase) * 34;
                    if (enemy.x <= enemy.minX || enemy.x + enemy.width >= enemy.maxX) {
                        enemy.x = clamp(enemy.x, enemy.minX, enemy.maxX - enemy.width);
                        enemy.vx *= -1;
                    }
                    for (const player of players) {
                        if (intersects(player, enemy)) hurt(player);
                    }
                    return;
                }

                if (enemy.state !== 'shellStill') enemy.x += enemy.vx * dt;
                enemy.vy += GRAVITY * 0.82 * dt;
                enemy.y += enemy.vy * dt;

                if (enemy.state === 'walking') {
                    if (enemy.x <= enemy.minX || enemy.x + enemy.width >= enemy.maxX) {
                        enemy.x = clamp(enemy.x, enemy.minX, enemy.maxX - enemy.width);
                        enemy.vx *= -1;
                    }
                } else if (enemy.state === 'shellMoving') {
                    const minimumX = inBonus ? BONUS_START : 0;
                    const maximumX = (inBonus ? BONUS_END : activeWorldWidth) - enemy.width;
                    if (enemy.x <= minimumX || enemy.x >= maximumX) {
                        enemy.x = clamp(enemy.x, minimumX, maximumX);
                        enemy.vx *= -1;
                    }
                }

                const solids: Rect[] = [
                    ...activePlatforms,
                    ...blocks.filter((block) => !block.destroyed),
                ];
                for (const solid of solids) {
                    if (!intersects(enemy, solid)) continue;
                    const wasAbove = previousEnemyY + enemy.height <= solid.y + 10;
                    if (wasAbove && enemy.vy >= 0) {
                        enemy.y = solid.y - enemy.height;
                        enemy.vy = 0;
                    } else if (previousEnemyX + enemy.width <= solid.x + 10) {
                        enemy.x = solid.x - enemy.width;
                        enemy.vx = -Math.abs(enemy.vx || 82);
                    } else if (previousEnemyX >= solid.x + solid.width - 10) {
                        enemy.x = solid.x + solid.width;
                        enemy.vx = Math.abs(enemy.vx || 82);
                    }
                }

                if (enemy.state === 'shellMoving') {
                    enemies.forEach((other) => {
                        if (other === enemy || !other.alive || !intersects(enemy, other)) return;
                        other.alive = false;
                        burst(other.x + other.width / 2, other.y + other.height / 2, '#ffd43b', 11);
                        playTone(170, 0.06, 'square');
                    });
                }

                if (enemy.y > GAME_HEIGHT + 120) {
                    enemy.alive = false;
                    return;
                }

                for (const player of players) {
                    if (!enemy.alive || !intersects(player, enemy)) continue;
                    const landed = player.vy > 120 && player.y + player.height - enemy.y < 24;

                    if (enemy.kind === 'turtle' && enemy.state === 'walking') {
                        if (!landed) {
                            hurt(player);
                            continue;
                        }
                        const feet = enemy.y + enemy.height;
                        enemy.state = 'shellStill';
                        enemy.height = 30;
                        enemy.y = feet - enemy.height;
                        enemy.vx = 0;
                        player.vy = -470;
                        burst(enemy.x + enemy.width / 2, enemy.y, '#9fdb58', 9);
                        playTone(210, 0.07, 'square');
                        break;
                    }

                    if (enemy.kind === 'turtle' && enemy.state === 'shellStill') {
                        const playerCenter = player.x + player.width / 2;
                        const shellCenter = enemy.x + enemy.width / 2;
                        enemy.state = 'shellMoving';
                        enemy.vx = playerCenter <= shellCenter ? 570 : -570;
                        enemy.dangerousAt = performance.now() + 320;
                        enemy.x += Math.sign(enemy.vx) * 8;
                        if (landed) player.vy = -430;
                        burst(shellCenter, enemy.y + enemy.height / 2, '#d8ff8a', 8);
                        playTone(330, 0.06, 'square');
                        break;
                    }

                    if (enemy.kind === 'turtle' && enemy.state === 'shellMoving') {
                        if (landed) {
                            enemy.state = 'shellStill';
                            enemy.vx = 0;
                            player.vy = -470;
                            enemy.dangerousAt = performance.now() + 250;
                            playTone(190, 0.06, 'square');
                        } else if (performance.now() >= enemy.dangerousAt) hurt(player);
                        continue;
                    }

                    if (landed) {
                        enemy.alive = false;
                        player.vy = -470;
                        burst(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, '#ffd43b', 9);
                        playTone(185, 0.07);
                        window.setTimeout(() => playTone(265, 0.08), 55);
                    } else hurt(player);
                }
            });

            coins.forEach((coin) => {
                if (coin.taken) return;
                const coinRect = { x: coin.x - 14, y: coin.y - 18, width: 28, height: 36 };
                const collector = players.find((player) => intersects(player, coinRect));
                if (collector) {
                    coin.taken = true;
                    coinCount += 1;
                    playerCoins[collector.id] += 1;
                    burst(coin.x, coin.y, '#ffe047', 7);
                    playTone(740, 0.06, 'sine');
                    window.setTimeout(() => playTone(980, 0.06, 'sine'), 45);
                    setSnapshot((current) => ({ ...current, coins: { ...playerCoins } }));
                }
            });

            blocks.forEach((block) => {
                if (block.destroyed) return;
                block.bump = Math.max(0, block.bump - dt);
                block.coinAnimation = Math.max(0, block.coinAnimation - dt);
            });

            powerUps.forEach((powerUp) => {
                if (!powerUp.active) return;
                if (powerUp.emerging > 0) {
                    powerUp.emerging = Math.max(0, powerUp.emerging - dt);
                    powerUp.y -= 65 * dt;
                    return;
                }

                const previousX = powerUp.x;
                const previousY = powerUp.y;
                powerUp.vy += GRAVITY * 0.78 * dt;
                powerUp.x += powerUp.vx * dt;
                powerUp.y += powerUp.vy * dt;

                activePlatforms.forEach((platform) => {
                    if (!intersects(powerUp, platform)) return;
                    const wasAbove = previousY + powerUp.height <= platform.y + 9;
                    if (wasAbove && powerUp.vy >= 0) {
                        powerUp.y = platform.y - powerUp.height;
                        powerUp.vy = 0;
                    } else if (platform.kind === 'pipe') {
                        if (previousX + powerUp.width <= platform.x + 8) powerUp.x = platform.x - powerUp.width;
                        else if (previousX >= platform.x + platform.width - 8) powerUp.x = platform.x + platform.width;
                        powerUp.vx *= -1;
                    }
                });

                blocks.forEach((block) => {
                    if (block.destroyed) return;
                    if (!intersects(powerUp, block)) return;
                    const wasAbove = previousY + powerUp.height <= block.y + 9;
                    if (wasAbove && powerUp.vy >= 0) {
                        powerUp.y = block.y - powerUp.height;
                        powerUp.vy = 0;
                    } else {
                        if (previousX + powerUp.width <= block.x + 8) powerUp.x = block.x - powerUp.width;
                        else if (previousX >= block.x + block.width - 8) powerUp.x = block.x + block.width;
                        powerUp.vx *= -1;
                    }
                });

                const minimumX = inBonus ? BONUS_START : 0;
                const maximumX = (inBonus ? BONUS_END : activeWorldWidth) - powerUp.width;
                if (powerUp.x <= minimumX || powerUp.x >= maximumX) {
                    powerUp.x = clamp(powerUp.x, minimumX, maximumX);
                    powerUp.vx *= -1;
                }

                const collector = players.find((player) => player.id === powerUp.target
                    && intersects(player, powerUp)
                    && (powerUp.kind === 'growth' ? !player.isBig : player.isBig && !player.hasFire));
                if (collector) {
                    if (powerUp.kind === 'growth') {
                        const feet = collector.y + collector.height;
                        collector.isBig = true;
                        collector.height = 90;
                        collector.y = feet - collector.height;
                    } else {
                        collector.hasFire = true;
                    }
                    collector.invincibleUntil = performance.now() + 650;
                    powerUp.active = false;
                    burst(collector.x + collector.width / 2, collector.y + collector.height / 2, powerUp.kind === 'fire' ? '#ffd84e' : powerUp.color, 18);
                    playTone(523, 0.1, 'triangle');
                    window.setTimeout(() => playTone(659, 0.1, 'triangle'), 90);
                    window.setTimeout(() => playTone(784, 0.18, 'triangle'), 180);
                }

                if (powerUp.y > GAME_HEIGHT + 160) powerUp.active = false;
            });

            fireballs.forEach((fireball) => {
                if (!fireball.active) return;
                const previousY = fireball.y;
                fireball.life -= dt;
                fireball.vy += GRAVITY * 0.72 * dt;
                fireball.x += fireball.vx * dt;
                fireball.y += fireball.vy * dt;

                activePlatforms.forEach((platform) => {
                    if (!fireball.active || !intersects(fireball, platform)) return;
                    const wasAbove = previousY + fireball.height <= platform.y + 8;
                    if (wasAbove && fireball.vy >= 0) {
                        fireball.y = platform.y - fireball.height;
                        fireball.vy = -390;
                    } else fireball.active = false;
                });

                blocks.forEach((block) => {
                    if (block.destroyed) return;
                    if (!fireball.active || !intersects(fireball, block)) return;
                    const wasAbove = previousY + fireball.height <= block.y + 8;
                    if (wasAbove && fireball.vy >= 0) {
                        fireball.y = block.y - fireball.height;
                        fireball.vy = -390;
                    } else fireball.active = false;
                });

                enemies.forEach((enemy) => {
                    if (!fireball.active || !enemy.alive || !intersects(fireball, enemy)) return;
                    enemy.alive = false;
                    fireball.active = false;
                    burst(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, '#ffb52e', 14);
                    playTone(190, 0.07, 'square');
                    window.setTimeout(() => playTone(120, 0.09, 'square'), 55);
                });

                if (fireball.life <= 0 || fireball.y > GAME_HEIGHT + 100 || fireball.x < 0 || fireball.x > (inBonus ? BONUS_END : activeWorldWidth)) fireball.active = false;
            });

            const bothAtFinish = (selectedLevel === '1-1' || selectedLevel === '1-3') && !inBonus
                && players.every((player) => player.x > finishWorldX - 50);
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
            const cameraMin = inBonus ? BONUS_START : isWaterLevel && inWater ? WATER_START : 0;
            const cameraMax = (inBonus ? BONUS_END : activeWorldWidth) - GAME_WIDTH;
            const target = clamp(middle - GAME_WIDTH * 0.42, cameraMin, cameraMax);
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
            if (isWaterLevel && inWater) {
                const ocean = context.createLinearGradient(0, 0, 0, GAME_HEIGHT);
                ocean.addColorStop(0, '#159bd0');
                ocean.addColorStop(0.48, '#0879ae');
                ocean.addColorStop(1, '#075582');
                context.fillStyle = ocean;
                context.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

                const glow = context.createRadialGradient(GAME_WIDTH * 0.54, 12, 10, GAME_WIDTH * 0.54, 12, 620);
                glow.addColorStop(0, 'rgba(205,249,255,.32)');
                glow.addColorStop(1, 'rgba(205,249,255,0)');
                context.fillStyle = glow;
                context.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

                context.strokeStyle = 'rgba(204,250,255,.16)';
                context.lineWidth = 6;
                for (let row = 0; row < 5; row += 1) {
                    context.beginPath();
                    for (let x = -80; x <= GAME_WIDTH + 80; x += 40) {
                        const y = 105 + row * 105 + Math.sin((x + cameraX * 0.15) * 0.012 + row) * 13;
                        if (x === -80) context.moveTo(x, y);
                        else context.lineTo(x, y);
                    }
                    context.stroke();
                }

                for (let i = 0; i < 24; i += 1) {
                    const x = ((i * 173 - cameraX * 0.22) % (GAME_WIDTH + 120) + GAME_WIDTH + 120) % (GAME_WIDTH + 120) - 60;
                    const y = 110 + ((i * 97) % 560);
                    const radius = 4 + (i % 4) * 2;
                    context.strokeStyle = 'rgba(220,252,255,.5)';
                    context.lineWidth = 2;
                    context.beginPath(); context.arc(x, y, radius, 0, Math.PI * 2); context.stroke();
                }

                context.globalAlpha = 0.34;
                for (let i = -1; i < 12; i += 1) {
                    const x = i * 160 - (cameraX * 0.12) % 160;
                    const height = 65 + (i % 4) * 28;
                    context.strokeStyle = i % 2 ? '#52d3a4' : '#38b887';
                    context.lineWidth = 12;
                    context.beginPath();
                    context.moveTo(x, 735);
                    context.bezierCurveTo(x - 20, 700 - height * 0.25, x + 28, 690 - height * 0.7, x + (i % 2 ? 10 : -12), 725 - height);
                    context.stroke();
                }
                context.globalAlpha = 1;
                return;
            }

            if (isSkyLevel && !inBonus) {
                const sky = context.createLinearGradient(0, 0, 0, GAME_HEIGHT);
                sky.addColorStop(0, '#4fb8ff');
                sky.addColorStop(0.62, '#bdeaff');
                sky.addColorStop(1, '#f6fbff');
                context.fillStyle = sky;
                context.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

                context.fillStyle = '#fff0a0';
                context.beginPath(); context.arc(1180, 135, 70, 0, Math.PI * 2); context.fill();
                context.strokeStyle = 'rgba(255,255,255,.62)';
                context.lineWidth = 10;
                context.stroke();

                for (let i = -2; i < 10; i += 1) {
                    drawCloud(i * 260 - (cameraX * 0.16) % 260, 105 + (i % 4) * 92, 0.72 + (i % 3) * 0.18);
                }

                context.globalAlpha = 0.18;
                for (let i = -1; i < 12; i += 1) {
                    const x = i * 220 - (cameraX * 0.24) % 220;
                    const top = 540 + (i % 3) * 35;
                    context.fillStyle = '#39776f';
                    context.fillRect(x + 72, top, 42, GAME_HEIGHT - top);
                    context.fillStyle = '#55aa78';
                    context.beginPath(); context.ellipse(x + 92, top, 105, 32, 0, 0, Math.PI * 2); context.fill();
                }
                context.globalAlpha = 1;

                const mist = context.createLinearGradient(0, 620, 0, GAME_HEIGHT);
                mist.addColorStop(0, 'rgba(255,255,255,0)');
                mist.addColorStop(1, 'rgba(255,255,255,.92)');
                context.fillStyle = mist;
                context.fillRect(0, 600, GAME_WIDTH, GAME_HEIGHT - 600);
                return;
            }

            if (inBonus || isUndergroundLevel) {
                const underground = context.createLinearGradient(0, 0, 0, GAME_HEIGHT);
                underground.addColorStop(0, '#17213d');
                underground.addColorStop(1, '#29365b');
                context.fillStyle = underground;
                context.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

                context.strokeStyle = 'rgba(132,153,204,.17)';
                context.lineWidth = 3;
                const brickWidth = 96;
                const brickHeight = 54;
                for (let row = 0; row < 13; row += 1) {
                    const offset = row % 2 ? brickWidth / 2 : 0;
                    for (let column = -1; column < 17; column += 1) {
                        context.strokeRect(column * brickWidth + offset - (cameraX * 0.08) % brickWidth, row * brickHeight, brickWidth, brickHeight);
                    }
                }

                context.fillStyle = 'rgba(83,205,255,.1)';
                context.beginPath(); context.ellipse(250, 650, 330, 190, 0, Math.PI, Math.PI * 2); context.fill();
                context.beginPath(); context.ellipse(1120, 650, 390, 230, 0, Math.PI, Math.PI * 2); context.fill();

                [210, 720, 1230].forEach((x) => {
                    const glow = context.createRadialGradient(x, 165, 0, x, 165, 105);
                    glow.addColorStop(0, 'rgba(255,190,74,.34)');
                    glow.addColorStop(1, 'rgba(255,190,74,0)');
                    context.fillStyle = glow;
                    context.fillRect(x - 110, 55, 220, 220);
                    context.fillStyle = '#ffcc55';
                    context.beginPath(); context.arc(x, 165, 9, 0, Math.PI * 2); context.fill();
                });
                return;
            }

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

            const water = context.createLinearGradient(0, GROUND_Y, 0, GAME_HEIGHT);
            water.addColorStop(0, '#279fd1');
            water.addColorStop(1, '#125d9c');
            context.fillStyle = water;
            context.fillRect(0, GROUND_Y, GAME_WIDTH, GAME_HEIGHT - GROUND_Y);
            context.strokeStyle = 'rgba(255,255,255,.72)';
            context.lineWidth = 5;
            for (let x = -60 - (cameraX * 0.15) % 80; x < GAME_WIDTH + 80; x += 80) {
                context.beginPath();
                context.arc(x, GROUND_Y + 10, 40, 0, Math.PI);
                context.stroke();
            }
        };

        const drawPlatform = (platform: Platform) => {
            const x = platform.x - cameraX;
            if (x > GAME_WIDTH || x + platform.width < 0) return;
            if (platform.kind === 'treetop') {
                const trunkWidth = Math.min(92, platform.width * 0.28);
                const trunkX = x + platform.width / 2 - trunkWidth / 2;
                context.fillStyle = '#75421f';
                context.strokeStyle = '#4b2918';
                context.lineWidth = 5;
                roundRect(trunkX, platform.y + 30, trunkWidth, platform.height - 20, 18);
                context.fill(); context.stroke();
                context.fillStyle = 'rgba(255,205,117,.22)';
                context.fillRect(trunkX + 16, platform.y + 48, 12, Math.max(20, platform.height - 82));

                context.fillStyle = '#2d9a55';
                context.strokeStyle = '#17653b';
                context.lineWidth = 5;
                roundRect(x, platform.y, platform.width, 52, 20);
                context.fill(); context.stroke();
                context.fillStyle = '#57c96e';
                for (let px = 22; px < platform.width; px += 48) {
                    context.beginPath();
                    context.arc(x + px, platform.y + 9, 20, Math.PI, 0);
                    context.fill();
                }
                context.fillStyle = 'rgba(255,255,255,.26)';
                context.fillRect(x + 18, platform.y + 10, Math.max(25, platform.width - 36), 8);
            } else if (platform.kind === 'ground') {
                if (isWaterLevel && inWater) {
                    context.fillStyle = '#284d68';
                    context.fillRect(x, platform.y, platform.width, platform.height);
                    context.fillStyle = '#e7c877';
                    context.fillRect(x, platform.y, platform.width, 20);
                    context.fillStyle = '#f4dd91';
                    for (let px = 12; px < platform.width; px += 46) {
                        context.beginPath();
                        context.ellipse(x + px, platform.y + 7, 22, 8, 0, 0, Math.PI * 2);
                        context.fill();
                    }
                    context.fillStyle = 'rgba(122,191,191,.28)';
                    for (let px = 24; px < platform.width; px += 74) {
                        context.beginPath(); context.arc(x + px, platform.y + 52 + (px % 4) * 13, 7, 0, Math.PI * 2); context.fill();
                    }
                } else if (inBonus || isUndergroundLevel) {
                    context.fillStyle = '#24345f';
                    context.fillRect(x, platform.y, platform.width, platform.height);
                    context.fillStyle = '#6277b2';
                    context.fillRect(x, platform.y, platform.width, 25);
                    context.strokeStyle = 'rgba(145,165,220,.32)';
                    context.lineWidth = 3;
                    for (let px = 0; px < platform.width; px += 64) context.strokeRect(x + px, platform.y + 25, 64, 42);
                } else {
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
                }
            } else if (platform.kind === 'sidePipe') {
                context.fillStyle = '#159748';
                context.strokeStyle = '#075c2c';
                context.lineWidth = 5;
                roundRect(x + 36, platform.y + 13, platform.width - 36, platform.height - 26, 8);
                context.fill(); context.stroke();
                context.fillStyle = '#2bc760';
                context.fillRect(x + 54, platform.y + 25, Math.max(18, platform.width - 80), 15);
                context.fillStyle = '#24b755';
                roundRect(x, platform.y, 54, platform.height, 9);
                context.fill(); context.stroke();
                context.fillStyle = 'rgba(255,255,255,.26)';
                context.fillRect(x + 12, platform.y + 12, 13, platform.height - 24);
                context.fillStyle = '#07351d';
                context.beginPath();
                context.ellipse(x + 4, platform.y + platform.height / 2, 8, platform.height * 0.39, 0, 0, Math.PI * 2);
                context.fill();
            } else {
                const capHeight = 30;
                context.fillStyle = '#22a94f';
                context.strokeStyle = '#116331';
                context.lineWidth = 5;
                roundRect(x + 10, platform.y + capHeight - 3, platform.width - 20, platform.height - capHeight + 3, 5);
                context.fill(); context.stroke();
                context.fillStyle = '#35ca60';
                context.fillRect(x + 23, platform.y + capHeight + 5, 13, platform.height - capHeight - 8);
                context.fillStyle = '#29b957';
                roundRect(x, platform.y, platform.width, capHeight + 8, 7);
                context.fill(); context.stroke();
                context.fillStyle = 'rgba(255,255,255,.28)';
                context.fillRect(x + 13, platform.y + 7, 15, capHeight - 5);
                if (platform.travel) {
                    context.fillStyle = '#fff';
                    context.font = "900 25px 'Arial Black', Arial";
                    context.textAlign = 'center';
                    context.fillText('↓', x + platform.width / 2, platform.y + 27);
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

        const drawBlock = (block: WorldBlock) => {
            if (block.destroyed) return;
            const x = block.x - cameraX;
            if (x < -80 || x > GAME_WIDTH + 80) return;
            const bumpOffset = block.bump > 0 ? -Math.sin((block.bump / 0.18) * Math.PI) * 11 : 0;
            const y = block.y + bumpOffset;

            context.save();
            context.translate(x, y);
            const isQuestion = block.kind === 'question';
            context.fillStyle = block.used ? '#a89f89' : isQuestion ? '#f6b91c' : isUndergroundLevel ? '#4966a1' : '#c96535';
            context.strokeStyle = isQuestion ? '#704313' : isUndergroundLevel ? '#22365f' : '#74351f';
            context.lineWidth = 5;
            roundRect(0, 0, block.width, block.height, 7);
            context.fill();
            context.stroke();
            context.fillStyle = block.used ? 'rgba(255,255,255,.25)' : isQuestion ? '#ffe96a' : 'rgba(255,225,185,.35)';
            context.fillRect(7, 7, block.width - 14, 6);
            if (isQuestion) {
                context.fillStyle = block.used ? '#746e60' : '#fff8c9';
                context.font = "900 37px 'Arial Black', Arial";
                context.textAlign = 'center';
                context.textBaseline = 'middle';
                context.fillText(block.used ? '·' : '?', block.width / 2, block.height / 2 + 2);
            } else {
                context.strokeStyle = isUndergroundLevel ? '#2b4375' : '#8f4326';
                context.lineWidth = 3;
                context.beginPath(); context.moveTo(0, 27); context.lineTo(56, 27); context.stroke();
                context.beginPath(); context.moveTo(18, 0); context.lineTo(18, 27); context.moveTo(39, 27); context.lineTo(39, 56); context.stroke();
            }
            context.fillStyle = isQuestion ? '#704313' : isUndergroundLevel ? '#22365f' : '#74351f';
            [[7, 7], [49, 7], [7, 49], [49, 49]].forEach(([dotX, dotY]) => {
                context.beginPath(); context.arc(dotX, dotY, 2.5, 0, Math.PI * 2); context.fill();
            });
            context.restore();

            if (block.coinAnimation > 0) {
                const progress = 1 - block.coinAnimation / 0.65;
                const coinY = block.y - 20 - Math.sin(progress * Math.PI) * 82;
                context.save();
                context.globalAlpha = clamp(block.coinAnimation * 3, 0, 1);
                context.translate(x + block.width / 2, coinY);
                context.scale(0.65 + Math.abs(Math.cos(progress * Math.PI * 3)) * 0.35, 1);
                context.fillStyle = '#ffd51f';
                context.strokeStyle = '#8b590d';
                context.lineWidth = 4;
                context.beginPath(); context.ellipse(0, 0, 14, 20, 0, 0, Math.PI * 2); context.fill(); context.stroke();
                context.restore();
            }
        };

        const drawPowerUp = (powerUp: PowerUp, time: number) => {
            if (!powerUp.active) return;
            const x = powerUp.x - cameraX;
            if (x < -60 || x > GAME_WIDTH + 60) return;
            const bob = powerUp.emerging > 0 ? 0 : Math.sin(time * 0.012 + powerUp.x) * 2;
            context.save();
            context.translate(x, powerUp.y + bob);
            context.fillStyle = 'rgba(10,20,35,.2)';
            context.beginPath(); context.ellipse(20, 39, 18, 5, 0, 0, Math.PI * 2); context.fill();

            if (powerUp.kind === 'fire') {
                context.strokeStyle = '#5a3026';
                context.lineWidth = 3;
                context.fillStyle = '#2bb866';
                roundRect(17, 18, 7, 22, 3); context.fill();
                context.beginPath(); context.ellipse(12, 31, 8, 4, -.45, 0, Math.PI * 2); context.fill();
                context.beginPath(); context.ellipse(29, 31, 8, 4, .45, 0, Math.PI * 2); context.fill();
                context.fillStyle = '#fff8e9';
                [[20, 7], [9, 14], [31, 14], [13, 23], [27, 23]].forEach(([petalX, petalY]) => {
                    context.beginPath(); context.arc(petalX, petalY, 9, 0, Math.PI * 2); context.fill(); context.stroke();
                });
                context.fillStyle = powerUp.color;
                context.beginPath(); context.arc(20, 16, 9, 0, Math.PI * 2); context.fill(); context.stroke();
                context.fillStyle = '#ffd84e';
                context.beginPath(); context.arc(20, 16, 4, 0, Math.PI * 2); context.fill();
                context.restore();
                return;
            }

            context.fillStyle = '#f4d5aa';
            context.strokeStyle = '#5a3026';
            context.lineWidth = 3;
            roundRect(10, 18, 20, 22, 7); context.fill(); context.stroke();
            context.fillStyle = '#24201f';
            context.fillRect(15, 27, 3, 5); context.fillRect(23, 27, 3, 5);

            context.fillStyle = powerUp.color;
            context.beginPath();
            context.arc(20, 18, 19, Math.PI, Math.PI * 2);
            context.lineTo(39, 22);
            context.quadraticCurveTo(20, 27, 1, 22);
            context.closePath();
            context.fill(); context.stroke();
            context.fillStyle = '#fff8e9';
            context.beginPath(); context.ellipse(20, 8, 6, 8, 0, 0, Math.PI * 2); context.fill();
            context.beginPath(); context.arc(7, 16, 4, 0, Math.PI * 2); context.arc(33, 16, 4, 0, Math.PI * 2); context.fill();
            context.restore();
        };

        const drawFireball = (fireball: Fireball, time: number) => {
            if (!fireball.active) return;
            const x = fireball.x - cameraX;
            if (x < -40 || x > GAME_WIDTH + 40) return;
            context.save();
            context.translate(x + fireball.width / 2, fireball.y + fireball.height / 2);
            context.rotate(time * 0.012 * Math.sign(fireball.vx));
            context.shadowColor = '#ff8a24';
            context.shadowBlur = 18;
            context.fillStyle = '#ff7a1a';
            context.beginPath(); context.arc(0, 0, 10, 0, Math.PI * 2); context.fill();
            context.shadowBlur = 0;
            context.fillStyle = '#fff2a6';
            context.beginPath(); context.arc(-2, -2, 5, 0, Math.PI * 2); context.fill();
            context.strokeStyle = fireball.color;
            context.lineWidth = 3;
            context.beginPath(); context.moveTo(-12, 0); context.lineTo(-18, -6); context.moveTo(-10, 6); context.lineTo(-17, 10); context.stroke();
            context.restore();
        };

        const drawEnemy = (enemy: Enemy) => {
            if (!enemy.alive) return;
            if (enemy.kind === 'fish' && !inWater) return;
            const x = enemy.x - cameraX;
            if (x < -80 || x > GAME_WIDTH + 80) return;
            context.save();
            context.translate(x, enemy.y);

            if (enemy.kind === 'fish') {
                if (enemy.vx < 0) {
                    context.translate(enemy.width, 0);
                    context.scale(-1, 1);
                }
                context.fillStyle = '#ff765f';
                context.strokeStyle = '#8f3040';
                context.lineWidth = 3;
                context.beginPath();
                context.moveTo(8, enemy.height / 2);
                context.lineTo(-10, 3);
                context.lineTo(-10, enemy.height - 3);
                context.closePath();
                context.fill(); context.stroke();
                context.beginPath();
                context.ellipse(28, enemy.height / 2, 27, 16, 0, 0, Math.PI * 2);
                context.fill(); context.stroke();
                context.fillStyle = '#ffb650';
                context.beginPath();
                context.moveTo(24, 9); context.lineTo(10, -4); context.lineTo(35, 5); context.closePath(); context.fill();
                context.beginPath();
                context.moveTo(26, 26); context.lineTo(12, 39); context.lineTo(38, 29); context.closePath(); context.fill();
                context.fillStyle = '#fff';
                context.beginPath(); context.arc(43, 12, 6, 0, Math.PI * 2); context.fill();
                context.fillStyle = '#17243d';
                context.beginPath(); context.arc(45, 13, 2.4, 0, Math.PI * 2); context.fill();
                context.strokeStyle = '#8f3040';
                context.lineWidth = 2;
                context.beginPath(); context.arc(47, 23, 7, 0.15, 1.65); context.stroke();
                context.restore();
                return;
            }

            if (enemy.kind === 'turtle') {
                const shellOnly = enemy.state !== 'walking';
                if (!shellOnly && enemy.vx < 0) {
                    context.translate(enemy.width, 0);
                    context.scale(-1, 1);
                }
                if (shellOnly) {
                    context.fillStyle = '#2f7d43';
                    context.beginPath();
                    context.ellipse(enemy.width / 2, enemy.height / 2, 23, 14, 0, 0, Math.PI * 2);
                    context.fill();
                    context.strokeStyle = '#173f25';
                    context.lineWidth = 4;
                    context.stroke();
                    context.fillStyle = '#77c957';
                    context.beginPath();
                    context.ellipse(enemy.width / 2, enemy.height / 2 - 2, 15, 9, 0, 0, Math.PI * 2);
                    context.fill();
                    context.strokeStyle = '#d9f28c';
                    context.lineWidth = 2;
                    context.beginPath();
                    context.moveTo(14, 15); context.lineTo(36, 15);
                    context.moveTo(20, 7); context.lineTo(20, 23);
                    context.moveTo(30, 7); context.lineTo(30, 23);
                    context.stroke();
                    if (enemy.state === 'shellMoving') {
                        context.strokeStyle = 'rgba(255,255,255,.8)';
                        context.lineWidth = 3;
                        context.beginPath();
                        context.moveTo(-11, 8); context.lineTo(-2, 8);
                        context.moveTo(-15, 16); context.lineTo(-4, 16);
                        context.moveTo(-10, 24); context.lineTo(-1, 24);
                        context.stroke();
                    }
                    context.restore();
                    return;
                }

                context.fillStyle = '#f0c778';
                roundRect(34, 9, 17, 22, 8);
                context.fill();
                context.strokeStyle = '#6d4b23';
                context.lineWidth = 2.5;
                context.stroke();
                context.fillStyle = '#fff';
                context.beginPath(); context.arc(44, 16, 4, 0, Math.PI * 2); context.fill();
                context.fillStyle = '#1d241c';
                context.beginPath(); context.arc(45, 17, 1.7, 0, Math.PI * 2); context.fill();
                context.fillStyle = '#2f7d43';
                context.beginPath(); context.ellipse(23, 27, 21, 24, 0, 0, Math.PI * 2); context.fill();
                context.strokeStyle = '#173f25';
                context.lineWidth = 4;
                context.stroke();
                context.fillStyle = '#77c957';
                context.beginPath(); context.ellipse(22, 26, 13, 16, 0, 0, Math.PI * 2); context.fill();
                context.strokeStyle = '#d9f28c';
                context.lineWidth = 2;
                context.beginPath();
                context.moveTo(10, 27); context.lineTo(34, 27);
                context.moveTo(22, 11); context.lineTo(22, 43);
                context.stroke();
                context.fillStyle = '#f0c778';
                roundRect(3, 45, 18, 8, 4); context.fill();
                roundRect(28, 45, 18, 8, 4); context.fill();
                context.restore();
                return;
            }

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
            const swimmingPose = isWaterLevel && inWater && !player.grounded;
            const walking = Math.abs(player.vx) > 30 && player.grounded;
            const bob = swimmingPose ? Math.sin(time * 0.007 + player.x * 0.01) * 4 : walking ? Math.sin(time * 0.018) * 3 : 0;
            const hatColor = player.hasFire ? '#fff8e7' : player.color;
            const outfitColor = player.hasFire ? '#fff8e7' : player.accent;
            const shirtColor = player.hasFire ? player.color : player.color;

            if (swimmingPose) {
                const trailX = x + player.width / 2 - player.direction * 42;
                context.save();
                context.strokeStyle = 'rgba(222,251,255,.72)';
                context.lineWidth = 2;
                for (let bubble = 0; bubble < 3; bubble += 1) {
                    context.beginPath();
                    context.arc(trailX - player.direction * bubble * 13, player.y + player.height / 2 + 13 + bubble * 8, 4 + bubble * 1.5, 0, Math.PI * 2);
                    context.stroke();
                }
                context.restore();
            }

            context.save();
            if (swimmingPose) {
                const swimScale = player.isBig ? 1.16 : 1;
                context.translate(x + player.width / 2, player.y + player.height / 2 + bob);
                context.rotate(player.direction * (Math.PI / 2 + Math.sin(time * 0.006) * 0.06));
                context.scale(swimScale, swimScale);
                context.translate(-player.width / 2, -33);
            } else {
                context.translate(x + player.width / 2, player.y + bob);
                context.scale(player.direction, player.height / 66);
                context.translate(-player.width / 2, 0);
            }

            if (swimmingPose) {
                const stroke = Math.sin(time * 0.014) * 5;
                context.strokeStyle = '#f4bb8a';
                context.lineWidth = 8;
                context.lineCap = 'round';
                context.beginPath();
                context.moveTo(10, 39);
                context.lineTo(5 - stroke * 0.35, 22 - Math.abs(stroke));
                context.moveTo(38, 39);
                context.lineTo(44 + stroke * 0.35, 21 - Math.abs(stroke));
                context.stroke();
            }

            context.fillStyle = '#f4bb8a';
            roundRect(9, 11, 29, 28, 10);
            context.fill();
            context.fillStyle = hatColor;
            roundRect(4, 0, 39, 17, 8);
            context.fill();
            context.fillRect(4, 10, 45, 8);
            context.fillStyle = '#24201f';
            context.fillRect(31, 20, 5, 5);
            context.fillRect(38, 31, 8, 5);

            context.fillStyle = outfitColor;
            roundRect(7, 36, 34, 26, 7);
            context.fill();
            context.fillStyle = shirtColor;
            context.fillRect(8, 32, 32, 14);
            context.fillStyle = player.hasFire ? player.color : '#fff';
            context.beginPath(); context.arc(13, 47, 4, 0, Math.PI * 2); context.arc(36, 47, 4, 0, Math.PI * 2); context.fill();

            context.fillStyle = '#302722';
            const leg = swimmingPose ? Math.sin(time * 0.014) * 6 : walking ? Math.sin(time * 0.018) * 5 : 0;
            roundRect(3, 58 + leg, 19, 8, 4); context.fill();
            roundRect(26, 58 - leg, 19, 8, 4); context.fill();

            context.fillStyle = player.hasFire ? player.color : '#fff';
            context.font = '900 12px Arial';
            context.textAlign = 'center';
            context.fillText(player.id === 'bora' ? 'B' : 'G', 23, 13);
            context.restore();

            context.save();
            const labelX = x + player.width / 2;
            const labelY = player.y - 19 + bob;
            const labelText = player.name;
            context.font = "400 16px 'Lilita One', Impact, sans-serif";
            context.textAlign = 'center';
            context.textBaseline = 'middle';
            const labelWidth = Math.max(68, context.measureText(labelText).width + 24);

            context.fillStyle = 'rgba(20, 27, 43, .32)';
            roundRect(labelX - labelWidth / 2 + 3, labelY - 17 + 4, labelWidth, 25, 10);
            context.fill();

            context.fillStyle = player.color;
            context.strokeStyle = '#2a2331';
            context.lineWidth = 2.5;
            context.beginPath();
            context.moveTo(labelX - 5, labelY + 7);
            context.lineTo(labelX + 5, labelY + 7);
            context.lineTo(labelX, labelY + 13);
            context.closePath();
            context.fill();
            context.stroke();

            roundRect(labelX - labelWidth / 2, labelY - 17, labelWidth, 25, 10);
            context.fill();
            context.stroke();

            context.fillStyle = '#fffdf5';
            context.lineWidth = 3;
            context.strokeStyle = 'rgba(42, 35, 49, .45)';
            context.strokeText(labelText, labelX, labelY - 4);
            context.fillText(labelText, labelX, labelY - 4);
            context.restore();
        };

        const drawFinish = (time: number, worldX: number, baseY: number) => {
            const x = worldX - cameraX;
            context.fillStyle = '#ede8dc';
            context.fillRect(x + 100, baseY - 235, 210, 235);
            context.fillStyle = '#d84f4f';
            for (let i = 0; i < 3; i += 1) {
                context.beginPath();
                context.moveTo(x + 92 + i * 85, baseY - 235);
                context.lineTo(x + 135 + i * 85, baseY - 300);
                context.lineTo(x + 178 + i * 85, baseY - 235);
                context.fill();
            }
            context.fillStyle = '#384255';
            roundRect(x + 176, baseY - 88, 56, 88, 28); context.fill();
            context.fillStyle = '#f0c64b';
            context.fillRect(x + 22, baseY - 300, 9, 300);
            context.fillStyle = '#ef445f';
            context.beginPath();
            context.moveTo(x + 31, baseY - 285);
            context.lineTo(x + 112 + Math.sin(time * 0.004) * 5, baseY - 264);
            context.lineTo(x + 31, baseY - 235);
            context.closePath();
            context.fill();
            context.fillStyle = '#fff';
            context.font = '900 21px Arial';
            context.fillText('♥', x + 52, baseY - 255);
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
            if ((selectedLevel === '1-1' || selectedLevel === '1-3') && !inBonus) drawFinish(time, finishWorldX, finishBaseY);
            activePlatforms.forEach(drawPlatform);
            powerUps.forEach((powerUp) => drawPowerUp(powerUp, time));
            blocks.forEach(drawBlock);
            if (inBonus) {
                drawSign(7080, ['BONUS ODASI', 'Altınları topla!']);
            } else if (isUndergroundLevel) {
                drawSign(70, ['DÜNYA 1-2', 'Yeraltına hoş geldin']);
                drawSign(6750, ['ÇIKIŞ BORUSU', 'İkiniz de gelin']);
            } else if (isSkyLevel) {
                drawSign(70, ['DÜNYA 1-3', 'Tepelerden ilerleyin']);
            } else if (isWaterLevel) {
                if (!inWater) drawSign(70, ['DÜNYA 1-4', 'Boruya birlikte girin']);
            } else {
                drawSign(80, ['Birlikte ilerle,', 'birlikte kazan!']);
                drawSign(1850, ['Kontrol noktası', '1 / 3']);
                drawSign(3850, ['Kontrol noktası', '2 / 3']);
                drawSign(5680, ['Son düzlük!', 'İkiniz de gelin']);
            }
            coins.forEach((coin) => drawCoin(coin, time));
            enemies.forEach(drawEnemy);
            fireballs.forEach((fireball) => drawFireball(fireball, time));
            if (pipeTransition) {
                context.save();
                context.beginPath();
                if (pipeTransition.direction === 'right') {
                    context.rect(0, 0, pipeTransition.pipe.x - cameraX + 2, GAME_HEIGHT);
                } else {
                    context.rect(0, 0, GAME_WIDTH, pipeTransition.pipe.y + 1);
                }
                context.clip();
            }
            players.forEach((player) => drawPlayer(player, time));
            if (pipeTransition) context.restore();
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

            const usablePipe = activePlatforms.find((platform) => platform.kind !== 'sidePipe' && platform.travel && (platform.travel === 'bonusOut') === inBonus
                && players.some((player) => Math.abs(player.y + player.height - platform.y) < 8
                    && player.x + player.width > platform.x + 8
                    && player.x < platform.x + platform.width - 8));
            if (usablePipe && !pipeTransition) {
                const x = usablePipe.x - cameraX + usablePipe.width / 2;
                context.fillStyle = 'rgba(18,28,48,.9)';
                roundRect(x - 116, usablePipe.y - 58, 232, 42, 14); context.fill();
                context.fillStyle = '#fff';
                context.font = '900 15px Arial';
                context.textAlign = 'center';
                context.fillText('S / ↓  BORUYA GİR', x, usablePipe.y - 31);
            }

            if (isWaterLevel && !inWater && !pipeTransition) {
                const pipe = activePlatforms.find((platform) => platform.travel === 'waterIn');
                if (pipe) {
                    const x = pipe.x - cameraX - 24;
                    context.fillStyle = 'rgba(18,28,48,.9)';
                    roundRect(x - 230, pipe.y - 70, 250, 44, 14); context.fill();
                    context.fillStyle = '#fff';
                    context.font = '900 15px Arial';
                    context.textAlign = 'center';
                    context.fillText('İKİNİZ DE BORUYA YAKLAŞIN →', x - 105, pipe.y - 42);
                }
            }

            if (pipeFlash > 0) {
                context.fillStyle = `rgba(8,14,28,${clamp(pipeFlash * 1.4, 0, 0.62)})`;
                context.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
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
    }, [runId, snapshot.phase, beep, selectedLevel, isUndergroundLevel, isSkyLevel, isWaterLevel]);

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
                <div className={styles.logo}><span>İKİ KİŞİLİK</span><strong>MACERA {selectedLevel}</strong></div>
                <button className={styles.iconButton} onClick={toggleSound} aria-label={snapshot.sound ? 'Sesi kapat' : 'Sesi aç'}>
                    {snapshot.sound ? '♪' : '×'}
                </button>
            </header>

            <section className={styles.gameFrame}>
                <div className={styles.hud}>
                    <div className={`${styles.playerHud} ${styles.boraHud}`}>
                        <div className={styles.avatarFrame}><img src="/mario/bora-avatar-v2.png" alt="Bora karikatür avatarı" /></div>
                        <div className={styles.playerDetails}>
                            <strong>BORA</strong><small>A D · W · S · F</small>
                            <div className={styles.playerStats}>
                                <span className={styles.lifeStat} aria-label={`${snapshot.lives.bora} can`}>
                                    {Array.from({ length: 5 }, (_, index) => <i className={`${styles.lifeHeart} ${index < snapshot.lives.bora ? styles.filledHeart : ''}`} key={index}>{index < snapshot.lives.bora ? '♥' : '♡'}</i>)}
                                </span>
                                <span className={styles.coinStat} aria-label={`${snapshot.coins.bora} altın`}><i>●</i><b>{String(snapshot.coins.bora).padStart(2, '0')}</b><em>/ {totalCoins}</em></span>
                            </div>
                        </div>
                    </div>
                    <div className={`${styles.playerHud} ${styles.gozdeHud}`}>
                        <div className={styles.avatarFrame}><img src="/mario/gozde-avatar-v2.png" alt="Gözde karikatür avatarı" /></div>
                        <div className={styles.playerDetails}>
                            <strong>GÖZDE</strong><small>← → · ↑ · ↓ · ENTER</small>
                            <div className={styles.playerStats}>
                                <span className={styles.lifeStat} aria-label={`${snapshot.lives.gozde} can`}>
                                    {Array.from({ length: 5 }, (_, index) => <i className={`${styles.lifeHeart} ${index < snapshot.lives.gozde ? styles.filledHeart : ''}`} key={index}>{index < snapshot.lives.gozde ? '♥' : '♡'}</i>)}
                                </span>
                                <span className={styles.coinStat} aria-label={`${snapshot.coins.gozde} altın`}><i>●</i><b>{String(snapshot.coins.gozde).padStart(2, '0')}</b><em>/ {totalCoins}</em></span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.canvasWrap}>
                    <canvas ref={canvasRef} width={GAME_WIDTH} height={GAME_HEIGHT} aria-label="Bora ve Gözde için iki kişilik platform oyunu" />

                    {snapshot.phase === 'intro' && (
                        <div className={styles.overlay}>
                            <div className={styles.introCard}>
                                <p className={styles.eyebrow}>DÜNYA {selectedLevel} · AYNI KLAVYE</p>
                                <h1>{isUndergroundLevel ? 'Yeraltına.' : isSkyLevel ? 'Bulutların.' : isWaterLevel ? 'Derinlere.' : 'Yan yana.'}<br /><em>{isUndergroundLevel ? 'Birlikte.' : isSkyLevel ? 'Üzerine.' : isWaterLevel ? 'Birlikte.' : 'Sonuna kadar.'}</em></h1>
                                <p className={styles.lead}>{isUndergroundLevel ? 'Dar tuğla koridorlarını ve kısa çukurları aşın; çıkış borusuna birlikte ulaşın.' : isSkyLevel ? 'Ayrık ağaç tepeleri arasında dikkatli sıçrayın, altın rotasını takip edin ve kaleye birlikte ulaşın.' : isWaterLevel ? 'Kıyıdaki yatay boruya birlikte girin; mercan geçidini yüzerek aşın ve çıkış borusuna ulaşın.' : <>Paraları toplayın, minik engelleri aşın ve kaleye <strong>birlikte</strong> ulaşın.</>}</p>
                                <div className={styles.controls}>
                                    <div><i className={styles.redToken}>B</i><p><strong>Bora</strong><span><kbd>A</kbd><kbd>D</kbd> hareket · <kbd>W</kbd> zıpla · <kbd>S</kbd> boru · <kbd>F</kbd> ateş</span></p></div>
                                    <div><i className={styles.pinkToken}>G</i><p><strong>Gözde</strong><span><kbd>←</kbd><kbd>→</kbd> hareket · <kbd>↑</kbd> zıpla · <kbd>↓</kbd> boru · <kbd>Enter</kbd> ateş</span></p></div>
                                </div>
                                <button className={styles.primaryButton} onClick={startGame}>MACERAYI BAŞLAT <span>→</span></button>
                                <small className={styles.tip}>{isUndergroundLevel ? 'İpucu: Bölümün sonundaki oklu boru yeraltı çıkışıdır.' : isSkyLevel ? 'İpucu: Uzun atlayışlarda koşmayı bırakmayın; düşerseniz son ağaç tepesinden dönersiniz.' : isWaterLevel ? 'İpucu: Zıplama tuşu su altında yüzme vuruşu yapar.' : 'İpucu: Büyükken sonraki güç bloklarından ateş çiçeği çıkar.'}</small>
                            </div>
                        </div>
                    )}

                    {snapshot.phase === 'won' && (
                        <div className={styles.overlay}>
                            <div className={`${styles.resultCard} ${styles.winCard}`}>
                                <div className={styles.bigHeart}>♥</div>
                                <p className={styles.eyebrow}>BÖLÜM TAMAMLANDI</p>
                                <h2>En güzel takım<br />yine sizsiniz!</h2>
                                <p>Dünya {selectedLevel} tamamlandı; {snapshot.coins.bora + snapshot.coins.gozde} altın topladınız.</p>
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

            <section className={styles.levelBar} aria-label="Bölüm seçimi">
                <div><small>ŞU ANKİ BÖLÜM</small><strong>DÜNYA {selectedLevel}</strong></div>
                <button onClick={() => setShowLevelSelect((current) => !current)}>{showLevelSelect ? 'SEÇİMİ KAPAT' : 'BÖLÜM SEÇ'} <span>{showLevelSelect ? '↑' : '↓'}</span></button>
            </section>

            {showLevelSelect && (
                <section className={styles.levelPicker}>
                    <div className={styles.levelPickerHeading}>
                        <p className={styles.eyebrow}>DÜNYA 1</p>
                        <h2>Bölümünü seç</h2>
                        <p>İki kişilik maceranın ilk dünyası.</p>
                    </div>
                    <div className={styles.levelGrid}>
                        <button className={selectedLevel === '1-1' ? styles.activeLevel : ''} onClick={() => chooseLevel('1-1')}>
                            <span className={styles.levelNumber}>1-1</span><strong>Yeşil Tepeler</strong><small>Açık hava · Oynanabilir</small><i>→</i>
                        </button>
                        <button className={selectedLevel === '1-2' ? styles.activeLevel : ''} onClick={() => chooseLevel('1-2')}>
                            <span className={styles.levelNumber}>1-2</span><strong>Yeraltı Yolu</strong><small>Yeraltı · Oynanabilir</small><i>→</i>
                        </button>
                        <button className={selectedLevel === '1-3' ? styles.activeLevel : ''} onClick={() => chooseLevel('1-3')}>
                            <span className={styles.levelNumber}>1-3</span><strong>Bulut Geçidi</strong><small>Ağaç tepeleri · Oynanabilir</small><i>→</i>
                        </button>
                        <button className={selectedLevel === '1-4' ? styles.activeLevel : ''} onClick={() => chooseLevel('1-4')}>
                            <span className={styles.levelNumber}>1-4</span><strong>Mercan Geçidi</strong><small>Su altı · Oynanabilir</small><i>→</i>
                        </button>
                        <button className={styles.lockedLevel} disabled>
                            <span className={styles.levelNumber}>1-5</span><strong>Kale</strong><small>Final · Yakında</small><i>🔒</i>
                        </button>
                    </div>
                </section>
            )}

            <div className={styles.mobileControls} aria-label="Dokunmatik kontroller">
                <div><button onPointerDown={touchStart('bora-left')} onPointerUp={touchEnd('bora-left')} onPointerCancel={touchEnd('bora-left')}>←</button><button onPointerDown={touchStart('bora-right')} onPointerUp={touchEnd('bora-right')} onPointerCancel={touchEnd('bora-right')}>→</button><button className={styles.jump} onPointerDown={touchStart('bora-jump')} onPointerUp={touchEnd('bora-jump')} onPointerCancel={touchEnd('bora-jump')}>↑</button><button onPointerDown={touchStart('bora-down')} onPointerUp={touchEnd('bora-down')} onPointerCancel={touchEnd('bora-down')}>↓</button><button onPointerDown={touchStart('bora-fire')} onPointerUp={touchEnd('bora-fire')} onPointerCancel={touchEnd('bora-fire')}>●</button></div>
                <div><button onPointerDown={touchStart('gozde-left')} onPointerUp={touchEnd('gozde-left')} onPointerCancel={touchEnd('gozde-left')}>←</button><button onPointerDown={touchStart('gozde-right')} onPointerUp={touchEnd('gozde-right')} onPointerCancel={touchEnd('gozde-right')}>→</button><button className={styles.jump} onPointerDown={touchStart('gozde-jump')} onPointerUp={touchEnd('gozde-jump')} onPointerCancel={touchEnd('gozde-jump')}>↑</button><button onPointerDown={touchStart('gozde-down')} onPointerUp={touchEnd('gozde-down')} onPointerCancel={touchEnd('gozde-down')}>↓</button><button onPointerDown={touchStart('gozde-fire')} onPointerUp={touchEnd('gozde-fire')} onPointerCancel={touchEnd('gozde-fire')}>●</button></div>
            </div>

            <footer className={styles.footer}><span>Bora & Gözde için yapıldı</span><span>Yeniden başlat: <kbd>R</kbd></span></footer>
        </main>
    );
};

export default MarioGame;
