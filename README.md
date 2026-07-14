# The Gilded Oath website

Official static website for **The Gilded Oath**.

## What this revision fixes

- Rebuilt the mobile layout for 320–980 px screens.
- Corrected heading, card, gallery, keeper, install-panel, and footer alignment.
- Added responsive screenshot snapping and position indicators.
- Added lightweight entrance, header, hero, hover, and mobile download-dock motion.
- Respects `prefers-reduced-motion`.
- Removed the fragile hard-coded APK URL.
- Download buttons now query the latest GitHub Release and automatically use its `.apk` asset.
- When no APK release exists, buttons safely open the Releases page instead of a 404 URL.

## Publish

Replace the repository files with this folder, then commit and push:

```powershell
git add .
git commit -m "Fix mobile layout and release downloads"
git push
```

## Required GitHub release

Create at least one published GitHub Release and attach an `.apk` file. The website will locate the latest APK automatically; the tag and filename can change between releases.
