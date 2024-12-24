import React from 'react';
import styles from './styles.module.scss';
import { GithubIcon, InstagramIcon, MailIcon } from 'Core/components/Icons';
import LinkedinIcon from 'Core/components/Icons/linkedin';
import cx from 'Core/utils/cx';
import Tooltip from 'Core/components/Tooltip';
import { ContactIcons } from 'App/constants/ContactIcons';

type ContactIconProps = {
    type: 'linkedin' | 'mail' | 'instagram' | 'github';
    variant?: 'default' | 'primary';
};

const ContactIcon: React.FC<ContactIconProps> = ({
    type,
    variant = 'default',
}) => {
    const handleClick = () => {
        window.location.href = ContactIcons[type].url;
    };

    return (
        <Tooltip text={ContactIcons[type].tooltip}>
            <div
                className={cx(styles.icon, styles[type], styles[variant])}
                onClick={handleClick}
            >
                {ContactIcons[type].icon}
            </div>
        </Tooltip>
    );
};

export default ContactIcon;
