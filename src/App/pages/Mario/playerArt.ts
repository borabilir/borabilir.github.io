export const PLAYER_APPEARANCES = {
    bora: { id: 'bora', name: 'Bora', color: '#ef4444', accent: '#2558d9' },
    gozde: { id: 'gozde', name: 'Gözde', color: '#e9448c', accent: '#7c3aed' },
} as const;

type Appearance = { id: 'bora' | 'gozde'; color: string; accent: string; hasFire?: boolean };

// Draw in the same 46 x 66 coordinate space in both the game and the opening.
export const drawPlayerSprite = (
    context: CanvasRenderingContext2D,
    player: Appearance,
    time: number,
    walking = false,
    swimmingPose = false,
) => {
    const hatColor = player.hasFire ? '#fff8e7' : player.color;
    const outfitColor = player.hasFire ? '#fff8e7' : player.accent;
    const shirtColor = player.color;
    const isGozde = player.id === 'gozde';
    const roundRect = (x: number, y: number, width: number, height: number, radius: number) => {
        context.beginPath();
        context.roundRect(x, y, width, height, radius);
    };
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

    if (isGozde) {
        context.fillStyle = '#714a36';
        roundRect(5, 12, 28, 31, 11);
        context.fill();
        context.beginPath();
        context.ellipse(5, 32, 7, 14, -.25, 0, Math.PI * 2);
        context.fill();
        context.fillStyle = '#f7a1c6';
        roundRect(1, 21, 8, 5, 2);
        context.fill();
    }
    context.fillStyle = '#f4bb8a';
    roundRect(9, 11, 29, 28, 10);
    context.fill();
    if (isGozde) {
        context.fillStyle = '#714a36';
        context.beginPath();
        context.moveTo(9, 16);
        context.lineTo(28, 16);
        context.quadraticCurveTo(21, 24, 14, 23);
        context.lineTo(14, 36);
        context.lineTo(8, 33);
        context.closePath();
        context.fill();
    }
    context.fillStyle = hatColor;
    roundRect(4, 0, 39, 17, 8);
    context.fill();
    context.fillRect(4, 10, 45, 8);
    context.fillStyle = '#24201f';
    context.fillRect(31, 20, 5, 5);
    context.fillRect(38, 31, 8, 5);

    const leg = swimmingPose ? Math.sin(time * 0.014) * 6 : walking ? Math.sin(time * 0.018) * 5 : 0;
    if (isGozde) {
        context.fillStyle = '#f4bb8a';
        context.fillRect(11, 53 + leg, 8, 10);
        context.fillRect(29, 53 - leg, 8, 10);
        context.fillStyle = shirtColor;
        roundRect(9, 33, 29, 17, 6);
        context.fill();
        context.fillStyle = outfitColor;
        context.beginPath();
        context.moveTo(12, 45);
        context.lineTo(35, 45);
        context.lineTo(44, 57);
        context.quadraticCurveTo(23, 63, 3, 57);
        context.closePath();
        context.fill();
        context.fillStyle = player.hasFire ? player.color : '#ffc1de';
        roundRect(11, 44, 26, 4, 2);
        context.fill();
        context.fillStyle = player.hasFire ? '#e8d8d2' : '#a478ee';
        context.beginPath();
        context.moveTo(16, 49); context.lineTo(13, 57); context.lineTo(17, 57);
        context.moveTo(29, 49); context.lineTo(30, 58); context.lineTo(34, 57);
        context.fill();
        context.fillStyle = '#302722';
        roundRect(6, 59 + leg, 16, 7, 4); context.fill();
        roundRect(27, 59 - leg, 16, 7, 4); context.fill();
    } else {
        context.fillStyle = outfitColor;
        roundRect(7, 36, 34, 26, 7);
        context.fill();
        context.fillStyle = shirtColor;
        context.fillRect(8, 32, 32, 14);
        context.fillStyle = player.hasFire ? player.color : '#fff';
        context.beginPath(); context.arc(13, 47, 4, 0, Math.PI * 2); context.arc(36, 47, 4, 0, Math.PI * 2); context.fill();
        context.fillStyle = '#302722';
        roundRect(3, 58 + leg, 19, 8, 4); context.fill();
        roundRect(26, 58 - leg, 19, 8, 4); context.fill();
    }

    context.fillStyle = player.hasFire ? player.color : '#fff';
    context.font = '900 12px Arial';
    context.textAlign = 'center';
    context.fillText(player.id === 'bora' ? 'B' : 'G', 23, 13);
};
