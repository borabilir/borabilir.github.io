import { CSSProperties, useEffect, useState } from 'react';
import styles from './styles.module.scss';

type Question = {
    eyebrow: string;
    title: string;
    correctAnswer: string;
    runawayAnswer: string;
};

const questions: Question[] = [
    {
        eyebrow: 'Çok önemli bir soru',
        title: 'Bana küstün mü?',
        correctAnswer: 'Hayır',
        runawayAnswer: 'Evet',
    },
    {
        eyebrow: 'Son bir soru',
        title: 'Beni seviyor musun?',
        correctAnswer: 'Evet',
        runawayAnswer: 'Hayır',
    },
];

const escapeSpots = [
    { left: 74, top: 12, rotate: 2 },
    { left: 76, top: 66, rotate: 5 },
    { left: 20, top: 68, rotate: -4 },
    { left: 77, top: 38, rotate: 4 },
    { left: 48, top: 68, rotate: -3 },
    { left: 51, top: 8, rotate: 3 },
];

const teasingMessages = [
    'O seçenek şu an müsait değil 😌',
    'Yaklaşmıştın ama kalbim izin vermedi 💘',
    'Telefonunda küçük bir bug var galiba 🤭',
    'Israr da sevdaya dahilmiş 😅',
];

const LoveQuiz: React.FC = () => {
    const [step, setStep] = useState(0);
    const [escapeIndex, setEscapeIndex] = useState(0);
    const [attempts, setAttempts] = useState(0);

    const isComplete = step === questions.length;
    const question = questions[step];
    const escapeSpot = escapeSpots[escapeIndex];

    useEffect(() => {
        const previousTitle = document.title;
        document.title = 'Mini Sevgi Testi 💗';

        return () => {
            document.title = previousTitle;
        };
    }, []);

    const runAway = () => {
        setEscapeIndex((current) => (current + 1) % escapeSpots.length);
        setAttempts((current) => current + 1);
    };

    const answerCorrectly = () => {
        setStep((current) => current + 1);
        setEscapeIndex(0);
        setAttempts(0);
    };

    const runawayStyle = {
        '--escape-left': `${escapeSpot.left}%`,
        '--escape-top': `${escapeSpot.top}%`,
        '--escape-rotate': `${escapeSpot.rotate}deg`,
    } as CSSProperties;

    return (
        <main className={`${styles.page} ${isComplete ? styles.completePage : ''}`}>
            <div className={styles.glowOne} />
            <div className={styles.glowTwo} />

            <section className={`${styles.card} ${isComplete ? styles.completeCard : ''}`}>
                {!isComplete ? (
                    <>
                        <div className={styles.progress} aria-label={`${step + 1}. soru, toplam 2 soru`}>
                            <span className={styles.progressLabel}>Mini sevgi testi</span>
                            <span className={styles.progressCount}>{step + 1} / 2</span>
                        </div>

                        <div className={styles.progressTrack}>
                            <span style={{ width: `${(step + 1) * 50}%` }} />
                        </div>

                        <div className={styles.illustration} aria-hidden="true">
                            <span className={styles.smallHeart}>♥</span>
                            <span className={styles.envelope}>💌</span>
                            <span className={styles.sparkle}>✦</span>
                        </div>

                        <p className={styles.eyebrow}>{question.eyebrow}</p>
                        <h1>{question.title}</h1>
                        <p className={styles.subtitle}>Cevabını dikkatli seç, sistem biraz taraflı olabilir.</p>

                        <div className={styles.answerZone}>
                            <button className={styles.correctButton} onClick={answerCorrectly}>
                                {question.correctAnswer} <span aria-hidden="true">♥</span>
                            </button>
                            <button
                                className={styles.runawayButton}
                                style={runawayStyle}
                                onPointerDown={(event) => {
                                    event.preventDefault();
                                    runAway();
                                }}
                                onMouseEnter={runAway}
                                onClick={(event) => {
                                    event.preventDefault();
                                    runAway();
                                }}
                                tabIndex={-1}
                                aria-label={`${question.runawayAnswer}, ama bu seçenek kaçıyor`}
                            >
                                {question.runawayAnswer}
                            </button>
                        </div>

                        <p className={`${styles.hint} ${attempts > 0 ? styles.hintVisible : ''}`} aria-live="polite">
                            {teasingMessages[(attempts - 1 + teasingMessages.length) % teasingMessages.length]}
                        </p>
                    </>
                ) : (
                    <div className={styles.result}>
                        <div className={styles.confetti} aria-hidden="true">
                            {['♥', '✦', '♥', '●', '♥', '✦', '●', '♥'].map((shape, index) => (
                                <span key={index}>{shape}</span>
                            ))}
                        </div>
                        <div className={styles.bigHeart} aria-hidden="true">♥</div>
                        <p className={styles.resultEyebrow}>Tebrikler!</p>
                        <h1>Bütün soruları doğru cevapladınız</h1>
                        <div className={styles.score}>2/2</div>
                        <p className={styles.loveNote}>Seni seviyorum</p>
                        <p className={styles.signature}>Hem de çooook! 💗</p>
                        <figure className={styles.finalPhoto}>
                            <img
                                src={`${process.env.PUBLIC_URL}/q7m2x9k4-finale.png`}
                                alt="Birlikte çekilmiş romantik illüstrasyonumuz"
                            />
                        </figure>
                    </div>
                )}
            </section>

            <p className={styles.footerNote}>Sadece senin için hazırlandı ♡</p>
        </main>
    );
};

export default LoveQuiz;
