# Design System Specification — AI Learning OS

**Version**: 1.0.0  
**Status**: Active  
**Author**: UI/UX Design Lead & Senior Full-Stack Engineer

---

## 1. Design Philosophies
- **Dual-Mode Harmony**:
  - **Learn Mode (Default: Light)**: Educational, approachable, generous whitespace, clear typography, friendly visual badges, low cognitive overload.
  - **Engineer Mode (Default: Dark)**: High-density IDE layout, low visual distraction, monospace code precision, distinct panel borders, keyboard-first interaction.
- **Accessible & High-Contrast**: Minimum 4.5:1 contrast ratio across both light and dark modes for normal text, WCAG 2.1 AA compliant.
- **Zero Gimmicks**: No excessive blur, heavy glassmorphism, or gratuitous bouncy animations that hinder performance or readability.

---

## 2. Color Palette & Semantic Tokens

| Token | Light Value (Learn) | Dark Value (Engineer) | Usage |
| :--- | :--- | :--- | :--- |
| `--bg-primary` | `#F8FAFC` (Slate 50) | `#0F172A` (Slate 900) | App background, main canvas |
| `--bg-surface` | `#FFFFFF` (White) | `#1E293B` (Slate 800) | Cards, modals, sidebars, editor panels |
| `--bg-elevated`| `#F1F5F9` (Slate 100)| `#334155` (Slate 700) | Tooltips, hover states, active tabs |
| `--border-subtle`| `#E2E8F0` (Slate 200)| `#334155` (Slate 700)| Panel dividers, card borders |
| `--border-strong`| `#CBD5E1` (Slate 300)| `#475569` (Slate 600)| Inputs, active focus rings, splitters |
| `--text-primary` | `#0F172A` (Slate 900)| `#F8FAFC` (Slate 50) | Primary headlines, code, body text |
| `--text-secondary`| `#475569` (Slate 600)| `#CBD5E1` (Slate 300)| Metadata, captions, secondary labels |
| `--text-muted` | `#64748B` (Slate 500)| `#94A3B8` (Slate 400)| Placeholders, inactive icons |
| `--accent-primary`| `#2563EB` (Blue 600) | `#3B82F6` (Blue 500) | Primary actions, links, progress bars |
| `--success` | `#059669` (Emerald 600)| `#10B981` (Emerald 500)| Completed quizzes, verified tests |
| `--warning` | `#D97706` (Amber 600) | `#F59E0B` (Amber 500) | Unverified claims, warnings |
| `--error` | `#DC2626` (Red 600) | `#EF4444` (Red 500) | Syntax errors, execution exceptions |

---

## 3. Typography Scale
- **Font Stack**:
  - Sans-Serif: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif
  - Monospace: JetBrains Mono, Fira Code, 'Cascadia Code', Menlo, Consolas, monospace
- **Scale**:
  - `Display / H1`: 32px / 2rem, 700 weight, -0.025em tracking
  - `H2 (Section Header)`: 24px / 1.5rem, 600 weight
  - `H3 (Card / Panel Header)`: 18px / 1.125rem, 600 weight
  - `Body Regular`: 15px / 0.9375rem, 400 weight, 1.5 line height
  - `Small / Badge`: 13px / 0.8125rem, 500 weight
  - `Code / Editor`: 14px / 0.875rem, monospace, 1.6 line height

---

## 4. Component Primitives
1. **Button**: Primary, Secondary, Ghost, Danger, Icon-only. Distinct keyboard `:focus-visible` rings.
2. **Tabs**: Multi-tab horizontal strip with close buttons, dirty indicators, and keyboard tab navigation.
3. **Badge / Tag**: Small rounded indicators for Track names, difficulty levels (Beginner, Intermediate, Advanced), verification status (Verified, In Review, Speculative).
4. **Code Block / Monaco Container**: Bordered container with header displaying language, filename, copy button, and run button.
5. **Interactive Question Card**: Radio / Checkbox option rows with immediate deterministic feedback explaining *why* an answer is right or wrong.
6. **Toast / Banner Alert**: Accessible announcements for save states, news updates, or compilation errors.
