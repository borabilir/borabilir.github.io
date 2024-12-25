import Animator from 'Core/components/Animator';
import styles from './styles.module.scss';
import { useTranslation } from 'react-i18next';
import TypewriterText from 'Core/components/TypewriterText';
import ContactIcon from '../ContactIcon';
import Photo from '../Photo';
import Button from 'Core/components/Button';
import { ChevronDownIcon, DownloadIcon } from 'Core/components/Icons';
import MemoizedBackgroundCircles from '../BackgroundCircles';
import AnimatedNumber from 'Core/components/AnimatedNumber';
import { motion } from 'framer-motion';

const Intro: React.FC = () => {
    const { t } = useTranslation();
    const yearsOfExperience = () => {
        const now = new Date();
        const pastDate = new Date(2018, 10);

        let yearsDifference = now.getFullYear() - pastDate.getFullYear();

        if (
            now.getMonth() < pastDate.getMonth() ||
            (now.getMonth() === pastDate.getMonth() &&
                now.getDate() < pastDate.getDate())
        ) {
            yearsDifference--;
        }
        return yearsDifference;
    };

    return (
        <section id="intro" className={styles.container}>
            <MemoizedBackgroundCircles />
            <div className={styles.content}>
                <div className={styles.info}>
                    <div className={styles.left}>
                        <TypewriterText.h3 duration={0.5}>
                            Hello, I am
                        </TypewriterText.h3>
                        <Animator.h1 type="fadeDrop" delay={0.5}>
                            {t('intro.name')}
                        </Animator.h1>
                        <TypewriterText.h2 duration={1} delay={0.7}>
                            {t('intro.title')}
                        </TypewriterText.h2>
                        <Animator delay={1.7} className={styles.contact}>
                            <a href="Bora_Bilir_resume.pdf" download>
                                <Button after={<DownloadIcon />}>
                                    Download CV
                                </Button>
                            </a>
                            <div className={styles.contactIcons}>
                                <ContactIcon type="linkedin" />
                                <ContactIcon type="mail" />
                                <ContactIcon type="instagram" />
                                <ContactIcon type="github" />
                            </div>
                        </Animator>
                    </div>
                    <Animator delay={1.2} className={styles.right}>
                        <Photo />
                        {/* <div>
                        <h5>{t('intro.years')}</h5>
                        <h4>
                            <AnimatedNumber end={yearsOfExperience()} />+
                        </h4>
                    </div>
                    <div>
                        <h5>{t('intro.projects')}</h5>
                        <h4>
                            <AnimatedNumber end={50} />+
                        </h4>
                    </div> */}
                    </Animator>
                </div>
                <Animator delay={2} className={styles.stats}>
                    <div>
                        <h4>
                            <AnimatedNumber
                                delay={2.1}
                                end={yearsOfExperience()}
                            />
                            +
                        </h4>
                        <h5>{t('intro.years')}</h5>
                    </div>
                    <div>
                        <h4>
                            <AnimatedNumber delay={2.1} end={20} />+
                        </h4>
                        <h5>{t('intro.projects')}</h5>
                    </div>
                    <div>
                        <h4>
                            <AnimatedNumber delay={2.1} end={30} />+
                        </h4>
                        <h5>{t('intro.skills')}</h5>
                    </div>
                </Animator>
                <Animator delay={1} className={styles.scrollDown}>
                    <h4>Scroll Down</h4>
                    <h5>to View More </h5>
                    <motion.div
                        animate={{ y: [-2, 2] }}
                        transition={{
                            duration: 1,
                            repeat: Infinity,
                            repeatType: 'reverse',
                            ease: 'easeInOut',
                        }}
                    >
                        <ChevronDownIcon />
                    </motion.div>
                </Animator>
            </div>
        </section>
    );
};

export default Intro;
