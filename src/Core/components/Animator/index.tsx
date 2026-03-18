import React from "react";
import { motion, MotionProps } from "framer-motion";

type AnimatorProps = MotionProps & {
  children: React.ReactNode;
  className?: string;
  duration?: number;
  delay?: number;
  type?: "fadeIn" | "fadeDrop" | "fadeRise" | "scaleIn" | "slideInLeft" | "slideInRight" | "rotateIn" | "bounceIn";
};

const Animator: React.FC<AnimatorProps & { as?: React.ElementType }> = ({
  children,
  className,
  as = "div",
  type = "fadeIn",
  duration = 0.3,
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
    scaleIn: {
      initial: { opacity: 0, scale: 0.8 },
      whileInView: { opacity: 1, scale: 1 },
    },
    slideInLeft: {
      initial: { opacity: 0, x: -60 },
      whileInView: { opacity: 1, x: 0 },
    },
    slideInRight: {
      initial: { opacity: 0, x: 60 },
      whileInView: { opacity: 1, x: 0 },
    },
    rotateIn: {
      initial: { opacity: 0, scale: 0.5, rotate: -10 },
      whileInView: { opacity: 1, scale: 1, rotate: 0 },
    },
    bounceIn: {
      initial: { opacity: 0, y: -30, scale: 0.9 },
      whileInView: { opacity: 1, y: 0, scale: 1 },
    },
  };

  const { initial, whileInView } = animationVariants[type];

  const transitionConfig = type === "bounceIn" 
    ? { duration, delay, type: "spring", stiffness: 260, damping: 20 }
    : { duration, delay, ease: "easeOut" };

  return (
    <MotionComponent
      className={className}
      initial={initial}
      whileInView={whileInView}
      viewport={{ once: true, margin: "-100px" }}
      transition={transitionConfig}
      {...rest}
    >
      {children}
    </MotionComponent>
  );
};

const tagNames = ["h1", "h2", "h3", "h4", "h5", "h6", "p", "span", "div"] as const;

type AnimatedTextComponent = typeof Animator & {
  [key in (typeof tagNames)[number]]: React.FC<Omit<AnimatorProps, "as">>;
};

tagNames.forEach((tag) => {
  (Animator as AnimatedTextComponent)[tag] = (props: Omit<AnimatorProps, "as">) => (
    <Animator as={tag} {...props} />
  );
});

export default Animator as AnimatedTextComponent;