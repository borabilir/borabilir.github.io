import React, { ReactNode } from 'react';
import styles from './styles.module.scss';
import { Skill } from 'App/types/Skill';
import cx from 'Core/utils/cx';

export type SkillTagProps = {
    skill: Skill;
    size?: 'md' | 'sm';
};

const SkillTag: React.FC<SkillTagProps> = ({ skill, size = 'md' }) => {
    const hexToRgba = (hex: string, alpha: number) => {
        let r = parseInt(hex.slice(1, 3), 16);
        let g = parseInt(hex.slice(3, 5), 16);
        let b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    return (
        <>
            {skill && (
                <div className={cx(styles.container, styles[size])}>
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
                </div>
            )}
        </>
    );
};

export default SkillTag;
