import cx from 'Core/utils/cx';
import { ReactNode } from 'react';
import styles from './styles.module.scss';

type HeaderVariant = 'default' | 'bg' | 'transparent';

type Props = {
    href?: string;
    title?: string;
    left?: ReactNode;
    right?: ReactNode;
    center?: ReactNode;
    className?: string;
    size?: 'md' | 'lg';
    onClick?: () => void;
    variant?: HeaderVariant;
    mobileTransparent?: boolean;
};

const Header: React.FC<Props> = ({}) => {
    return (
        <header className={cx(styles.container)}>
            <div className={cx(styles.content)}>
                <section className={styles.left}>
                    <div>Logo</div>

                    <div>Tıtle</div>
                </section>

                <section className={styles.right}>Test</section>
            </div>
        </header>
    );
};

export default Header;
