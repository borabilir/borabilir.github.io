import { ReactNode } from 'react';
import { SkillType } from './SkillType';

export type Experience = {
    endYear: number | 'Present';
    startYear: number;
    organisation: string;
    title: string;
    location: string;
    details?: string;
    remote?: boolean;
    imgSrc: string;
    descriptions?: string[];
    skills: SkillType[];
};
