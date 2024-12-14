import React from 'react';
import styles from './styles.module.scss';
import Timeline from '../Timeline';
import { useTranslation } from 'react-i18next';
import AnimatedText from 'Core/components/AnimatedText';

const CareerJourney: React.FC = () => {
    const { t } = useTranslation();

    return (
        <section id="career" className={styles.container}>
            <AnimatedText.h3 type="fadeDrop">
                {t('career.title').split(' ')[0]}{' '}
                <span>{t('career.title').split(' ')[1]}</span>
            </AnimatedText.h3>
            <AnimatedText.h4>{t('career.description')}</AnimatedText.h4>
            <Timeline />
        </section>
    );
};

export default CareerJourney;
