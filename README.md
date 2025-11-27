# Quick Deployment Steps

## What You Need to Do

### Step 1: Copy Files to Your Project

Download these files from the outputs and copy them to your project:

**NEW FILE:**
- `functions/api/tarot.js` → Create this directory structure and add the file

**REPLACE THESE:**
- `index.html` → Replace your existing one
- `script.js` → Replace your existing one
- `wrangler.jsonc` → Replace your existing one

**KEEP AS IS:**
- `style.css` → No changes needed
- `README.md` → No changes needed
- `.gitignore` → No changes needed

### Step 2: Your Project Structure Should Look Like This

```
your-project/
├── functions/           ← NEW FOLDER
│   └── api/
│       └── tarot.js    ← NEW FILE
├── .gitignore
├── README.md
├── index.html          ← UPDATED
├── script.js           ← UPDATED
├── style.css           ← UNCHANGED
└── wrangler.jsonc      ← UPDATED
```

### Step 3: Deploy to Git

```bash
# From your project directory:
git add .
git commit -m "Add secure API proxy with Pages Functions"
git push
```

### Step 4: Wait for Deployment

- Go to https://dash.cloudflare.com
- Navigate to Workers & Pages → 2020tarot
- Watch the deployment complete (should take 30-60 seconds)

### Step 5: Add Your API Key

Once deployment finishes:

1. In the Cloudflare dashboard, go to your project (2020tarot)
2. Click **Settings** → **Variables and Secrets**
3. Click **Add variable**
4. Enter:
   - **Variable name:** `DEEPSEEK_API_KEY`
   - **Value:** Your DeepSeek API key
   - **Type:** Text (not Secret for now, you can change this later)
5. Select **Production** environment
6. Click **Save**

### Step 6: Test Your Site

1. Visit: https://2020tarot.felipe-debene.workers.dev/
2. Click "Draw Cards" (no API key input needed!)
3. You should see your tarot reading appear

## Troubleshooting

**If you still can't add environment variables:**
- Make sure the deployment finished completely
- Check that the `functions` folder is present in your Git repo
- Try refreshing the Cloudflare dashboard

**If you get API errors:**
- Verify your `DEEPSEEK_API_KEY` variable is set correctly
- Check the browser console (F12) for error messages
- Look at the Functions logs in Cloudflare dashboard

**If cards don't appear:**
- Clear your browser cache
- Try in an incognito/private window

## What Changed?

**Before:** API key stored in browser, frontend called DeepSeek directly
**After:** API key stored securely in Cloudflare, frontend calls your proxy

This means:
✅ Your API key is never exposed to users
✅ You control all API usage
✅ More secure and professional setup
