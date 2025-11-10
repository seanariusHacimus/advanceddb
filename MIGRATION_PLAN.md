# Migration Plan: AdvancedDB to shadcn/ui Design System

> **⚠️ IMPORTANT**: This migration plan uses shadcn/ui's **official color scheme and design guidelines**. All colors, spacing, and design tokens follow shadcn/ui's default specifications. The plan also includes instructions for maintaining brand colors if needed.

> **📝 Note**: Changes should **NOT** be committed to GitHub until explicitly instructed. All migration work should be done locally and tested thoroughly before any git commits.

## 📋 Table of Contents
1. [Overview](#overview)
2. [Current State](#current-state)
3. [Migration Goals](#migration-goals)
4. [Migration Strategy](#migration-strategy)
5. [Component Migration Checklist](#component-migration-checklist)
6. [Theme System (Dark/Light Mode)](#theme-system-darklight-mode)
7. [Implementation Phases](#implementation-phases)
8. [Design Tokens & Design System](#design-tokens--design-system)
9. [Testing Strategy](#testing-strategy)
10. [Rollback Plan](#rollback-plan)

---

## 🎯 Overview

This document outlines the comprehensive plan to migrate the AdvancedDB frontend from Ant Design to shadcn/ui components and design language, including dark mode and light mode support. This migration focuses exclusively on UI/UX/Design aspects, maintaining all existing functionality.

### Key Objectives
- ✅ Modernize UI with shadcn/ui design system
- ✅ Implement dark/light mode support
- ✅ Improve consistency across the application
- ✅ Reduce bundle size by removing Ant Design dependency
- ✅ Enhance accessibility and user experience
- ✅ Maintain all existing functionality during migration

---

## 📊 Current State

### Technology Stack
- **UI Library**: Ant Design v4.3.5
- **Icons**: @ant-design/icons v4.2.1
- **Styling**: styled-components v5.1.1
- **Font**: Inter (already migrated ✅)
- **React**: v18
- **State Management**: Redux + Redux Persist

### Already Migrated Components
- ✅ **Sidebar** (`src/components/Layout/Sidebar.js`)
- ✅ **Card** (`src/components/UI/shadcn/card.js`)
- ✅ **Progress** (`src/components/UI/shadcn/progress.js`)
- ✅ **Font**: Inter font family
- ✅ **Dashboard Card & Progress** (partial)

### Ant Design Components in Use
Based on codebase analysis, the following Ant Design components are actively used:

#### Layout Components
- `Layout`, `Header`, `Sider`, `Content`, `Footer`
- `Row`, `Col` (Grid system)
- `Space`, `Divider`

#### Form Components
- `Form`, `Form.Item`
- `Input`, `Input.Password`, `Input.TextArea`
- `Select`, `Select.Option`
- `Checkbox`, `Checkbox.Group`
- `Radio`, `Radio.Group`
- `Switch`
- `DatePicker`, `TimePicker`
- `Upload`, `Upload.Dragger`

#### Data Display
- `Table` (extensively used)
- `Card`
- `List`, `List.Item`
- `Tag`, `Badge`
- `Tooltip`, `Popover`, `Popconfirm`
- `Empty`
- `Descriptions`, `Descriptions.Item`
- `Collapse`, `Collapse.Panel`
- `Tabs`, `Tabs.TabPane`
- `Timeline`
- `Tree`, `TreeSelect`

#### Feedback
- `Modal`, `Modal.confirm`
- `Alert`, `Message`, `Notification`
- `Spin` (Loading spinner)
- `Progress`
- `Drawer`
- `Skeleton`

#### Navigation
- `Menu`, `Menu.Item`, `Menu.SubMenu`
- `Breadcrumb`
- `Pagination`
- `Steps`
- `Dropdown`, `Dropdown.Button`

#### Other
- `Button`, `Button.Group`
- `Avatar`
- `Typography` (Title, Text, Paragraph)
- `Anchor`
- `BackTop`
- `Affix`

---

## 🎯 Migration Goals

### Primary Goals
1. **Complete UI Migration**: Replace all Ant Design components with shadcn/ui equivalents
2. **Design System Consistency**: Implement a unified design system based on shadcn/ui principles
3. **Dark/Light Mode**: Full support for theme switching with smooth transitions
4. **Performance**: Reduce bundle size by removing Ant Design (~500KB+ reduction)
5. **Accessibility**: Improve accessibility with shadcn/ui's built-in a11y features
6. **Maintainability**: Create reusable component library for future development

### Success Criteria
- ✅ Zero Ant Design dependencies in `package.json`
- ✅ All components use shadcn/ui styling
- ✅ Dark mode fully functional across all pages
- ✅ No visual regressions
- ✅ All functionality preserved
- ✅ Improved performance metrics
- ✅ Better mobile responsiveness

---

## 🚀 Migration Strategy

### Approach: Incremental Migration
We'll use an **incremental migration strategy** to minimize risk and allow for gradual rollout:

1. **Phase 1**: Foundation & Core Components
2. **Phase 2**: Layout & Navigation
3. **Phase 3**: Forms & Inputs
4. **Phase 4**: Data Display
5. **Phase 5**: Feedback & Modals
6. **Phase 6**: Advanced Components
7. **Phase 7**: Theme System & Polish
8. **Phase 8**: Cleanup & Optimization

### Migration Principles
1. **Component-by-Component**: Migrate one component type at a time
2. **Page-by-Page**: Test each page after component migration
3. **Backward Compatibility**: Keep old components until migration is complete
4. **Feature Parity**: Ensure all functionality is preserved
5. **Progressive Enhancement**: Add improvements incrementally

---

## ✅ Component Migration Checklist

### Phase 1: Foundation & Core Components ⏳
- [x] **Sidebar** - ✅ Completed
- [x] **Card** - ✅ Completed
- [x] **Progress** - ✅ Completed
- [x] **Font (Inter)** - ✅ Completed
- [ ] **Button** - High Priority
- [ ] **Badge** - High Priority
- [ ] **Avatar** - Medium Priority
- [ ] **Skeleton** - Medium Priority
- [ ] **Separator** - Low Priority

**Files to Update:**
- `src/components/UI/shadcn/button.js`
- `src/components/UI/shadcn/badge.js`
- `src/components/UI/shadcn/avatar.js`
- `src/components/UI/shadcn/skeleton.js`
- `src/components/UI/shadcn/separator.js`

**Impact**: ~50+ files use Button component

---

### Phase 2: Layout & Navigation 🔄
- [x] **Sidebar** - ✅ Completed
- [ ] **Header** - High Priority
- [ ] **Navigation Menu** - High Priority
- [ ] **Breadcrumb** - Medium Priority
- [ ] **Tabs** - High Priority (used in multiple pages)
- [ ] **Dropdown Menu** - High Priority
- [ ] **Sheet** (Drawer replacement) - Medium Priority
- [ ] **Scroll Area** - Low Priority

**Files to Update:**
- `src/components/Layout/Header.js`
- `src/components/Layout/MainContent.js`
- `src/components/UI/shadcn/tabs.js`
- `src/components/UI/shadcn/dropdown-menu.js`
- `src/components/UI/shadcn/sheet.js`
- `src/components/UI/shadcn/breadcrumb.js`

**Impact**: Layout affects entire application

---

### Phase 3: Forms & Inputs 📝
- [ ] **Input** - High Priority
- [ ] **Textarea** - High Priority
- [ ] **Select** - High Priority
- [ ] **Checkbox** - High Priority
- [ ] **Radio Group** - Medium Priority
- [ ] **Switch** - High Priority
- [ ] **Label** - High Priority
- [ ] **Form** - High Priority
- [ ] **Slider** - Low Priority
- [ ] **Calendar** (DatePicker replacement) - Medium Priority
- [ ] **File Upload** - Medium Priority

**Files to Update:**
- `src/components/Auth/SignIn.js`
- `src/components/Auth/SignUp.js`
- `src/components/Auth/ResetPassword.js`
- `src/components/Auth/ForgotPassword.js`
- `src/components/Profile/ProfileEdit.js`
- `src/components/Profile/ProfileSecurity.js`
- `src/components/Settings/Settings.js`
- `src/components/Members/MembersForm.js`
- `src/components/StartBusiness/ActionPlan/CreateAction/*.js`
- `src/components/UI/shadcn/input.js`
- `src/components/UI/shadcn/textarea.js`
- `src/components/UI/shadcn/select.js`
- `src/components/UI/shadcn/checkbox.js`
- `src/components/UI/shadcn/radio-group.js`
- `src/components/UI/shadcn/switch.js`
- `src/components/UI/shadcn/label.js`
- `src/components/UI/shadcn/form.js`
- `src/components/UI/shadcn/calendar.js`

**Impact**: ~30+ form components across the app

---

### Phase 4: Data Display 📊
- [x] **Card** - ✅ Completed
- [ ] **Table** - **CRITICAL** (used extensively)
- [ ] **Data Table** (enhanced Table) - High Priority
- [ ] **List** - Medium Priority
- [ ] **Tag** - High Priority
- [ ] **Tooltip** - High Priority
- [ ] **Popover** - High Priority
- [ ] **Dialog** (Modal replacement) - High Priority
- [ ] **Alert** - High Priority
- [ ] **Accordion** (Collapse replacement) - Medium Priority
- [ ] **Empty State** - Medium Priority

**Files to Update:**
- `src/components/Members/table.js`
- `src/components/WorkingGroups/table.js`
- `src/components/Organizations/table.js`
- `src/components/Reform/table.js`
- `src/components/StartBusiness/ActionPlan/table.js`
- `src/components/StartBusiness/MeetingsMinutes/table.js`
- `src/components/Audit/index.js`
- `src/components/Approvals/index.js`
- `src/components/UI/shadcn/table.js`
- `src/components/UI/shadcn/data-table.js`
- `src/components/UI/shadcn/dialog.js`
- `src/components/UI/shadcn/alert.js`
- `src/components/UI/shadcn/tooltip.js`
- `src/components/UI/shadcn/popover.js`
- `src/components/UI/shadcn/accordion.js`

**Impact**: ~40+ files use Table component, ~20+ use Modal

---

### Phase 5: Feedback & Modals 💬
- [ ] **Dialog** (Modal) - High Priority
- [ ] **Alert Dialog** (Popconfirm replacement) - High Priority
- [ ] **Toast** (Message/Notification replacement) - High Priority
- [ ] **Alert** - High Priority
- [ ] **Sheet** (Drawer) - Medium Priority
- [ ] **Command** (Command Palette) - Low Priority
- [ ] **Loading Spinner** - High Priority

**Files to Update:**
- `src/components/UI/shadcn/dialog.js`
- `src/components/UI/shadcn/alert-dialog.js`
- `src/components/UI/shadcn/toast.js`
- `src/components/UI/shadcn/alert.js`
- `src/components/UI/Spinner.js`
- All modal usages across the app

**Impact**: ~30+ modal/dialog usages

---

### Phase 6: Advanced Components 🎨
- [ ] **Gantt Chart** (Keep existing, style with shadcn) - Low Priority
- [ ] **Charts** (ApexCharts/Recharts - keep, style with shadcn) - Low Priority
- [ ] **Rich Text Editor** (React Quill - keep, style with shadcn) - Low Priority
- [ ] **Drag and Drop** (react-dnd - keep functionality, style with shadcn) - Low Priority
- [ ] **Pagination** - High Priority
- [ ] **Scroll Area** - Medium Priority
- [ ] **Resizable** - Low Priority

**Files to Update:**
- Chart components in `src/components/Dashboard/`
- `src/components/UI/Editor/Editor.js`
- `src/components/StartBusiness/ActionPlan/components/Frappe.js`
- `src/components/UI/shadcn/pagination.js`
- `src/components/UI/shadcn/scroll-area.js`

---

### Phase 7: Theme System & Polish 🎨
- [ ] **Theme Provider** - High Priority
- [ ] **Dark Mode Toggle** - High Priority
- [ ] **Color System** - High Priority
- [ ] **CSS Variables** - High Priority
- [ ] **Theme Configuration** - High Priority
- [ ] **Smooth Transitions** - Medium Priority
- [ ] **Animation System** - Low Priority

**Files to Create/Update:**
- `src/styles/theme.js`
- `src/components/UI/ThemeProvider.js`
- `src/components/UI/ThemeToggle.js`
- `src/styles/globals.css` (CSS variables)
- `src/utils/theme.js`
- Update all component styles for theme support

---

### Phase 8: Cleanup & Optimization 🧹
- [ ] **Remove Ant Design** - Remove from package.json
- [ ] **Remove Ant Design Icons** - Replace with lucide-react
- [ ] **Update Imports** - Remove all Ant Design imports
- [ ] **Clean Up Styles** - Remove Ant Design specific styles
- [ ] **Bundle Size Optimization** - Analyze and optimize
- [ ] **Performance Testing** - Lighthouse audit
- [ ] **Accessibility Audit** - WCAG compliance check
- [ ] **Documentation** - Update component documentation

---

## 🎨 Theme System (Dark/Light Mode)

### Theme Architecture

#### 1. CSS Variables System
Create a comprehensive CSS variables system using shadcn/ui's official color scheme (HSL format):

```css
@layer base {
  :root {
    /* shadcn/ui Default Light Theme Colors (HSL format) */
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;
    
    --radius: 0.5rem;
    
    /* Chart colors (for data visualization) */
    --chart-1: 12 76% 61%;
    --chart-2: 173 58% 39%;
    --chart-3: 197 37% 24%;
    --chart-4: 43 74% 66%;
    --chart-5: 27 87% 67%;
  }

  .dark {
    /* shadcn/ui Default Dark Theme Colors (HSL format) */
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    
    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;
    
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 212.7 26.8% 83.9%;
    
    /* Chart colors for dark mode */
    --chart-1: 220 70% 50%;
    --chart-2: 160 60% 45%;
    --chart-3: 30 80% 55%;
    --chart-4: 280 65% 60%;
    --chart-5: 340 75% 55%;
  }
}

* {
  border-color: hsl(var(--border));
}

body {
  background-color: hsl(var(--background));
  color: hsl(var(--foreground));
}
```

#### 2. Theme Provider Component
Create a theme provider that:
- Manages theme state (light/dark)
- Persists theme preference in localStorage
- Provides theme context to all components
- Supports system preference detection
- Adds/removes `.dark` class on `<html>` or `<body>` element (shadcn/ui standard)

**Implementation Note**: shadcn/ui uses the `.dark` class on the root element (typically `<html>`) to toggle themes. This is different from `[data-theme="dark"]` attribute approach.

**File**: `src/components/UI/ThemeProvider.js`

**Example Implementation**:
```jsx
// ThemeProvider.js
import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    // Load theme from localStorage or system preference
    const savedTheme = localStorage.getItem('theme');
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const initialTheme = savedTheme || systemTheme;
    
    setTheme(initialTheme);
    updateTheme(initialTheme);
  }, []);

  const updateTheme = (newTheme) => {
    const root = document.documentElement;
    if (newTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', newTheme);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    updateTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
```

#### 3. Theme Toggle Component
Create a theme toggle button for the header:
- Sun/Moon icon toggle
- Smooth transition animation
- Accessible keyboard navigation

**File**: `src/components/UI/ThemeToggle.js`

#### 4. Theme Integration Points
- **Header**: Add theme toggle button
- **Settings**: Add theme preference setting
- **Redux Store**: Add theme state management (optional)
- **LocalStorage**: Persist user preference

### Migration Strategy for Themes
1. **Step 1**: Replace CSS variables in `src/styles/index.css` with shadcn/ui official colors (HSL format)
2. **Step 2**: Create ThemeProvider component with `.dark` class toggle
3. **Step 3**: Wrap app with ThemeProvider in `src/index.js` or `src/components/App.js`
4. **Step 4**: Update existing shadcn components to use CSS variables (already using them)
5. **Step 5**: Create ThemeToggle component for Header
6. **Step 6**: Add theme toggle to Header component
7. **Step 7**: Test all components in both themes
8. **Step 8**: Add smooth theme transitions and animations
9. **Step 9**: Update all styled-components to use CSS variables
10. **Step 10**: Remove old color constants and replace with CSS variable references

---

## 📅 Implementation Phases

### Phase 1: Foundation (Week 1-2) 🔨
**Goal**: Establish shadcn/ui foundation and core components

**Tasks**:
- [ ] Set up shadcn/ui component structure
- [ ] Create base shadcn components (Button, Badge, Avatar)
- [ ] Implement CSS variables system
- [ ] Create ThemeProvider
- [ ] Update existing migrated components (Card, Progress, Sidebar)
- [ ] Create component documentation template

**Deliverables**:
- Base shadcn component library structure
- Theme system foundation
- 5+ core components migrated

**Testing**:
- Component unit tests
- Visual regression tests
- Theme switching tests

---

### Phase 2: Layout & Navigation (Week 3-4) 🧭
**Goal**: Migrate layout and navigation components

**Tasks**:
- [ ] Migrate Header component
- [ ] Migrate Navigation Menu
- [ ] Migrate Tabs component
- [ ] Migrate Dropdown Menu
- [ ] Migrate Breadcrumb
- [ ] Update Layout structure
- [ ] Test responsive design

**Deliverables**:
- Complete layout system migrated
- Navigation fully functional
- Responsive design verified

**Testing**:
- Layout tests across all breakpoints
- Navigation functionality tests
- Accessibility tests

---

### Phase 3: Forms & Inputs (Week 5-6) 📝
**Goal**: Migrate all form components

**Tasks**:
- [ ] Migrate Input components
- [ ] Migrate Select components
- [ ] Migrate Checkbox and Radio
- [ ] Migrate Switch component
- [ ] Migrate Form component
- [ ] Migrate DatePicker/Calendar
- [ ] Update all form pages
- [ ] Form validation testing

**Deliverables**:
- All form components migrated
- Form validation working
- All auth pages updated

**Testing**:
- Form validation tests
- Input accessibility tests
- Cross-browser compatibility tests

---

### Phase 4: Data Display (Week 7-8) 📊
**Goal**: Migrate data display components (most critical)

**Tasks**:
- [ ] Migrate Table component (CRITICAL)
- [ ] Migrate Data Table with sorting/filtering
- [ ] Migrate Dialog/Modal
- [ ] Migrate Tooltip and Popover
- [ ] Migrate Alert component
- [ ] Migrate Tag and Badge
- [ ] Update all table pages
- [ ] Update all modal usages

**Deliverables**:
- Table component fully migrated
- All modals migrated
- Data display components working

**Testing**:
- Table functionality tests
- Modal tests
- Data display tests
- Performance tests

---

### Phase 5: Feedback & Modals (Week 9) 💬
**Goal**: Migrate feedback components

**Tasks**:
- [ ] Migrate Toast/Notification system
- [ ] Migrate Alert Dialog
- [ ] Migrate Loading Spinner
- [ ] Update all feedback usages
- [ ] Add smooth animations

**Deliverables**:
- Feedback system migrated
- Toast notifications working
- Loading states improved

**Testing**:
- Toast notification tests
- Loading state tests
- User feedback tests

---

### Phase 6: Advanced Components (Week 10) 🎨
**Goal**: Style advanced components with shadcn

**Tasks**:
- [ ] Style chart components
- [ ] Style rich text editor
- [ ] Style drag and drop
- [ ] Migrate Pagination
- [ ] Add Scroll Area where needed
- [ ] Polish animations

**Deliverables**:
- Advanced components styled
- Consistent design language
- Smooth animations

**Testing**:
- Chart rendering tests
- Editor functionality tests
- Drag and drop tests

---

### Phase 7: Theme System (Week 11) 🎨
**Goal**: Implement dark/light mode

**Tasks**:
- [ ] Complete CSS variables system
- [ ] Add theme toggle to Header
- [ ] Update all components for theme support
- [ ] Add theme transitions
- [ ] Test all pages in both themes
- [ ] Add theme preference to settings
- [ ] Persist theme preference

**Deliverables**:
- Full dark/light mode support
- Theme toggle functional
- All components theme-aware
- Smooth theme transitions

**Testing**:
- Theme switching tests
- Theme persistence tests
- Visual tests in both themes
- Performance tests

---

### Phase 8: Cleanup & Optimization (Week 12) 🧹
**Goal**: Final cleanup and optimization

**Tasks**:
- [ ] Remove Ant Design dependencies
- [ ] Replace Ant Design icons with lucide-react
- [ ] Clean up unused styles
- [ ] Optimize bundle size
- [ ] Performance optimization
- [ ] Accessibility audit
- [ ] Update documentation
- [ ] Final testing

**Deliverables**:
- Zero Ant Design dependencies
- Optimized bundle size
- Complete documentation
- Production-ready code

**Testing**:
- Full regression testing
- Performance audit
- Accessibility audit
- Cross-browser testing
- Mobile testing

---

## 🎨 Design Tokens & Design System

### Color Palette

#### shadcn/ui Official Color System (HSL Format)

shadcn/ui uses HSL (Hue, Saturation, Lightness) color format for better theme support and color manipulation. All colors are defined as CSS variables in HSL format.

##### Light Theme Colors
- **Background**: `hsl(0 0% 100%)` - Pure white
- **Foreground**: `hsl(222.2 84% 4.9%)` - Dark slate for text
- **Primary**: `hsl(222.2 47.4% 11.2%)` - Dark blue-gray
- **Primary Foreground**: `hsl(210 40% 98%)` - Light gray for text on primary
- **Secondary**: `hsl(210 40% 96.1%)` - Light blue-gray
- **Secondary Foreground**: `hsl(222.2 47.4% 11.2%)` - Dark text on secondary
- **Muted**: `hsl(210 40% 96.1%)` - Muted background
- **Muted Foreground**: `hsl(215.4 16.3% 46.9%)` - Muted text
- **Accent**: `hsl(210 40% 96.1%)` - Accent background
- **Accent Foreground**: `hsl(222.2 47.4% 11.2%)` - Accent text
- **Destructive**: `hsl(0 84.2% 60.2%)` - Red for errors/destructive actions
- **Destructive Foreground**: `hsl(210 40% 98%)` - Light text on destructive
- **Border**: `hsl(214.3 31.8% 91.4%)` - Light gray borders
- **Input**: `hsl(214.3 31.8% 91.4%)` - Input border color
- **Ring**: `hsl(222.2 84% 4.9%)` - Focus ring color

##### Dark Theme Colors
- **Background**: `hsl(222.2 84% 4.9%)` - Very dark blue-gray
- **Foreground**: `hsl(210 40% 98%)` - Light gray for text
- **Primary**: `hsl(210 40% 98%)` - Light gray (inverted from light)
- **Primary Foreground**: `hsl(222.2 47.4% 11.2%)` - Dark text on primary
- **Secondary**: `hsl(217.2 32.6% 17.5%)` - Dark blue-gray
- **Secondary Foreground**: `hsl(210 40% 98%)` - Light text on secondary
- **Muted**: `hsl(217.2 32.6% 17.5%)` - Dark muted background
- **Muted Foreground**: `hsl(215 20.2% 65.1%)` - Muted text
- **Accent**: `hsl(217.2 32.6% 17.5%)` - Dark accent background
- **Accent Foreground**: `hsl(210 40% 98%)` - Light accent text
- **Destructive**: `hsl(0 62.8% 30.6%)` - Darker red for dark mode
- **Destructive Foreground**: `hsl(210 40% 98%)` - Light text on destructive
- **Border**: `hsl(217.2 32.6% 17.5%)` - Dark borders
- **Input**: `hsl(217.2 32.6% 17.5%)` - Dark input border
- **Ring**: `hsl(212.7 26.8% 83.9%)` - Light focus ring

##### Chart Colors (for data visualization)
**Light Theme**:
- Chart 1: `hsl(12 76% 61%)` - Orange/red
- Chart 2: `hsl(173 58% 39%)` - Teal/green
- Chart 3: `hsl(197 37% 24%)` - Dark blue
- Chart 4: `hsl(43 74% 66%)` - Yellow
- Chart 5: `hsl(27 87% 67%)` - Orange

**Dark Theme**:
- Chart 1: `hsl(220 70% 50%)` - Blue
- Chart 2: `hsl(160 60% 45%)` - Green
- Chart 3: `hsl(30 80% 55%)` - Orange
- Chart 4: `hsl(280 65% 60%)` - Purple
- Chart 5: `hsl(340 75% 55%)` - Pink

#### Migration from Current Colors to shadcn/ui Official Colors

**Color Mapping Table**:

| Current Color Name | Hex Value | shadcn/ui Replacement | HSL Value (shadcn/ui) | Usage Notes |
|-------------------|-----------|----------------------|----------------------|-------------|
| Blue | `#527BDD` | `--primary` (override) or default `--primary` | `222 71% 59%` (custom) or `222.2 47.4% 11.2%` (default) | Primary actions, buttons, links. **Note**: shadcn/ui default is darker. Override if brand requires. |
| Dark Blue | `#313976` | `--primary` (darker) or `--foreground` | `222.2 47.4% 11.2%` | Headings, emphasis text |
| Background | `#FCFDFF` | `--background` | `0 0% 100%` (light) / `222.2 84% 4.9%` (dark) | Page background, card backgrounds |
| Text | `#252A32` | `--foreground` | `222.2 84% 4.9%` (light) / `210 40% 98%` (dark) | Body text, headings |
| Border Grey | `#E2E4ED` | `--border` | `214.3 31.8% 91.4%` (light) / `217.2 32.6% 17.5%` (dark) | Borders, dividers, input borders |
| Text Light | `#717A8F` | `--muted-foreground` | `215.4 16.3% 46.9%` (light) / `215 20.2% 65.1%` (dark) | Secondary text, placeholders |
| Dark | `#535263` | `--secondary` or `--muted` | `217.2 32.6% 17.5%` | Dark backgrounds (similar to dark mode secondary) |
| Danger | `#F181AB` | `--destructive` | `0 84.2% 60.2%` (light) / `0 62.8% 30.6%` (dark) | Errors, destructive actions, warnings |
| Icon Color | `#DADCE2` | `--muted-foreground` | `215.4 16.3% 46.9%` | Icons, decorative elements |
| Chart Yellow | `#F4D581` | `--chart-4` | `43 74% 66%` (light) / `43 80% 70%` (dark) | Charts, data visualization |
| Chart Blue | `#527BDD` | `--chart-1` or `--primary` | `12 76% 61%` (chart) or custom | Charts, data visualization |
| Chart Red | `#F4C9D9` | `--destructive` or `--chart-1` | `0 84.2% 60.2%` (destructive) | Charts, error indicators |
| Chart Grey | `#E5E7EF` | `--muted` | `210 40% 96.1%` (light) | Charts, neutral data |

**Important Notes**:
1. **Primary Color Difference**: shadcn/ui's default `--primary` is `hsl(222.2 47.4% 11.2%)` (dark blue-gray), which is much darker than current `#527BDD`. Consider overriding if brand identity requires the brighter blue.
2. **HSL Format**: All shadcn/ui colors use HSL format without `hsl()` wrapper in CSS variables. Use as: `hsl(var(--primary))` in CSS.
3. **Theme Awareness**: All colors automatically adapt to light/dark theme when using CSS variables.
4. **Migration Strategy**: Start with shadcn/ui defaults, then override only if necessary for brand identity.

#### Semantic Color Usage
For task status and semantic meanings, use shadcn/ui's color system:
- **Success/Completed**: Use `--primary` or create success variant (green)
- **Warning/In Progress**: Use chart colors (yellow/orange)
- **Error/Past Due**: Use `--destructive` (red)
- **Info**: Use `--primary` or `--accent`
- **Neutral/Not Started**: Use `--muted`

#### Custom Brand Colors (Optional)
If you need to maintain brand colors (like the current blue `#527BDD`), you can override shadcn/ui's default colors:

**Option 1: Override Primary Color (Recommended)**
```css
:root {
  /* Keep shadcn/ui structure but override primary */
  --primary: 222 71% 59%; /* #527BDD converted to HSL */
  --primary-foreground: 0 0% 100%; /* White text on primary */
}

.dark {
  /* Adjust dark mode primary if needed */
  --primary: 222 65% 65%; /* Lighter blue for dark mode */
  --primary-foreground: 0 0% 100%;
}
```

**Option 2: Add Custom Brand Variables**
```css
:root {
  /* Keep shadcn/ui defaults, add custom brand colors */
  --brand-blue: 222 71% 59%; /* #527BDD */
  --brand-dark-blue: 222 47% 30%; /* #313976 */
  /* Use these in specific components that need brand colors */
}
```

**Option 3: Create Custom Theme Variant**
Create a separate theme variant (e.g., `[data-theme="brand"]`) while keeping shadcn/ui defaults as fallback.

**Recommendation**: 
- For consistency, use shadcn/ui's default colors initially
- Only override if brand identity requires specific colors
- Test both light and dark modes with custom colors
- Ensure color contrast meets accessibility standards

### Typography
- **Font Family**: Inter (already migrated ✅)
- **Font Sizes**: Use shadcn typography scale
- **Line Heights**: Use shadcn line height scale
- **Font Weights**: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)

### Spacing
- **Base Unit**: 4px
- **Scale**: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128

### Border Radius
shadcn/ui uses a single `--radius` variable that applies to all components for consistency:
- **Default Radius**: `0.5rem` (8px) - defined in `--radius` CSS variable
- **Small**: `calc(var(--radius) - 2px)` - 6px
- **Medium**: `var(--radius)` - 8px (default)
- **Large**: `calc(var(--radius) + 2px)` - 10px
- **Full**: `9999px` (for pills/badges/avatars)

All components use `border-radius: var(--radius)` by default for consistency.

### Shadows
shadcn/ui uses subtle shadows that adapt to themes:
- **Card Shadow**: `0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)`
- **Dropdown/Popover Shadow**: `0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)`
- **Dialog/Modal Shadow**: `0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)`

In dark mode, shadows are more subtle or use colored shadows for better visibility.

### Design System Files Structure

```
src/
├── styles/
│   ├── globals.css          # Global styles with shadcn/ui CSS variables
│   ├── design-tokens.js     # Design tokens (JavaScript)
│   └── theme.css            # Theme-specific styles (if needed)
├── components/
│   └── UI/
│       ├── ThemeProvider.js # Theme context provider
│       ├── ThemeToggle.js   # Theme toggle component
│       └── shadcn/          # All shadcn/ui components
└── utils/
    ├── theme.js             # Theme utilities
    └── design-system.js     # Design system utilities
```

### CSS Variables Implementation

**File**: `src/styles/globals.css` or `src/styles/index.css`

Replace the current CSS variables with shadcn/ui's official color scheme:

```css
@layer base {
  :root {
    /* shadcn/ui Light Theme - Official Colors */
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;
    --radius: 0.5rem;
    
    /* Chart colors */
    --chart-1: 12 76% 61%;
    --chart-2: 173 58% 39%;
    --chart-3: 197 37% 24%;
    --chart-4: 43 74% 66%;
    --chart-5: 27 87% 67%;
  }

  .dark {
    /* shadcn/ui Dark Theme - Official Colors */
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 212.7 26.8% 83.9%;
    
    /* Chart colors for dark mode */
    --chart-1: 220 70% 50%;
    --chart-2: 160 60% 45%;
    --chart-3: 30 80% 55%;
    --chart-4: 280 65% 60%;
    --chart-5: 340 75% 55%;
  }
}

* {
  border-color: hsl(var(--border));
}

body {
  background-color: hsl(var(--background));
  color: hsl(var(--foreground));
  font-family: 'Inter', sans-serif;
}
```

### Migration Steps for Colors

1. **Replace CSS Variables**: Update `src/styles/index.css` with shadcn/ui color scheme
2. **Update Component Styles**: Replace hardcoded colors with CSS variables
3. **Update styled-components**: Use CSS variables in styled-components
4. **Test Both Themes**: Ensure all colors work in light and dark mode
5. **Update Charts**: Use chart color variables for data visualization
6. **Remove Old Colors**: Remove current color constants file or update it to reference CSS variables

---

## 🧪 Testing Strategy

### Unit Testing
- Test each shadcn component in isolation
- Test component props and behaviors
- Test theme switching
- Test accessibility features

### Integration Testing
- Test component interactions
- Test form submissions
- Test data display
- Test navigation flows

### Visual Regression Testing
- Screenshot comparisons
- Visual diff testing
- Theme comparison testing
- Responsive design testing

### Accessibility Testing
- WCAG 2.1 AA compliance
- Keyboard navigation testing
- Screen reader testing
- Color contrast testing

### Performance Testing
- Bundle size monitoring
- Load time testing
- Render performance testing
- Memory leak testing

### Browser Testing
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

---

## 🔄 Rollback Plan

### If Migration Fails
1. **Keep Ant Design**: Maintain Ant Design in package.json as fallback
2. **Feature Flags**: Use feature flags to toggle between old/new components
3. **Gradual Rollback**: Roll back component by component if needed
4. **Branch Strategy**: Keep migration in separate branch until complete

### Risk Mitigation
- **Incremental Migration**: Migrate one component at a time
- **Thorough Testing**: Test each component before moving to next
- **Code Reviews**: Review all migration changes
- **Staging Environment**: Test in staging before production
- **User Feedback**: Gather user feedback during migration

---

## 📝 Notes & Considerations

### Key Challenges
1. **Table Component**: Most complex component, used extensively
2. **Form Validation**: Ensure form validation works with new components
3. **Modal/Dialog**: Many modals need migration
4. **Theme System**: Ensuring all components support themes
5. **Bundle Size**: Monitoring bundle size during migration

### Dependencies to Remove
- `antd` (~500KB)
- `@ant-design/icons` (~200KB)
- Ant Design CSS (~100KB)

### Dependencies to Add
- `lucide-react` (for icons, ~50KB)
- `class-variance-authority` (for component variants)
- `clsx` (for className utilities)
- `tailwind-merge` (for merging Tailwind classes)

### File Structure
```
src/
├── components/
│   ├── UI/
│   │   └── shadcn/
│   │       ├── button.js
│   │       ├── card.js
│   │       ├── input.js
│   │       ├── table.js
│   │       ├── dialog.js
│   │       └── ...
│   └── ...
├── styles/
│   ├── theme.css
│   ├── design-tokens.js
│   └── globals.css
└── utils/
    ├── theme.js
    └── design-system.js
```

### Best Practices
1. **Component Composition**: Use shadcn's composition pattern
2. **Accessibility**: Always include accessibility features
3. **Theme Support**: All components must support themes
4. **Responsive Design**: Ensure mobile-first approach
5. **Performance**: Optimize for performance
6. **Documentation**: Document all components
7. **Testing**: Test thoroughly before deployment

---

## 🎯 Success Metrics

### Performance Metrics
- **Bundle Size**: Reduce by ~500KB+
- **Load Time**: Improve by 20%+
- **Lighthouse Score**: 90+ in all categories

### Quality Metrics
- **Accessibility**: WCAG 2.1 AA compliant
- **Browser Support**: Support all modern browsers
- **Mobile Responsiveness**: 100% mobile-friendly

### User Experience Metrics
- **Theme Switching**: Smooth transitions
- **Component Consistency**: 100% consistent design
- **User Satisfaction**: Positive user feedback

---

## 📚 Resources

### shadcn/ui Documentation
- [shadcn/ui Website](https://ui.shadcn.com/)
- [shadcn/ui Components](https://ui.shadcn.com/docs/components)
- [shadcn/ui Themes](https://ui.shadcn.com/themes)
- [shadcn/ui Installation](https://ui.shadcn.com/docs/installation)
- [shadcn/ui Styling](https://ui.shadcn.com/docs/theming)

### shadcn/ui Design System
- **Color System**: Uses HSL format for better theme support
- **Design Tokens**: All defined as CSS variables
- **Theme Toggle**: Uses `.dark` class on root element
- **Components**: Built on Radix UI primitives
- **Styling**: Uses Tailwind CSS (optional) or CSS-in-JS

### Official shadcn/ui Color Scheme
The migration plan uses shadcn/ui's **official default color scheme** as defined in their documentation:
- Light theme: Neutral grays with dark foreground
- Dark theme: Dark backgrounds with light foreground
- All colors in HSL format for better manipulation
- Chart colors included for data visualization
- Consistent radius and spacing system

### Design System Resources
- [Tailwind CSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/) (shadcn/ui is built on Radix UI)
- [Inter Font](https://rsms.me/inter/)

### Migration Resources
- [Ant Design to shadcn Migration Guide](https://ui.shadcn.com/docs)
- [Component Comparison Chart](#) (to be created)

---

## 👥 Team & Responsibilities

### Development Team
- **Frontend Developer**: Component migration
- **UI/UX Designer**: Design system and theme design
- **QA Engineer**: Testing and quality assurance
- **Product Owner**: Requirements and approvals

### Communication
- **Daily Standups**: Progress updates
- **Weekly Reviews**: Phase completion reviews
- **Sprint Planning**: Plan next phase tasks
- **Retrospectives**: Learn and improve

---

## 📅 Timeline Summary

| Phase | Duration | Status |
|-------|----------|--------|
| Phase 1: Foundation | Week 1-2 | ⏳ In Progress |
| Phase 2: Layout & Navigation | Week 3-4 | ⏸️ Pending |
| Phase 3: Forms & Inputs | Week 5-6 | ⏸️ Pending |
| Phase 4: Data Display | Week 7-8 | ⏸️ Pending |
| Phase 5: Feedback & Modals | Week 9 | ⏸️ Pending |
| Phase 6: Advanced Components | Week 10 | ⏸️ Pending |
| Phase 7: Theme System | Week 11 | ⏸️ Pending |
| Phase 8: Cleanup & Optimization | Week 12 | ⏸️ Pending |

**Total Estimated Time**: 12 weeks (3 months)

---

## ✅ Next Steps

1. **Review this plan** with the team
2. **Set up shadcn/ui** component structure
3. **Create ThemeProvider** component
4. **Start Phase 1** migration (Button, Badge, Avatar)
5. **Set up testing** infrastructure
6. **Begin incremental migration** following the phases

---

**Last Updated**: December 2024
**Version**: 1.1.0
**Status**: 🟡 In Planning

---

## 📝 Changelog

### v1.1.0 (Color Scheme Update)
- ✅ Updated to use shadcn/ui's **official color scheme** (HSL format)
- ✅ Added comprehensive color migration guide
- ✅ Updated theme system to use `.dark` class (shadcn/ui standard)
- ✅ Added chart colors for data visualization
- ✅ Added custom brand color options
- ✅ Added GitHub commit instructions (do not commit until instructed)

### v1.0.0 (Initial Plan)
- Created comprehensive migration plan
- Defined 8 migration phases
- Outlined theme system architecture
- Created component migration checklist
- Defined testing strategy
- Set up timeline and success metrics

---

## ⚠️ Important Reminders

### Git Workflow
- **DO NOT** commit changes to GitHub until explicitly instructed
- Work locally and test thoroughly
- Keep migration work in a local branch
- Only commit when migration phase is complete and tested

### Color Scheme
- This plan uses **shadcn/ui's official default color scheme**
- All colors are in HSL format for better theme support
- Current brand colors can be preserved by overriding CSS variables
- Test both light and dark themes thoroughly

### Theme Implementation
- Use `.dark` class on `<html>` element (shadcn/ui standard)
- All components should use CSS variables
- Ensure smooth transitions between themes
- Test theme persistence in localStorage

---

**Questions or Concerns?** Please reach out to the development team.

**Happy Migrating! 🚀**

