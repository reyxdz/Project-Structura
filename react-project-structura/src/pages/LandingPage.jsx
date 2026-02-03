import { useState, useEffect } from 'react';
import './LandingPage.css';

export default function LandingPage({ onStartBuilding }) {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };

        const handleScroll = () => {
            setScrollY(window.scrollY);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div className="landing-page">
            {/* 3D Background Elements */}
            <div className="background-container">
                <div className="floating-cube cube-1" style={{
                    transform: `rotateX(${scrollY * 0.5}deg) rotateY(${mousePosition.x * 0.02}deg) translateZ(0px)`
                }}></div>
                <div className="floating-cube cube-2" style={{
                    transform: `rotateX(${-scrollY * 0.3}deg) rotateY(${-mousePosition.x * 0.015}deg) translateZ(0px)`
                }}></div>
                <div className="floating-sphere sphere-1" style={{
                    transform: `translateY(${scrollY * 0.2}px) translateX(${mousePosition.x * 0.01}px)`
                }}></div>
                <div className="gradient-orb orb-1" style={{
                    transform: `translate(${mousePosition.x * 0.03}px, ${mousePosition.y * 0.03}px)`
                }}></div>
                <div className="gradient-orb orb-2" style={{
                    transform: `translate(${-mousePosition.x * 0.02}px, ${-mousePosition.y * 0.02}px)`
                }}></div>
            </div>

            {/* Navigation */}
            <nav className="navbar">
                <div className="nav-container">
                    <div className="logo">
                        <span className="logo-icon">⬚</span>
                        <span className="logo-text">FormStructura</span>
                    </div>
                    <div className="nav-links">
                        <a href="#features" className="nav-link">Features</a>
                        <a href="#benefits" className="nav-link">Benefits</a>
                        <a href="#pricing" className="nav-link">Pricing</a>
                        <button className="nav-cta" onClick={onStartBuilding}>Get Started</button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content">
                    <div className="hero-text">
                        <h1 className="hero-title">
                            Build Powerful Forms
                            <span className="gradient-text"> In Minutes</span>
                        </h1>
                        <p className="hero-subtitle">
                            Create complex, dynamic forms with an intuitive drag-and-drop interface. No coding required.
                        </p>
                        <div className="hero-buttons">
                            <button className="btn btn-primary" onClick={onStartBuilding}>
                                Start Building
                                <span className="btn-arrow">→</span>
                            </button>
                            <button className="btn btn-secondary">
                                Watch Demo
                            </button>
                        </div>
                    </div>
                    <div className="hero-visual">
                        <div className="form-showcase">
                            <div className="form-card">
                                <div className="form-header"></div>
                                <div className="form-field"></div>
                                <div className="form-field"></div>
                                <div className="form-field"></div>
                                <div className="form-submit"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section" id="features">
                <div className="section-container">
                    <h2 className="section-title">Powerful Features</h2>
                    <p className="section-subtitle">Everything you need to create professional forms</p>

                    <div className="features-grid">
                        <div className="feature-card feature-card-1">
                            <div className="feature-icon">
                                <span>⚡</span>
                            </div>
                            <h3>Drag & Drop Builder</h3>
                            <p>Intuitive interface to build forms without any coding knowledge</p>
                            <div className="feature-indicator"></div>
                        </div>

                        <div className="feature-card feature-card-2">
                            <div className="feature-icon">
                                <span>🔧</span>
                            </div>
                            <h3>Conditional Logic</h3>
                            <p>Create smart forms with conditional rules and dynamic field visibility</p>
                            <div className="feature-indicator"></div>
                        </div>

                        <div className="feature-card feature-card-3">
                            <div className="feature-icon">
                                <span>✓</span>
                            </div>
                            <h3>Advanced Validation</h3>
                            <p>Built-in validation rules with custom error messages and patterns</p>
                            <div className="feature-indicator"></div>
                        </div>

                        <div className="feature-card feature-card-4">
                            <div className="feature-icon">
                                <span>📊</span>
                            </div>
                            <h3>Multi-field Layouts</h3>
                            <p>Organize fields in multi-column grids and table layouts</p>
                            <div className="feature-indicator"></div>
                        </div>

                        <div className="feature-card feature-card-5">
                            <div className="feature-icon">
                                <span>📋</span>
                            </div>
                            <h3>Data Tables</h3>
                            <p>Create dynamic data tables with configurable rows and columns</p>
                            <div className="feature-indicator"></div>
                        </div>

                        <div className="feature-card feature-card-6">
                            <div className="feature-icon">
                                <span>📤</span>
                            </div>
                            <h3>Export & Preview</h3>
                            <p>Generate PDF exports and preview forms before deployment</p>
                            <div className="feature-indicator"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="benefits-section" id="benefits">
                <div className="section-container">
                    <h2 className="section-title">Why Choose FormStructura</h2>
                    
                    <div className="benefits-content">
                        <div className="benefits-left">
                            <div className="benefit-item">
                                <div className="benefit-number">01</div>
                                <div className="benefit-text">
                                    <h3>Time Saving</h3>
                                    <p>Build complex forms 10x faster than traditional coding methods</p>
                                </div>
                            </div>

                            <div className="benefit-item">
                                <div className="benefit-number">02</div>
                                <div className="benefit-text">
                                    <h3>User Friendly</h3>
                                    <p>No technical knowledge required. Perfect for everyone</p>
                                </div>
                            </div>

                            <div className="benefit-item">
                                <div className="benefit-number">03</div>
                                <div className="benefit-text">
                                    <h3>Fully Responsive</h3>
                                    <p>Forms automatically adapt to any device or screen size</p>
                                </div>
                            </div>
                        </div>

                        <div className="benefits-right">
                            <div className="benefit-visual">
                                <div className="floating-element element-1"></div>
                                <div className="floating-element element-2"></div>
                                <div className="floating-element element-3"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section className="pricing-section" id="pricing">
                <div className="section-container">
                    <h2 className="section-title">Simple Pricing</h2>
                    <p className="section-subtitle">Start free, upgrade when you need more</p>

                    <div className="pricing-cards">
                        <div className="pricing-card pricing-card-basic">
                            <div className="pricing-header">
                                <h3>Starter</h3>
                                <div className="pricing-badge">Free</div>
                            </div>
                            <div className="pricing-description">Perfect for trying out</div>
                            <div className="pricing-features">
                                <div className="pricing-feature">✓ Up to 5 forms</div>
                                <div className="pricing-feature">✓ Basic fields</div>
                                <div className="pricing-feature">✓ Simple validation</div>
                                <div className="pricing-feature">✗ Advanced rules</div>
                                <div className="pricing-feature">✗ Priority support</div>
                            </div>
                            <button className="btn btn-secondary w-full">Get Started</button>
                        </div>

                        <div className="pricing-card pricing-card-pro">
                            <div className="pricing-header">
                                <h3>Professional</h3>
                                <div className="pricing-price">$29<span>/mo</span></div>
                            </div>
                            <div className="pricing-description">For growing businesses</div>
                            <div className="pricing-features">
                                <div className="pricing-feature">✓ Unlimited forms</div>
                                <div className="pricing-feature">✓ All field types</div>
                                <div className="pricing-feature">✓ Advanced validation</div>
                                <div className="pricing-feature">✓ Conditional logic</div>
                                <div className="pricing-feature">✗ Priority support</div>
                            </div>
                            <button className="btn btn-primary w-full">Upgrade Now</button>
                        </div>

                        <div className="pricing-card pricing-card-enterprise">
                            <div className="pricing-header">
                                <h3>Enterprise</h3>
                                <div className="pricing-badge">Custom</div>
                            </div>
                            <div className="pricing-description">For large organizations</div>
                            <div className="pricing-features">
                                <div className="pricing-feature">✓ Everything in Pro</div>
                                <div className="pricing-feature">✓ Custom integrations</div>
                                <div className="pricing-feature">✓ Advanced analytics</div>
                                <div className="pricing-feature">✓ Dedicated support</div>
                                <div className="pricing-feature">✓ SLA guarantee</div>
                            </div>
                            <button className="btn btn-secondary w-full">Contact Sales</button>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="cta-content">
                    <h2>Ready to Build Amazing Forms?</h2>
                    <p>Join thousands of users creating powerful forms with FormStructura</p>
                    <button className="btn btn-primary btn-large" onClick={onStartBuilding}>
                        Start For Free
                        <span className="btn-arrow">→</span>
                    </button>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="footer-content">
                    <div className="footer-section">
                        <h4>FormStructura</h4>
                        <p>Build powerful forms with ease</p>
                    </div>
                    <div className="footer-section">
                        <h5>Product</h5>
                        <a href="#features">Features</a>
                        <a href="#pricing">Pricing</a>
                        <a href="#benefits">Benefits</a>
                    </div>
                    <div className="footer-section">
                        <h5>Legal</h5>
                        <a href="#privacy">Privacy</a>
                        <a href="#terms">Terms</a>
                        <a href="#cookies">Cookies</a>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; 2026 FormStructura. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
