export type TimelineEntry = {
    endYear: number | 'Present';
    startYear: number;
    organisation: string;
    title: string;
    location: string;
    details?: string;
    remote?: boolean;
    imgSrc: string;
};
