Task for LD2 - V3

Main fixes in this build:
1. Model Overview slide mapping rebuilt from the actual IVI Product Overview V2.0 slide content.
   - Mapping no longer assumes list row number = slide number.
   - Models may link to multiple source slides where the PPT contains multiple relevant slides.
   - Models with no dedicated source slide remain unmapped instead of opening a wrong model.
2. Model search moved to the top-right header area and remains realtime.
3. PPAP redesigned to follow the provided slide concept:
   - 2 model cards per row on desktop.
   - Each card shows Total new parts, Complete rate, PIC, Due date, status legend and pie chart.
   - Complete rate = Done parts / Total parts.
   - Clicking a model opens the detailed PPAP table.
   - Drawing status: white -> yellow Working -> green Release -> white.
   - HSMS/DQMS/SPR: white -> yellow Processing -> green Done -> red Pending -> white.
   - Clicking View/update opens PIC update details in the right-side panel.
4. A new local-storage key is used so the old incorrect V2 mapping does not persist in browser cache.

Run:
- Open this folder in VS Code.
- Right-click index.html -> Open with Live Server.

V4 update: Added Project Overview component adapted from ppap-local-app. Kept only No, Project, Buyer, Timeline as requested.

V5 FULL COMMENTS update:
- PPAP: removed Customer and Model search filters.
- Added Product tabs with All / per-product scopes.
- Overview chart aggregates all parts in selected product.
- Model cards remain below overview.
- Removed number from donut center.
- Status click cycle: White -> Yellow(Processing) -> Green(Done/Release) -> Red(Pending) -> White.
- Dev Flow/PIC Update drawer hidden by default; opens only from View/update and closes back to full-width table.
- Project Overview + Timeline from previous V4 retained.

V5.5 status fix:
- Restored the V3 PPAP status click mechanism that was proven clickable.
- Click target is the colored circle button itself.
- Infinite logic for every status: White -> Yellow/Processing -> Green/Done (Drawing=Release) -> Red/Pending -> White -> ...
- V5 PPAP layout, Product/All overview, model cards and hidden Dev Flow drawer remain unchanged.

V5.6 runtime fix:
- Fixed the exact Console blocker: old #closePpap / #addPpapBtn handlers no longer stop app.js.
- PPAP global search no longer references removed #ppapSearch.
- Status uses V3 direct-circle click mechanism.
- Infinite cycle: White -> Processing -> Done/Release -> Pending -> White.
