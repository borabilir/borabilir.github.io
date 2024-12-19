import Animator from 'Core/components/Animator';
import styles from './styles.module.scss';
import { useTranslation } from 'react-i18next';
import bgSection from 'Core/assets/bgsection.png';
import TypewriterText from 'Core/components/TypewriterText';

const AboutMe: React.FC = () => {
    const { t } = useTranslation();

    return (
        <section id="about" className={styles.container}>
            <div>
                <Animator.h1 type="fadeDrop">
                    {t('about.title')}
                </Animator.h1>
                <Animator.p>
                    {t('about.p1')}
                    <br />
                    <br />
                    {t('about.p2')}
                </Animator.p>
            </div>
            <img src={bgSection} alt="" />
            <img src={bgSection} alt="" />
        </section>
    );
};

export default AboutMe;
