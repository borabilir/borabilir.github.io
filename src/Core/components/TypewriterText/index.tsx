import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

type Props = {
    children: string;
    duration: number;
    className?: string;
};

const TypewriterText: React.FC<Props> = ({ children, duration, className }) => {
    const [visibleText, setVisibleText] = useState(children.slice(0, 1));
    const totalCharacters = children.length;
    const interval = duration / totalCharacters - 1;

    useEffect(() => {
        let index = 1;

        const timer = setInterval(() => {
            index++;
            setVisibleText(children.slice(0, index));
            if (index === totalCharacters) {
                clearInterval(timer);
            }
        }, interval);

        return () => clearInterval(timer);
    }, [children, interval, totalCharacters]);

    return (
        <motion.span
            className={className}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            {visibleText}
        </motion.span>
    );
};

export default TypewriterText;
