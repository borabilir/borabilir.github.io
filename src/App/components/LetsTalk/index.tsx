import { useTranslation } from 'react-i18next';
import styles from './styles.module.scss';
import Button from 'Core/components/Button';
import { useState } from 'react';
import Animator from 'Core/components/Animator';

const LetsTalk: React.FC = () => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        to: '',
        name: '',
        email: '',
        subject: '',
        message: '',
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const mailtoLink = `mailto:bora.bilir@outlook.com?subject=${encodeURIComponent(
            formData.subject
        )}&body=${encodeURIComponent(
            `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
        )}`;

        window.location.href = mailtoLink;
    };

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div>
                    <Animator.h3 type="fadeRise">
                        {t('letstalk.subtitle')}
                    </Animator.h3>
                    <Animator.h1 type="fadeRise">
                        {t('letstalk.title').split(' ')[0]}{' '}
                        <span>{t('letstalk.title').split(' ')[1]}</span>
                    </Animator.h1>
                </div>
                <Animator.div>
                    <h3>{t('letstalk.email')}</h3>
                    <h2>bora.bilir@outlook.com</h2>
                    <form onSubmit={handleSubmit}>
                        <div>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Name"
                            />
                            <input
                                type="email"
                                name="email"
                                value={formData.to}
                                onChange={handleChange}
                                placeholder="E-Mail"
                            />
                        </div>
                        <input
                            type="text"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            placeholder="Subject"
                        />
                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            placeholder="Message"
                            rows={4}
                        />
                        <Button type="submit">Send Message</Button>
                    </form>
                </Animator.div>
            </div>
        </div>
    );
};

export default LetsTalk;
