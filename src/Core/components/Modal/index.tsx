import React, { ReactNode, useRef, useState } from 'react';
import Portal from '../Portal';
import styles from './styles.module.scss';
import Button from '../Button';
import BlurryBackground from 'App/components/BlurryBackground';
import cx from 'Core/utils/cx';
import { motion } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon, CloseIcon } from '../Icons';

type ModalProps = {
    visible?: boolean;
    title?: ReactNode;
    subtitle?: ReactNode;
    right?: ReactNode;
    logoSrc?: string;
    imgSrcs?: string[];
    children: ReactNode;
    footer?: ReactNode;
    footerBorder?: boolean;
    type?: 'default' | 'gallery';
    onClose: () => void;
};

const Modal: React.FC<ModalProps> = ({
    visible = false,
    title,
    subtitle,
    right,
    logoSrc,
    imgSrcs,
    children,
    type = 'default',
    footer,
    footerBorder = true,
    onClose,
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const [index, setIndex] = useState(0);

    const onClickArrow = (dir: 'left' | 'right') => {
        if (ref.current == null) return;

        const currentMargin = parseInt(ref.current.style.marginLeft || '0', 10);

        switch (dir) {
            case 'left':
                if (currentMargin < 0) {
                    ref.current.style.marginLeft = `${currentMargin + 830}px`;
                    setIndex(index - 1);
                }
                break;
            case 'right':
                if (currentMargin > (imgSrcs!!.length - 1) * -830) {
                    ref.current.style.marginLeft = `${currentMargin - 830}px`;
                    setIndex(index + 1);
                }
                break;
        }
    };

    return visible ? (
        <Portal container={document.getElementById('modalContainer')}>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                viewport={{ once: true }}
                className={styles.container}
                role="dialog"
            >
                <motion.div
                    initial={{ y: window.innerHeight }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.1 }}
                    viewport={{ once: true }}
                    className={styles.card}
                >
                    {type === 'default' ? (
                        (title || subtitle) && (
                            <header className={styles[type]}>
                                <div className={styles.title}>
                                    {logoSrc && <img src={logoSrc} alt="" />}
                                    <div>
                                        {title && <h2>{title}</h2>}
                                        {subtitle && <span>{subtitle}</span>}
                                    </div>
                                </div>
                                <div className={styles.right}>
                                    {right && <span>{right}</span>}
                                </div>
                                <span>
                                    <BlurryBackground align="left" />
                                    <BlurryBackground align="right" />
                                </span>
                            </header>
                        )
                    ) : (
                        <header className={styles[type]}>
                            <div className={styles.galleryContainer}>
                                <span>
                                    {index > 0 && (
                                        <div
                                        className={styles["left"]}
                                            onClick={() => onClickArrow('left')}
                                        >
                                            <ChevronLeftIcon />
                                        </div>
                                    )}
                                    {index < (imgSrcs?.length || 0) - 1 && (
                                        <div
                                        
                                        className={styles["right"]}
                                            onClick={() =>
                                                onClickArrow('right')
                                            }
                                        >
                                            <ChevronRightIcon />
                                        </div>
                                    )}
                                </span>
                                <div ref={ref} className={styles.gallery}>
                                    {!!imgSrcs &&
                                        imgSrcs.map((x, i) => (
                                            <img key={i} src={x} />
                                        ))}
                                </div>
                            </div>
                            <div className={styles.title}>
                                {logoSrc && <img src={logoSrc} alt="" />}
                                <div>
                                    {title && <h2>{title}</h2>}
                                    {subtitle && <span>{subtitle}</span>}
                                </div>
                            </div>
                        </header>
                    )}
                    <span
                        className={cx(styles.close, styles[type])}
                        onClick={onClose}
                    >
                        <CloseIcon />
                    </span>
                    <main className={styles[type]}>{children}</main>
                    {footer && (
                        <footer className={cx([styles.bordered, footerBorder])}>
                            {footer}
                        </footer>
                    )}
                </motion.div>
            </motion.div>
        </Portal>
    ) : (
        <></>
    );
};

export default Modal;
