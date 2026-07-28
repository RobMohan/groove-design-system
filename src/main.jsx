import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DocsLayout from './layout/DocsLayout';
import HomePage from './pages/HomePage';

// Getting started & resources
import OverviewPage from './pages/OverviewPage';
import InstallationPage from './pages/InstallationPage';
import ThemingPage from './pages/ThemingPage';
import ContributionPage from './pages/ContributionPage';
import StatusPage from './pages/StatusPage';
import ChangelogPage from './pages/ChangelogPage';

// Foundations
import ColorTokensPage from './pages/ColorTokensPage';
import ColorUsagePage from './pages/ColorUsagePage';
import TypographyPage from './pages/TypographyPage';
import IconographyPage from './pages/IconographyPage';
import SpacingPage from './pages/SpacingPage';
import SizingPage from './pages/SizingPage';
import LayoutPage from './pages/LayoutPage';
import ElevationPage from './pages/ElevationPage';
import RadiusPage from './pages/RadiusPage';
import MotionPage from './pages/MotionPage';
import LayeringPage from './pages/LayeringPage';
import AccessibilityPage from './pages/AccessibilityPage';

// Components
import AccordionPage from './pages/AccordionPage';
import AlertPage from './pages/AlertPage';
import AvatarPage from './pages/AvatarPage';
import BadgePage from './pages/BadgePage';
import BannerPage from './pages/BannerPage';
import BreadcrumbsPage from './pages/BreadcrumbsPage';
import ButtonPage from './pages/ButtonPage';
import ButtonGroupPage from './pages/ButtonGroupPage';
import CardPage from './pages/CardPage';
import CheckboxPage from './pages/CheckboxPage';
import ChipPage from './pages/ChipPage';
import ComboboxPage from './pages/ComboboxPage';
import CommandPalettePage from './pages/CommandPalettePage';
import DataTablePage from './pages/DataTablePage';
import DatePickerPage from './pages/DatePickerPage';
import DividerPage from './pages/DividerPage';
import DrawerPage from './pages/DrawerPage';
import EmptyStatePage from './pages/EmptyStatePage';
import FieldPage from './pages/FieldPage';
import FileUploadPage from './pages/FileUploadPage';
import IconButtonPage from './pages/IconButtonPage';
import LinkPage from './pages/LinkPage';
import ListPage from './pages/ListPage';
import MenuPage from './pages/MenuPage';
import ModalPage from './pages/ModalPage';
import MultiSelectPage from './pages/MultiSelectPage';
import NumberInputPage from './pages/NumberInputPage';
import PaginationPage from './pages/PaginationPage';
import PopoverPage from './pages/PopoverPage';
import ProgressPage from './pages/ProgressPage';
import RadioPage from './pages/RadioPage';
import SegmentedControlPage from './pages/SegmentedControlPage';
import SelectPage from './pages/SelectPage';
import SkeletonPage from './pages/SkeletonPage';
import SliderPage from './pages/SliderPage';
import SpinnerPage from './pages/SpinnerPage';
import StatCardPage from './pages/StatCardPage';
import StepperPage from './pages/StepperPage';
import TabsPage from './pages/TabsPage';
import TextInputPage from './pages/TextInputPage';
import TextareaPage from './pages/TextareaPage';
import ToastPage from './pages/ToastPage';
import TogglePage from './pages/TogglePage';
import TooltipPage from './pages/TooltipPage';

import { ToastProvider } from './components/Toast';
import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ToastProvider>
      <BrowserRouter>
        <DocsLayout>
          <Routes>
            <Route path="/" element={<HomePage />} />

            {/* Getting started & resources */}
            <Route path="/overview" element={<OverviewPage />} />
            <Route path="/installation" element={<InstallationPage />} />
            <Route path="/theming" element={<ThemingPage />} />
            <Route path="/contributing" element={<ContributionPage />} />
            <Route path="/status" element={<StatusPage />} />
            <Route path="/changelog" element={<ChangelogPage />} />

            {/* Foundations */}
            <Route path="/color-tokens" element={<ColorTokensPage />} />
            <Route path="/color-usage" element={<ColorUsagePage />} />
            <Route path="/typography" element={<TypographyPage />} />
            <Route path="/iconography" element={<IconographyPage />} />
            <Route path="/spacing" element={<SpacingPage />} />
            <Route path="/sizing" element={<SizingPage />} />
            <Route path="/layout" element={<LayoutPage />} />
            <Route path="/elevation" element={<ElevationPage />} />
            <Route path="/radius" element={<RadiusPage />} />
            <Route path="/motion" element={<MotionPage />} />
            <Route path="/layering" element={<LayeringPage />} />
            <Route path="/accessibility" element={<AccessibilityPage />} />

            {/* Components */}
            <Route path="/accordion" element={<AccordionPage />} />
            <Route path="/alert" element={<AlertPage />} />
            <Route path="/avatar" element={<AvatarPage />} />
            <Route path="/badge" element={<BadgePage />} />
            <Route path="/banner" element={<BannerPage />} />
            <Route path="/breadcrumbs" element={<BreadcrumbsPage />} />
            <Route path="/button" element={<ButtonPage />} />
            <Route path="/button-group" element={<ButtonGroupPage />} />
            <Route path="/card" element={<CardPage />} />
            <Route path="/checkbox" element={<CheckboxPage />} />
            <Route path="/chip" element={<ChipPage />} />
            <Route path="/combobox" element={<ComboboxPage />} />
            <Route path="/command-palette" element={<CommandPalettePage />} />
            <Route path="/data-table" element={<DataTablePage />} />
            <Route path="/date-picker" element={<DatePickerPage />} />
            <Route path="/divider" element={<DividerPage />} />
            <Route path="/drawer" element={<DrawerPage />} />
            <Route path="/empty-state" element={<EmptyStatePage />} />
            <Route path="/field" element={<FieldPage />} />
            <Route path="/file-upload" element={<FileUploadPage />} />
            <Route path="/icon-button" element={<IconButtonPage />} />
            <Route path="/link" element={<LinkPage />} />
            <Route path="/list" element={<ListPage />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/modal" element={<ModalPage />} />
            <Route path="/multi-select" element={<MultiSelectPage />} />
            <Route path="/number-input" element={<NumberInputPage />} />
            <Route path="/pagination" element={<PaginationPage />} />
            <Route path="/popover" element={<PopoverPage />} />
            <Route path="/progress" element={<ProgressPage />} />
            <Route path="/radio" element={<RadioPage />} />
            <Route path="/segmented-control" element={<SegmentedControlPage />} />
            <Route path="/select" element={<SelectPage />} />
            <Route path="/skeleton" element={<SkeletonPage />} />
            <Route path="/slider" element={<SliderPage />} />
            <Route path="/spinner" element={<SpinnerPage />} />
            <Route path="/stat-card" element={<StatCardPage />} />
            <Route path="/stepper" element={<StepperPage />} />
            <Route path="/tabs" element={<TabsPage />} />
            <Route path="/text-input" element={<TextInputPage />} />
            <Route path="/textarea" element={<TextareaPage />} />
            <Route path="/toast" element={<ToastPage />} />
            <Route path="/toggle" element={<TogglePage />} />
            <Route path="/tooltip" element={<TooltipPage />} />
          </Routes>
        </DocsLayout>
      </BrowserRouter>
    </ToastProvider>
  </React.StrictMode>
);
