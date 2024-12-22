import React from 'react';
import styles from './styles.module.scss';
import Timeline from '../Timeline';
import { useTranslation } from 'react-i18next';
import Animator from 'Core/components/Animator';

const CareerJourney: React.FC = () => {
    const { t } = useTranslation();

    return (
        <section id="career" className={styles.container}>
            <div className={styles.content}>
                <Animator.h1 type="fadeDrop">
                    {t('career.title').split(' ')[0]}{' '}
                    <span>{t('career.title').split(' ')[1]}</span>
                </Animator.h1>
                <Animator.h2>{t('career.description')}</Animator.h2>
                <Timeline />
            </div>
        </section>
    );
};

export default CareerJourney;
