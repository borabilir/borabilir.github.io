type Rect = { x: number; y: number; width: number; height: number };
export type FinishLayout = { stairX: number; poleX: number; groundY: number; castle: boolean };

export const EXIT_AREA_START = 7600;
export const EXIT_AREA_END = 9300;
export const EXIT_PIPE = { x: 7700, y: 550, width: 96, height: 140 };
export const EXIT_SPAWNS = [7840, 7910];
export const FLAG_HEIGHT = 560;

export const LEVEL_FINISHES: Record<string, FinishLayout> = {
    '1-1': { stairX: 6130, poleX: 6560, groundY: 690, castle: false },
    '1-2': { stairX: 8270, poleX: 8790, groundY: 690, castle: false },
    '1-3': { stairX: 6480, poleX: 6960, groundY: 650, castle: false },
    '1-4': { stairX: 8270, poleX: 8790, groundY: 690, castle: true },
};

// Solid blocks cannot be broken, so both players can always reach the flag.
export const finishStairs = (finish: FinishLayout): Rect[] => Array.from({ length: 6 }, (_, column) =>
    Array.from({ length: column + 1 }, (_, row) => ({
        x: finish.stairX + column * 56,
        y: finish.groundY - (row + 1) * 56,
        width: 56,
        height: 56,
    }))).flat();

export const canGrabFlag = (player: Rect & { grounded: boolean }, finish: FinishLayout) => !player.grounded
    && player.y + player.height <= finish.groundY - 120
    && player.x < finish.poleX + 16 && player.x + player.width > finish.poleX - 10
    && player.y < finish.groundY && player.y + player.height > finish.groundY - FLAG_HEIGHT;
