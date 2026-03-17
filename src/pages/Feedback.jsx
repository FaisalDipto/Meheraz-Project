import React, { useState } from 'react';
import './Feedback.css';

export default function Feedback() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim() || description.trim()) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setTitle('');
        setDescription('');
      }, 3000);
    }
  };

  return (
    <div className="feedback-page-container">
      {/* Decorative background shapes */}
      <div className="fb-bg-shape fb-bg-shape-1"></div>
      <div className="fb-bg-shape fb-bg-shape-2"></div>
      <div className="fb-bg-shape fb-bg-shape-3"></div>

      <div className="feedback-card">
        <h3 className="feedback-heading">Feedback</h3>
        <p className="feedback-subtext">
          Give us Feedback, Report a Bug or Tell us how we can improve.
        </p>

        <form className="feedback-form" onSubmit={handleSubmit}>
          <div className="fb-form-group">
            <label htmlFor="feedback-title">Feedback Title</label>
            <input
              id="feedback-title"
              type="text"
              className="fb-input"
              placeholder="Enter a short title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="fb-form-group">
            <label htmlFor="feedback-description">Feedback Description</label>
            <textarea
              id="feedback-description"
              className="fb-textarea"
              placeholder="Describe your feedback in detail..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className={`fb-submit-btn ${submitted ? 'fb-submit-btn--success' : ''}`}
          >
            {submitted ? '✓ Submitted!' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
}
