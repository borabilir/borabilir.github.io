import Animator from 'Core/components/Animator';
import styles from './styles.module.scss';
import { useTranslation } from 'react-i18next';

const RecentWorks: React.FC = () => {
    const { t } = useTranslation();
    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <Animator.h3 type="fadeDrop">
                    {t('works.title').split(' ')[0]}{' '}
                    <span>{t('works.title').split(' ')[1]}</span>
                </Animator.h3>
                <Animator.h4>{t('works.description')}</Animator.h4>
                <div className={styles.works}>
                    
                </div>
            </div>
        </div>
    );
};

export default RecentWorks;
