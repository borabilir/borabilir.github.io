import TimelineItem from './Item';
import styles from './styles.module.scss';
import { Experiences } from 'App/constants/Experiences';

const Timeline: React.FC = () => {
    const getYear = (date: string): number => {
        if (date.toLowerCase() === 'present') {
            return new Date().getFullYear();
        }
        const year = date.split('-')[1];
        if (!year || isNaN(Number(year))) {
            throw new Error("Invalid date format. Use 'MM-YYYY'.");
        }
        return Number(year);
    };
    const timelineYears = Array.from(
        new Set(
            Experiences.flatMap((entry) => [
                getYear(entry.startDate),
                getYear(entry.endDate),
            ])
        )
    ).sort((b, a) => a - b);

    return (
        <div className={styles.timeline}>
            {timelineYears.map((x, i) => (
                <TimelineItem
                    key={i}
                    align={i % 2 == 0 ? 'left' : 'right'}
                    year={x}
                    isLast={i == timelineYears.length - 1}
                />
            ))}
        </div>
    );
};

export default Timeline;
