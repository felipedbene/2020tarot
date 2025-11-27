# Secure API Key Setup Instructions

## What Changed

1. **New folder structure:**
   - `/functions/api/tarot.js` - Pages Function that proxies API calls
   - Updated `script.js` - Now calls `/api/tarot` instead of DeepSeek directly
   - Updated `index.html` - Removed API key input field

2. **How it works:**
   - Your API key is stored as an environment variable in Cloudflare
   - Frontend calls your Pages Function at `/api/tarot`
   - Pages Function uses the secure API key to call DeepSeek
   - Response is returned to the frontend

## Deployment Steps

### Step 1: Update Your Code
1. Copy the new files to your project:
   - `functions/api/tarot.js` (new file)
   - `script.js` (replace existing)
   - `index.html` (replace existing)

2. Your project structure should now look like:
   ```
   your-project/
   ├── functions/
   │   └── api/
   │       └── tarot.js
   ├── index.html
   ├── script.js
   ├── style.css
   ├── wrangler.jsonc
   └── README.md
   ```

### Step 2: Add Your API Key to Cloudflare

1. Go to your Cloudflare dashboard
2. Navigate to **Workers & Pages** > Select your project (2020tarot)
3. Go to **Settings** > **Environment variables**
4. Click **Add variables**
5. Add a new variable:
   - **Variable name**: `DEEPSEEK_API_KEY`
   - **Value**: Your DeepSeek API key
   - **Environment**: Production (and Preview if you want)
6. Click **Save**

### Step 3: Deploy

1. Commit and push your changes:
   ```bash
   git add .
   git commit -m "Add secure API key proxy"
   git push
   ```

2. Cloudflare Pages will automatically redeploy

### Step 4: Test

1. Visit your site: https://2020tarot.felipe-debene.workers.dev/
2. Click "Draw Cards" (no API key input needed!)
3. You should see your tarot reading

## Security Notes

- Your API key is never exposed to the frontend
- It's stored securely in Cloudflare's environment variables
- Users can't see or access it
- All API calls go through your secure proxy

## Troubleshooting

If you get errors:
1. Make sure the environment variable is named exactly `DEEPSEEK_API_KEY`
2. Check that your API key is valid
3. Look at the deployment logs in Cloudflare dashboard
4. Check browser console for error messages
