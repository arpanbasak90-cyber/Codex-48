import React, { useState } from 'react';
import type { UserProfile } from '../types';
import { Shield, ArrowRight } from 'lucide-react';

interface LoginPageProps {
  onLogin: (user: UserProfile) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('Brand Marketing Lead');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid work email.');
      return;
    }
    if (!company.trim()) {
      setError('Please enter your company or organization name.');
      return;
    }

    onLogin({
      name: name.trim(),
      email: email.trim(),
      company: company.trim(),
      role,
    });
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      background: 'linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 16px',
    }}>
      <div style={{
        background: 'white',
        border: '1px solid #e2e8f0',
        borderRadius: 16,
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)',
        maxWidth: 480,
        width: '100%',
        padding: '36px 32px',
      }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            width: 48,
            height: 48,
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            borderRadius: 12,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.3)',
            marginBottom: 12,
          }}>
            <Shield size={26} strokeWidth={2.4} />
          </div>
          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 22,
            fontWeight: 800,
            color: '#0f172a',
            letterSpacing: -0.4,
            marginBottom: 4,
          }}>
            Sign in to BrandGuard <span style={{ color: '#2563eb' }}>AI</span>
          </h1>
          <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>
            Enterprise Brand Governance & Marketing Compliance Platform
          </p>
        </div>

        {error && (
          <div style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#b91c1c',
            padding: '10px 14px',
            borderRadius: 6,
            fontSize: 12.5,
            marginBottom: 18,
          }}>
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: 14 }}>
            <label className="form-label" style={{ fontSize: 12.5 }}>Full Name</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Sarah Miller"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                id="login-name-input"
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 14 }}>
            <label className="form-label" style={{ fontSize: 12.5 }}>Work Email</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                className="form-input"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                id="login-email-input"
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 14 }}>
            <label className="form-label" style={{ fontSize: 12.5 }}>Company / Organization</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Acme Global Corporation"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                required
                id="login-company-input"
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 20 }}>
            <label className="form-label" style={{ fontSize: 12.5 }}>Role / Department</label>
            <select
              className="form-select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              id="login-role-select"
            >
              <option value="Brand Marketing Lead">Brand Marketing Lead</option>
              <option value="Compliance & Legal Counsel">Compliance & Legal Counsel</option>
              <option value="Creative Director / Copywriter">Creative Director / Copywriter</option>
              <option value="Growth Marketing Director">Growth Marketing Director</option>
              <option value="Product Marketing Manager">Product Marketing Manager</option>
            </select>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '10px 16px', fontSize: 14, fontWeight: 700 }}
            id="btn-login-submit"
          >
            <span>Enter BrandGuard AI Workspace</span>
            <ArrowRight size={15} />
          </button>
        </form>
      </div>
    </div>
  );
};

