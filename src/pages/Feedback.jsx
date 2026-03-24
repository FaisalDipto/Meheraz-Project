import { useState } from 'react';
import { apiService } from '../services/api';
import './Feedback.css';

export default function Feedback() {
  const [feedbackType, setFeedbackType] = useState('Suggest Improvement');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (title.trim() || description.trim()) {
      try {
        await apiService.submitFeedback({
          type: feedbackType,
          title: title,
          details: description
        });
        setSubmitted(true);
        setTimeout(() => {
          setSubmitted(false);
          setTitle('');
          setDescription('');
        }, 3000);
      } catch (err) {
        console.error('Feedback submit error:', err);
        alert('Failed to submit feedback. Please try again later.');
      }
    }
  };

  return (
    <div className="feedback-page-container">
      {/* Decorative background shapes */}
      <div className="fb-bg-shape fb-bg-shape-1"></div>
      <div className="fb-bg-shape fb-bg-shape-2"></div>
      <div className="fb-bg-shape fb-bg-shape-3"></div>

      <div className="feedback-card" style={{ maxWidth: '800px', width: '100%', padding: '40px', borderRadius: '12px', backgroundColor: '#fff' }}>
        <h3 className="feedback-heading" style={{ fontSize: '28px', fontWeight: 700, marginBottom: '12px', textAlign: 'center' }}>Feedback</h3>
        <p className="feedback-subtext" style={{ color: '#334155', fontSize: '15px', textAlign: 'center', marginBottom: '32px' }}>
          Give us Feedback, Report a Bug, or Tell us how we can improve.
        </p>

        <form className="feedback-form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="fb-form-group" style={{ position: 'relative', margin: 0 }}>
            <select
              value={feedbackType}
              onChange={(e) => setFeedbackType(e.target.value)}
              style={{
                width: '100%',
                padding: '14px 16px',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '15px',
                fontFamily: 'inherit',
                outline: 'none',
                boxSizing: 'border-box',
                backgroundColor: '#fff',
                color: 'var(--text-primary)',
                appearance: 'none',
                cursor: 'pointer',
                transition: 'border-color 0.2s, box-shadow 0.2s',
              }}
              onFocus={(e) => { e.target.style.borderColor = '#0ea5e9'; e.target.style.boxShadow = '0 0 0 3px rgba(14,165,233,0.12)'; }}
              onBlur={(e) => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
            >
              <option value="General">General</option>
              <option value="Report a bug">Report a bug</option>
              <option value="Suggest Improvement">Suggest Improvement</option>
              <option value="Feature Request">Feature Request</option>
            </select>
            <div style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#cbd5e1' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </div>
          </div>

          <div className="fb-form-group" style={{ margin: 0 }}>
            <input
              type="text"
              placeholder="Title *"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{
                width: '100%',
                padding: '14px 16px',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '15px',
                fontFamily: 'inherit',
                outline: 'none',
                boxSizing: 'border-box',
                backgroundColor: '#fff',
                color: 'var(--text-primary)',
                transition: 'border-color 0.2s, box-shadow 0.2s',
              }}
              onFocus={(e) => { e.target.style.borderColor = '#0ea5e9'; e.target.style.boxShadow = '0 0 0 3px rgba(14,165,233,0.12)'; }}
              onBlur={(e) => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
            />
          </div>

          <div className="fb-form-group" style={{ margin: 0 }}>
            <textarea
              placeholder="Details *"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{
                width: '100%',
                padding: '14px 16px',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '15px',
                fontFamily: 'inherit',
                resize: 'vertical',
                outline: 'none',
                height: '140px',
                boxSizing: 'border-box',
                backgroundColor: '#fff',
                color: 'var(--text-primary)',
                transition: 'border-color 0.2s, box-shadow 0.2s',
              }}
              onFocus={(e) => { e.target.style.borderColor = '#0ea5e9'; e.target.style.boxShadow = '0 0 0 3px rgba(14,165,233,0.12)'; }}
              onBlur={(e) => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
            />
          </div>

          <button
            type="submit"
            className="btn-submit"
            style={{
              backgroundColor: submitted ? '#22c55e' : 'var(--bg-primary)',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              padding: '16px',
              fontSize: '16px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'background-color 0.25s, transform 0.1s',
              marginTop: '8px',
            }}
            onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
            onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            {submitted ? '✓ Submitted!' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
}
