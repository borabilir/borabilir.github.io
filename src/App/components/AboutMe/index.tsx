import AnimatedText from 'Core/components/AnimatedText';
import styles from './styles.module.scss';
import { useTranslation } from 'react-i18next';
import bgSection from 'Core/assets/bgsection.png';

const AboutMe: React.FC = () => {
    const { t } = useTranslation();

    return (
        <section id="about" className={styles.container}>
            <div>
                <AnimatedText.h1 type="fadeDrop">
                    {t('about.title')}
                </AnimatedText.h1>
                <AnimatedText.p>
                    {t('about.p1')}
                    <br />
                    <br />
                    {t('about.p2')}
                </AnimatedText.p>
            </div>
            <img src={bgSection} alt="" />
            <img src={bgSection} alt="" />
        </section>
    );
};

export default AboutMe;
