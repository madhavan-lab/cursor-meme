# GitHub Setup Guide

## Step 1: Create a Personal Access Token (PAT)

1. **Go to GitHub Settings:**
   - Visit: https://github.com/settings/tokens
   - Or: GitHub → Your Profile Picture (top right) → Settings → Developer settings → Personal access tokens → Tokens (classic)

2. **Generate New Token:**
   - Click "Generate new token" → Select "Generate new token (classic)"
   - Give it a name: `cursor-memes-push`
   - Set expiration: Choose your preference (90 days, 1 year, or no expiration)
   - Select scopes: Check `repo` (this gives full control of private repositories)
   - Scroll down and click "Generate token"

3. **Copy the Token:**
   - ⚠️ **IMPORTANT**: Copy the token immediately - you won't be able to see it again!
   - It will look like: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

## Step 2: Authenticate Git with GitHub

### Option A: Using Git Credential Helper (Recommended)

Run these commands in your terminal:

```bash
cd /Users/madhavanrangarajan/Desktop/cursor-memes

# Configure git with your email
git config user.email "madhavan@gurukula.com"
git config user.name "madhavan-lab"

# Set up credential helper to store credentials
git config credential.helper store

# Now push (it will prompt for username and password)
git push -u origin main
```

When prompted:
- **Username**: `madhavan-lab` (or your GitHub username)
- **Password**: Paste your Personal Access Token (NOT your GitHub password)

### Option B: Using Token in URL (One-time)

If you want to push immediately without prompts:

```bash
cd /Users/madhavanrangarajan/Desktop/cursor-memes

# Replace YOUR_TOKEN with your actual token
git remote set-url origin https://YOUR_TOKEN@github.com/madhavan-lab/cursor-meme.git

# Push
git push -u origin main
```

### Option C: Using GitHub CLI (gh) - Easiest Method

If you have GitHub CLI installed:

```bash
# Install GitHub CLI (if not installed)
brew install gh

# Authenticate
gh auth login

# Follow the prompts:
# - Choose GitHub.com
# - Choose HTTPS
# - Authenticate Git with your GitHub credentials? Yes
# - Login via web browser or token

# Then push
cd /Users/madhavanrangarajan/Desktop/cursor-memes
git push -u origin main
```

## Step 3: Verify Push

After pushing, check your repository:
- Visit: https://github.com/madhavan-lab/cursor-meme
- You should see all your files there!

## Troubleshooting

### If you get "Permission denied":
- Make sure your token has `repo` scope enabled
- Verify your GitHub username is correct
- Try regenerating the token

### If you get "Repository not found":
- Verify the repository URL: https://github.com/madhavan-lab/cursor-meme
- Make sure you have write access to the repository

### If credentials are not being saved:
```bash
# Clear stored credentials
git credential-osxkeychain erase
host=github.com
protocol=https

# Then try pushing again
```

## Security Notes

- Never commit your Personal Access Token to the repository
- Tokens are stored in `~/.git-credentials` (if using credential helper)
- Consider using SSH keys for better security (see below)

## Alternative: Set Up SSH Keys (More Secure)

1. **Generate SSH Key:**
```bash
ssh-keygen -t ed25519 -C "madhavan@gurukula.com"
# Press Enter to accept default location
# Enter a passphrase (optional but recommended)
```

2. **Add SSH Key to GitHub:**
```bash
# Copy your public key
cat ~/.ssh/id_ed25519.pub
# Copy the output
```

3. **Add to GitHub:**
   - Go to: https://github.com/settings/keys
   - Click "New SSH key"
   - Paste your public key
   - Click "Add SSH key"

4. **Update Remote URL:**
```bash
cd /Users/madhavanrangarajan/Desktop/cursor-memes
git remote set-url origin git@github.com:madhavan-lab/cursor-meme.git
git push -u origin main
```
