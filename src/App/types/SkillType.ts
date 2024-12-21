import { SkillTypes } from "App/constants/SkillTypes";

export type SkillType = (typeof SkillTypes)[keyof typeof SkillTypes];
