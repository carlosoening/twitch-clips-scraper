import { Application, log, send, isHttpError, Status } from './deps.ts';
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
        if (isHttpError(err)) {
            ctx.throw((Number(err.status)), JSON.stringify(err));
            return;
        }
        ctx.throw(Status.InternalServerError, JSON.stringify({ message: "Internal server error" }));
    }
});

app.use(async (ctx, next) => {
    await next();
    const time = ctx.response.headers.get("X-Response-Time");
    log.info(`${ctx.request.method} ${ctx.request.ip} - ${ctx.request.url}: ${time}`);
});

app.use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const delta = Date.now() - start;
    ctx.response.headers.set("X-Response-Time", `${delta}ms`);
});

app.use(api.routes());
app.use(api.allowedMethods());

app.use(async (ctx) => {
    const filePath = ctx.request.url.pathname;
    const fileWhitelist = [
        "/index.html",
        "/scripts/script.js",
        "/styles/style.css"
    ];
    if (fileWhitelist.includes(filePath)) {
        await send(ctx, filePath, { 
            root: `${Deno.cwd()}/public`
        });
    }
});

if (import.meta.main) {
    log.info(`Starting server on port ${PORT}...`);
    await app.listen({
        port: PORT
    });
}
