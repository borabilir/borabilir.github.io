import React, { ReactNode } from 'react';
import styles from './styles.module.scss';
import { Skill } from 'App/types/Skill';
import cx from 'Core/utils/cx';
import { motion } from 'framer-motion';

export type SkillTagProps = {
    skill: Skill;
    size?: 'md' | 'sm';
    index?: number;
};

const SkillTag: React.FC<SkillTagProps> = ({ skill, size = 'md', index = 0 }) => {
    const hexToRgba = (hex: string, alpha: number) => {
        let r = parseInt(hex.slice(1, 3), 16);
        let g = parseInt(hex.slice(3, 5), 16);
        let b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    return (
        <>
            {skill && (
                <motion.div 
                    className={cx(styles.container, styles[size])}
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{
                        duration: 0.15,
                        delay: index * 0.008,
                        ease: "easeOut"
                    }}
                    whileHover={{ 
                        scale: 1.08, 
                        y: -4,
                        transition: { duration: 0.1 }
                    }}
                    whileTap={{ scale: 0.95 }}
                >
                    <div
                        className={cx(styles.tag, styles[size])}
                        style={{
                            backgroundColor: hexToRgba(skill.color, 0.8),
                        }}
                    >
                        {skill?.icon && (
                            <span>
                                {skill.icon}
                            </span>
                        )}
                        <span>{skill.name}</span>
                    </div>
                </motion.div>
            )}
        </>
    );
};

export default SkillTag;
