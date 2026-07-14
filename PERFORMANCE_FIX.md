# Mobile smoothness and image-ratio fix

## Problems removed

- Removed `content-visibility`, which was causing sections to appear and resize while scrolling.
- Removed the fixed noise layer and mobile blur effects.
- Removed all scroll listeners, picture-position listeners, pointer-follow effects, and reveal observers.
- Removed the fixed mobile download bar.
- Disabled entrance animation on phones.
- Delayed the GitHub download lookup until the browser is idle.
- Changed the phone header from sticky to normal page content.

## Picture sizing

- Main artwork: exact 1:1 frame.
- Game pictures: exact 9:20 frame.
- Keeper artwork: exact 1:1 frame.
- Every displayed picture uses `object-fit: contain` and a fixed width/height ratio.
- Smaller WebP pictures are used on phones, while larger versions are reserved for bigger screens.

## Validation

Tested in headless Chromium at:

- 360 × 800
- 390 × 844
- 412 × 915
- 768 × 1024
- 1440 × 1000

Results:

- No script errors.
- No missing local files.
- No page-wide horizontal overflow.
- Every visible picture retained its intended ratio.
- Automated phone scrolling held a 16.7 ms median frame time.
- Under 6× CPU slowdown, the 95th-percentile frame time remained about 16.8 ms.
