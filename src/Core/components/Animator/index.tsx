import React from "react";
import { motion, MotionProps } from "framer-motion";

type AnimatorProps = MotionProps & {
  children: React.ReactNode;
  className?: string;
  duration?: number;
  delay?: number;
  type?: "fadeIn" | "fadeDrop" | "fadeRise";
};

const Animator: React.FC<AnimatorProps & { as?: React.ElementType }> = ({
  children,
  className,
  as = "div",
  type = "fadeIn",
  duration = 0.6,
  delay,
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
      transition={{ duration, delay }}
      {...rest}
    >
      {children}
    </MotionComponent>
  );
};

const tagNames = ["h1", "h2", "h3", "h4", "h5", "h6", "p", "span"] as const;

type AnimatedTextComponent = typeof Animator & {
  [key in (typeof tagNames)[number]]: React.FC<Omit<AnimatorProps, "as">>;
};

tagNames.forEach((tag) => {
  (Animator as AnimatedTextComponent)[tag] = (props: Omit<AnimatorProps, "as">) => (
    <Animator as={tag} {...props} />
  );
});

export default Animator as AnimatedTextComponent;