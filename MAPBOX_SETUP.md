# Mapbox Setup Guide

## Get Your Free Mapbox Token

1. Go to https://account.mapbox.com/access-tokens/
2. Sign up for a free account (no credit card required)
3. Copy your default public token (starts with `pk.`)

## Add Token to Project

1. Create a file called `.env.local` in the `site/` directory:
   ```bash
   cd site
   touch .env.local
   ```

2. Add your token to `.env.local`:
   ```
   NEXT_PUBLIC_MAPBOX_TOKEN=pk.your_actual_token_here
   ```

3. Restart your dev server:
   ```bash
   npm run dev
   ```

## What You Get

- **50,000 free map loads per month** (plenty for your site)
- Beautiful, clean "Light" style map
- Custom blue pins matching your brand color (`--primary`)
- Interactive markers with popups
- Smooth zoom and pan controls
- Click any pin to view that location's services page

## Map Features

✅ All 22 service area locations with pins
✅ Click pins to see location name and "View Services" link
✅ Hover effects on pins (scale up)
✅ Clean, minimal styling matching your site design
✅ Responsive and mobile-friendly
✅ Dark mode compatible (uses CSS variables)
✅ No Google branding or watermarks

## Map Customization Options

If you want to change the map style later, you can use:
- `mapbox://styles/mapbox/light-v11` (current - clean and minimal)
- `mapbox://styles/mapbox/dark-v11` (dark theme)
- `mapbox://styles/mapbox/streets-v12` (more detailed)
- `mapbox://styles/mapbox/outdoors-v12` (topographic)

Just change the `mapStyle` prop in `ServiceAreasMap.tsx`.
