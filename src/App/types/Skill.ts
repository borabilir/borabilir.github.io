import { ReactNode } from 'react';
import { SkillArea } from './SkillArea';
import { SkillCategory } from './SkillCategory';
import { SkillName } from './SkillName';

export type Skill = {
    name: SkillName;
    area: SkillArea;
    category: SkillCategory;
    color: string;
    icon?: ReactNode;
};
