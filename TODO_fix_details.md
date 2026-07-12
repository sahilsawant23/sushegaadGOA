# TODO: Fix Church and Waterfall Details Errors

- [x] Update project/src/data/churchData.ts: Add 'coordinates' object and 'nearbyPlaces' array to Church interface and data
- [x] Update project/src/data/waterfallData.ts: Add 'coordinates', 'nearbyPlaces', 'safetyTips', 'bestSeason' to Waterfall interface and data
- [x] Fix project/src/pages/ChurchDetails.tsx: Correct import path to '../data/churchData', parse id to number, update to use 'coordinates' object
- [x] Fix project/src/pages/WaterfallDetails.tsx: Add the missing waterfall fetch line using getWaterfallById, parse id to number
