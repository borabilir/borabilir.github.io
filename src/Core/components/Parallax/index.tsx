import useMousePosition from 'Core/hooks/useMousePosition';
import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';

type ParallaxElementProps = {
    multiplier: number;
    children: React.ReactNode;
    className?: string;
};

export const ParallaxElement: React.FC<ParallaxElementProps> = ({
    multiplier,
    children,
    className,
}) => {
    const mousePosition = useMousePosition();
    const [position, setPosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = () => {
            const x =
                (mousePosition.x - window.innerWidth / 2) * multiplier * 0.01;
            const y =
                (mousePosition.y - window.innerHeight / 2) * multiplier * 0.01;
            setPosition({ x, y });
        };

        handleMouseMove();
    }, [mousePosition, multiplier]);

    return (
        <motion.div
            className={className}
            animate={{ x: -position.x, y: -position.y }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
            {children}
        </motion.div>
    );
};

type ParallaxContainerProps = {
    children: React.ReactNode;
    className?: string;
};

export const ParallaxContainer: React.FC<ParallaxContainerProps> = ({
    children,
    className,
}) => {
    return (
        <div className={className} style={{ position: 'relative' }}>
            {children}
        </div>
    );
};
