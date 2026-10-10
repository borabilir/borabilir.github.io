type Rect = { x: number; y: number; width: number; height: number };
export type WorldSign = { x: number; y: number; lines: string[] };

// Includes the coin's outline at its narrowest rotation and its vertical bob.
export const COIN_HALF_WIDTH = 18;
export const COIN_HALF_HEIGHT = 34;
const CLEARANCE = 10;

export const clearCoinPositions = (positions: number[][], obstacles: Rect[], worldHeight: number) => positions.map(([x, originalY]) => {
    const nearby = obstacles.filter(obstacle => x + COIN_HALF_WIDTH + CLEARANCE > obstacle.x
        && x - COIN_HALF_WIDTH - CLEARANCE < obstacle.x + obstacle.width);
    const candidates = [originalY, ...nearby.flatMap(obstacle => [
        obstacle.y - COIN_HALF_HEIGHT - CLEARANCE,
        obstacle.y + obstacle.height + COIN_HALF_HEIGHT + CLEARANCE,
    ])];
    const y = candidates.filter(candidate => candidate >= COIN_HALF_HEIGHT + CLEARANCE
        && candidate <= worldHeight - COIN_HALF_HEIGHT - CLEARANCE
        && nearby.every(obstacle => candidate + COIN_HALF_HEIGHT + CLEARANCE <= obstacle.y
            || candidate - COIN_HALF_HEIGHT - CLEARANCE >= obstacle.y + obstacle.height))
        .sort((a, b) => Math.abs(a - originalY) - Math.abs(b - originalY) || a - b)[0];
    if (y === undefined) throw new Error(`No clear coin position near (${x}, ${originalY})`);
    return { x, y, taken: false };
});

export const MAIN_SIGNS: WorldSign[] = [
    { x: 80, y: 515, lines: ['Birlikte ilerle,', 'birlikte kazan!'] },
    { x: 1850, y: 580, lines: ['Kontrol noktası', '1 / 3'] },
    { x: 3850, y: 570, lines: ['Kontrol noktası', '2 / 3'] },
    { x: 5800, y: 480, lines: ['Merdivene tırmanın,', 'bayrağa atlayın!'] },
];
export const BONUS_SIGNS: WorldSign[] = [
    { x: 7080, y: 515, lines: ['BONUS ODASI', 'Altınları topla!'] },
];
export const UNDERGROUND_SIGNS: WorldSign[] = [
    { x: 30, y: 515, lines: ['DÜNYA 1-2', 'Yeraltına hoş geldin'] },
    { x: 6750, y: 580, lines: ['ÇIKIŞ BORUSU', 'İkiniz de gelin'] },
];
export const SKY_SIGNS: WorldSign[] = [
    { x: 30, y: 515, lines: ['DÜNYA 1-3', 'Tepelerden ilerleyin'] },
];
export const WATER_SIGNS: WorldSign[] = [
    { x: 70, y: 515, lines: ['DÜNYA 1-4', 'Boruya birlikte girin'] },
];
export const EXIT_AREA_SIGNS: WorldSign[] = [
    { x: 7960, y: 480, lines: ['Merdivene tırmanın,', 'bayrağa atlayın!'] },
];

export const signBounds = (sign: WorldSign): Rect[] => [
    { x: sign.x - 3, y: sign.y - 3, width: 196, height: 92 },
    { x: sign.x + 87, y: sign.y + 75, width: 14, height: 690 - sign.y - 75 },
];
