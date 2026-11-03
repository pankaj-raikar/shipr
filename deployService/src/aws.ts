import 'dotenv/config';
import { S3 } from "aws-sdk";
import fs from 'fs';
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

export async function downloadS3Folder(prefix: string) {
    const allFiles = await s3.listObjectsV2({
        Bucket: bucket,
        Prefix: prefix
    }).promise();

    const allPromises = allFiles.Contents?.map(async ({ Key }) => {
        return new Promise<string>((resolve) => {
            if (!Key) {
                resolve("");
                return;
            }
            const finalOutputPath = path.join(__dirname, Key);
            const dirName = path.dirname(finalOutputPath);
            if (!fs.existsSync(dirName)) {
                fs.mkdirSync(dirName, { recursive: true });
            }
            const outputFile = fs.createWriteStream(finalOutputPath);
            s3.getObject({
                Bucket: bucket,
                Key
            }).createReadStream().pipe(outputFile).on("finish", () => {
                resolve(finalOutputPath);
            });
        });
    }) || [];

    await Promise.all(allPromises.filter(Boolean));
    console.log(`Downloaded all files for prefix: ${prefix}`);
}

export async function copyFinalDist(id: string) {
    const folderPath = path.join(__dirname, `output/${id}/dist`);
    if (!fs.existsSync(folderPath)) {
        throw new Error(`Build output directory 'dist' was not found in project`);
    }

    const allFiles = getAllFiles(folderPath);
    const uploadPromises = allFiles.map(async (file) => {
        const relativePath = path
            .relative(folderPath, file)
            .replace(/\\/g, "/");

        await uploadFile(
            `dist/${id}/${relativePath}`,
            file
        );
    });

    await Promise.all(uploadPromises);
}

export async function copyStaticFiles(id: string) {
    const folderPath = path.join(__dirname, `output/${id}`);
    const allFiles = getAllFiles(folderPath).filter(
        file => !file.includes(".git") && !file.includes("node_modules")
    );

    const uploadPromises = allFiles.map(async (file) => {
        const relativePath = path
            .relative(folderPath, file)
            .replace(/\\/g, "/");

        await uploadFile(
            `dist/${id}/${relativePath}`,
            file
        );
    });

    await Promise.all(uploadPromises);
}

const getAllFiles = (folderPath: string): string[] => {
    let response: string[] = [];

    const allFilesAndFolders = fs.readdirSync(folderPath);
    allFilesAndFolders.forEach(file => {
        const fullFilePath = path.join(folderPath, file);
        if (fs.statSync(fullFilePath).isDirectory()) {
            response = response.concat(getAllFiles(fullFilePath));
        } else {
            response.push(fullFilePath);
        }
    });
    return response;
};

const uploadFile = async (fileName: string, localFilePath: string) => {
    const fileContent = fs.readFileSync(localFilePath);
    await s3.upload({
        Body: fileContent,
        Bucket: bucket,
        Key: fileName,
    }).promise();
};
