export const formatDateDifference = (startDate: string, endDate: string): string => {
    const [startMonth, startYear] = startDate.split("-").map(Number);
    const [endMonth, endYear] = endDate.toLowerCase() === "present" 
        ? [new Date().getMonth() + 1, new Date().getFullYear()] 
        : endDate.split("-").map(Number);

    if (!startMonth || !startYear || !endMonth || !endYear) {
        throw new Error("Invalid dates provided. Use 'MM-YYYY' format.");
    }

    let years = endYear - startYear;
    let months = endMonth - startMonth;

    if (months < 0) {
        years--;
        months += 12;
    }

    const yearText = years > 0 ? `${years} yrs` : "";
    const monthText = months > 0 ? `${months} mos` : "";

    return `${yearText}${yearText && monthText ? " " : ""}${monthText}`;
};
