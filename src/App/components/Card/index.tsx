import { SkillArea } from 'App/types/SkillArea';
import styles from './styles.module.scss';
import { EmptyImageIcon } from 'Core/components/Icons';
import { motion } from 'framer-motion';

type CardProps = {
    imgSrc?: string[];
    title: string;
    subtitle?: string;
    description?: string;
    areas: SkillArea[];
    onClick?: () => void;
    index?: number;
};

const Card: React.FC<CardProps> = ({
    imgSrc,
    title,
    subtitle,
    description,
    areas,
    onClick,
    index = 0,
}) => {
    const areaTitle = (area: string): string =>
        area === 'frontend'
            ? 'Front-end'
            : area === 'backend'
            ? 'Back-end'
            : '';

    return (
        <motion.div 
            className={styles.container} 
            onClick={onClick}
            initial={{ opacity: 0, y: 60, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{
                duration: 0.3,
                delay: index * 0.08,
                ease: [0.25, 0.46, 0.45, 0.94]
            }}
            whileHover={{ 
                y: -12,
                scale: 1.03,
                rotateY: 2,
                rotateX: -2,
                transition: { 
                    duration: 0.15,
                    ease: "easeOut"
                }
            }}
            whileTap={{ scale: 0.98 }}
        >
            {imgSrc ? (
                <motion.img 
                    src={imgSrc[0]} 
                    alt=""
                    initial={{ scale: 1.2, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.08 + 0.1 }}
                />
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
        </motion.div>
    );
};

export default Card;
