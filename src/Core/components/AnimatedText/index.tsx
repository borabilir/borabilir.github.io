import React from "react";
import { motion, MotionProps } from "framer-motion";

type AnimatedTextProps = MotionProps & {
  children: React.ReactNode;
  className?: string;
  duration?: number;
  type?: "fadeIn" | "fadeDrop" | "fadeRise";
};

const AnimatedText: React.FC<AnimatedTextProps & { as?: React.ElementType }> = ({
  children,
  className,
  as = "div",
  type = "fadeIn",
  duration = 0.6,
  ...rest
}) => {
  const MotionComponent = motion[as as keyof typeof motion] as React.ElementType;

  const animationVariants = {
    fadeIn: { initial: { opacity: 0 }, whileInView: { opacity: 1 } },
    fadeDrop: {
      initial: { opacity: 0, y: -10 },
      whileInView: { opacity: 1, y: 0 },
    },
    fadeRise: {
      initial: { opacity: 0, y: 10 },
      whileInView: { opacity: 1, y: 0 },
    },
  };

  const { initial, whileInView } = animationVariants[type];

  return (
    <MotionComponent
      className={className}
      initial={initial}
      whileInView={whileInView}
      viewport={{ once: true }}
      transition={{ duration }}
      {...rest}
    >
      {children}
    </MotionComponent>
  );
};

const tagNames = ["h1", "h2", "h3", "h4", "h5", "h6", "p", "span"] as const;

type AnimatedTextComponent = typeof AnimatedText & {
  [key in (typeof tagNames)[number]]: React.FC<Omit<AnimatedTextProps, "as">>;
};

tagNames.forEach((tag) => {
  (AnimatedText as AnimatedTextComponent)[tag] = (props: Omit<AnimatedTextProps, "as">) => (
    <AnimatedText as={tag} {...props} />
  );
});

export default AnimatedText as AnimatedTextComponent;