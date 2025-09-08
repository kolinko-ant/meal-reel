// js/app.js
export const KEY = 'mealreel_items_v1';
export const load = () => {
    try {
        return JSON.parse(localStorage.getItem(KEY) || '[]');
    } catch {
        return [];
    }
};
export const save = (arr) => localStorage.setItem(KEY, JSON.stringify(arr));

export function isShorts(u) {
    try {
        const x = new URL(u.trim());
        const host = x.hostname.replace(/^www\./, '');
        return (host === 'youtube.com' || host === 'm.youtube.com') && x.pathname.startsWith('/shorts/');
    } catch {
        return false;
    }
}

export function vidFrom(u) {
    try {
        return new URL(u).pathname.split('/')[2].split('?')[0];
    } catch {
        return '';
    }
}

export async function fetchTitle(url) {
    try {
        const r = await fetch("https://www.youtube.com/oembed?format=json&url=" + encodeURIComponent(url));
        if (!r.ok) throw 0;
        const j = await r.json();
        return j.title || "";
    } catch {
        return "";
    }
}

export function autoCategoryFromTitle(title = "") {
    const t = title.toLowerCase();
    if (t.includes('breakfast') || t.includes('завтрак')) return 'breakfast';
    if (t.includes('lunch') || t.includes('обед')) return 'lunch';
    if (t.includes('dinner') || t.includes('ужин')) return 'dinner';
    if (t.includes('dessert') || t.includes('десерт')) return 'dessert';
    return 'lunch';
}

export function upsertItem({url, vid, title, category}) {
    const items = load();
    const idx = items.findIndex(x => x.vid === vid);
    const base = {id: crypto.randomUUID(), url, vid, title, category, favorite: false, addedAt: Date.now()};
    if (idx === -1) {
        items.push(base);
        save(items);
        return base;
    } else {
        items[idx].title = title || items[idx].title;
        items[idx].category = category || items[idx].category;
        save(items);
        return items[idx];
    }
}

export async function addReelFromUrl(url) {
    if (!isShorts(url)) throw new Error('Only YouTube Shorts links are supported');
    const vid = vidFrom(url);
    let title = await fetchTitle(url);
    if (!title) title = `Recipe ${vid.slice(0, 6)}`;
    const category = autoCategoryFromTitle(title);
    return upsertItem({url, vid, title, category});
}

export function thumbUrl(vid) {
    return `https://img.youtube.com/vi/${vid}/maxresdefault.jpg`;
}

export function thumbFallback(imgEl, vid) {
    if (!imgEl) return;
    imgEl.onerror = null;
    imgEl.src = `https://img.youtube.com/vi/${vid}/hqdefault.jpg`;
}

export function toast(msg) {
    const t = document.createElement('div');
    t.textContent = msg;
    Object.assign(t.style, {
        position: 'fixed',
        left: '50%',
        bottom: '24px',
        transform: 'translateX(-50%)',
        background: '#111827',
        color: '#fff',
        padding: '10px 14px',
        borderRadius: '10px',
        zIndex: 9999
    });
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 1600);
}

window.MealReel = window.MealReel || {};
window.MealReel.thumbFallback = (img, vid) => thumbFallback(img, vid);
