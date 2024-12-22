import { useTranslation } from "react-i18next";
import styles from "./styles.module.scss";
import { SkillArea } from "App/types/SkillArea";
import SkillCard from "../SkillCard";
import Animator from "Core/components/Animator";

export const skillAreas: SkillArea[] = ["frontend", "backend", "tools"];

const Skills: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <Animator.h1 type="fadeDrop">{t("skills.title")}</Animator.h1>
        <Animator.h2>{t("skills.description")}</Animator.h2>
        <div className={styles.skillCards}>
          {skillAreas.map((area, i) => (
            <SkillCard key={i} area={area} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Skills;
