export const formatCurrency = (value: number | string): string => {
    const num = typeof value === "string" ? parseFloat(value) : value;

    if (isNaN(num)) return "0 TZS";

    if (num >= 1000000000) {
        return (num / 1000000000).toFixed(1).replace(/\.0$/, "") + "B TZS";
    }
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M TZS";
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K TZS";
    }

    return num.toFixed(2).replace(/\.00$/, "") + " TZS";
};
