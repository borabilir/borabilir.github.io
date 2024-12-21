import { useTranslation } from 'react-i18next';
import SkillTag from '../SkillTag';
import styles from './styles.module.scss';
import { SkillSet } from 'App/constants/SkillSet';
import { SkillArea } from 'App/types/SkillArea';
import { SkillCategory } from 'App/types/SkillCategory';
import MountainLeft from 'Core/assets/mountainLeft';
import cx from 'Core/utils/cx';
import MountainRight from 'Core/assets/mountainRight';
import palmTree from 'Core/assets/palm.png';

const Skills: React.FC = () => {
    const { t } = useTranslation();

    const renderSkillTags = (area: SkillArea, category?: SkillCategory) =>
        Object.values(SkillSet)
            .filter((skill) =>
                category
                    ? skill.area === area && skill.category === category
                    : skill.area === area
            )
            .map((x, i) => <SkillTag key={i} skill={x} />);

    return (
        <div className={styles.container}>
            <div className={styles.frontend}>
                <div className={styles.stars} />
                <div className={styles.sun} />
                <img src={palmTree} alt="" />
                <img src={palmTree} alt="" />
                <div className={cx(styles.mountain, styles.left)}>
                    <MountainLeft />
                </div>
                <div className={cx(styles.mountain, styles.left, styles.front)}>
                    <MountainLeft />
                </div>
                <div className={cx(styles.mountain, styles.right)}>
                    <MountainRight />
                </div>
                <div
                    className={cx(styles.mountain, styles.right, styles.front)}
                >
                    <MountainRight />
                </div>

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
                                    {renderSkillTags('frontend', 'language')}
                                </div>
                            </div>
                            <div className={styles.area}>
                                <h4>Frameworks</h4>
                                <div className={styles.tags}>
                                    {renderSkillTags('frontend', 'framework')}
                                </div>
                            </div>
                            <div className={styles.area}>
                                <h4>Libraries</h4>
                                <div className={styles.tags}>
                                    {renderSkillTags('frontend', 'library')}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.backend}>
                <span>
                    <img src="land.png" alt="" />
                </span>
                <div className={cx(styles.mountain, styles.left)}>
                    <MountainLeft />
                </div>
                <div className={cx(styles.mountain, styles.right)}>
                    <MountainRight />
                </div>

                <img src="leaves.png" alt="" />
                <img src="leaves.png" alt="" />
                <div className={styles.content}>
                    <div className={styles.skillSet}>
                        <div className={styles.title}>Back-end Development</div>
                        <div className={styles.skills}>
                            <div className={styles.area}>
                                <h4>Languages</h4>
                                <div className={styles.tags}>
                                    {renderSkillTags('backend', 'language')}
                                </div>
                            </div>
                            <div className={styles.area}>
                                <h4>Frameworks</h4>
                                <div className={styles.tags}>
                                    {renderSkillTags('backend', 'framework')}
                                </div>
                            </div>
                            <div className={styles.area}>
                                <h4>Databases</h4>
                                <div className={styles.tags}>
                                    {renderSkillTags('backend', 'database')}
                                </div>
                            </div>
                            <div className={styles.area}>
                                <h4>ORM & Data Access</h4>
                                <div className={styles.tags}>
                                    {renderSkillTags('backend', 'orm')}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.content} style={{ marginTop: 30 }}>
                    <div className={styles.skillSet}>
                        <div className={styles.title}>Applications & Tools</div>
                        <div className={styles.skills}>
                            <div className={styles.area}>
                                <div className={styles.tags}>
                                    {renderSkillTags('tools')}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Skills;
