import React, { ReactNode } from 'react';
import Portal from '../Portal';
import styles from './styles.module.scss';
import Button from '../Button';
import BlurryBackground from 'App/components/BlurryBackground';
import cx from 'Core/utils/cx';
import { motion } from 'framer-motion';

type ModalProps = {
    visible?: boolean;
    title?: ReactNode;
    subtitle?: ReactNode;
    right?: ReactNode;
    logoSrc?: string;
    children: ReactNode;
    footer?: ReactNode;
    footerBorder?: boolean;
    onClose: () => void;
};

const Modal: React.FC<ModalProps> = ({
    visible = false,
    title,
    subtitle,
    right,
    logoSrc,
    children,
    footer,
    footerBorder = true,
    onClose,
}) => {
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
                    {(title || subtitle) && (
                        <header>
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
                    )}
                    <Button className={styles.close} onClick={onClose}>
                        Close
                    </Button>
                    <main>{children}</main>
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
