import { useTranslation } from 'react-i18next';
import SkillTag from '../SkillTag';
import styles from './styles.module.scss';

const Skills: React.FC = () => {
    const { t } = useTranslation();

    return (
        <div className={styles.container}>
            <div className={styles.frontend}>
                <div className={styles.content}>
                    <h1>{t('skills.title')}</h1>
                    <div className={styles.skillSet}>
                        <div className={styles.title}>
                            Front-end Development
                        </div>
                        <div className={styles.skills}>
                            <div className={styles.area}>
                                <h4>Languages</h4>
                                <div className={styles.tags}>
                                    <SkillTag>Typescript</SkillTag>
                                </div>
                            </div>
                            <div className={styles.area}>
                                <h4>Frameworks</h4>
                                <div className={styles.tags}>
                                    <SkillTag>Typescript</SkillTag>
                                </div>
                            </div>
                            <div className={styles.area}>
                                <h4>Libraries</h4>
                                <div className={styles.tags}>
                                    <SkillTag>Typescript</SkillTag>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.backend}>
                <div className={styles.content}>
                    <div className={styles.skillSet}>
                        <div className={styles.title}>Back-end Development</div>
                        <div className={styles.skills}></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Skills;
