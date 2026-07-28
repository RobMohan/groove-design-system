# Groove Design System

A comprehensive, accessible component library built with React and Tailwind CSS. Groove ships **44 components** and **12 design foundations**, with a token-driven **light & dark theme**, a **TanStack-powered data table**, full **keyboard accessibility** (WCAG 2.2 AA), and interactive documentation for every piece. This project explores how AI can accelerate design system workflows and improve design-to-development collaboration.

## 🚀 Live Demo

**[View Live Demo](https://component-test-ashy.vercel.app)** | **[GitHub Repository](https://github.com/RobMohan/groove-design-system)**

## ✨ Features

- 🎨 **Token-driven theming** — semantic color/typography/spacing/elevation/radius tokens power a built-in light & dark mode (toggle from the sidebar)
- 🧩 **44 components** — from buttons, inputs, and overlays to comboboxes, sliders, date pickers, a command palette, and a full data table
- 📊 **TanStack data table** — headless sorting, filtering, global search, row selection, column visibility, and pagination, wrapped in the Groove visual style
- 📚 **Interactive documentation** — a dedicated page with live examples and props tables for every component and foundation
- ♿ **Accessible** — WCAG 2.2 AA target: focus traps, portaled overlays with a named z-index scale, ARIA roles/keyboard nav, and a semantic focus ring
- 🧪 **Tested** — 203 unit tests across 36 suites (Vitest + React Testing Library)
- 📱 **Responsive** — works across screen sizes with a collapsible sidebar

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/RobMohan/groove-design-system.git
cd groove-design-system

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run tests
npm test
```

## 🧱 Foundations

| Foundation | Description |
|---|---|
| **Color Tokens** | Brand scales + semantic surface/ink/line tokens (theme-aware) |
| **Color Usage** | When to reach for each color role, with contrast guidance |
| **Typography** | Type scale, weights, and usage |
| **Iconography** | Lucide sizing, stroke, and decorative-vs-meaningful guidance |
| **Spacing** | 4px-based spacing scale |
| **Sizing** | Control heights, density, and 44px touch targets |
| **Layout** | Breakpoints, containers, grids, and page scaffolds |
| **Elevation** | Five-step shadow scale (`shadow-elevation-1…5`) |
| **Radius** | Semantic radius tokens (`rounded-control` / `card` / `modal` / `pill`) |
| **Motion** | Duration/easing tokens and enter/exit animation utilities |
| **Layering** | Named z-index scale (`z-dropdown` … `z-tooltip`) |
| **Accessibility** | WCAG target, keyboard model, contrast, and per-component notes |

## 🧩 Components

**Actions:** Button, Icon Button, Button Group, Link
**Forms & inputs:** Field, Text Input, Textarea, Number Input, Select, Combobox, Multi-Select, Checkbox, Radio, Toggle, Segmented Control, Slider, Date Picker, File Upload
**Data display:** Badge, Chip, Avatar, Card, Stat Card, List, Data Table, Pagination, Divider, Skeleton, Empty State
**Feedback:** Alert, Banner, Toast, Spinner, Progress, Tooltip
**Navigation & overlays:** Tabs, Accordion, Breadcrumbs, Stepper, Menu, Popover, Modal, Drawer, Command Palette

Each component has its own documentation page with live examples, a props table, and copy-paste code snippets.

## 🌗 Theming & tokens

Groove uses CSS-variable-backed semantic tokens so components adapt to light/dark automatically. Prefer these over raw Tailwind grays:

- **Surfaces:** `bg-surface` (page), `bg-surface-raised` (cards/menus), `bg-surface-muted` (insets/hovers)
- **Text:** `text-ink`, `text-ink-muted`, `text-ink-subtle`, `text-ink-inverse`
- **Borders:** `border-line`, `border-line-strong`
- **Brand:** `primary`, `secondary`, `destructive`, `positive`, `warning` (each with `-hover` / `-pressed` / `-disabled`)
- **Focus:** `ring-focus` — a semantic, theme-aware focus ring for every interactive control

Dark mode is class-based (`darkMode: 'class'`); the docs toggle persists the choice to `localStorage`.

## 🎨 Color Palette

```javascript
colors: {
  primary:     { DEFAULT: '#588ae0' }, // Blue
  secondary:   { DEFAULT: '#7c3aed' }, // Purple
  positive:    { DEFAULT: '#16a34a' }, // Green
  destructive: { DEFAULT: '#dc2626' }, // Red
}
```

## 📁 Project Structure

```
groove-design-system/
├── src/
│   ├── components/          # Components + co-located tests (Component.jsx / Component.test.jsx)
│   ├── pages/               # One documentation page per component & foundation
│   ├── layout/              # DocsLayout (sidebar, nav, theme toggle)
│   ├── styles/              # global.css (token definitions + dark overrides)
│   ├── test/                # Vitest setup
│   └── main.jsx             # Routes + ToastProvider
├── tailwind.config.js       # Tokens: colors, elevation, radius, motion
├── vite.config.js
└── README.md
```

## 🧪 Testing

```bash
npm test              # run the suite
npm test -- --watch   # watch mode
npm run test:coverage # coverage report
```

Current coverage: **203 tests across 36 suites** — covering every component including the overlays (Popover, Drawer, Command Palette), form controls (Combobox, Multi-Select, Field, Number Input, Slider), and data widgets (Date Picker, File Upload, Stepper, List), plus the accessibility remediation of the original set.

## 🛠️ Built With

- **Framework:** React 18 + Vite
- **Routing:** React Router DOM
- **Styling:** Tailwind CSS (class-based dark mode)
- **Data table:** TanStack Table v8
- **Icons:** Lucide React
- **Testing:** Vitest + React Testing Library
- **Deployment:** Vercel

## 💡 About This Project

Groove is an exploration of how AI can be leveraged across the design-to-development pipeline — from initial component creation to testing, documentation, and theming. The goal is to identify where AI assistance adds the most value when building and maintaining a real component library.

## 👤 Author

**Rob Mohan**
- Email: [rob@robertmohandesign.com](mailto:rob@robertmohandesign.com)
- LinkedIn: [linkedin.com/in/robertmohan](https://www.linkedin.com/in/robertmohan)
- GitHub: [@RobMohan](https://github.com/RobMohan)
- Portfolio: [robertmohandesign.com](https://robertmohandesign.com)

## 📝 License

MIT License — feel free to use this in your own projects!

---

**Built with AI assistance** as an exploration of design-to-development collaboration.
