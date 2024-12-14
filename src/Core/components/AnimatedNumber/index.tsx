import React, { useEffect, useRef } from 'react';
import { useInView, motion, useSpring } from 'framer-motion';

type AnimatedNumberProps = {
    start?: number;
    end: number;
    className?: string;
};

const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
    start = 0,
    end,
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
        if (isInView) springValue.set(end);
    }, [end, springValue, isInView]);

    return <motion.span ref={ref} className={className} />;
};

export default AnimatedNumber;
