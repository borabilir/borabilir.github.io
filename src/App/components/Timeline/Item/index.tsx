import React from 'react';
import styles from './styles.module.scss';
import { timelineData } from '../constants/timelineData';
import cx from 'Core/utils/cx';
import { motion } from 'motion/react';

type TimelineItemProps = {
    year: number | 'Present';
    align: 'left' | 'right';
    isLast?: boolean;
};

const TimelineItem: React.FC<TimelineItemProps> = ({
    year,
    align,
    isLast = false,
}) => {
    const entries = timelineData
        .filter((x) => x.endYear == year)
        .sort((x) => x.startYear);

    return (
        <div className={styles.container}>
            <motion.div
                whileHover={{ scale: 1.2 }}
                className={styles.timelineDot}
            >
                <motion.span
                    initial={{ opacity: 0, x: align == 'left' ? -100 : 100 }}
                    whileInView={{
                        x: 0,
                        opacity: 1,
                    }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                    className={cx(
                        [styles.left, align == 'left'],
                        [styles.right, align == 'right']
                    )}
                >
                    {year}
                </motion.span>
            </motion.div>
            {!isLast && <div className={styles.line} />}

            {entries.map((x, i) => {
                const isLeft =
                    (align == 'left' && i % 2 == 0) ||
                    (align == 'right' && i % 2 != 0);

                return (
                    <motion.div
                        key={i}
                        whileHover={{ scale: 1.05 }}
                        className={cx(
                            styles.details,
                            [styles.left, isLeft],
                            [styles.right, !isLeft]
                        )}
                    >
                        <motion.img
                            initial={{ opacity: 0, scale: 0.6 }}
                            whileInView={{
                                opacity: 1,
                                scale: 1,
                            }}
                            viewport={{ once: true, amount: 0.5 }}
                            transition={{ duration: 0.5, ease: 'easeInOut' }}
                            src={x.imgSrc}
                            alt=""
                        />
                        <div>
                            <motion.h3
                                initial={{ opacity: 0, x: isLeft ? -10 : 10 }}
                                whileInView={{
                                    x: 0,
                                    opacity: 1,
                                }}
                                viewport={{ once: true, amount: 0.5 }}
                                transition={{ duration: 1, ease: 'easeInOut' }}
                            >
                                {x.organisation}
                            </motion.h3>
                            <motion.h4
                                initial={{ opacity: 0, x: isLeft ? -25 : 25 }}
                                whileInView={{
                                    x: 0,
                                    opacity: 1,
                                }}
                                viewport={{ once: true, amount: 0.5 }}
                                transition={{ duration: 1, ease: 'easeInOut' }}
                            >
                                {x.title}
                            </motion.h4>
                            <motion.h5
                                initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
                                whileInView={{
                                    x: 0,
                                    opacity: 1,
                                }}
                                viewport={{ once: true, amount: 0.5 }}
                                transition={{ duration: 1, ease: 'easeInOut' }}
                            >{`${x.location}${
                                x.details ? `, ${x.details}` : ''
                            }`}</motion.h5>
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
};

export default TimelineItem;
