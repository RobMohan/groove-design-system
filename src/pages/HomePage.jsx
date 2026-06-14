import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import Card from '../components/Card';
import StatCard from '../components/StatCard';
import { Component, Moon, TestTube2, Accessibility, ArrowRight } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto">
        {/* Hero Section */}
        <div className="mb-16 text-center">
          <h1 className="text-6xl font-bold mb-6">Groove Design System</h1>
          <p className="text-xl text-ink-muted mb-8 max-w-2xl mx-auto">
            A comprehensive, accessible component library built with React and Tailwind CSS —
            24 components and 5 design foundations, with full light &amp; dark theming and a
            TanStack-powered data table.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/button">
              <Button variant="primary" size="large">
                Get Started
              </Button>
            </Link>
            <a href="https://github.com/RobMohan/groove-design-system" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="large">
                View on GitHub
              </Button>
            </a>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          <StatCard value="24" label="Components" />
          <StatCard value="5" label="Foundations" />
          <StatCard value="112" label="Passing tests" />
          <StatCard value="2" label="Themes (light / dark)" />
        </div>

        {/* About This Project */}
        <div className="mb-16">
          <Card
            title="About This Project"
            description="An exploration of AI-assisted design system development"
          >
            <div className="space-y-4 text-ink-muted">
              <p>
                Groove explores how AI can speed up design system workflows and improve
                collaboration between designers and developers — translating design concepts
                into production-ready components, generating documentation, and keeping the
                library consistent and well-tested.
              </p>
              <p>
                Every component is built on a shared token foundation (color, typography,
                spacing, elevation, radius) and ships with interactive docs and unit tests.
              </p>
            </div>
          </Card>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          <Card title="Token-driven theming" description="Semantic tokens power a built-in light and dark mode — toggle it from the sidebar.">
            <Moon size={28} className="text-primary" />
          </Card>
          <Card title="24 components" description="From buttons and inputs to modals, toasts, menus, and a full data table.">
            <Component size={28} className="text-primary" />
          </Card>
          <Card title="Fully tested" description="112 unit tests across 15 suites keep behavior reliable.">
            <TestTube2 size={28} className="text-primary" />
          </Card>
          <Card title="Accessible" description="Keyboard navigation, ARIA roles, and focus states throughout.">
            <Accessibility size={28} className="text-primary" />
          </Card>
        </div>

        {/* Components Overview */}
        <div className="mb-16">
          <h2 className="text-4xl font-bold mb-8">Highlights</h2>
          <div className="space-y-6">
            <Card
              title="Button"
              description="7 variants, 4 sizes, icon support, and comprehensive states"
              footer={
                <Link to="/button" className="flex items-center gap-2 text-primary font-medium hover:underline">
                  View Documentation <ArrowRight size={18} />
                </Link>
              }
            >
              <div className="flex gap-3 flex-wrap">
                <Button variant="primary" size="small">Primary</Button>
                <Button variant="secondary" size="small">Secondary</Button>
                <Button variant="destructive" size="small">Destructive</Button>
                <Button variant="outline" size="small">Outline</Button>
              </div>
            </Card>

            <Card
              title="Data Table"
              description="Powered by TanStack Table — sorting, filtering, search, row selection, and pagination"
              footer={
                <Link to="/data-table" className="flex items-center gap-2 text-primary font-medium hover:underline">
                  View Documentation <ArrowRight size={18} />
                </Link>
              }
            >
              <p className="text-sm text-ink-muted">
                Keeps the Groove visual style while delegating table logic to a headless engine.
              </p>
            </Card>

            <Card
              title="Overlays &amp; feedback"
              description="Modal, Toast, Tooltip, Alert, Menu, and Popover patterns"
              footer={
                <Link to="/modal" className="flex items-center gap-2 text-primary font-medium hover:underline">
                  View Documentation <ArrowRight size={18} />
                </Link>
              }
            >
              <p className="text-sm text-ink-muted">
                Portal-based dialogs and an imperative toast system built for real apps.
              </p>
            </Card>
          </div>
        </div>

        {/* Color Palette */}
        <div className="mb-16">
          <h2 className="text-4xl font-bold mb-8">Color Palette</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <div className="bg-primary h-24 rounded-lg mb-3"></div>
              <div className="font-semibold">Primary</div>
              <div className="text-sm text-ink-muted">#588ae0</div>
            </div>
            <div>
              <div className="bg-secondary h-24 rounded-lg mb-3"></div>
              <div className="font-semibold">Secondary</div>
              <div className="text-sm text-ink-muted">#7c3aed</div>
            </div>
            <div>
              <div className="bg-positive h-24 rounded-lg mb-3"></div>
              <div className="font-semibold">Positive</div>
              <div className="text-sm text-ink-muted">#16a34a</div>
            </div>
            <div>
              <div className="bg-destructive h-24 rounded-lg mb-3"></div>
              <div className="font-semibold">Destructive</div>
              <div className="text-sm text-ink-muted">#dc2626</div>
            </div>
          </div>
        </div>

        {/* Quick Start */}
        <Card
          title="Quick Start"
          description="Get started with the Groove Design System in minutes"
          className="mb-16"
        >
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
{`# Clone the repository
git clone https://github.com/RobMohan/groove-design-system.git

# Install dependencies
npm install

# Run development server
npm run dev`}
          </pre>
        </Card>

        {/* Contact Section */}
        <Card
          title="Get in Touch"
          description="Questions or want to connect?"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="font-semibold text-ink-muted">Email:</span>
              <a
                href="mailto:rob@robertmohandesign.com"
                className="text-primary hover:underline"
              >
                rob@robertmohandesign.com
              </a>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-semibold text-ink-muted">LinkedIn:</span>
              <a
                href="https://www.linkedin.com/in/robertmohan"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                linkedin.com/in/robertmohan
              </a>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
