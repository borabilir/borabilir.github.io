import React, { ReactNode } from 'react';
import styles from './styles.module.scss';

export type SkillTagProps = {
    imgSrc?: string;
    bgColor?: string;
    children: ReactNode;
};

const SkillTag: React.FC<SkillTagProps> = ({
    imgSrc,
    bgColor = '#e8f1f1',
    children,
}) => {
    return (
        <div className={styles.container} style={{ backgroundColor: bgColor }}>
            {children}
        </div>
    );
};

export default SkillTag;
