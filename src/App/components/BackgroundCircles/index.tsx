import { shuffleArray } from "Core/utils/shuffleArray";
import { Tag } from "../../types/Tag";
import RotatingCircle from "./Circle";
import styles from "./styles.module.scss";
import Animator from "Core/components/Animator";
import { memo } from "react";
import useDevice from "Core/hooks/useDevice";

const skills1: Tag[] = [
  { label: "Typescript" },
  { label: "Javascript" },
  { label: "HTML" },
  { label: "CSS" },
  { label: "SCSS" },
  { label: "React.js" },
  { label: "Next.js" },
];
const skills2: Tag[] = [
  { label: "C#" },
  { label: "T-SQL" },
  { label: ".NET Core" },
  { label: "EF Core" },
  { label: "ASP.NET" },
];

const BackgroundCircles = () => {
  const device = useDevice();

  return (
    <Animator delay={1} className={styles.container}>
      <RotatingCircle
        r={!device.isMobile ? 1600 : 700}
        tags={shuffleArray(skills1)}
        duration={80}
      />
      <RotatingCircle
        r={!device.isMobile ? 1100 : 400}
        tags={shuffleArray(skills2)}
      />
      {!device.isMobile && (
        <RotatingCircle r={600} tags={shuffleArray(skills1)} duration={120} />
      )}
    </Animator>
  );
};

export const MemoizedBackgroundCircles = memo(BackgroundCircles);

export default MemoizedBackgroundCircles;
