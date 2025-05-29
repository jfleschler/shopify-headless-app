# Deployment Guide

## GitHub Repository Setup

1. **Create a new repository on GitHub**
2. **Push your code:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/shopify-headless-app.git
   git push -u origin main
   ```

## Environment Variables Setup

### For GitHub Actions

In your GitHub repository, go to **Settings → Secrets and Variables → Actions** and add these secrets:

| Secret Name        | Description                          | Example                        |
| ------------------ | ------------------------------------ | ------------------------------ |
| `SHOPIFY_DOMAIN`   | Your Shopify domain                  | `your-store.myshopify.com`     |
| `STOREFRONT_TOKEN` | Storefront API access token          | `your-storefront-access-token` |
| `API_VERSION`      | Shopify API version (optional)       | `2023-04`                      |
| `CACHE_TTL`        | Cache TTL in milliseconds (optional) | `300000`                       |

### Getting Your Shopify Credentials

1. **Shopify Domain**: Your store's myshopify.com URL
2. **Storefront Access Token**:
   - Go to your Shopify Admin
   - Navigate to **Apps → App and sales channel settings**
   - Click **Develop apps**
   - Create a private app or use existing one
   - Enable **Storefront API** access
   - Copy the **Storefront access token**

## Automatic Deployment

The GitHub Action will:

- ✅ Run on every push to `main` branch
- ✅ Test on Node.js 18.x and 20.x
- ✅ Build the production UMD bundle
- ✅ Deploy to GitHub Pages (accessible at `https://yourusername.github.io/shopify-headless-app/`)
- ✅ Upload build artifacts for download

## Manual Build

To build locally:

```bash
npm install
npm run build
```

The built file will be in `dist/shopify-headless-app.js`

## Using the Built File

### Option 1: GitHub Pages (Free)

After pushing to GitHub, your built file will be available at:

```
https://yourusername.github.io/shopify-headless-app/shopify-headless-app.js
```

### Option 2: Custom CDN

Upload `dist/shopify-headless-app.js` to your preferred CDN (AWS S3, Cloudflare, Netlify, etc.)

### Option 3: Direct Download

Download the build artifacts from the GitHub Actions page after each build.

## Integration in Webflow

```html
<script src="https://yourusername.github.io/shopify-headless-app/shopify-headless-app.js"></script>
<script>
  document.addEventListener('DOMContentLoaded', async () => {
    // Your Shopify integration code here
    const collections = await ShopifyHeadlessApp.fetchCollections();
    console.log('Collections loaded:', collections);
  });
</script>
```
