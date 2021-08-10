import { Router } from '../deps.ts';
import { getVideoUrlFromTwitchClip } from '../tools/scraper.ts';

const router = new Router();

router.get("/", (ctx) => {
    ctx.response.body = "API is working!"
});

router.get("/twitch/scrap", async (ctx) => {
    const url = ctx.request.url.searchParams.get("url");
    if (url) {
        const videoUrl = await getVideoUrlFromTwitchClip(url);
        if (!videoUrl) {
            ctx.response.body = "It was not possible to get the clip.";
            ctx.response.status = 404;
        }
        ctx.response.body = videoUrl;
    } else {
        ctx.response.body = "No valid URL";
        ctx.response.status = 404;
    }
});

export default router;
