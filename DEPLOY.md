# Deployment checklist

Repository expected by the site: `chandrumunisamy/the-gilded-oath`

1. Create a **public** GitHub repository named `the-gilded-oath` with no generated README or license.
2. Add all files from this folder to the `main` branch.
3. In **Settings → Pages**, choose **GitHub Actions** as the source.
4. Create a GitHub Release with tag `v2.0.1`.
5. Paste `release/RELEASE_NOTES_v2.0.1.md` into the release notes.
6. Upload `TheGildedOath_v2_0_1.apk` as the release asset.
7. Publish the release.
8. The website download buttons already target that exact release asset URL.

The APK is 113,592,447 bytes, so it must be a **Release asset**. Do not commit it directly to the repository.
