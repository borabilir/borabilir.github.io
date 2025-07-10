import Animator from "Core/components/Animator";
import styles from "./styles.module.scss";
import { useTranslation } from "react-i18next";
import BlurryBackground from "../BlurryBackground";

const AboutMe: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section id="about" className={styles.container}>
      <div>
        <Animator.h1 type="fadeDrop">{t("about.title")}</Animator.h1>
        <Animator.p>
          {t("about.p1")}
          <br />
          <br />
          {t("about.p2")}
          <br />
          <br />
          {t("about.p3")}
        </Animator.p>
      </div>
      <span>
        <BlurryBackground align="left" />
        <BlurryBackground align="right" />
      </span>
    </section>
  );
};

export default AboutMe;
