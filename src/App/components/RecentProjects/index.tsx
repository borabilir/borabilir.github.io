import Animator from 'Core/components/Animator';
import styles from './styles.module.scss';
import { useTranslation } from 'react-i18next';
import Card from '../Card';
import { Projects } from 'App/constants/Projects';
import { ChevronLeftIcon, ChevronRightIcon } from 'Core/components/Icons';
import { useRef, useState } from 'react';
import Modal from 'Core/components/Modal';
import { Project } from 'App/types/Project';
import { SkillSet } from 'App/constants/SkillSet';
import SkillTag from '../SkillTag';

const RecentProjects: React.FC = () => {
    const { t } = useTranslation();
    const ref = useRef<HTMLDivElement>(null);
    const [selectedProject, setSelectedProject] = useState<
        Project | undefined
    >();

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
                                    <SkillTag
                                        key={i}
                                        size="sm"
                                        skill={SkillSet[x]}
                                    />
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

    const onClickArrow = (dir: 'left' | 'right') => {
        if (ref.current == null) return;

        const currentMargin = parseInt(ref.current.style.marginLeft || '0', 10);

        switch (dir) {
            case 'left':
                if (currentMargin < 0)
                    ref.current.style.marginLeft = `${currentMargin + 370}px`;
                break;
            case 'right':
                if (currentMargin > (Projects.length - 1) * -370)
                    ref.current.style.marginLeft = `${currentMargin - 370}px`;
                break;
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <Animator.h3 type="fadeDrop">
                    {t('projects.title').split(' ')[0]}{' '}
                    <span>{t('projects.title').split(' ')[1]}</span>
                </Animator.h3>
                <Animator.h4>{t('projects.description')}</Animator.h4>
                <Animator.h5>{t('projects.note')}</Animator.h5>
                <div className={styles.arrows}>
                    <span onClick={() => onClickArrow('left')}>
                        <ChevronLeftIcon />
                    </span>
                    <span onClick={() => onClickArrow('right')}>
                        <ChevronRightIcon />
                    </span>
                </div>
            </div>
            <Animator.div type="fadeDrop" className={styles.projectsContainer}>
                <div ref={ref} className={styles.projects}>
                    {Projects.map((x, i) => (
                        <Card
                            key={i}
                            title={x.title}
                            description={x.description}
                            areas={x.areas}
                            imgSrc={x.images}
                            onClick={() => setSelectedProject(x)}
                        />
                    ))}
                </div>
            </Animator.div>
            {renderModal()}
        </div>
    );
};

export default RecentProjects;
