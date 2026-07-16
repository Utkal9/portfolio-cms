function parseDriveFileId(value) {
    if (!value) return "";
    const idMatch = value.match(
        /(?:file\/d\/|id=|\/d\/|open\?id=)([a-zA-Z0-9_-]+)/,
    );
    if (idMatch) return idMatch[1];
    return value.trim();
}

function parseYouTubeVideoId(value) {
    if (!value) return "";
    const trimmed = value.trim();
    const urlMatch = trimmed.match(
        /(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:watch\?v=|embed\/|shorts\/))([A-Za-z0-9_-]{11})/,
    );
    if (urlMatch) return urlMatch[1];
    if (/^[A-Za-z0-9_-]{11}$/.test(trimmed)) return trimmed;
    return "";
}

function parseVideoSource(value) {
    if (!value) return { type: "drive", id: "" };
    const youtubeId = parseYouTubeVideoId(value);
    if (youtubeId) return { type: "youtube", id: youtubeId };
    const driveId = parseDriveFileId(value);
    return { type: "drive", id: driveId };
}

export function buildVideoEmbed(source) {
    if (!source?.id) return "";
    if (source.type === "youtube") {
        return `https://www.youtube.com/embed/${source.id}?rel=0&showinfo=0&autoplay=1`;
    }
    return `https://drive.google.com/file/d/${source.id}/preview?usp=sharing&embedded=true`;
}

export function buildVideoOpenUrl(source) {
    if (!source?.id) return "";
    if (source.type === "youtube") {
        return `https://youtu.be/${source.id}`;
    }
    return `https://drive.google.com/file/d/${source.id}/view`;
}

export function buildVideoThumbnail(source) {
    if (!source?.id) return "";
    if (source.type === "youtube") {
        return `https://img.youtube.com/vi/${source.id}/maxresdefault.jpg`;
    }
    return `https://drive.google.com/thumbnail?id=${source.id}&sz=w1200`;
}

export { parseVideoSource, parseYouTubeVideoId, parseDriveFileId };
