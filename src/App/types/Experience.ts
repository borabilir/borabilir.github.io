import { ReactNode } from 'react';
import { SkillType } from './SkillType';

export type Experience = {
    endDate: string | 'Present';
    startDate: string;
    organisation: string;
    title: string;
    location: string;
    details?: string;
    remote?: boolean;
    imgSrc: string;
    descriptions?: string[];
    skills: SkillType[];
};
