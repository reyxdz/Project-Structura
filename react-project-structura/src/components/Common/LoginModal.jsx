import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import './LoginModal.css';

export default function LoginModal({ isOpen, onClose, onLogin, authUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showSignup, setShowSignup] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (isOpen) console.debug('LoginModal opened');
    // Prefill email when authUser is provided
    if (isOpen && authUser) setEmail(authUser);
  }, [isOpen, authUser]);

  const emailRef = useRef(null);
  useEffect(() => {
    if (isOpen && emailRef.current) {
      // focus after a tick to ensure portal mounted
      setTimeout(() => emailRef.current && emailRef.current.focus(), 50);
    }
  }, [isOpen]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }

    const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';
    try {
      const res = await fetch(`${API}/api/auth/signin`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Sign in failed');
        return;
      }
      // call onLogin with email and token
      onLogin({ email: data.email, token: data.token });
    } catch (err) {
      console.error(err);
      setError(err?.message || 'Network error');
    }
  }

  async function handleSignup(e) {
    e.preventDefault();
    setError('');
    if (!firstName || !lastName || !username || !email || !password || !confirmPassword) {
      setError('Please fill all fields');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';
    try {
      const res = await fetch(`${API}/api/auth/signup`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, username, email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Sign up failed');
        return;
      }
      onLogin({ email: data.email, token: data.token });
    } catch (err) {
      console.error(err);
      setError(err?.message || 'Network error');
    }
  }

  if (!isOpen) return null;

  let body = null;

  if (showSignup) {
    body = (
      <form className="login-body signup-body" onSubmit={handleSignup}>
        <h3>Create an account</h3>
        <div className="signup-grid">
          <label className="field">
            <div className="label">First Name</div>
            <input value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="First name" />
          </label>
          <label className="field">
            <div className="label">Last Name</div>
            <input value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Last name" />
          </label>
        </div>
        <label className="field">
          <div className="label">Username</div>
          <input value={username} onChange={e => setUsername(e.target.value)} placeholder="username" />
        </label>
        <label className="field">
          <div className="label">Email</div>
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.com" />
        </label>
        <label className="field">
          <div className="label">Password</div>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
        </label>
        <label className="field">
          <div className="label">Confirm Password</div>
          <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Confirm Password" />
        </label>

        {error && <div className="login-error">{error}</div>}

        <div className="login-actions">
          <button type="submit" className="btn btn-primary">Create account</button>
        </div>
        <div className="signup-link">Already have an account? <button type="button" className="link-btn" onClick={() => setShowSignup(false)}>Sign in</button></div>
      </form>
    );
  } else {
    body = (
      <form className="login-body" onSubmit={handleSubmit}>
        <h3>Sign in to continue</h3>
        <label className="field">
          <div className="label">Email</div>
          <input
            ref={emailRef}
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@company.com"
          />
        </label>

        <label className="field">
          <div className="label">Password</div>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </label>

        {error && <div className="login-error">{error}</div>}

        <div className="login-actions">
          <button type="submit" className="btn btn-primary">Sign in</button>
        </div>
        <div className="signup-link">Don't have an account? <button type="button" className="link-btn" onClick={() => setShowSignup(true)}>Create here</button></div>
      </form>
    );
  }

  const modal = (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="login-modal">
        <div className="login-header">
          <div className="login-brand">Project Structura</div>
          <button className="close" onClick={onClose} aria-label="Close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {body}
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
