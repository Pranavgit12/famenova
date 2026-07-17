import { useState, useEffect, useCallback } from 'react'
import { NICHE_OPTIONS } from '../utils/constants'
import { submitForm } from '../services/api'

export default function Modal({ isOpen, onClose }) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errors, setErrors] = useState({})

  const handleEscape = useCallback((e) => {
    if (e.key === 'Escape') onClose()
  }, [onClose])

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isOpen, handleEscape])

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose()
  }

  const handleClose = () => {
    setSuccess(false)
    setErrors({})
    setLoading(false)
    onClose()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const form = e.target
    const data = {
      fullName: form.fullName.value.trim(),
      phone: form.phone.value.trim(),
      location: form.location.value.trim(),
      businessName: form.businessName.value.trim(),
      niche: form.niche.value,
    }

    const newErrors = {}
    if (!data.fullName) newErrors.fullName = 'Please enter your full name'
    if (!data.phone || !/^[\d\s\-+()]{7,}$/.test(data.phone)) newErrors.phone = 'Please enter a valid phone number'
    if (!data.location) newErrors.location = 'Please enter your location'
    if (!data.businessName) newErrors.businessName = 'Please enter your business name'
    if (!data.niche) newErrors.niche = 'Please select your industry'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors({})
    setLoading(true)

    try {
      const res = await submitForm(data)
      if (res.success) {
        setSuccess(true)
      } else if (res.errors) {
        setErrors(res.errors)
      }
    } catch {
      alert('Network error. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  const clearError = (name) => {
    if (errors[name]) {
      setErrors(prev => {
        const next = { ...prev }
        delete next[name]
        return next
      })
    }
  }

  return (
    <div
      className={`modal-overlay${isOpen ? ' active' : ''}`}
      onClick={handleOverlayClick}
    >
      <div className="modal">
        <button className="modal-close" onClick={handleClose}>&times;</button>
        <h2>Get Your Free Audit</h2>
        <p>Fill in your details and we'll build a custom growth report for your brand within 48 hours.</p>

        {success ? (
          <div className="form-success show">
            <div className="form-success-icon">&#10003;</div>
            <h3>Application Received!</h3>
            <p>We'll be in touch within 24 hours to schedule your free strategy session.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <FormField name="fullName" label="Full Name" error={errors.fullName} onChange={clearError} />
            <FormField name="phone" label="Phone Number" type="tel" error={errors.phone} onChange={clearError} />
            <FormField name="location" label="Location / City" error={errors.location} onChange={clearError} />
            <FormField name="businessName" label="Business Name" error={errors.businessName} onChange={clearError} />

            <div className={`form-group${errors.niche ? ' error' : ''}`}>
              <select
                name="niche"
                required
                defaultValue=""
                onChange={() => clearError('niche')}
              >
                {NICHE_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value} disabled={opt.value === ''}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <label>Business Niche / Industry</label>
              <div className="error-msg">{errors.niche || 'Please select your industry'}</div>
            </div>

            <button type="submit" className="form-submit" disabled={loading}>
              {loading ? 'Submitting...' : 'Apply for a Strategy Session'}
            </button>
            <p className="form-note">We respect your privacy. No spam, ever.</p>
          </form>
        )}
      </div>
    </div>
  )
}

function FormField({ name, label, type = 'text', error, onChange }) {
  return (
    <div className={`form-group${error ? ' error' : ''}`}>
      <input
        type={type}
        name={name}
        placeholder=" "
        required
        onChange={() => onChange(name)}
      />
      <label htmlFor={name}>{label}</label>
      <div className="error-msg">{error || `Please enter your ${label.toLowerCase()}`}</div>
    </div>
  )
}
