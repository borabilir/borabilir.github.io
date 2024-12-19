import { useState } from 'react';
import styles from './styles.module.scss';
import { motion } from 'framer-motion';
import { Tag } from 'App/components/types/Tag';

type RotatingCircleProps = {
    r: number;
    color?: string;
    opacity?: string;
    duration?: number;
    tags: Tag[];
};

const RotatingCircle: React.FC<RotatingCircleProps> = ({
    r,
    duration = 100,
    tags,
}) => {
    const [rotation, setRotation] = useState<string | number>('0');

    return (
        <div className={styles.container}>
            <motion.div
                animate={{ rotate: 360 }}
                transition={{
                    duration: duration,
                    ease: 'linear',
                    repeat: Infinity,
                }}
                className={styles.circle}
                style={{
                    width: r,
                    height: r,
                }}
                onUpdate={(latest) => {
                    if (latest.rotate !== undefined) {
                        setRotation(latest.rotate);
                    }
                }}
            >
                {tags.map((tag, index) => {
                    const angle = (360 / tags.length) * index;
                    const x = r * Math.cos((angle * Math.PI) / 180);
                    const y = r * Math.sin((angle * Math.PI) / 180);

                    return (
                        <motion.div
                            key={index}
                            className={styles.tag}
                            style={{
                                transform: `translate(${x / 2}px, ${
                                    y / 2
                                }px) rotate(${-rotation}deg)`,
                            }}
                        >
                            {tag.label}
                        </motion.div>
                    );
                })}
            </motion.div>
        </div>
    );
};

export default RotatingCircle;
