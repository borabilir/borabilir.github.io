import { flameJets, inKestilLava, KestilEncounter, rotatingFlames, SURPU_MAX_HEALTH, touchesKestilFire } from './kestil';

const hero = (id: 'bora' | 'gozde', x: number) => ({ id, x, y: 624, width: 46, height: 66,
    vx: 0, vy: 0, grounded: true, direction: 1 as 1 | -1, invincibleUntil: 0 });
const setup = () => {
    const encounter = new KestilEncounter();
    const heroes = [hero('bora', 3750), hero('gozde', 3850)];
    const hurt = jest.fn(), health = jest.fn(), defeat = jest.fn();
    const tick = (dt: number, feet = heroes.map(p => p.y + p.height)) => encounter.update(dt, heroes, feet, hurt, health, defeat);
    tick(0);
    return { encounter, heroes, hurt, health, defeat, tick };
};

test('a side collision hurts the player; a descending stomp damages Şurpu and bounces the player', () => {
    const { encounter, heroes, hurt, health, tick } = setup();
    heroes[0].x = encounter.boss.x - 20;
    tick(1 / 60);
    expect(hurt).toHaveBeenCalledWith(heroes[0]);
    expect(encounter.boss.health).toBe(SURPU_MAX_HEALTH);
    hurt.mockClear();
    Object.assign(heroes[0], { x: encounter.boss.x + 40, y: encounter.boss.y - 62, vy: 200, grounded: false });
    tick(1 / 60, [encounter.boss.y - 4, 690]);
    expect(encounter.boss.health).toBe(SURPU_MAX_HEALTH - 1);
    expect(health).toHaveBeenLastCalledWith(7);
    expect(heroes[0].vy).toBeLessThan(0);
    expect(hurt).not.toHaveBeenCalled();
});

test('two simultaneous stomps cannot drain multiple health points in one frame', () => {
    const { encounter, heroes, tick, health } = setup();
    heroes.forEach(p => Object.assign(p, { x: encounter.boss.x + 40, y: encounter.boss.y - 62, vy: 200 }));
    tick(1 / 60, heroes.map(() => encounter.boss.y - 4));
    expect(encounter.boss.health).toBe(7);
    expect(health).toHaveBeenCalledTimes(1);
    expect(heroes.every(p => p.vy < 0)).toBe(true);
});

test('all four attacks are telegraphed, poop is more frequent, and projectiles hurt', () => {
    const { encounter, tick, heroes, hurt } = setup();
    const attacks = new Set<string>();
    let poopWarning = false, projectileSeen = false;
    let previousAction = ''; const attackCounts: Record<string, number> = {};
    for (let i = 0; i < 1000; i++) {
        tick(1 / 60);
        if (encounter.boss.action === 'windup') {
            if (previousAction !== 'windup') attackCounts[encounter.boss.attack] = (attackCounts[encounter.boss.attack] ?? 0) + 1;
            attacks.add(encounter.boss.attack);
            if (encounter.boss.attack === 'poop') poopWarning = encounter.caption.includes('Bok geliyor');
        }
        previousAction = encounter.boss.action;
        if (encounter.projectiles.length && !projectileSeen) {
            expect(poopWarning).toBe(true);
            projectileSeen = true;
            const p = encounter.projectiles[0];
            Object.assign(heroes[0], { x: p.x, y: p.y, vy: 0 });
            tick(1 / 60);
            expect(hurt).toHaveBeenCalledWith(heroes[0]);
            Object.assign(heroes[0], hero('bora', 3750));
        }
    }
    expect(Array.from(attacks).sort()).toEqual(['dash', 'poop', 'pounce', 'rage']);
    expect(attackCounts.poop).toBeGreaterThan(attackCounts.pounce);
    expect(attackCounts.poop).toBeGreaterThan(attackCounts.rage);
    expect(projectileSeen).toBe(true);
});

test('repeated head bounces do not cause damage until the 2.4 second cooldown expires', () => {
    const { encounter, heroes, tick, health } = setup();
    const stomp = (dt: number) => {
        encounter.boss.action = 'idle'; encounter.boss.timer = 100;
        Object.assign(heroes[0], { x: encounter.boss.x + 40, y: encounter.boss.y - 62, vy: 200 });
        tick(dt, [encounter.boss.y - 4, 690]);
    };
    stomp(1 / 60);
    expect(encounter.boss.invulnerable).toBeGreaterThan(2);
    for (let i = 0; i < 5; i++) stomp(.3);
    expect(encounter.boss.health).toBe(7);
    expect(health).toHaveBeenCalledTimes(1);
    Object.assign(heroes[0], hero('bora', 3750)); tick(1);
    stomp(1 / 60);
    expect(encounter.boss.health).toBe(6);
});

test('rage runs faster than a dash and stops at the targeted player position', () => {
    const { encounter, heroes, tick } = setup();
    heroes[0].x = 4100; heroes[1].x = 4200;
    for (let i = 0; i < 400 && encounter.boss.action !== 'rage'; i++) tick(1 / 60);
    expect(encounter.boss.action).toBe('rage');
    expect(Math.abs(encounter.boss.vx)).toBeGreaterThan(700);
    for (let i = 0; i < 150 && encounter.boss.action === 'rage'; i++) tick(1 / 60);
    expect(encounter.boss.x).toBeCloseTo(4200 + 23 - 68);
});

test('eight valid stomps lower the cage, rescue both toys, play the dialogue and chase, then finish once', () => {
    const { encounter, heroes, health, defeat, tick } = setup();
    for (let hit = 0; hit < SURPU_MAX_HEALTH; hit++) {
        encounter.boss.action = 'idle'; encounter.boss.timer = 10; encounter.boss.invulnerable = 0;
        Object.assign(heroes[0], { x: encounter.boss.x + 40, y: encounter.boss.y - 62, vy: 200 });
        tick(1 / 60, [encounter.boss.y - 4, 690]);
    }
    expect(encounter.boss.health).toBe(0);
    expect(health).toHaveBeenCalledTimes(8);
    expect(defeat).toHaveBeenCalledTimes(1);
    expect(encounter.cageY).toBe(175);
    for (let i = 0; i < 250; i++) tick(1 / 60);
    expect(encounter.cageY + 144).toBe(690);
    expect(encounter.rescued).toBe(true);
    for (let i = 0; i < 120; i++) tick(1 / 60);
    expect(encounter.caption).toContain('Bıktık senden Şurup!');
    for (let i = 0; i < 240; i++) tick(1 / 60);
    const before = heroes.map(p => p.x);
    expect(encounter.chasing).toBe(true);
    expect(encounter.caption).toContain('AAAAA');
    tick(.1);
    expect(heroes.every((p, i) => p.x < before[i] && p.direction === -1)).toBe(true);
    expect(encounter.boss.x).toBeGreaterThan(Math.max(...heroes.map(p => p.x + p.width)));
    for (let i = 0; i < 250; i++) tick(1 / 60);
    expect(encounter.finished).toBe(true);
    expect(defeat).toHaveBeenCalledTimes(1);
});

test('lava and visible flames hurt, but inactive jet warnings do not', () => {
    expect(inKestilLava({ x: 930, y: 650, width: 46, height: 66 })).toBe(true);
    expect(inKestilLava({ x: 930, y: 550, width: 46, height: 66 })).toBe(false);
    const flame = rotatingFlames(0)[0];
    expect(touchesKestilFire({ x: flame.x - 5, y: flame.y - 5, width: 10, height: 10 }, 0)).toBe(true);
    const jet = flameJets(1)[0];
    expect(jet.warning).toBe(true);
    expect(touchesKestilFire({ x: jet.x, y: 630, width: 30, height: 60 }, 1)).toBe(false);
    expect(touchesKestilFire({ x: jet.x, y: 630, width: 30, height: 60 }, 1.5)).toBe(true);
});
