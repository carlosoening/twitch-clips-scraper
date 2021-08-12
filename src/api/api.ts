import { Router, Status } from '../deps.ts';
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
            ctx.throw(Status.NotFound, "It was not possible to get the clip")
        }
        ctx.response.body = videoUrl;
    } else {
        ctx.throw(Status.NotFound, "No valid URL")
    }
});

export default router;
