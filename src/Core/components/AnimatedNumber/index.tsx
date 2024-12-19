import React, { useEffect, useRef } from 'react';
import { useInView, motion, useSpring } from 'framer-motion';

type AnimatedNumberProps = {
    start?: number;
    end: number;
    delay?: number;
    className?: string;
};

const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
    start = 0,
    end,
    delay = 0,
    className,
}) => {
    const ref = useRef<HTMLSpanElement>(null);
    const isInView = useInView(ref, { once: true });

    const springValue = useSpring(start, {
        stiffness: 100,
        damping: 30,
    });

    useEffect(() => {
        springValue.on('change', (latest) => {
            if (ref.current) {
                ref.current.textContent = latest.toFixed(0);
            }
        });
    }, [springValue]);

    useEffect(() => {
        if (isInView) {
            const timeout = setTimeout(() => {
                springValue.set(end);
            }, delay * 1000);
            return () => clearTimeout(timeout);
        }
    }, [end, springValue, isInView, delay]);

    return (
        <motion.span
            transition={{ delay: delay }}
            ref={ref}
            className={className}
        />
    );
};

export default AnimatedNumber;
