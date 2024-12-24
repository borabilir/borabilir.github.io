import { SkillArea } from 'App/types/SkillArea';
import styles from './styles.module.scss';
import { SkillSet } from 'App/constants/SkillSet';
import SkillTag from '../SkillTag';
import { SkillCategory } from 'App/types/SkillCategory';
import Animator from 'Core/components/Animator';

type SkillCardProps = {
    area: SkillArea;
};

const skillCategories: SkillCategory[] = [
    'language',
    'framework',
    'library',
    'orm',
    'database',
    'tools & libraries',
    'other',
    'default',
];

const SkillCard: React.FC<SkillCardProps> = ({ area }) => {
    const renderSkillTags = (area: SkillArea, category?: SkillCategory) =>
        Object.values(SkillSet)
            .filter((skill) =>
                category
                    ? skill.area === area && skill.category === category
                    : skill.area === area
            )
            .map((x, i) => <SkillTag key={i} size="sm" skill={x} />);

    const areaTitle: string =
        area === 'frontend'
            ? 'Front-end Development'
            : area === 'backend'
            ? 'Back-end Development'
            : 'Applications & Tools';

    return (
        <Animator.div type="fadeRise" className={styles.container}>
            <div className={styles.title}>{areaTitle}</div>
            <div className={styles.skills}>
                {skillCategories.map((c, i) => {
                    const skills = Object.values(SkillSet).filter(
                        (x) => x.area === area && x.category === c
                    );
                    return skills.length > 0 ? (
                        <div key={i} className={styles.area}>
                            {c !== 'default' && <h4>{c}</h4>}
                            <div className={styles.tags}>
                                {renderSkillTags(area, c)}
                            </div>
                        </div>
                    ) : null;
                })}
            </div>
        </Animator.div>
    );
};

export default SkillCard;
