type Rect = { x: number; y: number; width: number; height: number };
type Partner = Rect & { direction: 1 | -1 };
type Bounds = { minX: number; maxX: number; height: number };

const overlaps = (a: Rect, b: Rect) => a.x < b.x + b.width && a.x + a.width > b.x
    && a.y < b.y + b.height && a.y + a.height > b.y;

export const findPartnerSpawn = (
    player: Pick<Rect, 'width' | 'height'>,
    partner: Partner,
    solids: Rect[],
    bounds: Bounds,
    swimming: boolean,
): { x: number; y: number; grounded: boolean } | undefined => {
    const gap = 12;
    const positions = partner.direction === 1
        ? [partner.x - player.width - gap, partner.x + partner.width + gap]
        : [partner.x + partner.width + gap, partner.x - player.width - gap];
    const fits = (spot: Rect) => spot.x >= bounds.minX && spot.x + spot.width <= bounds.maxX
        && spot.y >= 0 && spot.y + spot.height <= bounds.height && !solids.some(solid => overlaps(spot, solid));

    if (swimming) {
        const y = Math.max(0, Math.min(partner.y + partner.height - player.height, bounds.height - player.height));
        for (const x of [...positions, partner.x]) {
            const spot = { ...player, x, y };
            if (fits(spot)) return { x, y, grounded: false };
        }
    }

    const partnerFeet = partner.y + partner.height;
    const candidates: { x: number; y: number; grounded: boolean; score: number }[] = [];
    for (const surface of solids) {
        const left = Math.max(bounds.minX, surface.x);
        const right = Math.min(bounds.maxX, surface.x + surface.width) - player.width;
        if (right < left) continue;
        const supportsPartner = Math.abs(partnerFeet - surface.y) < 12
            && partner.x < surface.x + surface.width && partner.x + partner.width > surface.x;
        for (let index = 0; index < 3; index += 1) {
            const targetX = index < 2 ? positions[index] : partner.x;
            const x = Math.max(left, Math.min(targetX, right));
            const y = surface.y - player.height;
            const spot = { ...player, x, y };
            if (!fits(spot)) continue;
            const score = Math.abs(x - partner.x) + Math.abs(surface.y - partnerFeet) * .5
                + (overlaps(spot, partner) ? 100 : 0) + index
                - (supportsPartner ? 1000 : 0);
            candidates.push({ x, y, grounded: true, score });
        }
    }
    const nearest = candidates.sort((a, b) => a.score - b.score)[0];
    return nearest && { x: nearest.x, y: nearest.y, grounded: nearest.grounded };
};
