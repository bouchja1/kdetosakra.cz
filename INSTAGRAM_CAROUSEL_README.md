# Instagram Carousel - Implementation Guide

## Overview
An Instagram carousel has been added to your home page (`src/pages/Home.js`). The carousel displays real Instagram posts from @kdetosakra with square images, captions with "more" buttons, and links to view posts on Instagram.

## Files Modified/Created
- **Created**: `src/components/InstagramCarousel.js` - Main carousel component
- **Created**: `scripts/fetchInstagramPosts.js` - Script to fetch Instagram posts
- **Created**: `src/data/instagram-posts.json` - Cached Instagram posts data
- **Modified**: `src/pages/Home.js` - Added carousel below the farewell alert
- **Modified**: `src/App.less` - Added carousel styling
- **Modified**: `package.json` - Added Swiper library and fetch-instagram script

## ✅ Current Implementation
The carousel is **already working** with real Instagram posts from your account (@kdetosakra)!

The posts are fetched from Instagram and stored in `src/data/instagram-posts.json`.

## How to Update Instagram Posts

The carousel automatically loads posts from `src/data/instagram-posts.json` and displays images from `public/instagram-images/`.

### Refresh Posts from Instagram

To fetch the latest posts from your Instagram account, run:

```bash
npm run fetch-instagram
```

This will:
- Fetch the latest posts from @kdetosakra Instagram account
- Download the images and save them locally to `public/instagram-images/`
- Update `src/data/instagram-posts.json` with local image paths
- Show you a preview of the fetched posts

**Why local images?** Instagram CDN blocks direct image embedding from external websites. By downloading images locally, we avoid CORS and referrer policy issues.

### Download Images Only

If you already have posts data but need to re-download images:

```bash
npm run download-instagram-images
```

**Note**: Instagram may occasionally change their API or add rate limiting. If the script fails, you can manually update the JSON file.

### Manual Data Entry (If Needed)

If the automatic fetch fails, you can manually edit `src/data/instagram-posts.json`:

```json
[
    {
        "id": "unique-id",
        "imageUrl": "https://instagram.com/path-to-image.jpg",
        "caption": "Your Instagram caption...",
        "postUrl": "https://www.instagram.com/p/POST_ID/",
        "likes": 0,
        "comments": 0,
        "timestamp": "2025-10-17T00:00:00.000Z"
    }
]
```

### Schedule Automatic Updates

You can set up a cron job or GitHub Action to automatically refresh the posts daily:

**Example cron job** (runs daily at 9 AM):
```bash
0 9 * * * cd /path/to/kdetosakra.cz && npm run fetch-instagram
```

## Component Features
- ✅ Responsive design (works on mobile, tablet, and desktop)
- ✅ Square images (1:1 aspect ratio)
- ✅ Auto-play carousel with 5-second delay
- ✅ Navigation arrows
- ✅ Pagination dots
- ✅ "More/Less" button for long captions
- ✅ Click to view on Instagram
- ✅ Hover effects and animations

## Customization
You can customize the carousel by modifying:
- **Colors**: Change `#c80707` in `App.less` to match your brand
- **Auto-play delay**: Change `delay: 5000` in `InstagramCarousel.js`
- **Slides per view**: Modify `breakpoints` settings in `InstagramCarousel.js`
- **Caption truncation**: Change `maxLength = 100` in the `truncateText` function

## Testing
Run your development server to see the carousel with real Instagram posts:
```bash
npm start
```

The carousel will appear between the farewell alert and the social media icons on the home page.

## Troubleshooting

### Posts Not Loading
- Check if `src/data/instagram-posts.json` exists and contains data
- Check if `public/instagram-images/` folder exists with images
- Try running `npm run fetch-instagram` to refresh the data
- Check browser console for errors

### Images Not Displaying
- **Solution**: Images are now stored locally in `public/instagram-images/`
- Run `npm run fetch-instagram` to download fresh images
- Check that image files exist in `public/instagram-images/`
- Verify the paths in `instagram-posts.json` start with `/instagram-images/`

### Fetch Script Fails
- Instagram may have changed their API
- Try running the script again in a few minutes
- As a workaround, manually update the JSON file

### Image Shows Placeholder
- If you see the Instagram icon placeholder, the image failed to load
- Click on the placeholder to view the post directly on Instagram
- Run `npm run download-instagram-images` to re-download images

## Current Posts
Currently displaying 2 posts from @kdetosakra:
1. "Nové Losiny jsou ukryté v údolí..." (Jeseníky location)
2. "6 let, 1 země, nespočet Vysočin..." (Farewell tour announcement)
