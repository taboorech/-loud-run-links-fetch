import "dotenv/config";
import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import puppeteer, { Page } from "puppeteer";
import { parseLinkValidation } from "../yup/parse-link.scheme";
import { join } from "path";
import { writeFile, unlink } from "fs/promises";
import { storage } from "../libs/constantas/storage.const";

async function autoScroll(page: Page) {
  await page.evaluate(() => {
    return new Promise<void>((resolve) => {
      let totalHeight = 0;
      const distance = 500; 
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight - window.innerHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 500);
    });
  });
}

const parseLink = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { url } = await parseLinkValidation.validate(req.body, { abortEarly: false });

  const launchOptions = {
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--disable-gpu',
      '--single-process'
    ],
    executablePath: '/usr/bin/google-chrome-stable'
  };

  const browser = await puppeteer.launch(launchOptions);
  const page = await browser.newPage();

  try {
    await page.goto(url, { waitUntil: "load", timeout: 60000 });

    await page.setViewport({ width: 1080, height: 1024 * 10 });

    await autoScroll(page);

    const htmlContent = await page.evaluate(() => document.documentElement.outerHTML);

    await browser.close();

    const fileName = `page-${Date.now()}.html`;
    const filePath = join("tmp", fileName);

    await writeFile(filePath, htmlContent, { encoding: "utf-8" });

    const bucket = storage.bucket(process.env.GOOGLE_CLOUD_BUCKET_NAME || "");

    const file = bucket.file(`html/${fileName}`);

    await bucket.upload(filePath, { destination: `html/${fileName}` });

    await unlink(filePath);

    const [publicUrl] = await file.getSignedUrl({
      action: "read",
      expires: Date.now() + 1000 * 60 * 60 * 24,
    });

    await browser.close();

    res.status(200).json({ url: publicUrl });
  } catch (error) {
    await browser.close();
    throw error;
  }
});

export { parseLink };