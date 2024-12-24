import { SkillArea } from "./SkillArea";
import { SkillType } from "./SkillType";

export type Project = {
    title: string;
    description: string;
    areas: SkillArea[];
    images?: string[];
    skills: SkillType[];
};
