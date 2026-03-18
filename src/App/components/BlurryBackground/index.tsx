import React from 'react';
import styles from './styles.module.scss';
import { motion } from 'framer-motion';
import cx from 'Core/utils/cx';

type BlurryBackgroundProps = {
    align: 'left' | 'right';
};

const BlurryBackground: React.FC<BlurryBackgroundProps> = ({ align }) => {
    return (
        <div className={cx(styles.container, styles[align])}>
            <motion.div
                className={styles.circle1}
                animate={{ x: [0, -50, 0], y: [0, 100, 0], scale: [1, 1.5, 1] }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
            />
            <motion.div
                className={styles.circle2}
                animate={{
                    x: [0, 150, 0],
                    y: [0, -100, 0],
                    scale: [1, 1.3, 1],
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
            />
            <motion.div
                className={styles.circle3}
                animate={{ x: [0, 50, 0], y: [0, -150, 0], scale: [1, 1.4, 1] }}
                transition={{
                    duration: 7,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
            />
            <motion.div
                className={styles.circle4}
                animate={{
                    x: [-20, 50, -20],
                    y: [0, -300, 0],
                    scale: [1, 1.2, 1],
                }}
                transition={{
                    duration: 9,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
            />
        </div>
    );
};

export default BlurryBackground;
