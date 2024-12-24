import { SkillArea } from 'App/types/SkillArea';
import styles from './styles.module.scss';
import { EmptyImageIcon } from 'Core/components/Icons';

type CardProps = {
    imgSrc?: string[];
    title: string;
    subtitle?: string;
    description?: string;
    areas: SkillArea[];
    onClick?: () => void;
};

const Card: React.FC<CardProps> = ({
    imgSrc,
    title,
    subtitle,
    description,
    areas,
    onClick,
}) => {
    const areaTitle = (area: string): string =>
        area === 'frontend'
            ? 'Front-end'
            : area === 'backend'
            ? 'Back-end'
            : '';

    return (
        <div className={styles.container} onClick={onClick}>
            {imgSrc ? (
                <img src={imgSrc[0]} alt="" />
            ) : (
                <div className={styles.emptyImg}>
                    <EmptyImageIcon />
                    <span>No Project Image</span>
                </div>
            )}
            <div className={styles.content}>
                <h1>{title}</h1>
                <h2>{subtitle}</h2>
                {areas.map((x, i) => (
                    <div key={i} className={styles.tag}>
                        {areaTitle(x)}
                    </div>
                ))}
                <p>{description}</p>
            </div>
        </div>
    );
};

export default Card;
