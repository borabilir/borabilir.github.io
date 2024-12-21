import TimelineItem from './Item';
import styles from './styles.module.scss';
import { Experiences } from 'App/constants/Experiences';

const Timeline: React.FC = () => {
    const timelineYears = Array.from(
        new Set(
            Experiences.flatMap((entry) => [entry.startYear, entry.endYear])
        )
    ).sort((b, a) => (a === 'Present' ? 1 : b === 'Present' ? -1 : a - b));

    return (
        <div className={styles.timeline}>
            {timelineYears.map((x, i) => (
                <>
                    <TimelineItem
                        align={i % 2 == 0 ? 'left' : 'right'}
                        year={x}
                        isLast={i == timelineYears.length - 1}
                    />
                </>
            ))}
         
        </div>
    );
};

export default Timeline;
