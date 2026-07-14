# Mobile campaign rebuild

- Rebuilt mobile layout from the ground up instead of modifying the previous composition.
- Replaced compressed mockups with real 720 × 1600 game screenshots.
- Every screenshot keeps its natural proportions; no `object-fit: cover`, forced height, zoom, or crop is used.
- Removed overlapping quotes, floating picture labels, angled screenshot cards, and staggered mobile image placement.
- Mobile images are centered, full-width, and displayed at half their source width or less for sharp rendering.
- Removed continuous mobile animation and all scroll listeners.
- Kept only one short desktop entrance animation.
- Marketing now follows a single story: read the law, shape the hand, face the cost.

## Validation
- Checked at 360, 390, 412, 768, and 1440 pixel widths.
- No horizontal overflow at any tested width.
- Phone screenshots retain the exact 9:20 source ratio.
- Keeper portraits retain the exact 1:1 source ratio.
- Mobile screenshots render at 318–346 px from 720 px sources, avoiding upscaling.
- Keeper portraits render at 330–382 px from 768 px sources, avoiding upscaling.
