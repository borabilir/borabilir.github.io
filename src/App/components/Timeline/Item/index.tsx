import React, { useState } from 'react';
import styles from './styles.module.scss';
import cx from 'Core/utils/cx';
import { motion } from 'motion/react';
import { Experiences } from 'App/constants/Experiences';
import Modal from 'Core/components/Modal';
import { Experience } from 'App/types/Experience';
import SkillTag from 'App/components/SkillTag';
import { SkillSet } from 'App/constants/SkillSet';
import { formatDateDifference } from 'Core/utils/getFormattedDate';

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
    const [selectedExperience, setSelectedExperience] = useState<
        Experience | undefined
    >();

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

    const entries = Experiences.filter((x) => getYear(x.endDate) == year).sort(
        (x) => getYear(x.startDate)
    );

    const renderModal = () =>
        selectedExperience ? (
            <Modal
                visible={!!selectedExperience}
                onClose={() => setSelectedExperience(undefined)}
                title={selectedExperience.organisation}
                subtitle={
                    <>
                        <div className={styles.title}>
                            {selectedExperience.title}
                        </div>
                        <div className={styles.location}>
                            {`${selectedExperience.location}${
                                selectedExperience.details
                                    ? `, ${selectedExperience.details}`
                                    : ''
                            }`}
                        </div>
                    </>
                }
                logoSrc={selectedExperience.imgSrc}
                right={
                    <>
                        <div
                            className={styles.interval}
                        >{`${selectedExperience.startDate} - ${selectedExperience.endDate}`}</div>
                        <div className={styles.time}>
                            {formatDateDifference(
                                selectedExperience.startDate,
                                selectedExperience.endDate
                            )}
                        </div>
                    </>
                }
                footer={
                    selectedExperience.skills.length > 0 && (
                        <div className={styles.skills}>
                            <h1>Skills Used</h1>
                            <div className={styles.tags}>
                                {selectedExperience.skills.map((x, i) => (
                                    <SkillTag
                                        key={i}
                                        size="sm"
                                        skill={SkillSet[x]}
                                    />
                                ))}
                            </div>
                        </div>
                    )
                }
            >
                {!!selectedExperience.descriptions && (
                    <ul>
                        {selectedExperience.descriptions.map((x, i) => (
                            <li key={i}>{x}</li>
                        ))}
                    </ul>
                )}
            </Modal>
        ) : (
            <></>
        );

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
                        onClick={() => setSelectedExperience(x)}
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
            {renderModal()}
        </div>
    );
};

export default TimelineItem;
