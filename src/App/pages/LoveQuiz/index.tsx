import { CSSProperties, FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import styles from './styles.module.scss';

type Question = { letter: string; answer: string; clue: string };
type LetterStatus = 'waiting' | 'active' | 'passed' | 'correct';
type GamePhase = 'intro' | 'playing' | 'complete';

const questions: Question[] = [
    { letter: 'A', answer: 'Ankara', clue: 'Yerlilerine göre ülkenin en iyi şehri' },
    { letter: 'B', answer: 'Bokçuk', clue: 'Küçük ve tipsiz anlamında benim kedilere kullandığım sıfat' },
    { letter: 'C', answer: 'Cin Biberi', clue: 'Tavuk pilavın yanında iyi gider' },
    { letter: 'Ç', answer: 'Çizme', clue: '10 bin TL’ye ayak giysisi' },
    { letter: 'D', answer: 'Döner', clue: 'Favori yemeğim' },
    { letter: 'E', answer: 'Erkek', clue: 'Sana göre kadının bir alt versiyonu' },
    { letter: 'F', answer: 'Fırın', clue: 'Yokluğunda beni güzel tatlılardan ve yemeklerden mahrum bırakan alet' },
    { letter: 'G', answer: 'Galata Kulesi', clue: 'Tanıştığımız yer' },
    { letter: 'H', answer: 'Hastane', clue: 'Geçen kış güzide date mekanımız' },
    { letter: 'I', answer: 'Isparta', clue: 'Askerliğimi nerede yaptım?' },
    { letter: 'İ', answer: 'İzmir Bomba', clue: 'Uyduruk bir tatlı ismi?' },
    { letter: 'J', answer: 'Jamaican', clue: 'Bam bam biram bam bam diye Balkan tatilinde sürekli dinlediğim şarkı' },
    { letter: 'K', answer: 'Kestıl', clue: 'Kalenin İngilizce okunuşunun Gözdece Türkçe telaffuzu' },
    { letter: 'L', answer: 'Lavanta', clue: 'Parfümlerin vazgeçilmez tuvalet kokusunun özü' },
    { letter: 'M', answer: 'Marmara Park', clue: 'Gidildiğinde ayak tabanlarını ağrıtan mekan' },
    { letter: 'N', answer: 'Nispeten', clue: 'Bir duruma oranla, göre veya bir dereceye kadar, oldukça' },
    { letter: 'O', answer: 'Otopark', clue: 'Sitede kapısının açılması için ileri geri hareket edilmesi gereken yer' },
    { letter: 'Ö', answer: 'Öfke', clue: 'Kontrolünde problemim olan duygu' },
    { letter: 'P', answer: 'Pestisit', clue: 'Sirkeli suyla arındırılan yemeklerimizi 1 saat geciktiren şey' },
    { letter: 'R', answer: 'Rakı', clue: 'İkimizin de sevmediği bir içki' },
    { letter: 'S', answer: 'Sarma', clue: 'Yapraktan yapılan senin sevdiğin bir yemek' },
    { letter: 'Ş', answer: 'Şurup', clue: 'Başımızın tatlı belası' },
    { letter: 'T', answer: 'Tiramisu', clue: 'Senin sevmediğin benim sevdiğim bir tatlı' },
    { letter: 'U', answer: 'Uzay', clue: 'Burada geçen filmleri sevmezsin' },
    { letter: 'Ü', answer: 'Ütü', clue: 'Benim masında yapmadığım için dalga geçtiğin şey' },
    { letter: 'V', answer: 'Veteriner', clue: 'Date aktivitesi olarak gittiğimiz yerlerden biri' },
    { letter: 'Y', answer: 'Yugoslavya', clue: '1991 yılında dağılmaya başlayan ama senin tarafından dağılmamış olarak bilinen ülke' },
    { letter: 'Z', answer: 'Zaman', clue: 'Beypeğğlıs rezidınsta yavaş işleyen olgu (İpucu: Asansör, Otopark)' },
];

const normalizeAnswer = (value: string) => value
    .trim()
    .toLocaleLowerCase('tr-TR')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[ıçşğöü]/g, (letter) => ({ 'ı': 'i', 'ç': 'c', 'ş': 's', 'ğ': 'g', 'ö': 'o', 'ü': 'u' } as Record<string, string>)[letter] || letter)
    .replace(/[\s\-_'.]+/g, '');

const LoveQuiz: React.FC = () => {
    const [phase, setPhase] = useState<GamePhase>('intro');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [statuses, setStatuses] = useState<Record<string, LetterStatus>>({});
    const [answer, setAnswer] = useState('');
    const [feedback, setFeedback] = useState<'none' | 'wrong' | 'correct' | 'passed'>('none');
    const [wrongAttempts, setWrongAttempts] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const transitionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const question = questions[currentIndex];
    const correctCount = questions.filter(({ letter }) => statuses[letter] === 'correct').length;
    const passedCount = questions.filter(({ letter }) => statuses[letter] === 'passed').length;
    const progress = (correctCount / questions.length) * 100;

    const currentStatuses = useMemo(() => questions.reduce<Record<string, LetterStatus>>((result, item, index) => {
        result[item.letter] = index === currentIndex && phase === 'playing' ? 'active' : statuses[item.letter] || 'waiting';
        return result;
    }, {}), [currentIndex, phase, statuses]);

    useEffect(() => {
        const previousTitle = document.title;
        document.title = 'Aşırı Ciddi Pasaparola';
        return () => {
            document.title = previousTitle;
            if (transitionTimer.current) clearTimeout(transitionTimer.current);
        };
    }, []);

    useEffect(() => {
        if (phase === 'playing' && !isTransitioning && window.matchMedia('(min-width: 901px)').matches) {
            inputRef.current?.focus();
        }
    }, [currentIndex, phase, isTransitioning]);

    const findNextQuestion = (fromIndex: number, nextStatuses: Record<string, LetterStatus>) => {
        for (let offset = 1; offset <= questions.length; offset += 1) {
            const index = (fromIndex + offset) % questions.length;
            if (nextStatuses[questions[index].letter] !== 'correct') return index;
        }
        return -1;
    };

    const moveOn = (nextStatuses: Record<string, LetterStatus>, delay = 520) => {
        setIsTransitioning(true);
        transitionTimer.current = setTimeout(() => {
            const nextIndex = findNextQuestion(currentIndex, nextStatuses);
            setAnswer('');
            setFeedback('none');
            setIsTransitioning(false);
            if (nextIndex === -1) setPhase('complete');
            else setCurrentIndex(nextIndex);
        }, delay);
    };

    const startGame = () => {
        if (transitionTimer.current) clearTimeout(transitionTimer.current);
        setStatuses({});
        setCurrentIndex(0);
        setAnswer('');
        setFeedback('none');
        setWrongAttempts(0);
        setIsTransitioning(false);
        setPhase('playing');
    };

    const submitAnswer = (event: FormEvent) => {
        event.preventDefault();
        if (isTransitioning || !answer.trim()) return;
        if (normalizeAnswer(answer) === normalizeAnswer(question.answer)) {
            const nextStatuses = { ...statuses, [question.letter]: 'correct' as LetterStatus };
            setStatuses(nextStatuses);
            setFeedback('correct');
            moveOn(nextStatuses, 650);
        } else {
            setWrongAttempts((count) => count + 1);
            setFeedback('wrong');
            setAnswer('');
            inputRef.current?.focus();
        }
    };

    const passQuestion = () => {
        if (isTransitioning) return;
        const nextStatuses = { ...statuses, [question.letter]: 'passed' as LetterStatus };
        setStatuses(nextStatuses);
        setFeedback('passed');
        moveOn(nextStatuses);
    };

    const chooseLetter = (index: number) => {
        if (phase !== 'playing' || isTransitioning || statuses[questions[index].letter] === 'correct') return;
        setCurrentIndex(index);
        setAnswer('');
        setFeedback('none');
    };

    return (
        <main className={styles.page}>
            <div className={styles.ambient} aria-hidden="true"><span /><span /><span /></div>

            {phase === 'intro' && (
                <section className={styles.introCard}>
                    <div className={styles.miniRosette} aria-hidden="true"><span>A</span><span>Ş</span><span>Ö</span><span>K</span><b>?!</b></div>
                    <p className={styles.kicker}>Gereksiz bilgiler şampiyonası</p>
                    <h1>Pasaparola<em>ama kişisel.</em></h1>
                    <p className={styles.introText}>28 harf, bolca saçmalık. Yanlış cevaplar sonsuza kadar yüzüne vurulabilir.</p>
                    <button className={styles.primaryButton} onClick={startGame}>Başlat bakalım <span aria-hidden="true">→</span></button>
                    <div className={styles.rules}><span><i>28</i> soru</span><span><i>0</i> torpil</span><span><i>!</i> bol baskı</span></div>
                </section>
            )}

            {phase === 'playing' && (
                <section className={styles.gameShell}>
                    <header className={styles.gameHeader}>
                        <div className={styles.brand}><span className={styles.brandMark}>?</span><span>Pasaparola</span></div>
                        <div className={styles.scorePill}><strong>{correctCount}</strong><span>/ {questions.length}</span></div>
                    </header>

                    <div className={styles.gameGrid}>
                        <div className={styles.wheelArea}>
                            <div className={styles.wheel} aria-label="Pasaparola harfleri">
                                <div className={styles.wheelGlow} />
                                {questions.map((item, index) => {
                                    const letterStyle = { '--angle': `${(index / questions.length) * 360 - 90}deg` } as CSSProperties;
                                    const status = currentStatuses[item.letter];
                                    return (
                                        <button key={item.letter} type="button" className={`${styles.letter} ${styles[status]}`} style={letterStyle} onClick={() => chooseLetter(index)} aria-current={status === 'active' ? 'step' : undefined}>
                                            <span>{item.letter}</span>
                                        </button>
                                    );
                                })}
                                <div className={styles.wheelCenter}><small>Doğru</small><strong>{correctCount}</strong><span>{passedCount > 0 ? `${passedCount} kaçış` : 'daha yeni!'}</span></div>
                            </div>
                            <div className={styles.legend} aria-hidden="true"><span><i className={styles.legendActive} /> Aktif</span><span><i className={styles.legendCorrect} /> Doğru</span><span><i className={styles.legendPassed} /> Pas</span></div>
                        </div>

                        <article className={`${styles.questionCard} ${feedback === 'wrong' ? styles.shake : ''}`}>
                            <div className={styles.questionTopline}><span>Sıra sende</span><span>{currentIndex + 1}. harf</span></div>
                            <div className={styles.letterBadge}>{question.letter}</div>
                            <p className={styles.startsWith}><strong>{question.letter}</strong> harfi ile başlıyor</p>
                            <h2>{question.clue}</h2>
                            <div className={styles.maskedAnswer}>
                                {question.answer.split(' ').map((word, index) => <span key={`${word}-${index}`}>{Array.from(word).map(() => '_').join(' ')}</span>)}
                            </div>
                            <form onSubmit={submitAnswer} className={styles.answerForm}>
                                <label htmlFor="pasaparola-answer">Cevabın</label>
                                <div className={`${styles.inputWrap} ${feedback === 'correct' ? styles.inputCorrect : ''}`}>
                                    <input ref={inputRef} id="pasaparola-answer" value={answer} onChange={(event) => { setAnswer(event.target.value); if (feedback === 'wrong') setFeedback('none'); }} disabled={isTransitioning} autoComplete="off" autoCapitalize="sentences" spellCheck={false} placeholder="Aklına geleni yaz..." aria-invalid={feedback === 'wrong'} />
                                    <button type="submit" disabled={!answer.trim() || isTransitioning} aria-label="Cevabı gönder">→</button>
                                </div>
                            </form>
                            <div className={styles.feedback} aria-live="polite">
                                {feedback === 'wrong' && <span className={styles.wrongMessage}>Yanlış. Beni hiç mi dinlemedin?</span>}
                                {feedback === 'correct' && <span className={styles.correctMessage}>Aferin kız</span>}
                                {feedback === 'passed' && <span className={styles.passMessage}>Kaçış yok, geri gelecek.</span>}
                                {feedback === 'none' && wrongAttempts > 0 && <span>Toplam {wrongAttempts} kez salladın. Kayıtlara geçti.</span>}
                            </div>
                            <button type="button" className={styles.passButton} onClick={passQuestion} disabled={isTransitioning}><span aria-hidden="true">↻</span> Pas geç</button>
                        </article>
                    </div>

                    <footer className={styles.progressFooter}><span>Ezberlenenler</span><div className={styles.progressTrack}><i style={{ width: `${progress}%` }} /></div><strong>%{Math.round(progress)}</strong></footer>
                </section>
            )}

            {phase === 'complete' && (
                <section className={styles.completeCard}>
                    <div className={styles.confetti} aria-hidden="true">{Array.from({ length: 18 }).map((_, index) => <i key={index} />)}</div>
                    <div className={styles.completeSeal}><span>✓</span><i>İnanılmaz</i></div>
                    <p className={styles.kicker}>Şaka maka 28 / 28</p>
                    <h1>Hepsini<em>bildin?!</em></h1>
                    <p className={styles.completeText}>Beklentiler düşüktü ama sen aştın. Bu sonuç şimdilik ilişki tarihine altın harflerle yazıldı.</p>
                    <div className={styles.loveNote}>ÖDÜL: Hava atma hakkı</div>
                    <button className={styles.replayButton} onClick={startGame}><span aria-hidden="true">↻</span> Rövanş iste</button>
                </section>
            )}
        </main>
    );
};

export default LoveQuiz;
