import { useState } from 'react'
import useScrollReveal from '../hooks/useScrollReveal'
import { NICHE_OPTIONS } from '../utils/constants'
import { submitForm } from '../services/api'
import { WhatsAppIcon } from './WhatsAppFloat'
import { WHATSAPP_LINK } from '../utils/constants'

const PERKS = [
  'Free comprehensive brand & ad audit',
  'Custom growth strategy blueprint',
  'Competitor analysis & opportunity map',
  'No commitment required',
]

export default function InquiryForm() {
  return (
    <section className="inquiry" id="contact">
      <div className="container">
        <div className="inquiry-wrapper">
          <InquiryInfo />
          <InquiryFormCard />
        </div>
      </div>
    </section>
  )
}

function InquiryInfo() {
  const { ref, isVisible } = useScrollReveal()
  return (
    <div ref={ref} className={`inquiry-info reveal${isVisible ? ' visible' : ''}`}>
      <div className="section-label">
        <span className="section-label-line"></span> Get Started
      </div>
      <h2>Ready to <span className="gradient-text">10x Your Growth</span>?</h2>
      <p>
        Book a free strategy session with our team. We'll audit your current setup and show
        you exactly where the untapped revenue is hiding.
      </p>
      <ul className="inquiry-perks">
        {PERKS.map(perk => (
          <li key={perk}>
            <span className="inquiry-perk-icon">&#10003;</span>
            {perk}
          </li>
        ))}
      </ul>
    </div>
  )
}

function InquiryFormCard() {
  const { ref, isVisible } = useScrollReveal()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errors, setErrors] = useState({})

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
    <div ref={ref} className={`inquiry-form-card reveal${isVisible ? ' visible' : ''} reveal-delay-1`}>
      {success ? (
        <div className="form-success show">
          <div className="form-success-icon">&#10003;</div>
          <h3>Application Received!</h3>
          <p>We'll be in touch within 24 hours to schedule your free strategy session.</p>
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="wa-success-btn"
          >
            <WhatsAppIcon size={16} />
            Chat with us now on WhatsApp
          </a>
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
