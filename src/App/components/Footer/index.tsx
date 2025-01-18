import ContactIcon from '../ContactIcon';
import styles from './styles.module.scss';

const Footer: React.FC = () => {
    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.buttons}>
                    <ContactIcon variant="primary" type="linkedin" />
                    <ContactIcon variant="primary" type="mail" />
                    <ContactIcon variant="primary" type="instagram" />
                    <ContactIcon variant="primary" type="github" />
                </div>
                <span>© 2024 Handcrafted by me. All Rights Reserved.</span>
            </div>
        </div>
    );
};

export default Footer;
