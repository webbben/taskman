export function isOverdue(d: Date): boolean {
    const t = new Date();
    t.setHours(0,0,0,0);
    d.setHours(0,0,0,0);
    return d < t;
}

export function isToday(d: Date): boolean {
    const t = new Date();
    return d.getDate() == t.getDate() &&
        d.getMonth() == t.getMonth() &&
        d.getFullYear() == t.getFullYear();
}