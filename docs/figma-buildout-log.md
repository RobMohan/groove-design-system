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

**Scope decision (mine, flagged):** the matrix is Size x State x Content, the same 24 variants as Textarea, because that is the family's shared API. `addonBefore` and `addonAfter` are **not** modeled. They change the field's corner rounding, and Figma can't bind radius to a boolean property, so modeling them means a fourth variant axis (96 variants, over the 30-variant guideline) or a separate Input Group component. Recommendation: build the group as its own component later (done in Round 32: the `Input Group` set). `type` is documented only (no visual difference).

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

**Correction (Round 17):** the paint-opacity tint described above looked right on the main components and my panels, but fresh instances rendered solid (instances do not inherit opacity from a variable-bound paint). The "stale instances" explanation in defect 3 was wrong. Chip and Chip State were rebuilt at layer level in Round 17.

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

### Round 12: Divider (2026-10-29)
**Why this one:** smallest remaining primitive; used inside menus, cards, forms and the sidebar. Also a good test of a build with no prototype and no repair pass.

**Built** (new `Divider` section, 10 variants): Orientation x Style x Label: horizontal Solid and Dashed, each with Label None, Center, Left, Right (8), plus vertical Solid and Dashed (2), matching the code (the label exists only on horizontal dividers). One property, `Label` (TEXT). The rule is a 1px frame with only the top (or left) stroke weight set, bound to the `Line/Default` token, `strokeAlign` inside, and a 4/4 dash pattern for Dashed. The label reuses `Chip / MD` (Medium 14/20, same as the code's `text-sm font-medium`), `Ink/Muted`, 12px gaps. Horizontal dividers are fill-width; the vertical one stretches with its row (as in code, resize the instance).

**Process:** built component and both review panels in one call; screenshot-checked each mode once. No defects. Verified by construction (every paint is a bound variable, the label has a text style, no radii) and visually; the Divider doc page already covers all four props, so no page change.

**Findings:** none new. The rule uses `line` on the page (about 1.2:1), which WCAG treats as decorative, so 3:1 doesn't apply. The vertical divider's `min-h-[1em]` isn't expressible in Figma and is described instead.

**Not done:** Code Connect.

### Round 13: Spinner (2026-10-29)
**Why this one:** the last primitive in the "small and widely depended on" batch (Button loading, Select/Combobox spinners, Toast, Modal). Reuses the Lucide `loader-2` component already in the library, so it stays in step with the icon pipeline.

**Built** (new `Spinner` section, 20 variants): Size 4 (SM 16, MD 24, LG 40, XL 56) x Color 5 (Primary, Secondary, Positive, Destructive, Neutral). Properties `Label` (TEXT) and `Show Label` (BOOLEAN, off by default as the label is optional in code). The glyph is an instance of `lucide/loader-2` scaled with `rescale` so stroke scales with size like the code's `size` prop; strokes are bound to the brand variables (Neutral uses `Ink/Muted`, so it follows the theme mode). Label reuses `Field / Message` at 8px gap.

**Limitation recorded in the description:** the code spins the glyph with a CSS animation (`animate-spin`); a static component can't show motion, so the description points to a prototype rotate animation. Also the `role="status"` and the always-present screen-reader "Loading" text are code behavior with no Figma equivalent.

**Process:** component and both panels in one call; one screenshot per mode; no defects; no repair pass. The Spinner doc page already covers `size` (including the number form), `color`, `label` and `className`, so no page change.

**Findings (accessibility, measured; 3:1 non-text, spinner against page)**
| Color | Light | Dark |
| --- | --- | --- |
| Primary | 3.28 | 5.18 |
| Secondary | 5.45 | 3.11 |
| Positive | 3.15 | 5.38 |
| Destructive | 4.62 | 3.67 |
| Neutral (theme-aware `ink-muted`) | 7.23 | 6.99 |
All pass, narrowly for positive (light) and secondary (dark). The label text is `ink-muted` on the page and passes.

### Round 14: Modal (2026-10-29)
**Why this one:** the first full composition. It stacks tokens, a text style, an elevation style, the close icon and the existing Button instances, so it is a real test of whether the foundation layers hold together.

**Built** (new `Modal` section, 4 variants plus 2 scenes): `Modal` set, Size SM / MD / LG / XL = the code's max widths 384 / 512 / 672 / 896. 7 properties: Title, Show Title, Show Close, Description, Show Description, Body, Show Footer. Structure: header (title and close, 20px padding, 1px bottom divider), body (description and content, 16px gap), footer (Cancel and Confirm Button instances, 12px gap, 1px top divider). Raised surface, `Radius/L` (16), `Elevation / 5`. New text style `Modal / Title` (Semi Bold 18/28). Two review scenes (Light and Dark) show the dialog centered on a page with the code's backdrop (black at 50% opacity), because the backdrop is page-sized and belongs to a scene, not the component.

**Honest scope notes:** `size="full"` (95% of the viewport) is not drawn (it depends on the viewport); the close button sits about 4px lower and further right in code than in Figma because of negative margins; focus trap, Escape and scroll lock have no visual form; the backdrop's raw `black/50` is a hard-coded color in the code and the scene, not a token (it is theme-independent on purpose).

**Dependency finding (important): Figma's Button is out of date.** The footer needed an outline or ghost button for Cancel, but the existing Figma `Button` set has only Primary, Secondary (purple), Destructive, Positive and Link, three states, one size, 4px radius and no Outline, Ghost, Focus, Disabled or Loading variants, versus the code's 7 variants x 3 sizes x 6 states. The footer uses Secondary (purple) as a stand-in and says so. Rebuilding Button on the IconButton matrix (126 variants) is the highest-value next round, but it needs a migration of every existing Button instance in Cards, Tables and App Compositions, so it is a deliberate round rather than a drive-by.

**Process:** component and both scenes in one call, screenshot-checked the Light scene and the set; no defects, no repair pass. Verified by construction (all paints bound except the intentional backdrop, all text styled, radius bound) and visually.

**Doc site:** `ModalPage.jsx` was missing `description` (a real prop with `aria-describedby` wiring) and the `full` size; added both and sharpened `title` and `size`.

**Findings (accessibility)**
- Close icon (`ink-muted` on raised): 7.56 light / 5.78 dark. Description text: same pair. Pass.
- The dialog has no border, so on a light page behind a 50% black scrim its edge relies on contrast between the raised surface and the dimmed page (about 7:1 in light mode scene). Fine. In dark the scrim over a near-black page leaves the dialog edge readable but low-contrast; the dark elevation is invisible (Round 2 finding).
- Code: the close button's focus ring uses `ring-offset-2` against the dialog surface; fine. No findings in the markup (role, aria-modal, labelledby and describedby are all present).

**Not done:** `full` size; Code Connect.

### Round 15: Button rebuild + migration (2026-10-29)
**Why this one:** flagged in Round 14 as the highest-value gap. The most-used component in the system was the most out of date in Figma: 5 types (no Outline, Ghost), 3 states, one size, 4px radius vs the code's 8px, no Focus, Disabled or Loading, raw colors. Everything that composed Buttons inherited the drift.

**Scoped as a migration, not a drive-by.** Counted dependents first (13 instances: 1 in a Card, 12 in my own Modal footers, plus 1 in the Playground), then built, then swapped with a guard, then recounted on every page.

**Built** (new `Button` section, 126 variants): Variant 7 (Primary, Outline, Secondary, Destructive, Positive, Ghost, Link) x Size 3 (SM 36px, MD 44px, LG 52px) x State 6 (Default, Hover, Pressed, Focus, Disabled, Loading); same matrix and naming as IconButton. 5 properties: Label, Show Leading Icon, Leading Icon (swap), Show Trailing Icon, Trailing Icon (swap). Radius is `Radius/S` (8px, the code's `rounded-lg`), every fill, stroke and text color is a bound variable (Brand roles, Theme tokens), focus ring is the same absolute stroke layer as IconButton, Link hover and pressed underline the label (correction, Round 18: that underline never actually rendered when first built; it was fixed with dedicated underline text styles). Loading follows the code: spinner replaces the icon and the *disabled* colors apply (`isDisabled = disabled || loading`). New text style `Button / LG` (Medium 18/28); SM and MD reuse `Chip / MD` and `Field / Label MD`. Trailing icon is wired on Loading variants so a designer can still add one, though in code loading hides both icons (noted as a minor looseness).

**Mirrored code behavior worth knowing:** the 2px outline border makes Outline buttons 4px taller than every other variant at each size (48 vs 44 at MD), because the code adds `border-2` without compensating padding. Same class of issue as the Textarea focus shift (Round 5). Pressed matches Hover for Outline, Ghost and Link (no `active:` style in code). Disabled Outline gets a muted fill; disabled Ghost and Link only change the text color.

**Migration:** 9 instances on Components (1 Card + 8 Modal footers) and 1 on the Playground swapped to the new set, mapping Cancel from Secondary (a purple stand-in) to Outline, Confirm to Primary; labels and the icon toggle preserved; guarded (skips instances nested inside other instances because they inherit from their main component). Recount after: 0 references on Foundations, Components and Playground. The legacy set is renamed `Button (deprecated)` with a description. **Not deleted**: it's now unreferenced, but the earlier deletion go-ahead was for two specific sets, so this one waits for Rob's OK. Modal's footer now reads correctly (Outline Cancel, Primary Confirm).

**Process:** one 126-variant build call (no prototype; the construction is IconButton's, already proven), migration in 3 calls, panels in 1; screenshot-checked both modes. No defects. Verified: 261 paints / 0 unbound, 126 text layers / 0 unstyled, 0 unbound radii, property wiring 0 issues, 21 focus rings (7 variants x 3 sizes), all Loading variants show the spinner, descriptions clean.

**Doc site:** `ButtonPage.jsx` had no mention of `loading` or `fullWidth` (both real props). Added both to the props table and a "Loading & Full Width" section with live examples.

**Findings (accessibility, measured): white label on the solid fills**
| Variant | Default | Hover | Pressed |
| --- | --- | --- | --- |
| Primary | **3.43** | **1.96** | 7.78 |
| Secondary | 5.70 | 5.38 | 8.72 |
| Destructive | 4.83 | **3.76** | 8.31 |
| Positive | **3.30** | **2.28** | 5.02 |
- 6 of 12 default/hover cells fail AA for the 14-18px medium labels. Hover is *worse* than default for Primary, Positive and Destructive (the hover token is a lighter shade, so white text loses contrast just as the user targets the button). Disabled states are exempt. This is the Round 1 finding at full scale: it affects every primary action in the product, and it's the same root cause as Chip (Round 10). The fix is a token decision (darken Primary and Positive, or switch their labels to dark ink, and re-pick the hover shades), which I still haven't made without Rob.
- Link text (`primary` on the page): 3.28 light / 5.18 dark, so light mode fails AA.
- Outline border (`line-strong`): 1.47 / 1.94, same 3:1 failure as the fields.
- Code: `secondary.disabled` is still `#DDE4BA` (a pale yellow-green, apparently a copy mistake next to `#B5AAC8` and the others).

**Not done:** deleting `Button (deprecated)` (needs Rob's OK); `Pagination Button` is a separate legacy set, left as is; Code Connect.

### Round 16: Toast (2026-10-29)
**Why this one:** next on the gap list, a pure composition of existing parts (icons, tokens, elevation, text styles) and the visual counterpart of Alert.

**Built** (new `Toast` section, 4 variants): `Toast` set, Variant = Info, Success, Warning, Error (accent icon and color: primary, positive, warning, destructive; glyphs Info, CheckCircle, AlertTriangle, AlertCircle). 6 properties: Title, Show Title, Description, Show Description, Action, Show Action. 320px wide (`w-80`), 16px padding plus the 1px border, 12px gap, `Radius/S`, `Elevation / 4`, line border. The icon, title, description and action rows reproduce the code's spacing exactly using wrapper frames (2px under the title, 8px above the action) so hiding the title also removes its 2px, as the code does. One new text style, `Toast / Action` (Semi Bold 14/20); title reuses `Body / Bold`, description `Field / Message`. Light and Dark panels.

**Honest scope notes:** the six placements, the 12px stack gap, 4s auto-dismiss with pause on hover, and the alert-versus-status role belong to `ToastProvider`, not to one toast, so they are described, not drawn.

**Process:** component and panels in one call; one screenshot per mode; no defects, no repair pass. Construction-time checks: all paints variable-bound, all text styled, radius bound, 6 properties wired.

**Doc site:** `ToastPage.jsx` documented four options but not `action`; added it, and noted the pause-on-hover behavior on `duration`.

**Findings (accessibility, measured)**
| Item | Light | Dark | Result |
| --- | --- | --- | --- |
| **Action link** (`primary`, 14px semibold) on raised | **3.43** | **4.28** | **Fails AA both modes** |
| Info icon (primary) vs raised | 3.43 | 4.28 | Pass (3:1 non-text) |
| Success icon (positive) | 3.30 | 4.45 | Pass |
| Warning icon | 3.19 | 4.61 | Pass (narrow) |
| Error icon (destructive) | 4.83 | **3.04** | Pass (narrow in dark) |
| Description (`ink-muted`) | 7.56 | 5.78 | Pass |
- The action link is the same primary-on-surface failure as the Link button (Round 15), a third instance of one token problem.
- Code finding: the toast is color-coded by icon and glyph only; the variant name is never in the accessible text, but `role=alert/status` is set, so screen readers get the message. The dismiss button has an `aria-label`. Good.

**Not done:** Code Connect.

### Round 17: Banner, and a repair to Round 10's Chip (2026-10-29)
**Why this one:** Banner is the page-level sibling of Alert and Toast, and it reuses the tint technique from Chip plus the rebuilt Button as its action slot.

**Built** (new `Banner` section, 4 variants): `Banner` set, Tone = Info, Positive, Warning, Destructive; 5 properties (Title, Show Title, Description, Show Actions, Show Dismiss). Full-width band (960px in the set, resize the instance), 16 / 12px padding, 12px gap, a 10% tint with a 30% top and bottom border only (no side borders: it runs edge to edge), tone icon at 20px, dismiss at 18px, and an Actions slot holding small Outline and Primary Button instances (from Round 15). Title reuses `Body / Bold`, description `Field / Message`. Light and Dark panels.

**The big finding of the session, found while building Banner:** my tint-by-paint-opacity technique, used in Round 10 for Chip, is broken for anyone using the library. A paint that is bound to a color variable and has partial opacity renders and reads correctly on the *main component*, but **every instance of it comes out at opacity 1**, so fresh instances of the tinted Chip variants (and of the Banner I had just built the same way) rendered as solid color with an unreadable same-colored label. Round 10 only looked right in the set itself and in panels that I had patched by hand. A fresh-instance test (create an instance, read the paint, screenshot it) proved it. Previous "fixes" had only treated the symptom on the specific panel instances I'd made, and I'd described the cause as stale instances; that was wrong. The actual cause is that instances don't inherit variable-bound paint opacity at all.
**Fix, applied to Chip (12 variants), Chip State (8) and Banner (4):** move the transparency to layer level. Each tinted variant now has a `Tint` rectangle (fill bound to the brand variable, layer opacity 15% for Chip, 10% for Banner) and a `Border` rectangle (stroke bound to the same variable, layer opacity 30%), absolute, stretched to the variant, rounded where needed, behind the content; the root has no fill or stroke. Layer opacity is inherited by instances. This also keeps one source for each color (no duplicated alpha tokens). Verified on fresh instances (opacity 0.15 / 0.3 on Chip, 0.1 / 0.3 on Banner, no root fill), and by screenshot. Cleared the stale paint overrides I had applied to 26 panel instances.
- Two more mistakes en route, both mine: the first repair script read the stroke weight as `figma.mixed` and threw after creating stray layers (I added cleanup), and its Chip pass copied opacity 1 into the new layers for reasons I did not fully establish (a read of the old paint at conversion time), so I set the known specs (15% and 30%) explicitly and re-verified on fresh instances. Lesson: the only trustworthy test of a component is a fresh instance, rendered.
- Audit gap: Round 10's audit read `opacity` on the main component, which was correct, so it passed. A component audit that never instantiates the component cannot see instance-inheritance bugs.

**Process note:** component and panels in one call, then the repair in four calls. The review panels are what exposed it (the Banner was solid in the first screenshot), which argues for always building panels from instances in the same call as the component.

**Doc site:** the Banner page already covers all props; no change.

**Findings (accessibility, measured; text and icons on the 10% tinted band)**
| Tone | Description text light / dark | Icon light / dark |
| --- | --- | --- |
| Info | 6.54 / 6.17 | **2.97** / 4.57 |
| Positive | 6.48 / 6.19 | **2.82** / 4.77 |
| Warning | 6.52 / 6.21 | **2.75** / 4.95 |
| Destructive | 6.21 / 6.63 | 3.97 / 3.49 |
- Text passes everywhere. Status icons fail the 3:1 non-text minimum in light mode for three tones (the title text carries the meaning, so impact is modest, but the icon is the only color-independent tone cue).
- Code: no dark-mode problem (the same brand colors work on both), and the role and aria-live split between destructive (alert) and others (status) is sound.

**Not done:** the `icon` prop's custom glyph is described, not drawn; Code Connect.

### Round 18: Link, and an underline regression found and fixed (2026-10-29)
**Why this one:** next small primitive; also the place where Button's "Link" variant (Round 15) needed its hover underline to work.

**Built** (new `Link` section, 24 variants): `Link` (18): Variant 3 (Default, Subtle, Quiet) x Underline 3 (Hover, Always, None) x State 2 (Default, Hover); `Link State` (6): Focus and Disabled x Variant 3 (kept separate to stay under the 30-variant guideline: 36 otherwise). Properties on both: Label, Show External Icon (14px external-link glyph). Colors follow the code: Default is primary (hover `Primary/Hover`), Subtle is ink (hover primary), Quiet is muted (hover ink). Focus ring is the 2px focus stroke with a 2px gap and a literal 6px radius (the code's `rounded-sm` plus the ring offset has no radius token); Disabled is 50% node opacity, which instances do inherit.

**The incident (a defect I introduced into already-shipped work, caught by a render, not by a check).** Link needed underlines on specific labels. Setting `textDecoration` after applying a text style did not stick (reads stayed NONE), so I used `setRangeTextDecoration` on the intended nodes, and verified by reading `textDecoration` on those nodes. Reading everything else afterward showed **147 labels underlined**: every Button variant label (126) plus Link and field labels sharing the three Medium styles, even though the text styles themselves read NONE. Panel screenshots at that moment still looked fine because panel instances had not refreshed; a **fresh instance** rendered underlined everywhere. So for a moment, every Button, Link and field label in the library would have shipped underlined.
- Recovery: reset all 147 underlined text nodes to NONE (verified 0 remain, styles all NONE), then implemented the underline the way Figma wants it: three dedicated text styles (`Underline / Label MD`, `Underline / Chip MD`, `Underline / Button LG`, same metrics with an underline) applied to the intended layers only (9 Link labels, 6 Button Link hover/pressed labels). Verified by node reads (0 mismatches on both sets) and by screenshots of the Link panel and the Button panel: Link hover and "Always" are underlined, Button Link hover and pressed are underlined, nothing else.
- This also fixes a latent Round 15 bug: the Button Link hover and pressed underline had never actually rendered (the same non-sticking assignment). The Round 15 entry said it did; it didn't until now.
- Lessons: (1) never set text decoration per layer on a styled text node: Figma propagates it to every node sharing the style, in a way the style object's own reads don't show; use a dedicated style per decoration. (2) Verify with a fresh render, and re-read the *neighbors* of anything you touch on a shared style. (3) A panel screenshot made of older instances can lag a component change; trust fresh instances.

**Doc site:** `LinkPage.jsx` covers `variant`, `underline`, `external`, `disabled`, `as` and `href`; no change.

**Findings (accessibility)**
- Default Link hover color (`primary-hover`, `#a3b9ed`) on a light page is about 1.9:1, so a hovered default link nearly disappears (the same shade that makes the Primary button's hover label fail in Round 15). On dark it reads fine (about 9:1).
- Default link text (`primary`, 16px medium) on a light page: 3.28:1, fails AA; dark 5.18 passes. Underline "hover" means the color alone separates links from body text at rest: contrast with surrounding text is not met, and WCAG 1.4.1 requires more than color for in-text links.
- Code: the Link's `rounded-sm` focus ring has no token, and its ring offset sits on a text-height box (tight but acceptable).

**Not done:** `as` (router component) has no visual form; Code Connect.

### Round 19: Menu (2026-10-29)
**Why this one:** next composition on the gap list; consumes the Button (as a trigger) and Elevation 4, and is the pattern behind the Popover and Select menus.

**Built** (new `Menu` section, 8 pieces): `Menu Item` (6): State 3 (Default, Active, Disabled) x Danger 2; properties Label, Show Icon, Icon (swap); 36px rows with a 16px icon and 10px gap. `Menu Divider` (1px line, 4px above and below). `Menu` (assembled: Edit, Duplicate (active), Archive (disabled), a divider, Delete (danger)), 192px min width, raised surface, line border, `Radius/S`, `Elevation / 4`. Light and Dark panels showing the trigger with the menu 8px below (the code's offset) and every item state. New token: **`Destructive/Tint 10`** (a Brand variable with real alpha 0.10) for the danger hover row.

**Defect found by rendering, not by any check (the third of this session):** the Active rows' hover fills drew one row *above* their owner, so the first menu row appeared as a blank gray bar with its label hidden, and the danger tint landed on the wrong row. The layer-level opacity approach from Round 17 (an absolutely positioned `Hover Fill` rectangle) renders correctly in horizontal rows (Chip) and single bands (Banner) but, inside auto-layout *instances stacked in a vertical list*, the screenshot placed it a row too high. Reads of the geometry said x=0, y=0, so the numbers were right and the renderer disagreed. Isolated with a four-item stack in a temp frame. Fix: no absolute layers for rows. The Active row's own fill is `Surface/Muted`, and for danger it is the new alpha variable. A variable's alpha is part of its color value, so instances inherit it; verified on a fresh stacked test, then on both panels.
- Revised guidance from Rounds 10-19, for the write-up: tints via **paint opacity** fail on instances; tints via **absolute layers** are fragile in stacked lists; **variables with alpha** are the one robust approach (and the most token-like). Round 10's Chip and Round 17's Banner still use layers (verified correct on fresh instances in their own contexts), but alpha tint variables are what I'd use for anything stacked, and a candidate cleanup is to move Chip and Banner onto them too.

**Process:** built the whole thing in one call plus 4 repair calls; the render-based verification caught what the numeric audit passed (bindings 0 unbound, all text styled, radius bound).

**Doc site:** `MenuPage.jsx` already covers `trigger`, `items` (with `icon`, `danger`, `disabled`, `divider`), `align` and `className`; no change.

**Findings (accessibility, measured)**
| Item | Light | Dark | Result |
| --- | --- | --- | --- |
| Item text on muted hover | 16.12 | 9.37 | Pass |
| **Danger text on raised** | 4.83 | **3.04** | **Dark fails AA** |
| **Danger text on the 10% tint (hover)** | **4.13** | **2.89** | **Fails AA both modes** |
- Same root cause as the destructive text elsewhere (dark error text in Round 5, destructive icon on dark in Round 7): the destructive token is not tuned for dark mode.
- Code: `danger` is conveyed by color only (no icon, no label), which fails 1.4.1 for users who can't distinguish the red.

**Not done:** align and viewport flipping (behavior); Code Connect.

### Round 20: Segmented Control (2026-10-29)
**Why this one:** a common selection control (view switchers, date ranges) and a clean test of the nested, exposed-instance pattern from Avatar (Round 11) applied to a repeated child.

**Built** (new `Segmented Control` section, 33 variants): `Segment` (15): Size 3 x State 5 (Default, Hover, Selected, Focus, Disabled); properties Label, Show Icon, Icon (swap). `Segmented Control` (18): Size 3 x Segments 3 (2, 3, 4) x State 2 (Default, Disabled). Every nested Segment is exposed, so a designer picks which segment is selected, edits labels and adds icons from the control itself (the first segment is Selected by default). Heights match the CSS box model: 38 / 50 / 58px (segment height plus track padding plus the 1px border). Track = muted surface, line border, `Radius/S`; Selected segment = raised surface with `Elevation / 1` (the code's indicator shadow). Reuses `Chip / MD`, `Field / Label MD` and `Button / LG` for the three label sizes (all Medium, matching `font-medium`). Disabled is 60% node opacity on the whole control, as in code.

**What the code does that Figma doesn't show:** the indicator *slides* under the selected segment (200ms ease-out); in Figma the raised pill is simply part of the Selected segment. Arrow-key radio-group behavior and `fullWidth` (segments share the width) are described, not drawn.

**Process:** built both sets and both panels in one call; verified heights numerically and Light and Dark by screenshot. No defects, and no repair pass: this is the first round since Round 15 with none. It used only constructs already proven in this file (root fills, node-level opacity, effect styles, absolute focus ring in a horizontal frame, exposed nested instances). Bindings are by construction (every paint a bound variable, every text a style, radii bound).

**Doc site:** `SegmentedControlPage.jsx` already covers `options`, `value`, `defaultValue`, `onChange`, `size`, `fullWidth`, `disabled`, `aria-label` and icons; no change.

**Findings (accessibility, measured)**
- Unselected segment labels (`ink-muted` on the muted track): 6.87 light / **4.06 dark**: fails AA in dark mode (same pair as Avatar initials and the Select search placeholder: `ink-muted` on `surface-muted`). Selected label (`ink` on raised): 17.7 / 11.7. Disabled labels are exempt.
- Track border (`line`) is decorative here; the raised selected segment is the state indicator, and it relies on a light-versus-muted fill difference (about 1.1:1 in light mode) plus a shadow that is invisible in dark mode (Round 2 finding). Selected state is therefore weakly indicated for low-vision users in both modes; consider a border or heavier weight on the selected segment.

**Not done:** the sliding animation; Code Connect.

### Round 21: Skeleton (2026-10-29)
**Why this one:** the simplest remaining component, and a dependency of every loading state in cards, tables and lists. A deliberate low-risk round after two long repair cycles.

**Built** (new `Skeleton` section, 6 variants): `Skeleton` (3): Variant = Text (240 x 16, 4px corners, the code's 1em line), Circle (40, fully rounded), Rect (240 x 96, `Radius/S`), all `Surface/Muted`. `Skeleton Text` (3): Lines = 2, 3, 4, an 8px stack with the last line 60% wide (144 of 240px: Figma has no percentage widths, noted in the description). Light and Dark panels include a "loading card" composed from instances (avatar circle, two text lines, an image rect, three body lines) as the realistic use. Free width and height in code means the components are sized for common cases and meant to be resized; the descriptions say so. The 4px text radius is the code's Tailwind `rounded` default again (off the documented scale, same finding as the Multi Select checkbox in Round 8); left literal.

**Process:** one call for components and panels; one screenshot per mode; no defects, no repair. All paints are bound variables, radii bound except the literal 4px.

**Doc site:** `SkeletonPage.jsx` already covers `variant`, `width`, `height`, `SkeletonText` and `lines`; no change.

**Findings (accessibility)**
- Skeleton blocks are decorative (`aria-hidden` in code) with `surface-muted` on the raised card at about 1.1:1 in light mode. That's acceptable for decoration, but it means the loading state is invisible to assistive tech unless the container announces it: the code's Skeleton does not (the Spinner has `role=status`). Recommend pairing a Skeleton region with a visually hidden "Loading" status or `aria-busy`.
- The product pulses the blocks (`animate-pulse`); there's no `prefers-reduced-motion` guard in the component. Not in Figma's scope, but worth a code follow-up.

**Not done:** the pulse animation; Code Connect.

### Round 22: Accordion (2026-10-29)
**Why this one:** common content pattern; and a chance to apply the Round 11 / Round 20 exposed-instance pattern to a stack of items with dividers.

**Built** (new `Accordion` section): `Accordion Item` (6): Open 2 (False, True) x State 3 (Default, Hover, Disabled); properties Title and Content. Header 16px padding all round (56px closed, the code's `py-4` + 24px line), title in the medium label style, 20px chevron (up when open: the product rotates it 180 degrees), and a panel with 16px side and bottom padding that appears only when open. Hover fills only the header (as the code's button), not the open panel. `Accordion` (assembled): three Accordion Item instances (first open, last disabled) separated by 1px line dividers inside a 1px line border with the card radius (`Radius/M`) and clipped corners; **every nested item is exposed** so Open, State, Title and Content can be set from the accordion. Light and Dark panels.

**Process:** built the sets, the assembled component and both panels in one call, with the lessons of Rounds 17 to 19 applied up front: state fills use the frame's own fill (no absolute layers, no partial-opacity paints), so there was nothing to repair. Verified heights numerically (56 closed, 120 open at the default content) and by screenshot in both modes. All paints bound, all text styled, radius bound.

**Doc site:** `AccordionPage.jsx` already covers `items`, `allowMultiple`, `defaultOpen`, `disabled` and `className`; no change.

**Findings (accessibility)**
- Code: the header button has **no custom focus style** (no ring class). It relies on the browser's default outline, which is inconsistent with every other interactive component in the system (all use `focus:ring-2 focus:ring-focus`). Not drawn in Figma, since Figma would be inventing a state the code doesn't style; flagged as a code gap.
- Contrast: content text (`ink-muted` on raised) 7.56 light / 5.78 dark, title (`ink`) 17+ / 13+; chevron (`ink-muted`) passes 3:1. Disabled title is exempt. No new failures.
- The hover state uses `surface-muted` on the header only: about 1.1:1 against the raised surface in light mode, so hover is subtle by design (hover is a non-essential cue).

**Not done:** `allowMultiple` and `defaultOpen` (behavior); the chevron rotation animation; Code Connect.

### Round 23: Stepper (2026-10-29)
**Why this one:** a multi-part composition (indicator, label, description, connector) that reuses Check and X glyphs, tokens and the exposed-instance pattern, and it covers a pattern the product uses for onboarding and checkout.

**Built** (new `Stepper` section, 12 variants): `Step Indicator` (4): Status = Complete (primary fill, white check), Current (raised fill, primary border and number), Upcoming (raised, strong line border, subtle number), Error (destructive fill, white X); 32px circle, 2px border; property Number. `Stepper` (8): Orientation (Horizontal with 2px connectors, Vertical with a rail and 32px of spacing) x Active step 1 to 4 (steps before it Complete, the active Current, the rest Upcoming; connectors before the active step in primary, the rest in the line color). All indicators are exposed, so a designer sets any step to Error (or changes the number) from the stepper, as the code allows with an explicit `status`. Property `Show Descriptions`. Labels reuse `Toast / Action` (Semi Bold 14/20) for the current step and `Field / Message` for the others; descriptions reuse `Field / Counter` (12/16). Light and Dark panels, including a step set to Error.

**Process:** one failed attempt (the exposed flag can only be set once the instance sits inside a component, and I set it before attaching), then a clean build; Figma had rolled the failed script back, so there was nothing to clean (the retry still guards for a partial section). Heights check against the CSS: horizontal 38px (32 indicator vs 38 text column), vertical 248px for four steps with the 32px gaps. No repair pass after rendering.

**Known limitation, stated in the description:** an indicator switched to Error does not recolor its own label (code colors the label destructive and semibold); a designer must restyle it. Making that automatic needs the label inside the indicator component, which would make the indicator itself too coupled to the stepper. Trade-off recorded, not hidden.

**Doc site:** `StepperPage.jsx` covers `steps`, `activeStep`, `orientation`, `clickable`, `onStepClick`, per-step `status`, icons and descriptions; no change.

**Findings (accessibility, measured). Several are in-content text, not decoration:**
| Item | Light | Dark | Result |
| --- | --- | --- | --- |
| **Upcoming step label** (`ink-subtle`, 14px regular) on the page | **2.43** | **3.67** (on page `#111827`) | **Fails AA both modes**: real content, not disabled |
| **Upcoming number in the circle** (`ink-subtle` on raised) | **2.54** | **3.04** | **Fails AA** |
| **Current number** (`primary` on raised, 14px medium) | **3.43** | 4.28 | **Fails AA** both |
| Error label (`destructive`, semibold 14px) on the page | 4.62 | **3.67** | Dark fails |
| Complete check (white on primary) | 3.43 | 3.43 | Passes 3:1 as a graphic |
| Connector lines | decorative | | n/a |
- The upcoming state is the first time a *non-disabled content label* uses `ink-subtle`. Combined with the counter (Round 5), group headings (Round 7) and placeholder cases, `ink-subtle` is being used for readable text throughout the system, which it can't meet (its pairs top out below 4.5). Either the token needs a darker value for text use, or those usages need `ink-muted`. This belongs in the contrast-pass decision.
- Code: state is conveyed by color and the number or glyph; `aria-current="step"` marks the current step, which is correct and good practice.

**Not done:** custom step icons (the glyph layers can be swapped); `clickable` focus ring (a standard ring, no visual change at rest); Code Connect.

### Round 24: Popover (2026-10-29)
**Why this one:** the last of the overlay family (Modal, Toast, Menu, Select menus), reusing the elevation, radius and Button pieces, plus a new geometry problem (an arrow on any of four edges).

**Built** (new `Popover` section, 8 variants): `Popover` set, Placement 4 (Bottom, Top, Left, Right: the side of the trigger where the panel sits) x Arrow 2 (Off, On). The panel is a raised surface with `Radius/M` (the code's `rounded-card`, 12px), line border, `Elevation / 4`, 16px padding, 288px wide here (code allows 160 to 320). Arrow = the code's 10px rotated square in the raised surface with a line border on its two outer edges, placed at the center of the edge that faces the trigger (a Bottom placement gets its arrow on the panel's top edge). Properties: Title, Show Title, Body, Show Actions (small Outline and Primary Button instances); the panel is a free slot in code, so those layers are sample content. Light and Dark panels show a trigger with a popover on each side. Arrow geometry was done with an explicit rotation matrix about the arrow's center so it stays on the edge at exact coordinates.

**Suspected code defect (not confirmed in a browser, flagged for Rob):** in `Popover.jsx`, `resolvedSide` is the side where the *panel* sits (it feeds `computeCoords`), and the arrow edge is derived as `{top:'bottom', bottom:'top', ...}[resolvedSide]` and then used both to pick the border and to index `arrowStyle`. For a panel below its trigger that gives arrowSide `top`, and `arrowStyle.top` is `top: 100%`, i.e. the arrow is placed at the panel's *bottom* edge with its top borders, away from the trigger. If that renders as it reads, every placed arrow is on the wrong edge. I built the intended design (arrow on the edge facing the trigger) rather than mirror what reads as a bug, and said so in the component description. Worth a 5 minute check in the running app.

**Process:** one build call with panels, one screenshot of each; no repair. Verified the arrow positions on the four placements in the set screenshot (top edge for Bottom, bottom edge for Top, right edge for Left, left edge for Right).

**Doc site:** `PopoverPage.jsx` already covers `trigger`, `content`/`children`, `placement`, `showArrow`, `offset`, `closeOnEsc` and `closeOnBlur`; no change.

**Findings (accessibility)**
- Text pairs reuse tokens already measured: title `ink` on raised (17.7 / 13.3), body `ink-muted` on raised (7.56 / 5.78): pass. The panel edge relies on the shadow plus a `line` border (1.2:1): decorative, with the dialog role carrying structure.
- Code: the panel has `role="dialog"` and moves focus into it, and `aria-haspopup="dialog"` on the trigger: correct. `closeOnBlur` defaults to closing when focus leaves, which can be surprising for non-modal popovers but is documented.

**Not done:** align (start and end) variants (the same layouts shifted); flipping behavior; Code Connect.

### Round 25: Slider (2026-10-29)
**Why this one:** a primitive form control still missing from Figma, and a geometry-heavy build (track, proportional fill, thumbs that overflow the track) that tests whether the layer lessons hold.

**Built** (new `Slider` section, 18 variants): Size 3 (SM / MD / LG: track 4 / 6 / 8px, thumb 16 / 20 / 24px) x Type 2 (Single at 50%, Range at 25 to 75%) x State 3 (Default, Focus, Disabled). 4 properties: Label, Show Label, Show Value, Show Marks (sample 0, 50, 100 ticks). Track is `Surface/Muted`, fill `Primary/Default`, thumb is a raised circle with a 2px primary border and `Elevation / 2`; Focus draws the 2px focus ring (2px gap) around the first thumb; Disabled is 60% opacity on the track area only, as in code. The thumb deliberately overflows the track's own height (the code's wrapper is only as tall as the track, so thumbs overlap the 8px gaps); reproduced.

**Layer decision, applied from the Menu lesson (Round 19):** the track area is a plain frame with positioned children, not an auto-layout with absolute layers, and fill and thumbs use `SCALE` constraints so they keep their proportions if an instance is resized. No partial-opacity paints (Round 17), no absolute layers in a stacked auto layout. Verified in a stacked panel: no displacement. The fill and thumb positions are baked for the sample values (50, and 25 to 75); the description says to move the layers for other values, because a continuous numeric value can't be a variant property and a variant per value would explode.

**Process:** one build call with panels; one screenshot per mode; no defects, no repair. The third round in a row without one, which is the clearest evidence in this log that front-loading the failure patterns pays.

**Doc site:** `SliderPage.jsx` already covers `min`, `max`, `step`, `value`, `defaultValue`, `marks`, `showValue`, `size`, `label` and `disabled`; no change.

**Findings (accessibility, measured)**
| Item | Light | Dark | Result |
| --- | --- | --- | --- |
| **Track** (`surface-muted`) vs the page | **1.1** | 1.5 | **Fails the 3:1 non-text minimum**: the unfilled track defines the control's extent and hit target |
| Fill and thumb border (`primary`) vs page | 3.28 | 5.18 | Pass |
| Value readout (`ink-muted`) | 7.2 | 7.0 | Pass |
| **Mark labels** (`ink-subtle`, 12px) vs page | **2.43** | **3.67** | **Fails AA** (the fifth place `ink-subtle` carries real content) |
- Code: each thumb is a proper `role="slider"` with `aria-valuemin`, `aria-valuemax`, `aria-valuenow`, label and full keyboard support; the range case correctly constrains each thumb's valuemin and valuemax to the other thumb. Good practice, no change needed.

**Not done:** vertical orientation (not in code); drag behavior; Code Connect.

### Round 26: StatCard (2026-10-29)
**Why this one:** a headline-metric composition used on every dashboard, and a quick test of the "type scale" gap (it is the first 36px bold heading: Figma had no style for it).

**Built** (new `Stat Card` section, 3 variants): `StatCard` set, Trend = Positive, Neutral, Negative (trend row in the positive, muted or destructive color). Properties: Value, Label, Show Icon, Show Trend. 280px wide, raised surface, 1px line border, `Radius/M` (the code's `rounded-xl`, which is Tailwind's default 12px and so equals the card radius), 24px padding, 16px row gaps. Height 166px, matching the CSS box model (24 + 40 + 16 + 24 + 16 + 20 + 24 + 2). New text style `Stat / Value` (Bold 36/40). The icon is a 24px `ink-subtle` glyph; the trend row uses the 16px trend glyph and `Field / Message`. Light and Dark panels, including no-icon and no-trend cards.

**One deliberate difference from the code:** the Negative trend uses TrendingDown; the React component draws TrendingUp for every trend type (including negative), which looks like a code oversight (a "-4.2%" trend with an upward arrow). Said so in the description. Not changed in code.

**Defect and fix:** I declared a `Trend Text` TEXT property but didn't wire it, so my own panel override ("+8.1%") silently didn't apply. Found by reading the screenshot. A text property can't carry a different default per Trend, so the property was deleted and the layer is edited directly (the description says so). Same limitation noted in Rounds 5 and 7.

**Process:** one build call with panels, one fix call. All paints bound, all text styled, radius bound.

**Doc site:** `StatCardPage.jsx` already covers `value`, `label`, `icon`, `trend`, `trendLabel`, `trendType`; no change.

**Findings (accessibility)**
- Label (`ink-muted`) 7.56 / 5.78 and value (`ink`) 17+ pass. The icon (`ink-subtle`) is 2.54 / 3.04 against the card: decorative here, so exempt, but the Positive trend text (green on raised) is 3.30:1 in light mode and the Negative is 4.83 / 3.04: 14px text, so **the positive trend line fails AA in light, and the negative fails in dark.**
- Code: the trend is communicated by color plus the arrow glyph (and the text), so 1.4.1 is satisfied; the TrendingUp-for-negative bug above would contradict the text for a screen reader user only if the icon had a label (it's `aria-hidden` by default, which is fine).

**Not done:** custom icon choice per card (swap the glyph); Code Connect.

### Round 27: ButtonGroup (2026-10-29)
**Why this one:** a pure composition of the rebuilt Button (Round 15), and the first component that has to modify its children (square inner corners) rather than just place them.

**Built** (new `Button Group` section, 4 variants): `Button Group` set: Orientation (Horizontal, Vertical) x Attached (True, False), three `Button` instances (Outline, MD) each. Attached squares the inner corners and overlaps neighbors so the borders collapse; not attached spaces them 8px. The corner squaring is done with per-corner overrides on each Button instance, and every nested Button is **exposed**, so Variant, Size and Label are set per button from the group. Vertical groups stretch their buttons to the widest, as the code's flex column does.

**Honest trade-offs:** (1) the overlap is 2px here (itemSpacing -2) because Figma's Outline button has a 2px stroke, while the code's `-ml-px` overlaps 1px on a 2px border, which leaves the joint 1px thicker in code; mirrored in spirit (collapsed joint), not pixel for pixel, and said so in the description. (2) Corner rounding is per instance, so adding or reordering buttons means re-applying it: a component-level "position in group" property is not possible without variants per position (3 positions x variants x sizes), so I documented the limitation. (3) The group's shared `size` prop sets children that don't specify one; in Figma set Size on each Button.

**Defect found by reading the screenshot, fixed:** vertical groups first rendered with unequal button widths (each hugging its label). The code's `flex-col` stretches items. Fixed by setting each button to fill (96px for all three) and re-checked the widths numerically.

**Process:** component and panels in one call, one fix call. All instances are exposed, so the designer experience is "group first, then tune each button".

**Doc site:** `ButtonGroupPage.jsx` covers `orientation`, `attached`, `size` and `className`; no change.

**Findings (accessibility)**
- Same Outline button tokens as Round 15: label (`ink` on raised) 17.7 / 13.3 passes; the outline border (`line-strong`, 2px) is 1.47 / 1.94, the recurring 3:1 failure. In an *attached* group the border is the only thing separating adjacent buttons, so the failure is more visible than for a single button.
- Code: `role="group"` is set but there is no `aria-label` prop pass-through documented; unlabeled groups give a screen reader no context. A small code follow-up.

**Not done:** IconButton-in-group example (works the same; the IconButton set is in Figma); Code Connect.

### Round 28: EmptyState (2026-10-29)
**Why this one:** a common zero-data pattern that composes the rebuilt Button, icons, tokens and the badge shape from Avatar.

**Built** (new `Empty State` section, 3 variants): `EmptyState` set, Size = SM (32px vertical padding, 40px badge, 16px title), MD (48 / 56 / 18px), LG (64 / 80 / 20px, with a 16px description). 5 properties: Title, Description, Show Icon, Show Description, Show Actions. Everything centered with 24px side padding; the description is capped at 384px (`max-w-sm`); the gap above the actions is 12 / 16 / 24px by size; actions are Primary and Outline Button instances (replaceable). Heights check against the CSS (MD 240px with a two-line description). One new text style, `Empty / Title LG` (Semi Bold 20/28); SM and MD reuse `Body / Bold` and `Modal / Title`. Light and Dark panels.

**Process:** one build call with panels; one screenshot per mode; no defects, no repair (a fifth clean round in this batch). The wrapper-frame technique from Toast (spacing owned by a wrapper that hides with its content) keeps toggled content from leaving stray gaps.

**Doc site:** `EmptyStatePage.jsx` already covers `icon`, `title`, `description`, `primaryAction`, `secondaryAction`, `size`, `className`; no change.

**Findings (accessibility)**
- No new color failures: title `ink`, description `ink-muted` (7.56 / 5.78), icon `ink-muted` on the muted badge (6.87 / 4.06, passes the 3:1 graphic minimum).
- Code: the title is a hard-coded `h3`, so a page can't choose a heading level that fits its outline, and an `h3` under a page with no `h2` is an accessibility smell. An `as` or `headingLevel` prop would fix it.

**Not done:** custom icon node (the code also accepts a React element); Code Connect.

### Round 29: NumberInput (2026-10-29)
**Why this one:** the last member of the text-field family (TextInput, Textarea, Select, Combobox, Multi Select), reusing the TextInput construction (label, message, border tokens, per-variant field text) with a new stepper column.

**Built** (new `Number Input` section, 24 variants): `NumberInput` set, Size 3 x State 4 (Default, Focus, Error, Disabled) x Content 2 (Placeholder, Value); 5 properties (Label, Show Label, Required, Message, Show Message). Field heights 32 / 40 / 48 (fixed), 1px or 2px border by state, clipped to the rounded corners (`overflow-hidden` in code). The stepper is a column with a 1px left border and a 1px divider between the increase and decrease buttons, chevrons at 12 / 14 / 16px; the error state adds the alert icon before the stepper; Disabled drops the stepper buttons to 40% opacity (`disabled:opacity-40`). Value padding is 8 / 12 / 12px by size, applying the Round 6 lesson (the stroke adds itself, so padding is the code's value, not value plus border). Light and Dark panels.

**Build note:** one failed attempt (Figma has no `STRETCH` value for counter-axis alignment: stretching a child is a per-child fill setting). Nothing persisted; the corrected script ran clean and needed no repair pass.

**Honest scope notes:** min and max disable one stepper at a time in code; that isn't a variant (it would add four more states to 24), so the description says to reduce one button's opacity. `precision`, `step` and clamping are behavior.

**Doc site:** `NumberInputPage.jsx` was missing `label`, `placeholder`, `required`, `id` and `className`, and the descriptions for `size`, `error` and `helperText` were thin. Added the five rows and sharpened three descriptions; site build passes.

**Findings (accessibility, measured)**
- Value text (`ink`) and placeholder (`ink-muted`) pass (17+ / 7.56 light; 13+ / 5.78 dark). The border (`line-strong`) is the same 1.47 / 1.94 failure as the rest of the field family (now **six** components: TextInput, Textarea, Select, Combobox, Multi Select, NumberInput, plus the Outline button, ButtonGroup and Multi Select checkbox).
- The stepper chevrons (`ink-muted`) pass the 3:1 graphic minimum (6.87 / 4.06 on raised). Stepper buttons have `tabIndex={-1}` by design (keyboard users use Arrow Up and Down on the input, the WAI-ARIA spinbutton pattern), so they are mouse-only affordances: correct, and noted.
- The error state pairs destructive text and border with the alert icon (not color alone): good.

**Not done:** stepper hover (muted fill and ink icon: the code has it; not drawn, same trade-off as other hover states in this file); Code Connect.

### Round 30: AvatarGroup (2026-10-29)
**Why this one:** closes the loose end from Round 11 (the Avatar family's "AvatarGroup not built") and exercises the nested-instance composition one more time.

**Built** (added to the existing `Avatar` section, 10 variants): `Avatar Group` set, Size 5 (XS to XL) x Overflow 2 (False, True). Four `Avatar` instances (circle, initials) each wrapped in a 2px ring in the raised surface color (the code's `ring-2 ring-surface-raised`, drawn as an outside stroke on a circular wrapper so the ring never changes the avatar's size), overlapping by 8px (itemSpacing -8), plus, for Overflow = True, a "+3" chip that is the same size as an avatar (`Surface/Muted`, muted medium text, same ring). The ring wrapper and the chip use the same size-to-text mapping as Avatar. Light and Dark panels show every size with and without the chip.

**Honest notes:** at XS the 8px overlap hides a third of each avatar's initials; the code does the same (a later sibling paints over the earlier one), so it's mirrored, not fixed. The avatars are plain instances (edit initials, shape or status per avatar by selecting them) rather than exposed props, because the count of avatars in a group is open-ended in code; adding or removing an avatar means adding or removing an instance with a ring wrapper. The `max` prop is expressed as the Overflow axis (the chip's count is edited as text).

**Process:** one build call with panels; a clean render in both modes; no repair pass. Verified all variants render the same sizes as their Avatar (24 to 80px) and the ring is outside the avatar box.

**Doc site:** `AvatarPage.jsx` already documents AvatarGroup (`children`, `max`, `size`); no change.

**Findings (accessibility):** no new failures. The chip's muted text on the muted surface is the recurring dark-mode pair (`ink-muted` on `surface-muted`, 4.06 in dark, Rounds 7, 11 and 20). The "+N" chip has no accessible name in code (it's a bare `div`), so a screen reader hears "+3" with no context ("3 more people"); worth an `aria-label` prop.

**Not done:** Code Connect.

### Round 31: Drawer (2026-10-29)
**Why this one:** the overlay family's last panel type (Modal, Popover, Menu, Toast are done), and it reuses the Modal's header, footer, backdrop scene and the rebuilt Button directly.

**Built** (new `Drawer` section, 12 variants plus 4 scenes): `Drawer` set, Side 4 (Right, Left, Top, Bottom) x Size 3 (SM, MD, LG). Side drawers are 288 / 384 / 512px wide and top or bottom drawers are 160 / 288 / 512px high; the other dimension is the viewport (shown at 640px high and 960px wide: resize the instance). A 1px line border sits on the inner edge only, raised surface, `Elevation / 5`, no radius. 5 properties: Title, Show Title, Show Close, Body, Show Footer. Header, body (fills the remaining space, clipped) and footer (Outline Cancel and Primary Save) follow the Modal exactly (20px padding, 1px dividers). Four review scenes put the drawer on a dimmed page (the code's black at 50%): Light right, Dark right, Light bottom, Dark left.

**Finding by rendering (a code geometry issue, mirrored on purpose):** at Size = SM, a top or bottom drawer is 160px high but the header (about 69px) and the footer (about 81px) take about 150, leaving roughly 10px for the body, so the body is effectively clipped (it scrolls in the product, but nothing is visible). Small top and bottom drawers are only usable without a footer. Either the size should be larger or the footer should be optional by default.

**Process:** one build call, one screenshot call on three of the four scenes; no repair pass. Applied the Round 19 lessons: no absolute layers inside stacked auto layouts, no partial-opacity paints; the scrim is a plain rectangle in a plain frame.

**Doc site:** `DrawerPage.jsx` covers `open`, `onClose`, `side`, `size`, `title`, `footer`, `closeOnOverlayClick`, `closeOnEsc` and `showClose`; no change.

**Findings (accessibility)**
- The same Modal pairs (close icon and title, description) pass; no new failures. The panel edge against a dimmed page relies on the scrim and the shadow (invisible in dark mode, Round 2), so in dark mode a left or right drawer is separated from the scrim mostly by the border and the raised fill (about 1.4:1): visible, but low-contrast.
- Code: `role=dialog` with `aria-modal`, a focus trap and scroll lock are present, as for the Modal; the drawer's `max-w-[90vw]` cap means a large drawer on a small screen leaves a 10% sliver of scrim, which is the intended affordance for dismissal.

**Not done:** slide-in animations; the 90% viewport caps (behavior); Code Connect.

### Round 32: Input Group (2026-10-29)
**Why this one:** it closes the open scope decision from Round 6, where `addonBefore` and `addonAfter` were deliberately left out of TextInput because Figma can't bind a radius to a boolean (the recommendation then: build the group as its own component).

**Built** (new `Input Group` section, 27 variants): `Input Group` set, Size 3 x Addons 3 (Before, After, Both) x State 3 (Default, Focus, Error). Each variant is a label row, a group row (addon block or blocks plus the field) and a message. Addon blocks are `Surface/Muted` with muted text, 12px side padding, a strong line border that omits the joined edge, and rounded outer corners only; the field takes the opposite corner rounding (squared on every side that has an addon), bound per corner to `Radius/S` with the squared corners set to 0. Focus and error apply to the field only, as in code (the addon borders do not change). Same label, required and message properties as TextInput. Heights 32 / 40 / 48, matching the code, and the field padding uses the Round 6 correction (the stroke adds itself).

**Scope notes:** the no-addon case is the plain TextInput, so it isn't repeated; Disabled isn't drawn (it adds 9 variants, 36 total) and the description says so; prefix and suffix live inside the border and stay on TextInput.

**Process:** one build call, a clean render in both modes, no repair pass. Verified heights numerically and the corner logic visually (Before: addon left, field's right corners rounded; After: the reverse; Both: field fully squared).

**Doc site:** the TextInput page already documents `addonBefore` and `addonAfter` (added in Round 6); no change.

**Findings (accessibility)**
- Addon text (`ink-muted` on `surface-muted`): 6.87 light / **4.06 dark** (fails AA in dark mode, the same pair as Rounds 7, 11, 20, 30). The field border and the addon border are `line-strong`: the same 1.47 / 1.94 failure as the rest of the family.
- Code: an addon is plain text in a `span` with no association to the input (`aria-describedby` or a visually hidden label would give a screen reader "https://" and ".com" as context). Today a screen reader user may never hear the addons.

**Not done:** Disabled; Code Connect.

### Round 33: List (2026-10-29)
**Why this one:** the standard row pattern behind settings screens, people lists and navigation, and the first component to need two *tint* levels (10% and 15%), which made it the right moment to apply the Round 19 lesson properly.

**Tokens first:** added two Brand variables with real alpha, `Primary/Tint 10` and `Primary/Tint 15` (the code's `bg-primary/10` and `hover:bg-primary/15` for selected rows), alongside Round 19's `Destructive/Tint 10`. Alpha lives in the color value, so instances inherit it (verified by the stacked render). Trade-off recorded in the variable descriptions: they duplicate the primary hex, so a change to the brand blue needs a three-place update (Primary/Default, and the tints). A candidate cleanup is to move Chip and Banner (Rounds 10 and 17, which use layer opacity) onto the same pattern for consistency.

**Built** (new `List` section, 8 variants): `List Item` (6): State = Default, Hover (muted), Selected (10% primary tint, primary medium text), Selected Hover (15% tint), Focus (2px focus-color inset ring, drawn as the row's own inside stroke, no absolute layer) and Disabled (50% opacity); properties Primary, Secondary, Show Secondary, Show Leading (an Avatar SM instance), Show Trailing (a chevron). Rows are 16px by 12px padding, 12px gap, 68px high with both lines (matches the CSS). `List` (2): Dividers True or False, three exposed List Item instances with 1px dividers between them when True. Light and Dark panels (the list and every row state).

**Process:** one build call with panels, clean render in both modes; no repair pass. The stacked-rows case was exactly where Round 19's absolute-layer bug lived; building state fills as the row's own fill avoided it.

**Doc site:** `ListPage.jsx` covers `dividers`, `leading`, `primary`, `secondary`, `trailing`, `interactive`, `selected`, `disabled` and `onClick`; no change.

**Findings (accessibility, measured)**
| Item | Light | Dark | Result |
| --- | --- | --- | --- |
| **Selected primary text** (`primary` medium 16px) on the 10% tint | **3.08** | **3.72** | **Fails AA** both modes |
| Selected primary text on the 15% hover tint | 2.91 | 3.46 | Fails AA |
| Secondary text (`ink-muted`) on the tint | 6.79 | 5.03 | Pass |
- The selected row's label is the most prominent text in the list and the one that fails. A selected state conveyed by primary color text and a faint tint, with no icon, check, bar or weight beyond "medium", also falls short of 1.4.11 / 1.4.1 for users who can't see the color change. (`aria-current` is set, which is correct.)
- Design observation: the leading Avatar's disc is `surface-muted`, the same as the Hover row fill, so the avatar disc disappears into the row on hover (1.00:1); the code does the same.

**Not done:** non-interactive rows with children content; the Logo import (below); Code Connect.

### Cleanup: legacy artboards audited, first removals (2026-10-29)
Rob asked to remove the old artboards and noticed there were no new Checkbox or Toggle. Before deleting anything I counted instances of every component in the six legacy sections (Form Controls, Data Display, Feedback, Navigation, Data Visualization, App Compositions) across all three pages. Result: **the legacy sections are the only Figma home of about 20 components that have not been rebuilt** (Checkbox, Radio, Toggle, Card, Badge, Label, TableHead and TableCell, Pagination and Pagination Button, Alert, ToolTip, Loading, InlineLoading, ProgressBar, Tabs, Breadcrumb, Data Viz, Trend, Large Line Chart, and the app compositions Sidebar, Top Bar, Container), and about 60 instances on the Playground page depend on them (Table 24, Tabs 7, Status 4, Controls 3, Card 1). Deleting whole sections would have broken the Playground and thrown away the only Figma versions. Removed now, with a zero-reference guard: the deprecated `Button` set (108:1061, 0 instances) and the two empty title frames `Input` and `Dropdown`. The rest goes section by section as each component is rebuilt in the new system and its Playground instances are migrated, starting with the three the code has and Rob noticed missing: Checkbox, Toggle, Radio. The gap list I had been keeping was wrong about this: it listed only components with no Figma version at all, so it hid the ones that had an outdated version.

### Round 34: Checkbox (2026-10-29)
**Code:** `Checkbox.jsx` (+ `CheckboxGroup`). Props: checked, indeterminate, disabled, label, description, error, size (sm 20 / md 24 / lg 28), plus the group context.
**Figma:** new `Checkbox` section (566:7908, bottom of the Form controls column); set `566:7909`, 45 variants: Size (MD default, SM, LG) x Value (Unchecked, Checked, Indeterminate) x State (Default, Hover, Focus, Disabled, Error); 6 properties (Label, Show Label, Description, Show Description, Error Message, Show Error Message). Light and Dark review panels `566:7910` / `566:8083`. No new variables or styles: box and icon fills bind to Theme and Brand tokens, label uses `Body / Regular` / `Field / Text SM` / `Field / Text LG`, description and message use `Field / Message`. Focus is a 2px stroke ring at a 2px offset (a stroke layer, per the earlier lesson). The check and minus are the Lucide instances at 12, 14 and 16px with a 3px stroke at 24px scale (the code's `strokeWidth={3}`), so they are heavier than the 2px default; verified in a fresh render.
**Findings (code, not changed):** (1) Error takes precedence over Checked in the box classes, so a checked box with an error renders a white icon on a near-white box: the check is invisible in light mode (visible in dark). Modeled faithfully and called out in the description. (2) The unchecked border (`line-strong`) is 1.47:1 on white and 1.94:1 in dark, below the 3:1 non-text minimum; this is the same token as the other nine components, so it belongs to the token contrast pass. (3) The radius is the code's `rounded` (4px), off the radius scale, so it stays a literal like before.
**Not modeled:** `CheckboxGroup` as a separate Figma component (it is label + description + a stack of Checkbox instances + error; composable from the set today). The legacy `Checkbox` set (120:567) stays until its one Playground instance is migrated.
**Docs:** CheckboxPage was behind the code: added indeterminate, description, error, size, value and name to the props table, a Sizes/indeterminate/description/error section, a CheckboxGroup section with its own props table. Build passes.

### Round 35: Toggle (2026-10-29)
**Code:** `Toggle.jsx`: checked, disabled, label, description, size (sm/md/lg), labelPosition (left/right), `role="switch"`.
**Figma:** new `Toggle` section (567:8062, under Checkbox in the Form controls column); set `567:8063`, 36 variants: Size (MD default, SM, LG) x Checked (Off, On) x State (Default, Focus, Disabled) x Label Position (Right, Left); 4 properties (Label, Show Label, Description, Show Description). Light and Dark panels `567:8064` / `567:8146`. No new tokens or styles. Geometry follows the code exactly: the thumb's `left` is measured from the padding box, so inside the 1px border it sits at 3px when off and flush with the inner edge when on (verified at all three sizes). Radius binds to `Radius/FULL`. The disabled thumb is the ink fill at 20% layer opacity (layer opacity, not a bound paint opacity, per the Round 17 lesson). Focus is a 2px ring at a 2px offset as a stroke layer. There is no hover state in the code, so there is none in Figma. No defects found in the render.
**Findings (tokens, not code):** off-state track border (`line-strong`) 1.47:1 / 1.94:1 and the `ink-subtle` thumb on a raised track below 3:1; both belong to the contrast pass.
**Docs:** TogglePage was behind the code: added description, size and labelPosition to the props table plus a Sizes, description and label position section. Legacy `Toggle` set (121:518) stays until its Playground instance is migrated.

### Round 36: Radio (2026-10-29)
**Code:** `Radio.jsx` (+ `RadioGroup`): checked, disabled, label, description, error, size, value/name, group context with roving focus.
**Figma:** new `Radio` section (569:8145, under Toggle); set `569:8146`, 30 variants: Size (MD default, SM, LG) x Value (Unselected, Selected) x State (Default, Hover, Focus, Disabled, Error); 6 properties (Label, Show Label, Description, Show Description, Error Message, Show Error Message). Panels `569:8147` / `569:8263`. No new tokens or styles. Same construction as Checkbox: stroke-layer focus ring, `Radius/FULL` bound, a selected radio has a 2px primary border and a primary dot, unselected has a 1px `line-strong` border, disabled dot is ink at 20% layer opacity. Render checked at all sizes in both themes; no defects. Unlike the Checkbox, an error radio that is selected still shows its primary dot, so the error state stays legible.
**Findings (tokens):** the unselected border (`line-strong`) 1.47:1 / 1.94:1, as for Checkbox and Toggle: three more components for the contrast pass.
**Docs:** RadioPage was behind the code: added description, error, size to the props table, a RadioGroup, sizes and error section with a RadioGroup props table. The table now reuses one `RowsTable`. Build passes. Legacy `Radio` set (120:587) stays until its Playground instance is migrated.
**Not modeled:** `RadioGroup` as its own Figma component.

### Cleanup 2: legacy Checkbox, Radio, Toggle retired (2026-10-29)
Swapped the three Playground instances (one each, in the `Controls` frame) to the new MD default variants (Checked, Unselected, Off), then deleted the legacy `Checkbox`, `Radio` and `Toggle` sets and the `Controls` title frame after a zero-reference check across all three pages. A fresh render of the Playground frame shows all three correctly (the new ones are slightly smaller than the old, 78x24 against 92x28, because the old sets were wider than the code). The legacy Form Controls section now holds only the `Buttons` frame, which keeps `Pagination Button` (still used by the legacy Pagination in Data Display). Remaining legacy components awaiting rebuild: Card, Badge, Label, Table (TableHead, TableCell), Pagination, Alert, ToolTip, Loading, InlineLoading, ProgressBar, Tabs, Breadcrumb, Data Viz, Trend, Large Line Chart and the app compositions.

### Round 37: Tabs (2026-10-29) and the first legacy rebuild
Rob said to rebuild the old components and remove each legacy version as its replacement lands. Order: by Playground dependency, so Tabs (7 instances) first.
**Code:** `Tabs.jsx`: variant underline / pill / enclosed, orientation horizontal / vertical, per-tab icon and disabled, controlled or uncontrolled value. The legacy Figma `Tabs` was a single three-state text box (Default, Hover, Active) with none of that.
**Figma:** new `Tabs` section (572:8276, bottom of the Navigation and compositions column). Two sets, as the code is composed: `Tab` `572:8277` (32 variants: Variant x Orientation x Selected x State [Default, Hover, Focus, Disabled]; only Underline has a vertical form; properties Label, Show Icon, Icon swap) and `Tabs` `573:8204` (6 variants: Variant x Orientation, each holding three exposed Tab instances, first selected). Panels `573:8205` / `573:8306`, including a with-icons-and-disabled row. Radius uses `Radius/S` (enclosed top corners) and `Radius/FULL` (pill); label style `Chip / MD`; the focus ring is an inset 2px stroke layer. The list rule (underline, enclosed) is the list's own 1px stroke with `strokesIncludedInLayout` off so the active tab's 2px border covers it as in CSS, and avoids an absolute layer inside a component that gets stacked vertically (Round 19 lesson). Verified in a fresh render of every variant.
**Playground migration:** the 7 legacy instances in `Tabs Test` were swapped to Underline Tab variants (Off/Default, Off/Hover, On/Default), keeping their label text and order, set to hug and repacked (they had kept fixed widths of 98 to 245px). One had an empty label and now reads "Tab Option". Legacy `Tabs` set (247:549) deleted after a zero-reference check on all pages, along with its empty title frame.
**Findings (tokens):** selected tab text is primary on white (3.43:1) and white on the pill (3.43:1), both below AA for 14px text; the inactive muted label passes. Swapping a tab icon resets its stroke to Ink (the Lucide components bind to `Ink/Default`), so a swapped icon on a selected tab keeps the wrong color until recolored; documented in the Tab description.
**Docs:** TabsPage props table lacked variant, orientation, value and defaultValue, and the tab fields (id, icon, disabled); added them plus a Variants, orientation, icons and disabled section.

### Housekeeping: Components page layout (2026-10-29)
After Round 33 the Components page was a single row about 81,000px wide (every new section had been appended to the right). Regrouped the 33 sections into six labeled category rows, wrapping at 16,000px (160px gaps): **Actions** (IconButton, Button, Button Group, Link), **Icons**, **Form controls** (the original Form Controls, Text Fields, Selection, Multi Select, Combobox, Number Input, Input Group, Slider, Segmented Control), **Overlays and feedback** (Modal, Drawer, Popover, Menu, Toast, Banner, the original Feedback, Spinner, Skeleton, Empty State), **Data display** (the original Data Display, Avatar, Chip, List, Accordion, Stat Card, Divider, Data Visualization) and **Navigation and compositions** (the original Navigation, Stepper, App Compositions). The page is now about 15,000 by 26,000px. Positions only: nothing inside any section changed. Also found and fixed a loose end from Round 6: the two TextInput review panels had been left at the page root floating over another section; moved into `Text Fields` where they belong. Lesson: always append a new panel to its section explicitly, and place a new section into its category row instead of at the end of the page.

### Housekeeping 2: index and tighter packing (2026-10-29)
Rob said the Components page "looks empty" after the regrouping. A read of the file showed nothing was missing (33 sections, all populated, nothing hidden), so the cause was the saved viewport sitting on canvas the sections had left, and the page being 26,000px of mostly whitespace once zoomed out. Fixes: (1) trimmed every section to its content plus 80px (Number Input, Slider, Menu and Input Group shrank by up to a third; a few original sections grew slightly where children extended past their frame); (2) repacked the six category rows with 120px gaps and a 13,000px wrap, so the page is now about 11,900 by 26,300px (the height is dominated by the tall Drawer, Data Display and App Compositions sections); (3) added an **Index** frame at the top-left: the title, a one-line description, and each category with a clickable name per section (35 node hyperlinks). Decided against one page per category: sections can't be moved across pages reliably through the plugin API, and the single canvas is what makes the system skimmable. First attempt failed on a hyperlink range (my separator length was off by two characters); the failed script rolled back cleanly and the retry was idempotent (it removes old labels and the old Index first), which is the right habit for any layout script. Maintenance note: a new section needs an entry in the Index (and a re-run of the layout script's category list).

### Housekeeping 3: category columns (2026-10-29)
Rob asked for a better organization and suggested columns. Rows were still a wide strip you had to pan across; columns match how people scan a system (pick a category, scroll down). Re-laid the 35 sections into five vertical columns, one per category, each with a 72px column header and sections stacked top to bottom with 160px gaps and 400px between columns: **Actions and icons** (Actions, Button, Button Group, Link, Icons), **Form controls** (9 sections), **Overlays and feedback** (10), **Data display** (8) and **Navigation and compositions** (3). Icons moved into the Actions column rather than keeping a column of one short section, so the Index merges them too (new "Icons" link, and a stray hyperlink that leaked onto the separator after the insert was cleared). The page is now about 17,900 by 18,100px, close to square, instead of 11,900 by 26,300, so "fit to screen" shows all five columns at a readable scale. Positions and the Index only: nothing inside any section changed. Column widths follow each column's widest section (Modal makes Overlays the widest at about 4,000px). Maintenance: a new section is appended to the bottom of its category's column; re-run the layout with its id added to the column list, and add it to the Index.

**Follow-up: "Actions" renamed "Icon Button".** Rob asked why the IconButton section was called Actions. No good reason: it was my generic name in Round 3, before Button had its own section, and it held only IconButton. Decision (Rob chose option 1): keep IconButton as its own component set, because the code does (`IconButton.jsx` has its own docs page and a required `aria-label`), and folding it into Button as `Size=Icon` would take that set from 126 to 168 variants and hide the accessible-name requirement. Renamed the section `Icon Button` (id unchanged, 468:353), moved it to sit right after Button in the first column (Button, Icon Button, Button Group, Link, Icons) and updated the Index link. Open code finding, not changed: `Button` still has `size="icon"`, which duplicates IconButton with no required accessible name (used in MenuPage and the demo); Figma's Button set has no icon size. Suggested follow-up for the code: deprecate `Button size="icon"` and migrate its three usages to IconButton.

### Fix: Drawer SM top/bottom footer floating outside the panel (2026-10-29)
Rob reported that on some Drawer variants the buttons look like they float outside the component. Cause: `Side=Top, Size=SM` and `Side=Bottom, Size=SM` are 160px tall (the code's `h-40`), the header (69px) and footer (89px) already take 158px, and my Body frame kept its 20px top and bottom padding, so it could not shrink below 40px; the footer was pushed 38px past the bottom edge. This is the Round 31 note ("SM top/bottom body is clipped") that I had logged as a known quirk but rendered wrongly: the code's body is `flex-1 overflow-y-auto`, which shrinks to the 1 to 2px left over and clips its content, so in the browser the footer stays inside. Fixed in both variants by zeroing the Body's vertical padding, fixing its height to the leftover space (2px Top, 1px Bottom, which counts the 1px border) and clipping it; the footer now ends exactly at 160px. Verified by child bounds and a fresh render of the section. The sliver body means the SM top/bottom drawer shows no content at all, which is the real behaviour; suggested code fix: raise SM top/bottom to `h-52` or more, then drop the clipped state here. Lesson: "logged as a known quirk" is not the same as "rendered it faithfully"; a screenshot of every variant in a set, not just the representative ones, would have caught this in Round 31.

## Running tally

| Metric | Value |
| --- | --- |
| Components audited | inventory-level only (~17 present / ~27 missing of ~44) |
| Components built in Figma | 15 UI components / 7 families (IconButton 126 variants, Textarea 24, TextInput 24, Select 30 + Option 6 + Group Label 1 + Menu 4, Multi Select 27 + Pill 1 + Option 6 + Menu 4, Combobox 18 + Menu 4, Chip 30 + Chip State 20, Avatar 20 + Avatar Status 20, Divider 10, Spinner 20, Modal 4, Button rebuilt 126, Toast 4, Banner 4, Link 18 + Link State 6, Menu Item 6 + Divider 1 + Menu 1, Segment 15 + Segmented Control 18, Skeleton 3 + Skeleton Text 3, Accordion Item 6 + Accordion 1, Step Indicator 4 + Stepper 8, Popover 8, Slider 18, StatCard 3, Button Group 4, EmptyState 3, NumberInput 24, Avatar Group 10, Drawer 12, Input Group 27, List Item 6 + List 2) + 200 Lucide icon components |
| Components retired | 2 deleted (legacy `Text` and `Dropdown`, after migration with a zero-reference guard) + 1 deprecated awaiting Rob's OK (legacy `Button`, 10 instances migrated) |
| Doc pages updated | 11 (CheckboxPage added in Round 34; TextInput, Select, MultiSelect, Combobox, Modal, Button, Toast, NumberInput, ButtonPage; the rest were already accurate) |
| Token/contrast issues found | 5 failing pairs (see Round 1) + invisible dark-mode elevation + counter text (Round 5) + default field border 1.47 / 1.94 (Round 6) + group heading 2.54 / 3.04 and dark search placeholder 4.06 (Round 7) + unchecked checkbox border 1.47 / 1.94 (Round 8) |
| Self-corrections | 14 (Round 18: underline leaked to 147 shared-style labels, reset and rebuilt as dedicated underline styles, which also fixed Round 15's never-rendered Link underline; Round 17: variable-bound paint opacity not inherited by instances, which invalidated Chip's Round 10 fix and was re-done at layer level; failed first repair attempt; earlier: Chip: paint opacity reset, false-alarm verification, stale instances; earlier still: IconButton stroke scaling, escaped descriptions, Textarea padding double-counting stroke, "Dropdown nests Text" mis-attribution, review-panel row clipping, Multi Select orphaned buttons, Multi Select tail minimum) |
| Figma variables added | 45 (11 Cool Gray primitives + 11 Theme tokens x Light/Dark + 16 Brand + 4 Brand Warning + 3 alpha tints: Destructive/Tint 10, Primary/Tint 10, Primary/Tint 15) |
| Figma styles added | 5 effect styles (Elevation / 1-5) + 19 text styles (Field / Text SM, Text LG, Label SM / MD / LG, Message, Counter, Group Label; Chip / SM, MD; Avatar / XL; Modal / Title; Button / LG; Toast / Action; Underline / Label MD, Chip MD, Button LG) |

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
