import React from 'react';
import './Landing.css';

export default function Landing({ onEnter, theme, toggleTheme }) {
  return (
    <div className="landing-root">
      <header className="landing-header">
        <div className="brand">Project Structura</div>
        <nav>
          <button className="btn-ghost" onClick={onEnter}>Open Builder</button>
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
          >
            {theme === 'dark' ? '🌤️' : '🌙'}
          </button>
        </nav>
      </header>

      <main className="landing-hero">
        <div className="hero-left">
          <h1 className="hero-title">Design forms visually. Structure deeply.</h1>
          <p className="hero-sub">A modern, minimalist form builder with nested fields, tables, and reusable layout components — built for clarity, speed, and scale.</p>
          <div className="hero-ctas">
            <button className="btn-primary" onClick={onEnter}>Try the Builder</button>
          </div>
        </div>

        <div className="hero-right">
          <div className="canvas-3d">
            <div className="card card-large">
              <div className="card-title">Multi Fields</div>
              <div className="card-body">Rows × Columns • Responsive slots</div>
            </div>
            <div className="card card-medium">
              <div className="card-title">Table Field</div>
              <div className="card-body">Configurable cells • Nested fields</div>
            </div>
            <div className="card card-small">
              <div className="card-title">Rules</div>
              <div className="card-body">Conditional logic • Validation</div>
            </div>
          </div>
        </div>
      </main>

      <section id="features" className="landing-features">
        <h2>Features</h2>
        <div className="features-grid">
          <div className="feature">
            <div className="feature-icon">🔧</div>
            <h3>Visual Builder</h3>
            <p>Drag, drop and configure fields with instant previews.</p>
          </div>
          <div className="feature">
            <div className="feature-icon">📐</div>
            <h3>Layouts & Grids</h3>
            <p>Multi Fields and Tables for structured, repeatable groups.</p>
          </div>
          <div className="feature">
            <div className="feature-icon">⚡</div>
            <h3>Performance</h3>
            <p>Optimized rendering and minimal bundle size for speed.</p>
          </div>
          <div className="feature">
            <div className="feature-icon">🔒</div>
            <h3>Extensible</h3>
            <p>Field plugins and validations to match your workflow.</p>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <div>© {new Date().getFullYear()} Project Structura</div>
        <div className="footer-links"><a href="#">Docs</a> · <a href="#">GitHub</a></div>
      </footer>
    </div>
  );
}
