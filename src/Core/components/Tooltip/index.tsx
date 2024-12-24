import React, { useState } from 'react';
import styles from './styles.module.scss';

type TooltipProps = {
    text: string;
    children: React.ReactNode;
};

const Tooltip: React.FC<TooltipProps> = ({ text, children }) => {
    const [visible, setVisible] = useState(false);

    const showTooltip = () => setVisible(true);
    const hideTooltip = () => setVisible(false);

    return (
        <div
            className={styles.container}
            onMouseEnter={showTooltip}
            onMouseLeave={hideTooltip}
        >
            {children}
            {visible && <div className={styles.tooltip}>{text}</div>}
        </div>
    );
};

export default Tooltip;
