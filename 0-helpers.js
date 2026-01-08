const Helper = {
    UUID() {
        const time = Date.now().toString(36);
        const rand = Math.random().toString(36).substring(2, 4);
        return rand + time;
    },
    compareObj(obj1, obj2) {
        const keys1 = Object.keys(obj1);
        const keys2 = Object.keys(obj2);
        return (
            keys1.length === keys2.length &&
            keys1.every(key => keys2.includes(key))
        );
    },
    compareDate(date1, date2) {
        const str1 = helperDateToString(date1);
        const str2 = helperDateToString(date2);
        return str1 === str2;
    },
    dateToString(date) {
        const rawDate = date instanceof Date ? date : new Date(date);
        const year = rawDate.getFullYear();
        const month = String(rawDate.getMonth() + 1).padStart(2, '0');
        const day = String(rawDate.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    },
    dateToStringMonth(date) {
        const rawDate = date instanceof Date ? date : new Date(date);
        const year = rawDate.getFullYear();
        const month = String(rawDate.getMonth() + 1).padStart(2, '0');
        return `${year}-${month}`;
    },
    dateToStringWeek(date) {
        const rawDate = date instanceof Date ? date : new Date(date);

        // Lấy ngày trong tuần (0 = Chủ Nhật, 1 = Thứ Hai, ...)
        let dayNum = rawDate.getUTCDay();
        if (dayNum === 0) dayNum = 7; // Chủ Nhật = 7

        // Đưa về thứ Hai của tuần hiện tại
        rawDate.setUTCDate(rawDate.getUTCDate() + 4 - dayNum);

        // Lấy ngày đầu năm
        const yearStart = new Date(Date.UTC(rawDate.getUTCFullYear(), 0, 1));

        // Tính số tuần ISO
        const weekNo = Math.ceil((((rawDate - yearStart) / 86400000) + 1) / 7);

        const year = rawDate.getUTCFullYear();

        // Format: W02-2026
        return `${year}-W${String(weekNo).padStart(2, '0')}`;
    },
    getDaysOfWeek(weekString) {
        // weekString dạng "YYYY-W02"
        const [yearStr, weekStr] = weekString.split("-W");
        const year = parseInt(yearStr, 10);
        const week = parseInt(weekStr, 10);

        // ISO tuần bắt đầu từ thứ Hai
        // Tạo ngày từ tuần ISO: lấy ngày 4/1 (thứ Năm đầu tiên của năm) làm mốc
        const simple = new Date(year, 0, 4);
        const dayOfWeek = simple.getDay() || 7; // Chủ nhật = 0 → đổi thành 7
        // Lùi về thứ Hai của tuần 1
        const isoWeekStart = new Date(simple);
        isoWeekStart.setDate(simple.getDate() - dayOfWeek + 1);

        // Tính ngày bắt đầu của tuần cần tìm
        const weekStart = new Date(isoWeekStart);
        weekStart.setDate(isoWeekStart.getDate() + (week - 1) * 7);

        // Tạo list 7 ngày
        const days = [];
        for (let i = 0; i < 7; i++) {
            const d = new Date(weekStart);
            d.setDate(weekStart.getDate() + i);
            const yyyy = d.getFullYear();
            const mm = String(d.getMonth() + 1).padStart(2, "0");
            const dd = String(d.getDate()).padStart(2, "0");
            days.push(`${yyyy}-${mm}-${dd}`);
        }

        return days;
    },
    stringToSlug(text) {
        return text.toLowerCase().replace(/\s+/g, '-');
    },
    stringfromSlug(slug) {
        return slug
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    },
    average(arr) {
        if (!arr.length) return 0; // tránh chia cho 0
        const sum = arr.reduce((acc, val) => acc + val, 0);
        return sum / arr.length;
    }
}