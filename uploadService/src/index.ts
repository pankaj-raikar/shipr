import 'dotenv/config';
import express, { Request, Response } from "express";
import cors from "cors";
import simpleGit from "simple-git";
import { generate } from "./utils";
import path from "path";
import { getAllFiles } from "./file";
import { uploadFile } from "./aws";
import { createClient } from "redis";

const redURL = process.env.REDIS_URL ?? 'redis://127.0.0.1:6379';

const subscriber = createClient({
    url: redURL
});

const publisher = createClient({
    url: redURL
});

subscriber.on("error", (err: unknown) =>
    console.error("Redis Subscriber Error:", err)
);

publisher.on("error", (err: unknown) =>
    console.error("Redis Publisher Error:", err)
);

const app = express();
app.use(cors());
app.use(express.json());

app.post("/deploy", async (req: Request, res: Response) => {
    const repoURL = req.body.repoURL || req.body.repoUrl;
    if (!repoURL) {
        return res.status(400).json({ error: "Missing repoURL in request body" });
    }

    const id = generate();
    const outputRoot = path.join(__dirname, "output");
    const repoRoot = path.join(outputRoot, id);
    
    try {
        await simpleGit().clone(repoURL, repoRoot, ["--depth", "1"]);
    } catch (err) {
        console.error("Cloning failed:", err);
        return res.status(500).json({
            error: "Repository cloning failed"
        });
    }

    const files = getAllFiles(repoRoot).filter(
        file => !file.includes(".git") && !file.includes("node_modules")
    );

    await Promise.all(
        files.map(async file => {
            const relativePath = path.relative(outputRoot, file).split(path.sep).join('/');
            await uploadFile(`output/${relativePath}`, file);
        })
    );

    publisher.lPush("build-queue", id).catch((err: unknown) => console.error('Redis LPUSH error', err));
    publisher.hSet("status", id, "uploaded").catch((err: unknown) => console.error('Redis HSET error', err));

    console.log(`Repository queued for deployment [id: ${id}]: ${repoURL}`);

    res.json({
        id,
        message: `Deployment enqueued with id: ${id}`
    });
});

app.get("/health", (_req: Request, res: Response) => {
    res.json({
        status: "ok",
        service: "shipr-upload-service",
        timestamp: new Date().toISOString()
    });
});

app.get("/status", async (req: Request, res: Response) => {
    const id = req.query.id;
    if (!id || typeof id !== "string") {
        return res.status(400).json({ error: "Missing or invalid deployment id" });
    }
    const response = await subscriber.hGet("status", id);
    res.json({
        status: response || "not_found"
    });
});

app.get("/logs", async (req: Request, res: Response) => {
    const id = req.query.id;
    if (!id || typeof id !== "string") {
        return res.status(400).json({ error: "Missing or invalid deployment id" });
    }
    try {
        const logs = await subscriber.lRange(`logs:${id}`, 0, -1);
        res.json({ logs });
    } catch (err: unknown) {
        console.error("Error reading logs from Redis", err);
        res.status(500).json({ error: "Internal server error reading logs" });
    }
});

async function start() {
    try {
        if (!publisher.isOpen) {
            await publisher.connect();
        }
        if (!subscriber.isOpen) {
            await subscriber.connect();
        }
        const port = process.env.PORT || 3000;
        app.listen(port, () => console.log(`Shipr Upload Service listening on port ${port}`));
    } catch (err) {
        console.error('Startup error:', err);
        process.exit(1);
    }
}

start();
