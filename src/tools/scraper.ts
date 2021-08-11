import {  
    log, 
    DOMParser, 
    HTMLDocument 
} from '../deps.ts';

const TWITCH_CLIPS_BASE_URL = "https://clips-media-assets2.twitch.tv/";
const MAX_ATTEMPTS = 3;

export async function getVideoUrlFromTwitchClip(url: string) {
    try {
        for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
            const document = await loadHtmlDocument(url);
            if (!document) {
                continue;
            }
            const contents = getContentFromDocument(document);

            if (!contents || contents.length === 0) {
                continue;
            }
            const filtered = contents.find(c => c?.endsWith('-social-preview.jpg'));
            if (!filtered) {
                continue;
            }
            const prelink = filtered?.split('-social-preview.jpg');
            return `${prelink[0]}.mp4`;
        }
        return null;
    } catch (err) {
        log.error(err);
    }
}

async function loadHtmlDocument(url: string) {
    const res = await fetch(url);
    const html = await res.text();
    const document = new DOMParser().parseFromString(html, 'text/html');
    if (!document) {
        return null;
    }
    return document;
}

function getContentFromDocument(document: HTMLDocument) {
    const elements = document.getElementsByTagName('meta');
    const contents = elements.map(e => {
        return e.getAttribute('content');
    });
    if (!contents || contents.length === 0) {
        return null;
    }
    const filtered = contents.filter(c => c?.includes(TWITCH_CLIPS_BASE_URL));
    if (!filtered || filtered.length === 0) {
        return null;
    }
    return filtered;
}