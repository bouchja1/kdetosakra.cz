#!/usr/bin/env node

import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const POSTS_FILE = path.join(__dirname, '..', 'src', 'data', 'instagram-posts.json');
const IMAGES_DIR = path.join(__dirname, '..', 'public', 'instagram-images');

// Create images directory if it doesn't exist
if (!fs.existsSync(IMAGES_DIR)) {
    fs.mkdirSync(IMAGES_DIR, { recursive: true });
}

async function downloadImage(url, filepath) {
    try {
        const response = await axios({
            url,
            method: 'GET',
            responseType: 'stream',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
            },
        });

        const writer = fs.createWriteStream(filepath);
        response.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });
    } catch (error) {
        console.error(`Failed to download image from ${url}:`, error.message);
        throw error;
    }
}

async function downloadInstagramImages() {
    console.log('📥 Downloading Instagram images...\n');

    // Read posts file
    const postsData = JSON.parse(fs.readFileSync(POSTS_FILE, 'utf8'));

    for (let i = 0; i < postsData.length; i++) {
        const post = postsData[i];
        const imageFilename = `post-${post.id}.jpg`;
        const imagePath = path.join(IMAGES_DIR, imageFilename);

        console.log(`[${i + 1}/${postsData.length}] Downloading image for post ${post.id}...`);

        try {
            await downloadImage(post.imageUrl, imagePath);

            // Update the post's imageUrl to point to local file
            post.imageUrl = `/instagram-images/${imageFilename}`;

            console.log(`✅ Downloaded: ${imageFilename}\n`);
        } catch (error) {
            console.error(`❌ Failed to download image for post ${post.id}\n`);
            // Keep original URL if download fails
        }
    }

    // Save updated posts file
    fs.writeFileSync(POSTS_FILE, JSON.stringify(postsData, null, 2));
    console.log('✅ All images downloaded and posts file updated!');
    console.log(`📁 Images saved to: ${IMAGES_DIR}`);
}

downloadInstagramImages()
    .then(() => {
        console.log('\n🎉 Done!');
        process.exit(0);
    })
    .catch(error => {
        console.error('\n❌ Error:', error);
        process.exit(1);
    });
