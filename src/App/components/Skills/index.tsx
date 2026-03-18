import { useTranslation } from "react-i18next";
import styles from "./styles.module.scss";
import { SkillArea } from "App/types/SkillArea";
import SkillSection from "../SkillCard";
import Animator from "Core/components/Animator";

export const skillAreas: SkillArea[] = ["frontend", "backend", "tools"];

const Skills: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section id="skills" className={styles.container}>
      <div className={styles.content}>
        <Animator.h1 type="bounceIn" duration={0.3}>{t("skills.title")}</Animator.h1>
        <Animator.h2 type="scaleIn" delay={0.05} duration={0.2}>{t("skills.description")}</Animator.h2>
        <div className={styles.skillCards}>
          {skillAreas.map((area, i) => (
            <SkillSection key={i} area={area} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
