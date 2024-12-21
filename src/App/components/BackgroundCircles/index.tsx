import { shuffleArray } from 'Core/utils/shuffleArray';
import { Tag } from '../../types/Tag';
import RotatingCircle from './Circle';
import styles from './styles.module.scss';
import Animator from 'Core/components/Animator';
import { memo } from 'react';

const skills1: Tag[] = [
    { label: 'Typescript' },
    { label: 'Javascript' },
    { label: 'HTML' },
    { label: 'CSS' },
    { label: 'SCSS' },
    { label: 'React.js' },
    { label: 'Next.js' },
];
const skills2: Tag[] = [
    { label: 'C#' },
    { label: 'T-SQL' },
    { label: '.NET Core' },
    { label: 'EF Core' },
    { label: 'ASP.NET' },
];

const BackgroundCircles = () => {
    return (
        <Animator delay={1} className={styles.container}>
            <RotatingCircle
                r={1600}
                tags={shuffleArray(skills1)}
                duration={80}
            />
            <RotatingCircle r={1100} tags={shuffleArray(skills2)} />
            <RotatingCircle
                r={600}
                tags={shuffleArray(skills1)}
                duration={120}
            />
        </Animator>
    );
};

export const MemoizedBackgroundCircles = memo(BackgroundCircles);

export default MemoizedBackgroundCircles;
