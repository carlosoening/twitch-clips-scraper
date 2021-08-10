import { Application, log } from './deps.ts';
import api from './api/api.ts';

const app = new Application();
const PORT = 9000;

await log.setup({
    handlers: {
        console: new log.handlers.ConsoleHandler("INFO"),
    },
    loggers: {
        default: {
            level: "INFO",
            handlers: ["console"],
        },
    },
});

app.addEventListener("error", (event) => {
    log.error(event.error);
});

app.use(async (ctx, next) => {
    try {
        await next();
    } catch (err) {
        ctx.response.body = "Internal server error";
        ctx.throw(err);
    }
});

app.use(async (ctx, next) => {
    await next();
    const time = ctx.response.headers.get("X-Response-Time");
    log.info(`${ctx.request.method} ${ctx.request.url}: ${time}`);
});

app.use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const delta = Date.now() - start;
    ctx.response.headers.set("X-Response-Time", `${delta}ms`);
});

app.use(api.routes());
app.use(api.allowedMethods());

if (import.meta.main) {
    log.info(`Starting server on port ${PORT}...`);
    await app.listen({
        port: PORT
    });
}