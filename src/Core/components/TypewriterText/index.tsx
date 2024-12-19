import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

type Props = {
    children: string;
    duration: number;
    delay?: number; // Saniye cinsinden alacak
    className?: string;
};

const TypewriterText: React.FC<Props & { as?: React.ElementType }> = ({
    children,
    duration,
    className,
    delay = 0,
    as = 'div',
}) => {
    const [visibleText, setVisibleText] = useState('');
    const totalCharacters = children.length;

    const interval = (duration * 1000) / totalCharacters;

    const MotionComponent = motion[
        as as keyof typeof motion
    ] as React.ElementType;

    useEffect(() => {
        const startTyping = () => {
            let index = 1;

            const timer = setInterval(() => {
                index++;
                setVisibleText(children.slice(0, index));
                if (index === totalCharacters) {
                    clearInterval(timer);
                }
            }, interval);

            return () => clearInterval(timer);
        };

        const delayTimer = setTimeout(startTyping, delay * 1000);

        return () => clearTimeout(delayTimer);
    }, [children, interval, totalCharacters, delay]);

    return (
        <MotionComponent
            className={className}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration, delay }}
        >
            {visibleText}
        </MotionComponent>
    );
};

const tagNames = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span'] as const;

type TypewriterTextComponent = typeof TypewriterText & {
    [key in (typeof tagNames)[number]]: React.FC<Omit<Props, 'as'>>;
};

tagNames.forEach((tag) => {
    (TypewriterText as TypewriterTextComponent)[tag] = (
        props: Omit<Props, 'as'>
    ) => <TypewriterText as={tag} {...props} />;
});

export default TypewriterText as TypewriterTextComponent;
