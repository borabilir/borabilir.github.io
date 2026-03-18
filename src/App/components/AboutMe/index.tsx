import Animator from "Core/components/Animator";
import styles from "./styles.module.scss";
import { useTranslation } from "react-i18next";
import BlurryBackground from "../BlurryBackground";
import AnimatedNumber from "Core/components/AnimatedNumber";

const AboutMe: React.FC = () => {
  const { t } = useTranslation();

  const yearsOfExperience = () => {
    const now = new Date();
    const pastDate = new Date(2017, 8);

    let yearsDifference = now.getFullYear() - pastDate.getFullYear();

    if (
      now.getMonth() < pastDate.getMonth() ||
      (now.getMonth() === pastDate.getMonth() &&
        now.getDate() < pastDate.getDate())
    ) {
      yearsDifference--;
    }
    return yearsDifference;
  };

  return (
    <section id="about" className={styles.container}>
      <div>
        <Animator.h1 type="bounceIn" duration={0.5}>{t("about.title")}</Animator.h1>
        <Animator.p type="fadeRise" delay={0.2} duration={0.4}>
          Senior Backend / Full Stack Developer with <AnimatedNumber delay={0.4} end={yearsOfExperience()} />+ years of experience designing and building scalable applications using .NET, C#, and React. Specialized in backend architecture, microservices, and database design, while also delivering user friendly frontends. Currently expanding cloud expertise with Microsoft Azure fundamentals to enhance full stack solutions and modern deployment strategies.
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
