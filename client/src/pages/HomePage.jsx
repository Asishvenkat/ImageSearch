import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Sparkles, BarChart3, Lock, ArrowRight } from 'lucide-react';
import Header from '../components/Header';

export default function HomePage() {
  return (
    <div style={styles.page}>
      {/* Professional Header */}
      <Header user={null} onLogout={() => {}} />
      
      {/* Hero Section */}
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>
            Discover & Curate Beautiful Images
          </h1>
          <p style={styles.heroSubtitle}>
            Search millions of high-quality images, select your favorites, and track your search history.
            Powered by Unsplash and secured with OAuth authentication.
          </p>
          <div style={styles.ctaButtons}>
            <Link to="/login" style={styles.primaryButton}>
              Get Started
            </Link>
          
          </div>
        </div>
        <div style={styles.heroImage}>
          <div style={styles.imageGrid}>
            <div style={{...styles.gridItem, backgroundImage: 'url(https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop)', backgroundSize: 'cover', backgroundPosition: 'center'}}></div>
            <div style={{...styles.gridItem, backgroundImage: 'url(https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=400&fit=crop)', backgroundSize: 'cover', backgroundPosition: 'center'}}></div>
            <div style={{...styles.gridItem, backgroundImage: 'url(https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&h=400&fit=crop)', backgroundSize: 'cover', backgroundPosition: 'center'}}></div>
            <div style={{...styles.gridItem, backgroundImage: 'url(https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&h=400&fit=crop)', backgroundSize: 'cover', backgroundPosition: 'center'}}></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={styles.features}>
        <h2 style={styles.sectionTitle}>Why Choose Our Platform?</h2>
        <div style={styles.featureGrid}>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>
              <Search size={40} color="#667eea" />
            </div>
            <h3 style={styles.featureTitle}>Smart Search</h3>
            <p style={styles.featureText}>
              Search millions of high-quality images from Unsplash with lightning-fast results
              and intelligent filtering.
            </p>
          </div>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>
              <Sparkles size={40} color="#f5576c" />
            </div>
            <h3 style={styles.featureTitle}>Multi-Select</h3>
            <p style={styles.featureText}>
              Select multiple images at once, manage your selections efficiently, and download
              in bulk.
            </p>
          </div>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>
              <BarChart3 size={40} color="#43e97b" />
            </div>
            <h3 style={styles.featureTitle}>Search History</h3>
            <p style={styles.featureText}>
              Track all your searches, view statistics, and revisit your favorite queries
              anytime.
            </p>
          </div>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>
              <Lock size={40} color="#4facfe" />
            </div>
            <h3 style={styles.featureTitle}>Secure Login</h3>
            <p style={styles.featureText}>
              OAuth authentication via Google, GitHub, and Facebook. Your data is safe and
              secure.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section style={styles.howItWorks}>
        <h2 style={styles.sectionTitle}>How It Works</h2>
        <div style={styles.steps}>
          <div style={styles.step}>
            <div style={styles.stepNumber}>1</div>
            <h3 style={styles.stepTitle}>Sign In</h3>
            <p style={styles.stepText}>
              Use your Google, GitHub, or Facebook account to securely sign in.
            </p>
          </div>
          <div style={styles.stepArrow}>
            <ArrowRight size={32} color="#dee2e6" />
          </div>
          <div style={styles.step}>
            <div style={styles.stepNumber}>2</div>
            <h3 style={styles.stepTitle}>Search</h3>
            <p style={styles.stepText}>
              Type your query and explore millions of stunning images instantly.
            </p>
          </div>
          <div style={styles.stepArrow}>
            <ArrowRight size={32} color="#dee2e6" />
          </div>
          <div style={styles.step}>
            <div style={styles.stepNumber}>3</div>
            <h3 style={styles.stepTitle}>Select & Save</h3>
            <p style={styles.stepText}>
              Choose your favorites, track your searches, and manage your collection.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={styles.cta}>
        <h2 style={styles.ctaTitle}>Ready to Get Started?</h2>
        <p style={styles.ctaText}>
          Join thousands of users who are discovering amazing images every day.
        </p>
        <Link to="/login" style={styles.ctaButton}>
          Sign In Now
        </Link>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <p style={styles.footerText}>
          © 2025 Image Search Platform. Powered by Unsplash API.
        </p>
      </footer>
    </div>
  );
}

const styles = {
  page: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    color: '#212529',
    background: '#ffffff'
  },
  hero: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '80px 60px',
    background: 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)',
    minHeight: '90vh',
    gap: 60
  },
  heroContent: {
    flex: 1,
    maxWidth: 600
  },
  heroTitle: {
    fontSize: 56,
    fontWeight: 800,
    lineHeight: 1.2,
    marginBottom: 24,
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  },
  heroSubtitle: {
    fontSize: 20,
    lineHeight: 1.6,
    color: '#6c757d',
    marginBottom: 40
  },
  ctaButtons: {
    display: 'flex',
    gap: 16
  },
  primaryButton: {
    display: 'inline-block',
    padding: '16px 32px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#fff',
    textDecoration: 'none',
    borderRadius: 8,
    fontWeight: 600,
    fontSize: 16,
    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
    transition: 'transform 0.2s, box-shadow 0.2s'
  },
  secondaryButton: {
    display: 'inline-block',
    padding: '16px 32px',
    background: '#fff',
    color: '#667eea',
    textDecoration: 'none',
    borderRadius: 8,
    fontWeight: 600,
    fontSize: 16,
    border: '2px solid #667eea',
    transition: 'all 0.2s'
  },
  heroImage: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  imageGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 16,
    width: 400,
    height: 400
  },
  gridItem: {
    borderRadius: 16,
    boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
  },
  features: {
    padding: '80px 60px',
    background: '#f8f9fa'
  },
  sectionTitle: {
    fontSize: 40,
    fontWeight: 700,
    textAlign: 'center',
    marginBottom: 60
  },
  featureGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 32
  },
  featureCard: {
    background: '#fff',
    padding: 32,
    borderRadius: 12,
    textAlign: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    transition: 'transform 0.2s, box-shadow 0.2s'
  },
  featureIcon: {
    fontSize: 48,
    marginBottom: 16
  },
  featureTitle: {
    fontSize: 20,
    fontWeight: 600,
    marginBottom: 12
  },
  featureText: {
    fontSize: 14,
    color: '#6c757d',
    lineHeight: 1.6
  },
  howItWorks: {
    padding: '80px 60px',
    background: '#fff'
  },
  steps: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 40,
    maxWidth: 1000,
    margin: '0 auto'
  },
  step: {
    textAlign: 'center',
    flex: 1
  },
  stepNumber: {
    width: 64,
    height: 64,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#fff',
    fontSize: 28,
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 16px',
    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: 600,
    marginBottom: 8
  },
  stepText: {
    fontSize: 14,
    color: '#6c757d',
    lineHeight: 1.6
  },
  stepArrow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  cta: {
    padding: '80px 60px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    textAlign: 'center',
    color: '#fff'
  },
  ctaTitle: {
    fontSize: 40,
    fontWeight: 700,
    marginBottom: 16
  },
  ctaText: {
    fontSize: 18,
    marginBottom: 32,
    opacity: 0.9
  },
  ctaButton: {
    display: 'inline-block',
    padding: '16px 40px',
    background: '#fff',
    color: '#667eea',
    textDecoration: 'none',
    borderRadius: 8,
    fontWeight: 600,
    fontSize: 16,
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s'
  },
  footer: {
    padding: '32px 60px',
    background: '#212529',
    textAlign: 'center'
  },
  footerText: {
    margin: 0,
    color: '#adb5bd',
    fontSize: 14
  }
};
