import { useEffect, useRef, useState } from 'react';
import styles from './opening.module.scss';
import { drawPlayerSprite, PLAYER_APPEARANCES } from './playerArt';

const scenes = [
    { label: 'KÖYDE SAKİN BİR GÜN', title: 'Her şey yerli yerindeydi.', text: 'Bora, Gözde ve en sevdikleri iki oyuncak: SüngerBob ile Patrick. Bugün de sıradan bir gün olacaktı…', speaker: 'Gözde', line: 'Oyuncakları buraya bırakalım. Şurpu uyuyor zaten!' },
    { label: 'KÜÇÜK BİR PATİ PLANI', title: 'Şurpu’nun başka bir fikri vardı.', text: 'Şurup, namıdiğer Şurpu, gözünü oyuncaklara dikmişti. Bir pati, iki oyuncak… ve kusursuz bir kaçış planı!', speaker: 'Şurpu', line: 'Miyav. Bunlar artık benim.' },
    { label: 'OYUNCAKLAR KAYIP!', title: 'Hey! O bizim Patrick!', text: 'Şurpu iki oyuncağı da kaptığı gibi köyden kaçtı. Bora ile Gözde’nin onu gözden kaybetmeye hiç niyeti yoktu.', speaker: 'Bora', line: 'SüngerBob’u da almış! Gözde, peşinden!' },
    { label: 'HEDEF: ŞURPU KESTIL', title: 'İki oyuncak. İki kahraman.', text: 'Tepeler, yeraltı, bulutlar ve mercan geçidi… Yolun sonunda Şurpu Kestıl var. Oyuncakları eve getirme zamanı!', speaker: 'Bora & Gözde', line: 'Şurpu! Oyuncaklarımızı almaya geliyoruz!' },
];

const Portrait = ({ player }: { player: 'bora' | 'gozde' }) => <img className={`${styles.portrait} ${player === 'gozde' ? styles.pinkPortrait : ''}`} src={`/mario/${player}-avatar-v2.png`} alt={player === 'bora' ? 'Bora' : 'Gözde'} />;

const Pipe = ({ x, y, height }: { x: number; y: number; height: number }) => <g transform={`translate(${x} ${y})`} stroke="#17653b" strokeWidth="5" strokeLinejoin="round">
    <path d={`M9 23H99V${height}H9Z`} fill="url(#intro-pipe)" />
    <rect width="108" height="30" rx="4" fill="url(#intro-pipe)" />
    <path d={`M23 38V${height - 8}M16 8H86`} stroke="#a8ef7b" strokeWidth="6" opacity=".7" />
</g>;

const Block = ({ x, y, question = false }: { x: number; y: number; question?: boolean }) => <g transform={`translate(${x} ${y})`}>
    <rect width="56" height="56" rx="5" fill={question ? '#ffce57' : '#c97742'} stroke="#75421f" strokeWidth="4" />
    <path d="M6 48V6H49" fill="none" stroke={question ? '#ffe99a' : '#e7a26a'} strokeWidth="4" />
    {question ? <><text x="28" y="41" textAnchor="middle" fontFamily="'Lilita One', sans-serif" fontSize="41" fill="#75421f">?</text>{[9, 47].flatMap(x => [9, 47].map(y => <circle key={`${x}-${y}`} cx={x} cy={y} r="2" fill="#a56a26" />))}</> : <path d="M0 28H56M28 0V28M14 28V56M42 28V56" stroke="#75421f" strokeWidth="3" />}
</g>;

// White chest and paws, tabby cap, pink nose and large dark eyes, from Şurpu's photo.
export const Surpu = ({ carrying = false }: { carrying?: boolean }) => <g stroke="#493e39" strokeWidth="3.5" strokeLinejoin="round">
    <path d="M48 108C-13 110 0 59 18 69C30 77 5 87 49 90" fill="none" stroke="#8a7966" strokeWidth="13" strokeLinecap="round" />
    <ellipse cx="73" cy="99" rx="38" ry="48" fill="#fcf6e9" />
    <path d="M80 65Q110 90 95 118L82 112Z" fill="#ded5c3" stroke="none" />
    <ellipse cx="48" cy="135" rx="17" ry="10" fill="#fffaf0" /><ellipse cx="96" cy="135" rx="18" ry="10" fill="#fffaf0" />
    <path d="M34 42L26 0Q50 5 59 24L87 24Q101 1 117 0L110 48Z" fill="#8a7966" />
    <path d="M33 10L39 36L52 28Z M96 28L110 10L105 36Z" fill="#d79f97" stroke="none" />
    <ellipse cx="73" cy="51" rx="44" ry="36" fill="#faf4e8" />
    <path d="M31 44Q27 11 61 19L77 42L87 19Q119 20 114 47L94 53L85 37L71 50L55 33L48 52Z" fill="#8a7966" stroke="none" />
    <path d="M48 22L55 34M59 20L67 32M91 23L86 36M102 26L96 37" fill="none" stroke="#514a43" strokeWidth="4" strokeLinecap="round" />
    <ellipse cx="53" cy="50" rx="13" ry="15" fill="#b6ae7e" /><ellipse cx="94" cy="50" rx="13" ry="15" fill="#b6ae7e" />
    <ellipse cx="55" cy="51" rx="10" ry="12" fill="#24262a" stroke="none" /><ellipse cx="92" cy="51" rx="10" ry="12" fill="#24262a" stroke="none" />
    <circle cx="58" cy="46" r="3.5" fill="#fff" stroke="none" /><circle cx="95" cy="46" r="3.5" fill="#fff" stroke="none" />
    <path d="M67 64Q73 61 79 64L73 70Z" fill="#df9c9d" strokeWidth="2" />
    <path d="M73 70V74M73 74Q65 80 61 73M73 74Q81 80 85 73M30 63L12 60M31 69L11 72M113 63L133 59M113 69L134 73" fill="none" strokeWidth="2" strokeLinecap="round" />
    {carrying && <><path d="M46 87Q67 74 91 88L108 126Q73 149 39 125Z" fill="#e2a95d" /><path d="M47 90Q75 103 92 89" fill="none" /><g transform="translate(47 80) scale(.48)"><Toys /></g><ellipse cx="41" cy="106" rx="10" ry="15" fill="#fffaf0" /><ellipse cx="103" cy="106" rx="10" ry="15" fill="#fffaf0" /></>}
</g>;

const Toys = () => <g stroke="#674731" strokeWidth="3" strokeLinejoin="round">
    <g transform="rotate(-8 25 30)"><path d="M6 49L2 65M37 49L42 65" fill="none" /><rect x="0" y="0" width="45" height="49" rx="7" fill="#ffe35d" /><circle cx="9" cy="9" r="3" fill="#dfba36" stroke="none" /><circle cx="36" cy="30" r="4" fill="#dfba36" stroke="none" /><circle cx="16" cy="18" r="8" fill="white" /><circle cx="31" cy="18" r="8" fill="white" /><circle cx="18" cy="18" r="3" fill="#499ace" /><circle cx="29" cy="18" r="3" fill="#499ace" /><path d="M14 33Q24 41 34 32" fill="none" /><path d="M0 42H45V54H0Z" fill="#aa713e" /><path d="M0 39H45" stroke="white" strokeWidth="6" /><path d="M22 41L19 46L24 48L27 45Z" fill="#ed5b50" /><path d="M3 66H13M34 66H46" stroke="#30374c" strokeWidth="6" strokeLinecap="round" /></g>
    <g transform="translate(66 -5) rotate(10 25 30)"><path d="M24 0L34 24L53 30L39 41L42 67L25 57L7 66L11 41L-3 30L16 24Z" fill="#f6a0a6" /><path d="M11 44Q25 49 39 44L42 58Q26 68 8 58Z" fill="#badd79" /><path d="M13 52L19 50L23 57M31 55L35 50" stroke="#a67fc4" strokeWidth="5" /><ellipse cx="22" cy="25" rx="4" ry="6" fill="white" /><ellipse cx="30" cy="25" rx="4" ry="6" fill="white" /><circle cx="23" cy="26" r="1.5" fill="#30374c" /><circle cx="29" cy="26" r="1.5" fill="#30374c" /><path d="M20 36Q26 40 33 35" fill="none" strokeWidth="2" /></g>
</g>;

const Hero = ({ pink = false, running = false }: { pink?: boolean; running?: boolean }) => {
    const canvas = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const context = canvas.current?.getContext('2d');
        if (!context) return;
        const player = PLAYER_APPEARANCES[pink ? 'gozde' : 'bora'];
        const animate = running && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        let frame = 0;
        const draw = (time: number) => {
            context.clearRect(0, 0, 144, 220);
            context.save();
            context.scale(2, 2);
            context.translate(10, 8);
            drawPlayerSprite(context, player, time, animate);
            context.restore();
            if (animate) frame = window.requestAnimationFrame(draw);
        };
        draw(0);
        return () => window.cancelAnimationFrame(frame);
    }, [pink, running]);
    return <foreignObject x="-10" y="-8" width="72" height="110">
        <canvas ref={canvas} width="144" height="220" style={{ width: 72, height: 110, display: 'block' }} aria-label={pink ? 'Gözde, oyun içi karakteri' : 'Bora, oyun içi karakteri'} />
    </foreignObject>;
};

const Village = ({ step, menu, paused }: { step: number; menu: boolean; paused: boolean }) => <svg className={styles.village} viewBox="0 0 1440 810" preserveAspectRatio={menu ? 'xMidYMid slice' : 'xMidYMid meet'} role="img" aria-label={menu ? 'Yeşil borular, tuğla ve soru bloklarıyla köy; uzakta Şurpu Kestıl.' : 'Köyde Bora ve Gözde, SüngerBob ve Patrick oyuncakları ve beyaz tekir kedi Şurpu. Uzakta Şurpu Kestıl var.'}>
    <defs><linearGradient id="intro-sky" x2="0" y2="1"><stop stopColor="#76d7ff" /><stop offset=".72" stopColor="#c8f3ff" /><stop offset="1" stopColor="#fff3c4" /></linearGradient><linearGradient id="intro-grass" x2="0" y2="1"><stop stopColor="#63cf69" /><stop offset="1" stopColor="#36a852" /></linearGradient><linearGradient id="intro-pipe"><stop stopColor="#269c4d" /><stop offset=".28" stopColor="#83df5c" /><stop offset=".65" stopColor="#3db452" /><stop offset="1" stopColor="#19723e" /></linearGradient><pattern id="intro-earth" width="72" height="48" patternUnits="userSpaceOnUse"><rect width="72" height="48" fill="#a96536" /><path d="M0 0H72V48H0ZM36 0V24M0 24H72M18 24V48M54 24V48" fill="none" stroke="#704022" strokeWidth="3" /><path d="M4 5H31M40 5H67" stroke="#c98d54" strokeWidth="3" /></pattern></defs>
    <rect width="1440" height="810" fill="url(#intro-sky)" /><circle cx="1130" cy="125" r="62" fill="#fff0ad" />
    <g className={styles.clouds} fill="#fffdf0" opacity=".85"><path d="M80 147Q55 100 107 100Q114 46 164 81Q204 73 218 116Q260 137 229 156H80Z" /><path d="M610 120Q590 84 627 77Q645 29 689 66Q735 49 748 94Q786 97 777 128Z" /><path d="M1280 259Q1260 216 1301 210Q1316 160 1363 199Q1404 190 1418 229V267Z" /></g>
    <path d="M0 480Q180 240 450 468Q680 250 900 437Q1130 215 1440 449V810H0Z" fill="#77d990" /><path d="M0 547Q241 350 534 530Q795 330 1057 515Q1314 376 1440 493V810H0Z" fill="#66cb82" />
    <g className={styles.castle} transform="translate(1100 300)" stroke="#46546a" strokeWidth="4"><path d="M0 150V36H35V65H60V20H95V65H122V36H158V150Z" fill="#b9c7cd" /><path d="M-8 36L18 0L43 36M53 20L78 -20L102 20M114 36L140 0L166 36" fill="#bd6f72" /><path d="M59 150V114Q78 84 98 114V150" fill="#596475" /><path d="M78 -20V-65" /><path d="M80 -63L124 -53L80 -40" fill="#e9448c" /><path d="M12 79H27M131 79H147M70 50H86" strokeWidth="8" /></g>
    <path d="M0 585Q470 525 810 579Q1110 545 1440 580V810H0Z" fill="url(#intro-grass)" /><path d="M682 810Q638 653 869 593Q1060 539 1180 471" fill="none" stroke="#d9c48f" strokeWidth="73" />
    <g stroke="#654b3c" strokeWidth="5"><path d="M111 525V334H364V529" fill="#ffedc5" /><path d="M79 349L237 229L392 349Z" fill="#d77766" /><path d="M214 525V436Q239 411 267 436V525" fill="#9e6d4d" /><rect x="135" y="380" width="53" height="62" rx="4" fill="#89cbd1" /><path d="M160 380V442M135 411H188" /><path d="M291 380H342V442H291Z" fill="#89cbd1" /><path d="M316 380V442M291 411H342" /><path d="M133 465H184M293 465H343" stroke="#769967" strokeWidth="13" /><path d="M337 276V228H366V305" fill="#c2967d" /></g>
    <g stroke="#675b3e" strokeWidth="7"><path d="M34 586V430M405 580V426" /><path d="M-20 471H68M-20 502H68M382 471H475M382 502H475" stroke="#ffebbc" strokeWidth="15" /></g>
    <g transform="translate(910 520)"><path d="M0 70V-45" stroke="#796442" strokeWidth="18" /><g fill="#58946f" stroke="#377654" strokeWidth="4"><circle cx="0" cy="-70" r="54" /><circle cx="-40" cy="-38" r="43" /><circle cx="37" cy="-31" r="45" /></g><circle cx="-19" cy="-64" r="7" fill="#f6ab7c" /><circle cx="31" cy="-22" r="7" fill="#f6ab7c" /></g>
    <g fill="#ffedaa">{[52, 148, 398, 880, 974, 1230, 1370].map((x, i) => <g key={x} transform={`translate(${x} ${630 + i % 3 * 42})`}><circle r="6" /><path d="M0 6V20" stroke="#31674e" strokeWidth="3" /></g>)}</g>
    <Pipe x={35} y={563} height={178} /><Pipe x={1018} y={532} height={210} /><Pipe x={1303} y={588} height={153} />
    {menu && <Pipe x={850} y={549} height={194} />}
    <Block x={455} y={322} /><Block x={511} y={322} question /><Block x={567} y={322} /><Block x={767} y={265} question /><Block x={823} y={265} />
    <g fill="#ffdf64" stroke="#b9802f" strokeWidth="3">{[483, 539, 595].map(x => <g key={x}><ellipse cx={x} cy="291" rx="10" ry="15" /><path d={`M${x} 283V299`} /></g>)}</g>
    {!menu && <g className={step === 2 ? styles.chasing : ''} transform="translate(510 498)"><g className={styles.heroBob}><Hero running={step === 2 && !paused} /></g><g transform="translate(70 8)"><g className={styles.heroBob}><Hero pink running={step === 2 && !paused} /></g></g></g>}
    {step < 2 && !menu && <g transform="translate(690 534)"><path d="M-25 29H134L110 70H-37Z" fill="#fff2d7" stroke="#e2c79b" strokeWidth="3" />{step === 0 && <Toys />}</g>}
    {!menu && <g className={step === 2 ? styles.escaping : step === 1 ? styles.sneaking : ''} transform={step === 3 ? 'translate(1140 312) scale(.62)' : 'translate(805 450)'}><g className={styles.catBob}><Surpu carrying={step > 0} /></g></g>}
    {step === 1 && <text x="840" y="405" fontSize="52" fill="#fff5de" stroke="#675343" strokeWidth="2" fontWeight="900">!</text>}
    <rect y="743" width="1440" height="67" fill="url(#intro-earth)" /><path d="M0 743H1440" stroke="#17653b" strokeWidth="5" /><rect y="727" width="1440" height="16" fill="#36a852" /><path d="M0 727H1440" stroke="#83df5c" strokeWidth="6" />
</svg>;

type Props = { mode: 'menu' | 'story'; onStart: () => void; onFinish: () => void; onMenu: () => void; onLevels: () => void };

export const Opening = ({ mode, onStart, onFinish, onMenu, onLevels }: Props) => {
    const [step, setStep] = useState(0);
    const [controls, setControls] = useState(false);
    const [autoPlay, setAutoPlay] = useState(() => !window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    const primary = useRef<HTMLButtonElement>(null);
    const controlsClose = useRef<HTMLButtonElement>(null);
    useEffect(() => { (controls ? controlsClose : primary).current?.focus({ preventScroll: true }); }, [mode, step, controls]);
    useEffect(() => {
        if (mode !== 'story' || !autoPlay || step === scenes.length - 1) return;
        const timer = window.setTimeout(() => setStep(value => value + 1), 6500);
        return () => window.clearTimeout(timer);
    }, [mode, step, autoPlay]);
    const scene = scenes[step];
    return <div className={`${styles.opening} ${mode === 'menu' ? styles.menu : styles.story} ${!autoPlay ? styles.paused : ''}`}>
        <Village key={`${mode}-${step}`} step={mode === 'menu' ? 0 : step} menu={mode === 'menu'} paused={!autoPlay} />
        {mode === 'menu' ? <>
            <svg className={styles.menuCat} viewBox="-10 -10 160 170" role="img" aria-label="Şurpu, beyaz patili ve tekir başlı kedimiz"><Surpu /></svg>
            <div className={styles.menuContent} inert={controls}>
                <p className={styles.kicker}>BORA & GÖZDE’NİN İKİ KİŞİLİK MACERASI</p>
                <h1>Bokçuk<br />Şurpunun<br /><span>Peşinde</span></h1>
                <p className={styles.menuLead}>İki kayıp oyuncak.<br />Çok şüpheli bir kedi.</p>
                <div className={styles.menuButtons}><button ref={primary} className={styles.playButton} onClick={onStart}>OYUNA BAŞLA <span>▶</span></button><button onClick={onLevels}>BÖLÜM SEÇ <span>↗</span></button><button onClick={() => setControls(true)}>NASIL OYNANIR? <span>?</span></button></div>
                <p className={styles.menuFootnote}>Aynı klavye. Aynı takım. Oyuncaklar eve dönecek.</p>
            </div>
            <div className={styles.menuTeam} aria-label="Kahramanlarımız Bora ve Gözde"><div><Portrait player="bora" /><strong>BORA</strong></div><span>♥</span><div><Portrait player="gozde" /><strong>GÖZDE</strong></div></div>
            {controls && <div className={styles.controlsBackdrop}><section className={styles.controlsCard} role="dialog" aria-modal="true" aria-labelledby="opening-controls-title" onKeyDown={event => {
                if (event.key === 'Escape') { event.stopPropagation(); setControls(false); }
                if (event.key === 'Tab') { event.preventDefault(); controlsClose.current?.focus(); }
            }}><p className={styles.kicker}>İKİ KİŞİ, BİR MACERA</p><h2 id="opening-controls-title">Yan yana oynayın.</h2><div><p><Portrait player="bora" /><strong>BORA</strong><span>A / D · Hareket<br />W veya Boşluk · Zıpla<br />S · Boruya gir<br />F · Ateş</span></p><p><Portrait player="gozde" /><strong>GÖZDE</strong><span>← / → · Hareket<br />↑ · Zıpla<br />↓ · Boruya gir<br />Enter · Ateş</span></p></div><p className={styles.controlTip}>Güç blokları sizi büyütür; ateş çiçeğiyle ateş edebilirsiniz. R ile bölümü yeniden başlatın, Esc ile menüye dönün.</p><button ref={controlsClose} className={styles.playButton} onClick={() => setControls(false)}>ANLADIK! <span>♥</span></button></section></div>}
        </> : <>
            <div className={styles.storyTop}><button onClick={onMenu}>← ANA MENÜ</button><div><button onClick={() => setAutoPlay(value => !value)} aria-pressed={!autoPlay}>{autoPlay ? 'Ⅱ DURAKLAT' : '▶ OTOMATİK'}</button><button onClick={onFinish}>İNTROYU ATLA →</button></div></div>
            <div className={styles.speech} key={`speech-${step}`}><div className={styles.speaker}>{scene.speaker.includes('Bora') && <Portrait player="bora" />}{scene.speaker.includes('Gözde') && <Portrait player="gozde" />}<strong>{scene.speaker}</strong></div><p>{scene.line}</p></div>
            <section className={styles.caption} aria-live="polite" aria-atomic="true"><div><p className={styles.kicker}>{scene.label}</p><h2>{scene.title}</h2><p>{scene.text}</p></div><div className={styles.storyNavigation}><span className={styles.progress} aria-label={`Sahne ${step + 1} / ${scenes.length}`}>{scenes.map((_, index) => <i key={index} className={index === step ? styles.current : ''} />)}</span><button ref={primary} className={styles.playButton} onClick={() => step === scenes.length - 1 ? onFinish() : setStep(value => value + 1)}>{step === scenes.length - 1 ? 'PEŞİNE DÜŞ!' : 'DEVAM ET'} <span>→</span></button></div></section>
        </>}
    </div>;
};
