import React, { useState } from 'react';
import styles from './styles.module.scss';
import cx from 'Core/utils/cx';
import { motion } from 'motion/react';
import { Experiences } from 'App/constants/Experiences';
import Modal from 'Core/components/Modal';
import { Experience } from 'App/types/Experience';
import SkillTag from 'App/components/SkillTag';
import { SkillSet } from 'App/constants/SkillSet';

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

    const entries = Experiences.filter((x) => x.endYear == year).sort(
        (x) => x.startYear
    );

    const renderModal = (experience?: Experience) =>
        experience ? (
            <Modal
                visible={!!selectedExperience}
                onClose={() => setSelectedExperience(undefined)}
                title={experience.organisation}
                subtitle={
                    <>
                        <div className={styles.title}>{experience.title}</div>
                        <div className={styles.location}>
                            {`${experience.location}${
                                experience.details
                                    ? `, ${experience.details}`
                                    : ''
                            }`}
                        </div>
                    </>
                }
                logoSrc={experience.imgSrc}
                right={
                    <>
                        <div
                            className={styles.interval}
                        >{`${experience.startYear} - ${experience.endYear}`}</div>
                        <div className={styles.time}>2 yrs 2 mos</div>
                    </>
                }
                footer={
                    <div className={styles.skills}>
                        <h1>Skills Used</h1>
                        <div className={styles.tags}>
                            {experience.skills.map((x, i) => (
                                <SkillTag
                                    key={i}
                                    size="sm"
                                    skill={SkillSet[x]}
                                />
                            ))}
                        </div>
                    </div>
                }
            >
                {!!experience.descriptions && (
                    <ul>
                        {experience.descriptions.map((x, i) => (
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
            {renderModal(selectedExperience)}
        </div>
    );
};

export default TimelineItem;
