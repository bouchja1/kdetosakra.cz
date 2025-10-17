#!/usr/bin/env node

import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const INSTAGRAM_USERNAME = 'kdetosakra';
const OUTPUT_FILE = path.join(__dirname, '..', 'src', 'data', 'instagram-posts.json');

// Create data directory if it doesn't exist
const dataDir = path.join(__dirname, '..', 'src', 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

async function fetchInstagramPosts() {
    console.log(`Fetching Instagram posts for @${INSTAGRAM_USERNAME}...`);

    try {
        // Try method 1: Instagram's public JSON endpoint
        const url = `https://www.instagram.com/api/v1/users/web_profile_info/?username=${INSTAGRAM_USERNAME}`;

        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'x-ig-app-id': '936619743392459',
            },
        });

        if (response.data && response.data.data && response.data.data.user) {
            const user = response.data.data.user;
            const edges = user.edge_owner_to_timeline_media?.edges || [];

            const posts = edges.slice(0, 12).map((edge) => {
                const node = edge.node;
                return {
                    id: node.id,
                    imageUrl: node.display_url || node.thumbnail_src,
                    caption: node.edge_media_to_caption?.edges[0]?.node?.text || '',
                    postUrl: `https://www.instagram.com/p/${node.shortcode}/`,
                    likes: node.edge_liked_by?.count || 0,
                    comments: node.edge_media_to_comment?.count || 0,
                    timestamp: new Date(node.taken_at_timestamp * 1000).toISOString(),
                };
            });

            // Save to JSON file
            fs.writeFileSync(OUTPUT_FILE, JSON.stringify(posts, null, 2));
            console.log(`✅ Successfully fetched ${posts.length} posts!`);
            console.log(`📁 Saved to: ${OUTPUT_FILE}`);

            return posts;
        } else {
            throw new Error('Unexpected response format');
        }
    } catch (error) {
        console.error('❌ Error fetching Instagram posts:', error.message);

        // If the API fails, try alternative method
        console.log('\nTrying alternative method...');
        return await tryAlternativeMethod();
    }
}

async function tryAlternativeMethod() {
    try {
        // Try the older endpoint format
        const url = `https://www.instagram.com/${INSTAGRAM_USERNAME}/?__a=1&__d=dis`;

        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
                'Accept': 'text/html,application/json',
            },
        });

        if (response.data && response.data.graphql) {
            const user = response.data.graphql.user;
            const edges = user.edge_owner_to_timeline_media?.edges || [];

            const posts = edges.slice(0, 12).map((edge) => {
                const node = edge.node;
                return {
                    id: node.id,
                    imageUrl: node.display_url || node.thumbnail_src,
                    caption: node.edge_media_to_caption?.edges[0]?.node?.text || '',
                    postUrl: `https://www.instagram.com/p/${node.shortcode}/`,
                    likes: node.edge_liked_by?.count || 0,
                    comments: node.edge_media_to_comment?.count || 0,
                    timestamp: new Date(node.taken_at_timestamp * 1000).toISOString(),
                };
            });

            fs.writeFileSync(OUTPUT_FILE, JSON.stringify(posts, null, 2));
            console.log(`✅ Successfully fetched ${posts.length} posts using alternative method!`);
            console.log(`📁 Saved to: ${OUTPUT_FILE}`);

            return posts;
        } else {
            throw new Error('Alternative method also failed');
        }
    } catch (error) {
        console.error('❌ Alternative method failed:', error.message);
        console.log('\n⚠️  Instagram\'s public API is not accessible.');
        console.log('📝 Please use one of these alternatives:');
        console.log('   1. Use Instagram Basic Display API (requires setup)');
        console.log('   2. Manually create the posts file at:', OUTPUT_FILE);
        console.log('   3. Use a third-party service\n');

        // Create a sample file to show the format
        const samplePosts = [
            {
                id: 'sample-1',
                imageUrl: 'https://via.placeholder.com/400x400?text=Post+1',
                caption: 'Manually add your Instagram posts here. Replace this sample data.',
                postUrl: 'https://www.instagram.com/p/YOUR_POST_ID/',
                likes: 0,
                comments: 0,
                timestamp: new Date().toISOString(),
            },
        ];

        if (!fs.existsSync(OUTPUT_FILE)) {
            fs.writeFileSync(OUTPUT_FILE, JSON.stringify(samplePosts, null, 2));
            console.log('📁 Created sample file at:', OUTPUT_FILE);
        }

        process.exit(1);
    }
}

// Run the script
fetchInstagramPosts()
    .then((posts) => {
        if (posts && posts.length > 0) {
            console.log('\n📸 Post previews:');
            posts.slice(0, 3).forEach((post, index) => {
                console.log(`   ${index + 1}. ${post.caption.substring(0, 50)}...`);
            });
        }
    })
    .catch((error) => {
        console.error('Fatal error:', error);
        process.exit(1);
    });
