import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DocsLayout from './layout/DocsLayout';
import HomePage from './pages/HomePage';
import ButtonPage from './pages/ButtonPage';
import CardPage from './pages/CardPage';
import StatCardPage from './pages/StatCardPage';
import BadgePage from './pages/BadgePage';
import ColorTokensPage from './pages/ColorTokensPage';
import TypographyPage from './pages/TypographyPage';
import SpacingPage from './pages/SpacingPage';
import ElevationPage from './pages/ElevationPage';
import RadiusPage from './pages/RadiusPage';
import CheckboxPage from './pages/CheckboxPage';
import RadioPage from './pages/RadioPage';
import TogglePage from './pages/TogglePage';
import TabsPage from './pages/TabsPage';
import TooltipPage from './pages/TooltipPage';
import DataTablePage from './pages/DataTablePage';
import TextInputPage from './pages/TextInputPage';
import TextareaPage from './pages/TextareaPage';
import SelectPage from './pages/SelectPage';
import AlertPage from './pages/AlertPage';
import ModalPage from './pages/ModalPage';
import ToastPage from './pages/ToastPage';
import SpinnerPage from './pages/SpinnerPage';
import ProgressPage from './pages/ProgressPage';
import { ToastProvider } from './components/Toast';
import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ToastProvider>
      <BrowserRouter>
        <DocsLayout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/color-tokens" element={<ColorTokensPage />} />
            <Route path="/typography" element={<TypographyPage />} />
            <Route path="/spacing" element={<SpacingPage />} />
            <Route path="/elevation" element={<ElevationPage />} />
            <Route path="/radius" element={<RadiusPage />} />
            <Route path="/badge" element={<BadgePage />} />
            <Route path="/button" element={<ButtonPage />} />
            <Route path="/card" element={<CardPage />} />
            <Route path="/stat-card" element={<StatCardPage />} />
            <Route path="/checkbox" element={<CheckboxPage />} />
            <Route path="/radio" element={<RadioPage />} />
            <Route path="/select" element={<SelectPage />} />
            <Route path="/tabs" element={<TabsPage />} />
            <Route path="/toggle" element={<TogglePage />} />
            <Route path="/tooltip" element={<TooltipPage />} />
            <Route path="/data-table" element={<DataTablePage />} />
            <Route path="/text-input" element={<TextInputPage />} />
            <Route path="/textarea" element={<TextareaPage />} />
            <Route path="/alert" element={<AlertPage />} />
            <Route path="/modal" element={<ModalPage />} />
            <Route path="/toast" element={<ToastPage />} />
            <Route path="/spinner" element={<SpinnerPage />} />
            <Route path="/progress" element={<ProgressPage />} />
          </Routes>
        </DocsLayout>
      </BrowserRouter>
    </ToastProvider>
  </React.StrictMode>
);