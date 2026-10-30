# Groove x Figma build-out: case study log

A running record of using Claude, acting as a senior design systems designer, to bring Figma and the doc site in line with the Groove codebase, one component at a time. Written as it happens so the story can be told honestly afterward.

## The question

How effective is it to have an AI build out missing design-system components in Figma, incrementally, with the code as source of truth?

## Starting point (2026-10-29)

- Groove v2.0.0: 44 React components, 12 foundations, 6 guides, light/dark theming via CSS-variable semantic tokens, 203 tests.
- Figma file: `lfrGFBYB7xPSgFfNqOWKpA` ("Groove Design System"), 3 pages: Foundations, Components, Playground.
- Doc site: built and themed; freshness vs. code not yet audited.

## Operating principles

1. Tokens before components: primitives -> semantic tokens with Light/Dark modes; components bind only to semantic variables.
2. Figma component properties mirror React props (same names, same vocabulary).
3. Full state coverage (default, hover, pressed, focus, disabled, plus loading/error where relevant) and WCAG AA contrast checked in both themes.
4. Audit before building. Classify gaps as missing / outdated / diverged, and recommend which side wins when they diverge.
5. State trade-offs and recommend; don't silently decide.
6. One component per round, verified by screenshot against the doc page.

## Round log

_Entries are added newest-last. Each records: goal, decisions + rationale, what worked, friction / guesses, evidence, time or effort notes._

### Round 0: Setup
- Agreed scope, method and role. Created this log and a persistent project note.
- Waiting on: Figma file URL/key and go-ahead for the audit. (Received 2026-10-29.)

### Round 1: Audit (read-only, 2026-10-29)
**Method:** listed pages and node trees with `get_metadata`, sampled variable bindings with `get_variable_defs`, screenshotted the Components page, then compared against `src/components/` and `tailwind.config.js` / `global.css`. Nothing in Figma was modified.

**What Figma has**
- Foundations: 6 primitive color ramps (Blue, Purple, Green, Yellow, Red, Gray; 50-950), role-based color tokens (Primary, Secondary, Error, Warning, Success, Grayscale), a type scale (base 16, ratio 1.25) with H1-Footnote styles in Light/Regular/Bold, a radius scale (XS-Full) and a number/spacing scale.
- Components (~17 families): Button (5 types x Default/Hover/Pressed), Pagination Button, Checkbox, Radio, Toggle, Input (Text), Dropdown, Card (Simple/KPI/Data Viz), Badge, Label, Table (head/cell/pagination), Alert, Tooltip, Spinner/InlineLoading, ProgressBar, Tabs, Breadcrumb, charts (Pie/Donut/Line/Trend), Icons, and app compositions (Sidebar, Top Bar, containers).
- Playground page with instance smoke tests.

**Gaps (code -> Figma)**
- Missing entirely (~27): Accordion, Avatar, Banner, ButtonGroup, Chip, Combobox, CommandPalette, DatePicker, Divider, Drawer, EmptyState, Field, FileUpload, IconButton, Link (partial, as a Button type), List, Menu, Modal, MultiSelect, NumberInput, Popover, SegmentedControl, Skeleton, Slider, Stepper, Textarea, Toast.
- Foundations missing: elevation scale, z-index/layering, motion, focus ring, light/dark semantic tokens (`surface`, `ink`, `line`, `focus`).

**Diverged / drift**
- Token taxonomy: Figma is role-based (`Surface/Default`, `Grayscale/Text/Body`) while code is semantic (`surface`, `surface-raised`, `ink-muted`, `line`). No Dark mode found in Figma (to confirm via variable collections).
- Naming: Figma uses `Type=`, `State=Inactive`, `Property 1=...`, `Page Count=Variant3`, `State=pressed` (lowercase). Code uses `variant`, `disabled`. "Inactive" in Figma means "disabled" in code.
- Icons: Figma uses iconstack.io glyphs; code uses lucide.
- Button: no Disabled or Focus state, no sizes, no loading in Figma.

**Accessibility findings (measured, WCAG 2.x contrast)**
| Pair | Ratio | Result |
| --- | --- | --- |
| White on primary `#588ae0` (Button label) | 3.43:1 | Fails AA for normal text (passes large) |
| White on primary-hover `#a3b9ed` | 1.96:1 | Fails; hover state is less readable than rest |
| Figma `Text/Caption` `#9f9d9d` on white | 2.70:1 | Fails AA |
| Code `ink-subtle` (gray-400) on white | 2.54:1 | Fails AA (decorative/placeholder use may be acceptable; body text isn't) |
| Code `ink-subtle` dark (gray-500) on gray-800 | 3.04:1 | Fails AA |
| Code `ink-muted` dark (gray-400) on gray-800 | 5.78:1 | Passes |

**Friction / limits so far**
- `get_variable_defs` returns only the resolved value for the active mode, so it can't show modes or collection structure. Needs a `use_figma` read to confirm.
- Component counts come from node names, not prop-level comparison; per-component audits still to do.

**Status:** audit complete at the inventory level. Next: agree on foundations-first plan, then pick Round 2 component.

### Round 2: Foundations pass (started 2026-10-29)
**Scope locked:** tokens/foundations only. Acceptance: Light/Dark semantic collection mirroring `global.css`; elevation styles; focus token; scopes + web code syntax on new variables; existing tokens untouched.

**Discovery (read-only `use_figma`)**
- Figma already has a layered system: `Primitive` (78 vars: 68 color, 10 float), `Style Tokens` (13), `Semantic Colors` (10, modes = brand roles Primary/Secondary/Error/Warning/Success/GreyScale), `Sizing Tokens` (6 radius). 24 text styles, 0 effect styles, 0 paint styles.
- Every existing variable has `ALL_SCOPES` and no code syntax (token hygiene debt).
- Radius matches code (S=8 control, M=12 card, L=16 modal, FULL=99 pill). Blue ramp matches (Blue 500 `#588ae0`, 300 `#a3b9ed`, 700 `#30528a`), so focus can alias directly.
- **Conflict:** Figma `Color/Gray` is a warm neutral (50 `#f4f3f3`, 900 `#222121`); code's semantic surfaces/ink/lines use Tailwind's cool gray (50 `#f9fafb`, 900 `#111827`). Aliasing Light/Dark tokens to Figma's grays would not reproduce what the code renders. Paused for a decision (code wins / Figma wins / hybrid).

**Done**
- Created 5 effect styles `Elevation / 1..5` mirroring `shadow-elevation-1..5` (1, 2, 2, 2, 2 shadow layers; verified from returned data). Additive, nothing existing changed.

**Decisions (Rob, 2026-10-29)**
1. Gray source of truth: **code wins (option A)**. Added Tailwind's gray ramp as a separate `Color/Cool Gray/50-950` set of primitives (11 vars, hidden from pickers via empty scopes) rather than editing the existing warm `Color/Gray` ramp. Existing components keep their current look until migrated.
2. Primary/hover AA contrast: **deferred**. Mirrored the code as-is; the failing pairs stay logged as known debt.

**Done (continued)**
- New `Theme` collection with `Light` and `Dark` modes: 11 semantic tokens (`Surface/Page|Raised|Muted|Inverse`, `Ink/Default|Muted|Subtle|Inverse`, `Line/Default|Strong`, `Focus/Ring`), each aliased to primitives in both modes, with explicit scopes and web code syntax (`var(--color-surface)` etc.). Named `Surface/Page` (not `Surface/Default`) to avoid colliding with the existing brand-role `Semantic Colors/Surface/Default`.
- **Verified programmatically:** all 22 resolved values (11 tokens x 2 modes) match the RGB triplets in `src/styles/global.css`; 0 mismatches.
- Added a specimen to the Foundations page ("Theme Tokens (Light / Dark)"): two panels pinned to each mode via explicit variable modes, showing all tokens, elevation 1-5 and the focus ring. Screenshot-checked.

**Findings**
- **Elevation is effectively invisible in dark mode.** The code reuses the same black 5-10% shadows in both themes, so on dark surfaces the five elevation levels are indistinguishable (see Dark panel). Depth in dark mode currently comes only from the surface hierarchy. Candidate fix: dark-specific shadows or a lighter-surface elevation scheme. Not changed; flagged for a decision.
- Existing `Color/Gray` (warm) vs code gray (cool) split is now explicit in the file: two ramps coexist until components are migrated.

**Not done (deliberately out of scope this round)**
- Scopes/code syntax on the pre-existing 107 variables (modifies existing tokens; needs a go-ahead).
- Motion, z-index and sizing/spacing tokens.
- AA contrast fix.

**Friction notes**
- The skill's "ask when code != Figma" rule triggered correctly; the conflict was only visible because I compared actual values rather than names.
- Process slip: I fired a verification screenshot in the same turn as a fix, so it captured the pre-fix state and briefly looked like the fix had failed. Re-taking it after the fix confirmed success. Lesson: screenshots must follow writes, never run in parallel with them.
- The elevation shadow clipping was an auto-layout default (wrapper frames clip content) that only showed up visually, not in structural data.

**Status:** foundations pass complete for color theme + elevation + focus. Ready for Round 3 (first component).

### Round 3: IconButton (2026-10-29)
**Goal:** first component built end-to-end from code (`src/components/IconButton.jsx`), as the test of the one-component-at-a-time method.

**Source-of-truth read:** 7 variants (primary, secondary, destructive, positive, outline, ghost, link), 3 sizes (sm/md/lg = 28/40/48px, icons 16/20/24), disabled + loading, 8px radius (`rounded-control`), 2px focus ring with 2px offset, required `aria-label`.

**Pre-work (a second code-vs-Figma conflict)**
- Brand colors: only the blue family matched. Code secondary `#7c3aed` / destructive `#dc2626` / positive `#16a34a` vs Figma Purple/Red/Green 600 `#7147ff` / `#c42617` / `#3c6e3e`. Precedent from Round 2 (code wins): added a `Brand` collection (16 vars, Primary/Secondary/Destructive/Positive x Default/Hover/Pressed/Disabled), primary aliased to existing Blue primitives, others raw because `tailwind.config.js` defines them raw.
- Existing Figma Button has a 4px radius; code is 8px. Not changed (out of scope), flagged for the Button migration.
- Added `STROKE_COLOR` scope to the `Ink` tokens because icons are stroke-based.

**Built**
- Component set `IconButton` in a new `Actions` section on the Components page: **126 variants** (Variant x Size x State, 7 x 3 x 6), plus an `Icon` instance-swap property (wired on the 105 non-loading variants). Default variant is Primary / MD / Default (matches code defaults).
- 100% variable-bound: 471 paints audited, 0 hardcoded; all 126 radii bound to `Radius/S`. Fills use `Brand/*` and `Theme/*`, focus ring uses `Theme/Focus/Ring`.
- Description on the set maps Figma properties to React props, notes the required accessible name, and lists known issues.
- Light and Dark review panels (instances pinned to Theme modes) show the full grid, the size comparison and an icon-swap test.

**What worked**
- Prototype-first (12 of 126 variants) caught two bugs cheaply before the full matrix was generated.
- Icon swap preserves token-bound icon colors: swapped Heart/Settings icons stayed white on filled variants and ink on outline. I had expected overrides to reset; they don't.
- Dark mode "just worked" on the Theme tokens: the same instances re-theme via explicit modes, and the focus ring brightens to Blue 300 like the code.

**Friction / bugs found and fixed**
1. **Shadow-based focus ring didn't render.** Stacked 0-blur spread shadows (the Tailwind `ring` recipe) were present on the node, correctly variable-bound, and counted in render bounds, but did not appear in exports even with a bright red test color. Diagnosed with a pixel readout rather than eyeballing. Fixed by drawing the ring as an absolutely-positioned stroke layer. Side benefit: the gap is transparent, so it works on any surface (code's `ring-offset` is solid white, which would show a white halo in dark mode).
2. **Spinner looked like a pie chart.** Ellipse `arcData` draws radial closing lines. Replaced with an open 270-degree vector arc (matches lucide `Loader2`).
3. **Default Size was SM.** Figma picks the top-left variant as the default and my grid put SM there. Re-gridded into size bands (MD first).
4. Variant/Size dropdown option order follows creation order and can't be changed by reordering layers (Outline listed 2nd, sizes MD/SM/LG). Cosmetic; unfixed.

**Deviation from the skill's guidance:** the skill caps variant matrices at ~30 and suggests splitting. I kept one 126-variant set because splitting by size would force designers to swap component to change size, which breaks parity with the single `size` prop. Trade-off: a heavy set to maintain.

**Code findings surfaced by building it**
- `secondary.disabled` is `#DDE4BA` (pale yellow-green). Obviously off next to purple; likely a copy-paste bug in `tailwind.config.js`. Mirrored as-is, flagged.
- Outline/Ghost/Link have no `active:` style in code, so Pressed = Hover. Documented in the description.
- White icon on Primary hover (`#a3b9ed`) is 1.96:1 (below the 3:1 non-text minimum). Contrast fix still deferred.

**Not done (scope):** Code Connect mapping; updating the doc-site page (it already matches code); migrating the older Button to the new tokens/radius.

**Status:** IconButton complete and verified (structure + both themes). Ready for Round 4.

### Round 4: Iconography (2026-10-29)
**Context:** Figma had 22 hand-collected iconstack.io glyphs; the code uses `lucide-react` (^0.263.1). Decision (Rob): Option 2, generate from the code's own Lucide source, ~200 icons, prototype 5 first.

**Method**
1. Wrote a Node script (`extract-icons.mjs`, scratchpad) that parses the installed lucide-react package: indexes every icon, resolves the package's alias exports, scans `src/` imports, and emits clean SVG per icon.
2. Scope = **200 icons: 79 the code actually imports + 121 curated additions** (common UI vocabulary: navigation, actions, status, data, commerce, media, devices, text formatting), filtered to what exists in v0.263.1 (one candidate, `CloudUpload`, doesn't exist in this version).
3. Prototyped 5 with different geometry (settings, bell, search, plus, calendar), verified, then built the remaining 195 in 4 idempotent batches.
4. Built in Figma with `createNodeFromSvg`: one 24px component per icon named `lucide/<file-name>`, strokes bound to `Theme/Ink/Default`, description with the React import name and any code alias. Arranged into a labeled gallery ("In use by Groove (79)" / "Curated additions (121)") in a new `Icons (Lucide)` section on the Components page. The 22 legacy iconstack icons are untouched.

**Verified:** 200 components, 200 unique names, 594 stroke layers all variable-bound, all stroke weight 2 / round caps, every component exactly 24x24, no visible fills, no stray temp nodes. Screenshot-checked.

**Findings**
- **The code imports icon aliases.** `Edit` and `Edit2` are Lucide aliases for `pen-square` and `pen`. Figma carries the canonical names and notes the alias in each description. Without alias resolution a naive name match would have reported two "missing" icons.
- **Stroke scaling mismatch (affects Round 3):** `lucide-react`'s `size` prop scales the stroke with the icon (16px = 1.33px stroke). Figma's `resize()` keeps a 2px stroke; `rescale()` scales it (verified: 2 vs 1.333). The IconButton I built last round used `resize()`, so its SM/MD icons are heavier than the code's. Logged, not yet fixed.
- **Prototype-first caught nothing broken this time, but answered the design question** (resize vs rescale) with numbers before 200 components depended on it.
- **Tooling trap, found by audit:** Figma's `description` field HTML-escapes characters (`'` became `&#39;`, `<`/`>` became `&lt;`/`&gt;`). It affected all 200 new icon descriptions and the Round 3 IconButton description (which I had declared verified). Fixed both with plain wording. Lesson: read descriptions back; "it ran without error" isn't verification.
- Lucide `0.263.1` is from 2023; newer Lucide renames and adds icons. Upgrading is a code decision; Figma is pinned to what ships.

**Not done:** swapping existing components (Button, Alert, etc.) off the legacy iconstack icons; marking legacy icons deprecated; the IconButton stroke-scaling fix; updating the doc-site Iconography page to link the Figma gallery.

**Status:** Round 4 complete. 200 icons live in Figma, matching the code's icon source.

### Round 4b: Icon migration + legacy removal (2026-10-29)
**Goal:** replace every use of the old iconstack icons with Lucide, then delete the old set.

**Inventory first (read-only):** 21 legacy icon components; 243 instances on the Components page (105 were my own IconButton variants, 90 in its review panels), 9 on the Playground, 4 components with `INSTANCE_SWAP` defaults pointing at them (Button, TableHead, SidebarMenuItem, IconButton), 121 instances overriding the icon through the swap property. Many legacy icons had zero uses.

**Mapping (legacy -> Lucide):** Alert Circle / Circle_Warning -> `alert-circle`; Alert Triangle / Triangle_Warning -> `alert-triangle`; Warning/Info -> `info`; Circle_Check -> `check-circle`; Edit -> `pen-square` (the code's `Edit` alias); Heart, Filter, Search, Settings, Users, x, External Link -> same-named; Arrow Sync -> `refresh-cw`; Alt Arrow Down -> `chevron-down`; Layout Dashboard -> `layout-dashboard`; Analytics Line -> `line-chart`; Report Search -> `file-text` (closest in the curated set; unused); Chevron Left/Right -> `chevron-left/right`.

**Method:** (1) IconButton: set the swap default to `pen-square` and rebuilt all 105 icon layers with `rescale`, which also fixes the Round 3 stroke-weight mismatch (stroke now 1.333 / 1.667 / 2 px at SM / MD / LG, same as code). (2) Everything else: captured each legacy instance's color and size, updated the 3 other swap defaults, set swap-property overrides, swapped the remaining direct instances, then restored color and size. (3) Guarded delete: the script re-counted references and would have aborted if any remained. (4) Renamed the new section to `Icons`.

**Result (verified):** 243/243 instances accounted for (187 pen-square, 19 alert-circle, 18 layout-dashboard, 4 info, 4 heart, 4 settings, 2 check-circle, 2 filter, 1 each chevron-down / refresh-cw / alert-triangle); 0 legacy references remain on either page; 0 orphaned instances; all swap defaults resolve to `lucide/*`; 21 legacy components and their section deleted; 200 Lucide icons and the 126-variant IconButton intact. Screenshot-checked: Buttons, Alerts, Sidebar, Data Table, Status, IconButton Light + Dark.

**Bugs the migration introduced, found by looking, and fixed**
1. **Variable modes carried by the icon, not the container.** The legacy Success and Warning alert icons got their green / yellow from an explicit `Semantic Colors` mode set on the legacy icon *components*. Swapping kept the variable binding but dropped the mode, so those two icons silently fell back to gray. No error, no structural signal; a screenshot comparison caught it. Fixed by setting the mode on the Alert variants' icon instances.
2. **Nested instances can't be resized** (`rescale` throws "cannot be overridden"), which aborted the color restore for 8 swapped icons in the IconButton review panels, leaving white-on-blue icons dark. Fixed with a targeted recolor. The first-pass script reported `errors: 8` honestly; I chased it instead of declaring success.
3. Figma's `saveVersionHistoryAsync` isn't available, so I couldn't create a programmatic restore point; mitigated by deleting only after the guarded zero-reference check, leaving Figma's own version history as the fallback.

**Not covered / unverified:** icons drawn as raw vectors (not instances of the legacy components), for example glyphs inside Input; the Report Search and Analytics Line mappings are approximate but had no usages. The doc-site Iconography page does not yet link to the Figma gallery.

**Status:** legacy icon set fully replaced and removed. Figma and code now share one icon source.

### Round 5: Textarea (2026-10-29)
**Why this one:** clean, self-contained, and the first component of the text-field family (TextInput shares its label, helper/error, counter and border logic). Built so those pieces can be reused when the older Figma Input is migrated.

**Source read:** `Textarea.jsx` and `TextInput.jsx`. Sizes sm/md/lg (padding 10x6 / 12x8 / 14x10, text 14/16/18, line height 24), states default / focus (2px primary border) / error (2px destructive) / disabled, optional label + required marker, helper or error message, character counter, `rows` (default 4), `autoResize`.

**Pre-work: typography gap.** Code uses Tailwind's 14 and 18px text; Figma's scale has no 14 or 18 (8, 10, 13, 16, 20...). Reused `Body / Regular` (16/24, identical to the code's MD) and added 6 text styles: `Field / Text SM` (14/24), `Field / Text LG` (18/24), `Field / Label SM|MD|LG` (Medium 14|16|18 / 24), `Field / Message` (14/20). Figma also has **no semantic spacing tokens** (only radius), so padding and gaps are plain numbers while radius, colors and type are bound.

**Built:** component set `Textarea` in a new `Text Fields` section: **24 variants** (Size SM|MD|LG x State Default|Focus|Error|Disabled x Content Placeholder|Value), default variant MD / Default / Placeholder. Seven component properties wired to layers: `Label`, `Show Label`, `Required`, `Message`, `Show Message`, `Count`, `Show Count`. Light and Dark review panels built from instances.

**Method note:** prototyped 3 variants first and checked the geometry against the code's CSS box model before generating the other 21. Field heights match: 110 / 114 / 118 px (SM / MD / LG) plus 2px on focus or error, because the code's `border-2` grows the box.

**Verified:** 168 paints, 0 unbound; 120 text layers, all with a text style; all 24 radii bound; every property wired on all 24 variants; description read back with no escaped characters (applying the Round 4b lesson); screenshot-checked in Light and Dark.

**Findings (accessibility, measured)**
| Item | Ratio | Result |
| --- | --- | --- |
| Error message `#dc2626` on light page | 4.62:1 | Passes AA (narrowly) |
| Error message on dark page `#111827` | 3.67:1 | **Fails AA** for 14px text |
| Counter (`ink-subtle`) light | 2.43:1 | **Fails AA** |
| Counter (`ink-subtle`) dark | 3.67:1 | **Fails AA** |
| Focus border (primary `#588ae0`) vs white / dark raised | 3.43:1 / 4.28:1 | Passes the 3:1 non-text minimum |
- Code finding: focus and error borders change from 1px to 2px by growing the box (no compensating padding), so the field shifts 2px on focus.
- Figma limitation: a TEXT component property has one default across all variants, so `Message` can't default to "Helper text" in some variants and "Error message" in others. Placeholder/value text is left as per-variant layer text (edit directly) and the message text is a neutral default.

**Correction (Round 6):** all 24 variants had padding that double-counted the border (content 1px too far in at default, 2px at focus/error). Fixed and re-verified in Round 6. The height and token checks above were right; they just didn't test content position.

**Not done:** TextInput migration (done in Round 6); `autoResize` and the native resize grip are documented, not drawn; Code Connect.

**Addendum (Round 4): dark-mode icons.** Rob asked for a dark version of the icons. Decision: no duplicate components. The icons' strokes are already bound to `Theme/Ink/Default`, which has Light and Dark values, so they recolor with the mode. Added `Lucide Icon Gallery / Dark` beside the light gallery: 200 instances in a frame pinned to the Theme Dark mode, same layout and labels. Verified: 200 instances, all `lucide/*`, still exactly 200 main components (no duplicates); screenshot-checked. Design principle for the write-up: dark mode is a property of the token layer, not a second asset set.

### Round 6: TextInput + Round 5 correction (2026-10-29)
**Why this one:** the natural second half of the text-field family. Reuses Round 5's label, message and field pieces, and retires the oldest component in the file that still used raw colors.

**Audit first.** The legacy field was not called Input: the frame was "Input", the component set inside it was `Text` (5 variants: Default/Active/Filled/Inactive/Error, 40px fixed height, 4px radius, raw white fill, a bound stroke, no sizes, no helper text, no counter). Its search glyph was a raw iconstack frame, not an icon instance, so Round 4b's migration had never touched it. Dependents: one instance in the Playground "Input Test" frame, and two nested instances that I first attributed to the Dropdown. **That attribution was wrong** (caught at the start of Round 7): they were the search field inside the Top Bar composition. I wrote the claim from an instance ID without walking its parent chain. The doc page for TextInput was also stale: it said the basic example shows a search icon (the code made the icon opt-in), listed `showIcon` as defaulting to true, and documented 8 of ~20 props.

**Scope decision (mine, flagged):** the matrix is Size x State x Content, the same 24 variants as Textarea, because that is the family's shared API. `addonBefore` and `addonAfter` are **not** modeled. They change the field's corner rounding, and Figma can't bind radius to a boolean property, so modeling them means a fourth variant axis (96 variants, over the 30-variant guideline) or a separate Input Group component. Recommendation: build the group as its own component later. `type` is documented only (no visual difference).

**Built:** component set `TextInput` (24 variants, default MD / Default / Placeholder) in the `Text Fields` section, beside Textarea. 13 properties: Label, Show Label, Required, Message, Show Message, Count, Show Count, Prefix, Show Prefix, Suffix, Show Suffix, Show Icon, Icon (instance swap, default `lucide/search`). Sizes match the code box model: field heights 32 / 40 / 48, padding 8 / 8 / 12, icons 16 / 20 / 22. Error variants always show the alert icon with the property intentionally unwired, because code gives the error icon priority over `showIcon`. Added one text style (`Field / Counter`, 12/16) because the inline counter is `text-xs`. Light and Dark review panels built from instances (dark needed no extra work: it's the Theme mode on the panel).

**Prototype first, again.** Built 3 variants with every optional layer switched on as a stress test, and tested one thing I wasn't sure about: whether recoloring an icon instance survives swapping the icon (it does, so `Icon` can be swapped without losing the muted color).

**Correction to Round 5 (found by the prototype).** The prototype's text sat 1px too far in at default and 2px at focus/error. Cause: this file's frames default to `strokesIncludedInLayout = true`, so a stroke is added to padding automatically, and I had already folded the border into the padding (9 = 8 + 1, 10 = 8 + 2). Textarea had the same bug in all 24 variants. It was invisible to every check I ran last round: the heights were fixed values I'd set explicitly, bindings were fine, and the screenshots were not pixel-compared against CSS. It surfaced only because I read child x-offsets on a new component. Fixed on all 24 Textarea variants (padding now equals the code's px/py exactly; content x is now 13 / 14 for MD default / focus, content width 294 / 292, matching the CSS box model) and verified by number. Lesson for the write-up: "verified" claims need to say what was compared against what. Last round's check compared field heights to the code and never compared where the content sits inside the box.

**Verified:** 234 paints, 0 unbound; 168 text layers, all with a text style; 24/24 radii bound; every property wired on all 24 variants (Error icon intentionally unwired); description read back with no escaped characters; Light, Dark and Playground screenshots reviewed after the writes.

**Migration:** replaced the legacy instance in Playground "Input Test" with a `TextInput` instance (guarded: aborted unless the frame held exactly that one child). The legacy set was **renamed `Text (deprecated)` with a description, not deleted**, because the Top Bar still nested it (2 instances; mislabelled as "the Dropdown" at the time, see above). That mirrors Round 4b's rule of never deleting while references remain. Resolved in Round 7: the Top Bar's search field was swapped to a TextInput instance (Show Label off, Show Message off, Show Icon on, 325px wide) and a recount found 0 references on the Components page.

**Doc site:** `TextInputPage.jsx` updated: props table now lists all props with correct defaults (showIcon false, plus size, type, helperText, required, maxLength, showCount, prefix, suffix, addonBefore, addonAfter), fixed the two stale statements, and replaced "Without Icon" with Sizes, Helper Text / Required / Counter, With Icon, and Prefix / Suffix / Addons sections. Site build passes.

**Findings (accessibility, measured)**
| Item | Ratio | Result |
| --- | --- | --- |
| Placeholder, prefix, icon (`ink-muted`) vs raised, light / dark | 7.56 / 5.78 | Pass |
| Disabled text (`ink-subtle`), light / dark | 2.54 / 3.04 | Below 4.5 but exempt (inactive controls) |
| Error border and icon (destructive) vs raised, light / dark | 4.83 / 3.04 | Pass the 3:1 non-text minimum (dark only just) |
| **Default field border (`line-strong`) vs raised, light / dark** | **1.47 / 1.94** | **Fails the 3:1 non-text minimum** for identifying the control |
- The default border failure applies to Textarea, TextInput and likely every outlined control (Select, NumberInput). It is a token-level fix (darken `line-strong`, or add a stronger `line-control` token), not a component fix, which strengthens the case for the single contrast pass: primary button, counter, error text, field border.
- Code finding: `showIcon` default changed in the component but the docs lagged. Figma limitation repeated: TEXT properties have one default across variants.

**Not done:** `addonBefore` / `addonAfter` (see scope decision); the doc site does not link to the Figma components; Code Connect.

### Round 7: Select family (2026-10-29)
**Why this one:** next in the form-control family, and the last piece of the oldest Figma UI. It also turned out to be a family, not a component: the code's Select is a trigger, a portaled listbox, option rows, group headings, a search field, an empty state and a clear button.

**Start-of-round correction.** Before auditing Select I re-checked Round 6's claim that "the Dropdown still nests the deprecated `Text` field". It was wrong: the two nested instances were in the Top Bar composition (its search field), and the legacy Dropdown set had no instances on the Components page at all. Fixed first: swapped the Top Bar's field to a TextInput instance (label and message off, icon on, same 325px slot, screenshot-checked), recounted: 0 references to the legacy `Text` set anywhere. Log and memory corrected.

**Audit.** Legacy `Dropdown` (116:970): 5 variants (Default/Selected/Open/Disabled/Error), 210 x 72, a raw "Textbox" frame with a raw-vector chevron, 4px radius, one size, no focus ring, no listbox. Playground "Dropdown Test" held the only instance.

**Scope decision.** Split into three components, because one component set holding the trigger *and* the menu would exceed the variant guideline and couldn't express the real dependency (a menu is composed of options):
- `Select` (trigger): Size 3 x State 5 (Default, Focus, Open, Error, Disabled) x Content 2 (Placeholder, Selected) = **30 variants**, exactly at the cap. Focus is its own state because, unlike TextInput, the code draws a keyboard focus ring (`focus-visible:ring-2` with a 2px offset); built as an absolutely positioned stroke layer copied from IconButton, bound to `Focus/Ring` (shadows don't render in exports). 9 properties: Label, Show Label, Placeholder, Selected Label, Show Icon, Icon (swap), Show Clear, Message, Show Message.
- `Select Option`: State 3 (Default, Active, Disabled) x Selected 2 = 6 variants; Label, Show Icon, Icon.
- `Select Group Label` (one component) and `Select Menu`: Type = Options | Grouped | Searchable | Empty, composed from instances, elevation 4.
Plus one new text style, `Field / Group Label` (Semi Bold 12/16, uppercase, 2.5% tracking). Total new: 4 components / 41 variants.

**Choices where Figma and the code differ in expression**
- Open state: code rotates the same ChevronDown 180 degrees; I swap to `lucide/chevron-up`. For this icon the two are geometrically identical, and it avoids rotation inside auto layout.
- Clear button: the code positions it absolutely at `right: calc(chevron + 1rem)`. Reproduced with an absolute layer pinned right (3px gap to the chevron at MD, same as the code) rather than putting it inline, which would have been 8px.
- Properties are wired only where the code can produce the state: Show Clear exists only on enabled Selected variants (code: `clearable && selected && !disabled`); Message only on Error variants. A designer can't toggle on something the product can't render.
- The menu isn't sized by `size` (options are `text-sm` regardless), so Select Menu has no Size axis.

**Prototype first (4 variants, all optional layers on).** Checked child x-offsets against the CSS box model before generating the rest, not just heights (Round 6's lesson, applied): icon at 13 = 12px padding + 1px border, chevron right edge 13 from the end, clear button 3px from the chevron. Found nothing to fix, which is the point.

**Defect caught in review, not in the numbers.** First panel screenshots showed the focus ring cut off on its right and bottom edges and the menu shadows clipped. The 30-variant set rendered correctly, so the components were fine: the layout rows I'd created for the review panels clip their children by default. Fixed by turning clipping off on 10 rows per panel and re-shooting. A structural audit would not have found this; only looking did.

**Verified:** Select 132 paints / 0 unbound, 66 text layers / 0 unstyled, 36 rounded nodes / 0 unbound radii; Select Option, Group Label, Menu: all 0 unbound. Property wiring checked per variant against what the code can render (0 issues). Trigger heights 32 / 40 / 48. All four descriptions read back with no escaped characters. Light and Dark panels screenshot-checked after the clipping fix.

**Migration.** Playground "Dropdown Test" instance swapped to Select (guarded: aborted unless the frame held exactly that one child). Legacy `Dropdown` renamed `Dropdown (deprecated)` with a description. Recount: 0 references to either legacy set on the Components page and the Playground. **Deleted after Rob's go:** recounted references on all three pages (Foundations, Components, Playground: 0), guarded delete (abort if the node name/type differed or any reference remained), then confirmed from a fresh read that no component set named Text, Dropdown or "(deprecated)" remains. The Form Controls section keeps two now-empty title frames ("Input", "Dropdown") where the sets used to sit.

**Doc site:** `SelectPage.jsx` documented 8 props and 4 sections. Added `size`, `searchable`, `clearable`, `emptyMessage`, `id`, expanded `options` (group, icon, disabled) and `onChange` (clear gives ''), plus Sizes, Searchable and clearable, Groups and icons sections. Site build passes.

**Findings (accessibility, measured)**
| Item | Ratio | Result |
| --- | --- | --- |
| **Group heading** (`ink-subtle`, 12px, not disabled) on raised, light / dark | **2.54 / 3.04** | **Fails AA** |
| **Search placeholder** (`ink-muted`) on `surface-muted`, light / dark | 6.87 / **4.06** | **Dark fails AA** (light passes) |
| Option text on active row, light / dark | 16.12 / 9.37 | Pass |
| Focus ring vs page, light / dark | 3.28 / 9.06 | Pass (3:1) |
| Selected check (primary) on raised, light / dark | 3.43 / 4.28 | Pass (3:1 non-text) |
| Menu border vs raised, light / dark | 1.24 / 1.42 | Low; the popover relies on its shadow (invisible in dark: Round 2 finding) |
| Default trigger border (`line-strong`) | 1.47 / 1.94 | Fails 3:1 (same token as Round 6) |
- Code inconsistencies, not fixed (code changes weren't asked for): (1) Select's label is regular 16px with 8px gap while TextInput and Textarea use a medium-weight, size-matched label with 6px gap, so Select looks different beside them in a form; (2) a **disabled Select with a value keeps full-ink text** (`selected ? text-ink : ...` wins over the disabled branch), so only the border and chevron say it's disabled; I mirrored this in Figma and flagged it in the description; (3) Select's leading option icon is 18px at MD and the chevron 22px at LG, off the documented 16/20/24/32 icon scale; (4) the Select has a focus ring and TextInput/Textarea don't (they change border instead).

**Not done:** MultiSelect and Combobox (same family, separate components, probably share Select Option); the deprecated sets' deletion; the menu's scroll behaviour past 240px is described but not drawn; Code Connect.

### Round 8: Multi Select (2026-10-29)
**Why this one:** it was the stated payoff of splitting Select into trigger / option / menu. It reuses `Select Group Label`, the menu chrome and the Select tokens, so this round tests whether that split actually made the next component cheaper.

**Process change (cost):** Rob asked what these rounds cost, so this round skipped the separate throwaway prototype and built the full set directly, verifying by numbers and a screenshot and rebuilding only on failure. Trade-off: it needed two follow-up fixes (below) instead of zero, but avoided re-sending the generator script. Net: fewer tokens on the simple parts, one extra repair pass on the layout-sensitive part. For wrap layouts the prototype is still worth it.

**Source read:** `MultiSelect.jsx` and its doc page. The control is `flex flex-wrap` with removable pills, an input, optional spinner and clear button, and a chevron; the listbox has checkbox options, groups, a loading row and an empty row. There is **no error state** in the React component (Select and TextInput have one), so none was invented in Figma.

**Built** (new `Multi Select` section, 4 components, 38 variants):
- `Multi Select` (27): Size 3 x State 3 (Default, Open, Disabled) x Content 3 (Empty, Few = 2 pills, Many = 6 pills that wrap). 5 properties: Label, Show Label, Placeholder, Show Clear, Show Loading. Wired only where the code can render the state (placeholder on Empty only; clear on non-empty, enabled variants).
- `Multi Select Pill` (1): label, optional icon, remove X; 24px high.
- `Multi Select Option` (6): State x Selected, with a leading checkbox.
- `Multi Select Menu` (4): Options, Grouped, Loading, Empty.
Reused as-is: `Select Group Label`, the token set, elevation 4, the focus-ring construction.

**Where the code's behavior needed a Figma decision**
- Open state = a 1px primary border plus the focus ring (code uses `focus-within`, and focusing opens the menu), not Select's 2px border. Mirrored exactly. A "focused but closed" state exists in code only after Escape; not modeled.
- Disabled = the whole control at 60% opacity (code: `opacity-60`), not individual subtle tokens like Select. Mirrored.
- Heights are minimums: SM with pills is 34px, not 32 (24px pill + padding + border exceeds `min-h-8`), which the Figma control reproduces; Many wraps to 64 / 96 / 102.
- Checkbox radius: the code's `rounded` is Tailwind's default 4px, which is **not on the documented radius scale** (control 8 / card 12 / modal 16 / pill) and Figma's `Radius/XS` is 6px. Code wins: literal 4px, deliberately unbound (the only 6 unbound radii in the audit), logged as a finding.

**Two defects found by looking, both fixed.** (1) Many variants orphaned the clear and chevron buttons on their own left-aligned row. Cause: I'd made input, spinner, clear and chevron separate wrap items. In the browser they share the last row with the input. Fix: group them into a `Tail` frame that wraps as one unit. (2) The first Tail minimum reserved space for the hidden spinner and pushed "Few" onto a second row (66px instead of 40px); resized for what's visible by default. Numeric checks had passed before (1) because no height or binding was wrong; only the screenshot showed the buttons on the wrong side.

**Verified:** 171 paints / 0 unbound in the trigger set; 0 unbound anywhere else; 0 unstyled text; property wiring checked per variant (0 issues); empty-control heights 32 / 40 / 48; descriptions read back with no escaped characters; Light and Dark panels screenshot-checked. Doc page build and the existing MultiSelect tests (4) pass.

**Doc site:** `MultiSelectPage.jsx` documented 7 props; added `defaultValue`, `label`, `placeholder`, `emptyMessage`, `filterFn`, `id`, `className` and sharpened the descriptions (uncontrolled use, clear hidden while loading, disabled opacity, minimum height).

**Findings (accessibility, measured)**
| Item | Ratio | Result |
| --- | --- | --- |
| Pill text (`ink`) on `surface-muted`, light / dark | 16.12 / 9.37 | Pass |
| Pill remove X (`ink-muted`) on `surface-muted`, light / dark | 6.87 / 4.06 | Pass (3:1 non-text) |
| **Unchecked checkbox border** (`line-strong`) on raised, light / dark | **1.47 / 1.94** | **Fails 3:1**: the border is the only thing that marks the box |
| Checked box (primary) on raised; white check on primary | 3.43 (both) | Pass (3:1 non-text) |
| Open border (primary) on raised, light / dark | 3.43 / 4.28 | Pass |
| Control border (`line-strong`) | 1.47 / 1.94 | Fails 3:1 (same token as Rounds 6-7) |
- The `line-strong` token now fails in five places (TextInput, Textarea, Select, Multi Select control, Multi Select checkbox). The "one contrast pass" is no longer a nice-to-have.
- Code inconsistencies (not changed): no error state, 1px open border vs Select's 2px, whole-control 60% opacity vs Select's per-token disabled, 18px chevron off the icon scale. The form family has three different disabled treatments.

**Not done:** Combobox (the only remaining member of the family; shares this menu); a focused-but-closed state; the intrinsic-width quirk (a browser `input` has a ~150px default basis, so pills may wrap earlier in code than in Figma at 320px); Code Connect.

### Round 9: Combobox (2026-10-29)
**Autonomy note:** from this round Rob handed over sequencing ("keep rolling... stop when out of tokens"). Rule I set for myself: pick the next component by dependency and reuse, skip anything that needs a product decision from Rob (the token contrast pass, brand blue), commit after every component.

**Why this one:** last member of the select family; it can reuse `Select Option` and `Select Group Label` outright, so it is the cheapest honest test of the reuse the earlier split promised.

**Built** (new `Combobox` section, 22 variants): `Combobox` control (18): Size 3 x State 3 (Default, Open, Disabled) x Content 2 (Placeholder, Value); 8 properties (Label, Show Label, Placeholder, Value, Show Icon, Icon, Show Clear, Show Loading). `Combobox Menu` (4): Options, Grouped, Loading, Empty, made entirely of `Select Option` and `Select Group Label` instances (the Select family's row style, with the check at the end, unlike Multi Select's checkbox rows). Light and Dark panels.

**Reuse result:** zero new row components, zero new text styles, zero new tokens. The only construction work was the control (a single-line variant of the Multi Select control without pills) and the menu shell. Build was 2 `use_figma` calls plus panels, versus ~6 for Multi Select. This is the case for splitting the Select family by composition.

**Choices:** single fixed-height control (the code's `min-h` never grows because there is nothing to wrap); `clearable` defaults off as in code (Multi Select defaults on); no error state because the React component has none; the typed query and the chosen value look identical, so they are one `Value` content.

**Process:** no throwaway prototype (low layout risk: single row, same construction as Select). It paid off: no repair pass needed. Verified 78 paints / 0 unbound, 36 text layers / 0 unstyled, 0 unbound radii, property wiring 0 issues, heights 32 / 40 / 48, descriptions clean, Light and Dark screenshots reviewed.

**Doc site:** `ComboboxPage.jsx` documented 8 props; added `defaultValue`, `label`, `placeholder`, `disabled`, `id`, `className`.

**Findings:** no new contrast failures (same tokens as Rounds 6-8; the control border again fails 3:1). Code inconsistency: `clearable` defaults to true in MultiSelect and false in Combobox; and the whole select family now has one component (Select) with an error state and two without.

**Not done:** error state (absent in code); Code Connect.

### Round 10: Chip + Warning tokens (2026-10-29)
**Why this one:** chosen by gap analysis. Compared the code's component list with the Figma component sets: missing are Accordion, Avatar, Banner, ButtonGroup, Chip, CommandPalette, DataTable, DatePicker, Divider, Drawer, EmptyState, Field, FileUpload, Link, List, Logo, Menu, Modal, NumberInput, Popover, SegmentedControl, Skeleton, Slider, Spinner, StatCard, Stepper, Toast. Chip first: small, high fan-out (tags, filters, tables, Multi Select's pill is its cousin), and it forces a token gap into the open.

**Foundations first: Warning was missing.** The code has a `warning` brand role (amber `#d97706` / `#f59e0b` / `#b45309` / `#fcd34d`) but Figma's Brand collection had only Primary, Secondary, Destructive and Positive. Added `Warning/Default|Hover|Pressed|Disabled` (4 variables, scopes copied from the Destructive set). Code syntax is not set on any Brand variable (the collection predates a code-syntax pass), so the new ones match. Added 2 text styles: `Chip / SM` (Medium 12/16) and `Chip / MD` (Medium 14/20); Large reuses `Field / Label MD` (Medium 16/24).

**Built** (new `Chip` section, 50 variants): `Chip` (30): Size 3 x Color 5 (Neutral, Primary, Positive, Warning, Destructive) x Selected 2; properties Label, Show Icon, Icon (swap), Show Remove. `Chip State` (20): State (Focus, Disabled) x Color 5 x Selected 2 at MD only. Reason for the split: adding State to the main set would be 90 variants, over the 30 guideline; focus ring and 50% opacity behave identically at every size, so one size documents them. Sizes verified: 22 / 30 / 38px, matching the CSS box model. Unselected colored chips use the brand token at 15% fill and 30% border opacity, exactly as `bg-primary/15 border-primary/30`.

**Known deviation:** the remove X sits about 2px further from the edge than in code (the code uses `-mr-1`; Figma auto layout has no negative margin). Documented in the description.

**Three defects, all caught by looking or by distrusting a check**
1. **Paint opacity silently reset.** First pass set `opacity` on a paint, bound the color variable, assigned it: stored opacity was 1, so every tinted chip rendered solid with a same-colored label (invisible text). A scratch rectangle isolated the cause (opacity set before bind+assign is dropped; clone the paint array, set opacity, reassign works). Fixed on 20 variants.
2. **A verification false alarm.** My post-fix check flagged all 20 as failed because Figma stores paint opacity as a 32-bit float (0.15 comes back as 0.15000000596). Strict equality was the bug. Lesson: compare with a tolerance, and read the actual value before concluding the fix didn't work.
3. **Stale instances.** The component fix did not reach the 26 panel instances created before it (they kept opacity 1). Re-applied the main component's paints to them. Screenshotting the component set itself, not the panel, is what separated "component wrong" from "instances stale".

**Verified:** 160 paints / 0 unbound, 50 text layers / 0 unstyled, 0 unbound radii, property wiring 0 issues, tint opacities correct on all 20 tinted variants, descriptions clean, Light and Dark panels screenshot-checked after the fixes.

**Findings (accessibility, measured). This is the largest contrast failure so far.**
| Chip variant | Light | Dark | Result |
| --- | --- | --- | --- |
| Tinted Primary (text `primary` on `primary/15`) | 2.81 | 4.23 | **Fails AA both modes** |
| Tinted Positive | 2.68 | 4.43 | **Fails AA both** |
| Tinted Warning | 2.60 | 4.64 | Light fails, dark passes |
| Tinted Destructive | 3.66 | 3.35 | **Fails AA both** |
| Selected: white on Primary | 3.43 | 3.43 | **Fails AA** |
| Selected: white on Positive | 3.30 | 3.30 | **Fails AA** |
| Selected: white on Warning | 3.19 | 3.19 | **Fails AA** |
| Selected: white on Destructive | 4.83 | 4.83 | Passes |
| Neutral and neutral selected | 17.7 / 16.1 | | Pass |
- These are 12-16px medium-weight labels, so the 4.5:1 normal-text threshold applies. 7 of 8 colored variants fail in at least one mode. It's the same root cause as the primary button (white on `#588ae0` = 3.43:1) and the same tokens (`positive`, `warning`) will recur in Badge, Alert and Toast. Strongest argument yet for the single token contrast pass, which needs Rob's decision on the brand colors; I haven't made it.
- Code finding: chip hover uses `bg-black/10 dark:hover:bg-white/20`, a raw color and a Tailwind `dark:` variant in a codebase that otherwise uses semantic tokens for dark mode.

**Not done:** hover/pressed (code has no distinct chip pressed style); Code Connect; doc page needs only a `className` row.

### Round 11: Avatar (2026-10-29)
**Why this one:** next on the gap list and a dependency of menus, tables, comments and the Top Bar. Small API, but the status dot forced a composition decision.

**Built** (new `Avatar` section, 40 variants): `Avatar` (20): Size 5 (XS 24, SM 32, MD 40, LG 56, XL 80) x Shape 2 (Circle, Square) x Content 2 (Initials, Icon). `Avatar Status` (20): Size 5 x Status 4 (Online, Away, Busy, Offline), dot sizes 6 / 8 / 10 / 12 / 16 with a 2px outside ring in the raised surface color (the code's `ring-2 ring-surface-raised`). Properties: Initials (TEXT), Show Status (BOOLEAN) and the nested dot's own Status property **exposed** on the avatar (`isExposedInstance`), so a designer picks Online / Away / Busy / Offline from the avatar's panel. One new text style, `Avatar / XL` (Medium 24/32); the other four sizes reuse existing Medium styles (`Chip / SM`, `Chip / MD`, `Field / Label MD`, `Field / Label LG`), same sizes and weights, only the names are borrowed.

**Decision: why the dot is its own set.** Folding Status (5 values) into Avatar would be 5 x 2 x 2 x 5 = 100 variants. A nested, exposed instance keeps Avatar at 20 and gives the dot one source of truth. This is the first use of exposed nested instances in the file.

**Not modeled (and why):** photo avatars (the React component swaps the initials for an `img`; a variant with a fake photo would be misleading, so the description says to fill the Surface layer with an image); `AvatarGroup` (overlapping cluster with a +N chip; reasonable next small component).

**Process:** built directly (no throwaway prototype), screenshot-checked once per mode. No defects this round; the first-pass build was clean. Verified: 120 paints / 0 unbound, 10 text layers / 0 unstyled, 0 unbound radii, property wiring and exposed-instance flag on all 20, descriptions clean. The Avatar doc page already covered every prop and AvatarGroup, so no page change.

**Findings (accessibility, measured)**
| Item | Light | Dark | Result |
| --- | --- | --- | --- |
| Initials / icon (`ink-muted`) on `surface-muted` | 6.87 | 4.06 | Dark fails 4.5 for XS to LG text (XL is 24px, large-text 3:1, passes) |
| Offline dot (`ink-subtle`) vs raised ring | 2.54 | 3.04 | Light fails the 3:1 non-text minimum |
| Online / away dots vs ring | 3.30 / 3.19 | | Pass 3:1 narrowly |
- Code finding: status is conveyed by color only (the dot is a bare `span` with an `aria-label` but no role, which most screen readers ignore); sighted users with color-vision differences get no non-color cue (no icon, shape or text). Worth a shape or label treatment.

**Not done:** AvatarGroup; photo variant; Code Connect.

## Running tally

| Metric | Value |
| --- | --- |
| Components audited | inventory-level only (~17 present / ~27 missing of ~44) |
| Components built in Figma | 15 UI components / 7 families (IconButton 126 variants, Textarea 24, TextInput 24, Select 30 + Option 6 + Group Label 1 + Menu 4, Multi Select 27 + Pill 1 + Option 6 + Menu 4, Combobox 18 + Menu 4, Chip 30 + Chip State 20, Avatar 20 + Avatar Status 20) + 200 Lucide icon components |
| Components retired | 2 (legacy `Text` and `Dropdown` sets: migrated, deprecated, then deleted with a zero-reference guard) |
| Doc pages updated | 4 (TextInput, Select, MultiSelect, Combobox) |
| Token/contrast issues found | 5 failing pairs (see Round 1) + invisible dark-mode elevation + counter text (Round 5) + default field border 1.47 / 1.94 (Round 6) + group heading 2.54 / 3.04 and dark search placeholder 4.06 (Round 7) + unchecked checkbox border 1.47 / 1.94 (Round 8) |
| Self-corrections | 10 (Chip: paint opacity reset, false-alarm verification, stale instances; earlier: IconButton stroke scaling, escaped descriptions, Textarea padding double-counting stroke, "Dropdown nests Text" mis-attribution, review-panel row clipping, Multi Select orphaned buttons, Multi Select tail minimum) |
| Figma variables added | 42 (11 Cool Gray primitives + 11 Theme tokens x Light/Dark + 16 Brand + 4 Brand Warning) |
| Figma styles added | 5 effect styles (Elevation / 1-5) + 10 text styles (Field / Text SM, Text LG, Label SM / MD / LG, Message, Counter, Group Label; Chip / SM, MD) |

## Story notes (for the final write-up)

_Candidate narrative beats, captured as they surface._

- Code outgrew Figma: the codebase went from ~17 to ~44 components (plus dark mode and 12 foundations) while Figma stayed at the original set. Classic design-system drift, in the direction people don't usually expect (code ahead of design).
- "Same system" wasn't: both sides call it "gray" and both are neutral ramps, but one is warm and one is cool. The mismatch only showed up when comparing values, not names. Good illustration of why code-to-Figma sync needs value-level checks.
- Building one component surfaced three things an audit couldn't: a likely color bug in the code (`secondary.disabled`), a rendering trap (shadow rings that exist in the data but don't draw), and the Figma default-variant rule (top-left wins). Pixel-level checks beat trusting the property panel.
- "Prototype 10% first" paid for itself: two of the three bugs were found on 12 variants instead of 126.
- Generating the icon library from the code's own package (instead of hand-picking from a plugin) makes Figma-to-code parity a property of the pipeline, not of anyone's diligence, and it's re-runnable. The script, not the clicking, is the deliverable.
- Two honest self-corrections in one round (stroke scaling in IconButton, escaped descriptions in IconButton): checking my own earlier "verified" work is part of the process, not an embarrassment.
- Variable *modes* can hide in the component being swapped. The migration's worst bug (two alert icons turning gray) came from state the icon carried that wasn't in its fills at all. A swap that "preserves everything you can see in the property panel" still lost it. Structural checks said clean; only a before/after look caught it.
- The prototype-first habit caught a bug in the previous round's "verified" component. A new build exposed an old defect because it measured something the old checks never did (child offsets, not box heights). Good argument for building the second member of a family before declaring the first one done.
- A deprecated component with live dependents is a different thing from a deleted one. Renaming to "(deprecated)" plus a description is a reversible, honest intermediate state; the dependency (Dropdown) tells you the real sequencing of the roadmap.
- Doc drift runs both ways: Figma was behind code, and the doc site was also behind code (icon default, 12 undocumented props). A sync pass that only looks at Figma misses it.
- Components have dependency order, and the code's own structure tells you where to cut. The Select was one React file but four Figma things (trigger, option, group label, menu); the decision to split was driven by the variant cap *and* by the fact that a menu is made of options. Modeling it as the code is composed, not as the code is filed, is what makes the Figma library reusable for MultiSelect and Combobox.
- Where Figma can't express a code behavior (radius bound to a boolean, absolute positioning in auto layout, rotation), the honest options are: model it differently and say so, or leave it out and say so. Both times this round the choice and its reason went in the log and the component description, so a designer reading Figma gets the same caveat as an engineer reading the code.
- Reading the code closely for the design file surfaces product inconsistencies as a side effect: Select's label style differs from TextInput's, and a disabled Select with a value doesn't look disabled. A design-system audit and a code review turn out to be the same activity from different ends.
- The audit surfaced real accessibility debt in the token layer, not just missing components: the primary button's white-on-blue label is 3.43:1, and the hover state is worse (1.96:1). Better to fix at the token level before building 27 more components on top.
