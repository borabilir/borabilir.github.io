import Animator from "Core/components/Animator";
import styles from "./styles.module.scss";
import { useTranslation } from "react-i18next";
import Card from "../Card";
import { Projects } from "App/constants/Projects";
import { ChevronLeftIcon, ChevronRightIcon } from "Core/components/Icons";
import { useRef, useState } from "react";
import Modal from "Core/components/Modal";
import { Project } from "App/types/Project";
import { SkillSet } from "App/constants/SkillSet";
import SkillTag from "../SkillTag";
import useDevice from "Core/hooks/useDevice";

const RecentProjects: React.FC = () => {
  const { t } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);
  const [selectedProject, setSelectedProject] = useState<Project | undefined>();
  const device = useDevice();

  const renderModal = () =>
    selectedProject ? (
      <Modal
        visible={!!selectedProject}
        onClose={() => setSelectedProject(undefined)}
        title={selectedProject.title}
        imgSrcs={selectedProject.images}
        type="gallery"
        footer={
          selectedProject.skills.length > 0 && (
            <div className={styles.skills}>
              <h1>Skills Used</h1>
              <div className={styles.tags}>
                {selectedProject.skills.map((x, i) => (
                  <SkillTag key={i} size="sm" skill={SkillSet[x]} />
                ))}
              </div>
            </div>
          )
        }
      >
        {<p>{selectedProject.description}</p>}
      </Modal>
    ) : (
      <></>
    );

  const onClickArrow = (dir: "left" | "right") => {
    if (ref.current == null) return;

    const currentMargin = parseInt(ref.current.style.marginLeft || "0", 10);
    const swipeWidth = device.isMobile ? 270 : 370;

    switch (dir) {
      case "left":
        if (currentMargin < 0)
          ref.current.style.marginLeft = `${currentMargin + swipeWidth}px`;
        break;
      case "right":
        if (currentMargin > (Projects.length - 1) * -swipeWidth)
          ref.current.style.marginLeft = `${currentMargin - swipeWidth}px`;
        break;
    }
  };

  return (
    <section id="projects" className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.content}>
          <Animator.h3 type="bounceIn" duration={0.3}>
            {t("projects.title").split(" ")[0]}{" "}
            <span>{t("projects.title").split(" ")[1]}</span>
          </Animator.h3>
          <Animator.h4 type="scaleIn" delay={0.05} duration={0.2}>{t("projects.description")}</Animator.h4>
          <Animator.h5 type="fadeRise" delay={0.1} duration={0.2}>{t("projects.note")}</Animator.h5>
          <Animator.div type="slideInLeft" delay={0.15} duration={0.25} className={styles.arrows}>
            <span onClick={() => onClickArrow("left")}>
              <ChevronLeftIcon />
            </span>
            <span onClick={() => onClickArrow("right")}>
              <ChevronRightIcon />
            </span>
          </Animator.div>
        </div>
        <div className={styles.projectsContainer}>
          <div ref={ref} className={styles.projects}>
            {Projects.map((x, i) => (
              <Card
                key={i}
                index={i}
                title={x.title}
                description={x.description}
                areas={x.areas}
                imgSrc={x.images}
                onClick={() => setSelectedProject(x)}
              />
            ))}
          </div>
        </div>
        {renderModal()}
      </div>
    </section>
  );
};

export default RecentProjects;
