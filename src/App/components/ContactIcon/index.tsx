import React from 'react';
import styles from './styles.module.scss';

type ContactIconProps = {
    type: 'linkedin' | 'mail' | 'instagram' | 'github';
};

const ContactIcon: React.FC<ContactIconProps> = ({ type }) => {
    const onClick = () => {
        switch (type) {
            case 'linkedin':
                window.location.href = 'https://linkedin.com/in/borabilir';
                break;
            case 'mail':
                window.location.href = 'mailto:bora.bilir@outlook.com';
                break;
            case 'instagram':
                window.location.href = 'https://instagram.com/borabilir';
                break;
            case 'github':
                window.location.href = 'https://instagram.com/borabilir';
                break;
        }
    };

    return (
        <img
            src={`${type}.png`}
            onClick={onClick}
            alt={type}
            className={styles.icon}
        />
    );
};

export default ContactIcon;
