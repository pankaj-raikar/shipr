import 'dotenv/config';
import { S3 } from 'aws-sdk';
import express, { Request, Response } from "express";
import path from "path";

const accessKeyId = process.env.ACCESS || "";
const secretAccessKey = process.env.SECRET || "";
const endpoint = process.env.ENDPOINT || "";
const bucket = process.env.BUCKET || "";

if (!accessKeyId || !secretAccessKey || !endpoint || !bucket) {
    throw new Error("Missing required storage environment variables (ACCESS, SECRET, ENDPOINT, BUCKET)");
}

const s3 = new S3({
    accessKeyId,
    secretAccessKey,
    endpoint,
    s3ForcePathStyle: true,
    signatureVersion: 'v4'
});

const app = express();

app.get("*", async (req: Request, res: Response) => {
    const host = req.hostname;
    // Extract ID from subdomain (e.g. "a1b2c.domain.com" -> "a1b2c") or fallback to query parameter `?id=` for local testing
    let id = host.split(".")[0] || "";
    if (id === "localhost" || id === "127") {
        id = (req.query.id as string) || id;
    }

    const filePath = req.path === "/"
        ? "/index.html"
        : req.path;

    try {
        const contents = await s3.getObject({
            Bucket: bucket,
            Key: `dist/${id}${filePath}`
        }).promise();

        const ext = path.extname(filePath).toLowerCase();
        const mimeTypes: { [key: string]: string } = {
            ".html": "text/html",
            ".css": "text/css",
            ".js": "application/javascript",
            ".png": "image/png",
            ".jpg": "image/jpeg",
            ".jpeg": "image/jpeg",
            ".gif": "image/gif",
            ".svg": "image/svg+xml",
            ".ico": "image/x-icon",
            ".json": "application/json",
            ".txt": "text/plain",
            ".woff": "font/woff",
            ".woff2": "font/woff2",
            ".ttf": "font/ttf",
            ".map": "application/json"
        };

        const type = mimeTypes[ext] || "application/octet-stream";
        res.set("Content-Type", type);

        res.send(contents.Body);
    } catch (err: any) {
        if (err.code === "NoSuchKey") {
            res.status(404).send("404: Deployment or resource not found on Shipr");
        } else {
            console.error(`Error fetching file dist/${id}${filePath}:`, err);
            res.status(500).send("500: Internal Server Error fetching deployment artifact");
        }
    }
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Shipr Request Router listening on port ${port}`);
});
