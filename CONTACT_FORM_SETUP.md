# Contact Form Setup Guide

The contact form now stores submissions in GitHub and notifies you automatically:
1. Stores submissions in a `leads` branch as JSON files
2. GitHub sends you email/push notifications when action runs
3. Falls back to mailto links if GitHub API is unavailable

## Setup Steps (2 minutes)

### 1. Create GitHub Personal Access Token
1. Go to GitHub Settings → Developer Settings → Personal Access Tokens → Tokens (classic)
2. Generate new token with `repo` scope
3. This token allows the form to trigger GitHub Actions

### 2. Add Token to Environment
```bash
# For local development
cd site
echo "NEXT_PUBLIC_GITHUB_TOKEN=your_token_here" >> .env.local

# For production (GitHub Pages)
# Add as repository secret: Settings → Secrets → Actions → New repository secret
# Name: NEXT_PUBLIC_GITHUB_TOKEN
# Value: your_token_here
```

### 3. Create Leads Branch
```bash
git checkout --orphan leads
git rm -rf .
echo "# Contact Form Submissions" > README.md
mkdir leads
git add README.md leads/
git commit -m "Initialize leads branch"
git push origin leads
git checkout main
```

### 4. Enable GitHub Notifications
Go to GitHub repository → Settings → Notifications:
- Enable "Actions" email notifications
- Install GitHub mobile app for push notifications

That's it! No other services needed.

## How It Works

### User Flow:
1. User fills out contact form
2. Form triggers GitHub Action via repository_dispatch
3. GitHub Action saves submission to `leads` branch as JSON
4. GitHub sends you email/push notification about the new commit
5. You view the full submission data in the `leads` branch
6. If GitHub API fails, fallback to mailto link

### Data Storage:
- All submissions saved to `leads` branch in `leads/` directory
- Filename format: `YYYY-MM-DD_HH-MM-SS_email@example.com.json`
- Each submission is a separate JSON file with timestamp

### Viewing Submissions:
```bash
# Switch to leads branch
git checkout leads

# View all submissions
ls -la leads/

# Read a submission
cat leads/2025-11-07_19-30-45_john@example.com.json
```

## Testing Locally

1. Set up environment variables:
```bash
cd site
echo "NEXT_PUBLIC_WEB3FORMS_KEY=your_key" >> .env.local
```

2. Start dev server:
```bash
npm run dev
```

3. Navigate to http://localhost:3000/contact-us
4. Submit test form
5. Check Web3Forms dashboard for email delivery
6. Check GitHub Actions tab for workflow run
7. Check `leads` branch for JSON file

## Production Deployment

The form works automatically once:
1. Web3Forms key is added to production environment
2. GitHub secrets are configured
3. `leads` branch exists
4. Workflow file is committed to `main` branch

## Troubleshooting

**Form doesn't submit:**
- Check browser console for errors
- Verify Web3Forms key is set
- Check network tab for failed requests

**No email received:**
- Check Web3Forms dashboard for delivery status
- Verify Gmail app password is correct
- Check spam folder

**GitHub Action doesn't run:**
- Verify `leads` branch exists
- Check Actions tab for error messages
- Verify GitHub secrets are set correctly

**Leads not saved:**
- Check `leads` branch permissions
- Verify workflow has `contents: write` permission
- Check workflow logs for commit errors
