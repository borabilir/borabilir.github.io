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
            <motion.img
                className={styles.img1}
                animate={{ x: [0, -50, 0], y: [0, 100, 0], scale: [1, 5, 1] }}
                transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
                src="c3.png"
                alt=""
            />
            <motion.img
                className={styles.img2}
                animate={{
                    x: [0, 150, 0],
                    y: [0, -100, 0],
                    scale: [1, 3.5, 1],
                }}
                transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
                src="c4.png"
                alt=""
            />
            <motion.img
                className={styles.img3}
                animate={{ x: [0, 50, 0], y: [0, -150, 0], scale: [1, 3.5, 1] }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
                src="c1.png"
                alt=""
            />
            <motion.img
                className={styles.img4}
                animate={{
                    x: [-20, 50, -20],
                    y: [0, -300, 0],
                    scale: [1, 2.5, 1],
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
                src="c2.png"
                alt=""
            />
        </div>
    );
};

export default BlurryBackground;
