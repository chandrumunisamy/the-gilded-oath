# Deploy update

From this extracted folder, open PowerShell and run:

```powershell
git init
git branch -M main
git remote remove origin 2>$null
git remote add origin https://github.com/chandrumunisamy/the-gilded-oath.git
git add .
git commit -m "Fix mobile website and APK download"
git push -u origin main --force-with-lease
```

Use `--force-with-lease` only because this package replaces the current generated website. It refuses to overwrite the remote when somebody else has pushed changes you do not have.

Then create or update a published GitHub Release and upload the APK. No hard-coded version or APK filename is required by the website.
