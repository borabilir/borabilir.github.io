import AnimatedText from "Core/components/AnimatedText";
import styles from "./styles.module.scss";
import AnimatedNumber from "Core/components/AnimatedNumber";
import developerImg from "Core/assets/developer.png";
import { useTranslation } from "react-i18next";
import { SocialIcon } from "react-social-icons";

const Intro: React.FC = () => {
  const { t } = useTranslation();

  const yearsOfExperience = () => {
    const now = new Date();
    const pastDate = new Date(2018, 10);

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
    <section id="intro" className={styles.container}>
      <AnimatedText.h1 type="fadeDrop">{t("intro.name")}</AnimatedText.h1>
      <AnimatedText.h2>{t("intro.title")}</AnimatedText.h2>
      <div className={styles.info}>
        <div className={styles.left}>
          <div>
            <h5>{t("intro.contact")}</h5>
            <div className={styles.contactIcons}>
              <SocialIcon className={styles.socialIcon} url="linkedin.com/in/borabilir" />
              <SocialIcon className={styles.socialIcon} url="mailto:borabilir94@gmail.com" />
            </div>
          </div>
        </div>
        <div className={styles.right}>
          <div>
            <h5>{t("intro.years")}</h5>
            <h4>
              <AnimatedNumber end={yearsOfExperience()} />+
            </h4>
          </div>
          <div>
            <h5>{t("intro.projects")}</h5>
            <h4>
              <AnimatedNumber end={50} />+
            </h4>
          </div>
        </div>
      </div>
      <img src={developerImg} alt="" />
    </section>
  );
};

export default Intro;
