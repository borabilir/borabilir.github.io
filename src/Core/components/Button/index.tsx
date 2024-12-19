import React, { ReactNode } from 'react';
import styles from './styles.module.scss';

type ButtonProps = {
    children: ReactNode;
    before?: ReactNode;
    after?: ReactNode;
};

const Button: React.FC<ButtonProps> = ({ children, before, after }) => {
    return (
        <button className={styles.button}>
            {before && <span className={styles.before}>{before}</span>}
            {children}
            {after && <span className={styles.after}>{after}</span>}
        </button>
    );
};

export default Button;
