import { useState } from 'react'
import heroImg from './assets/hero.png'
import './App.css'

const initialFormState = {
  title: '',
  description: '',
  url: '',
  language: '',
  tags: '',
}

function App() {
  const [formData, setFormData] = useState(initialFormState)
  const [errors, setErrors] = useState({})
  const [statusMessage, setStatusMessage] = useState('')

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setFormData((previous) => ({ ...previous, [name]: value }))
    setErrors((previous) => ({ ...previous, [name]: '' }))
    setStatusMessage('')
  }

  const validateForm = () => {
    const nextErrors = {}

    if (!formData.title.trim()) {
      nextErrors.title = 'Resource title is required.'
    }

    if (!formData.description.trim()) {
      nextErrors.description = 'Description is required.'
    }

    if (!formData.language.trim()) {
      nextErrors.language = 'Language tag is required.'
    }

    if (!formData.url.trim()) {
      nextErrors.url = 'Resource link is required.'
    } else {
      try {
        const parsedUrl = new URL(formData.url)
        if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
          nextErrors.url = 'Use a valid http or https link.'
        }
      } catch {
        nextErrors.url = 'Use a valid URL format.'
      }
    }

    return nextErrors
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const nextErrors = validateForm()

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      setStatusMessage('Please fix the errors before submitting.')
      return
    }

    setErrors({})
    setStatusMessage('Submission saved locally. API integration comes next.')
    setFormData(initialFormState)
  }

  return (
    <div className="app-shell">
      <header className="site-header">
        <a className="site-brand" href="#top">
          Multilingual Mental Health Hub
        </a>
        <nav aria-label="Primary navigation">
          <ul className="nav-links">
            <li>
              <a href="#resources">Resources</a>
            </li>
            <li>
              <a href="#submit">Submit</a>
            </li>
            <li>
              <a href="#languages">Languages</a>
            </li>
          </ul>
        </nav>
      </header>

      <main id="top">
        <section className="hero-section">
          <div className="hero-copy">
            <p className="eyebrow">Community Powered</p>
            <h1>Mental health resources in every language</h1>
            <p>
              A welcoming space to discover support tools and share trusted
              resources with multilingual communities.
            </p>
            <div className="hero-actions">
              <a className="primary-btn" href="#resources">
                Browse resources
              </a>
              <a className="secondary-btn" href="#submit">
                Submit a resource
              </a>
            </div>
          </div>
          <img
            src={heroImg}
            className="hero-image"
            width="320"
            height="337"
            alt="Illustration of supportive conversation"
          />
        </section>

        <section id="resources" className="info-grid">
          <article className="info-card">
            <h2>Find what helps</h2>
            <p>
              Search by language, topic, and format so people can quickly find
              support they understand.
            </p>
          </article>
          <article id="languages" className="info-card">
            <h2>Support many languages</h2>
            <p>
              We are building language tagging and translation support to reduce
              access barriers.
            </p>
          </article>
          <article className="info-card">
            <h2>Built for communities</h2>
            <p>
              Shared knowledge from community members helps make care pathways
              easier to access for everyone.
            </p>
          </article>
        </section>

        <section id="submit" className="submit-section">
          <div className="submit-header">
            <h2>Submit a new resource</h2>
            <p>
              Share a trusted resource with language tags so others can discover
              support in a familiar language.
            </p>
          </div>

          <form className="resource-form" onSubmit={handleSubmit} noValidate>
            <label htmlFor="title">
              Resource title
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g. Free crisis support hotline"
              />
              {errors.title && <span className="field-error">{errors.title}</span>}
            </label>

            <label htmlFor="description">
              Description
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
                placeholder="What support does this provide?"
              />
              {errors.description && (
                <span className="field-error">{errors.description}</span>
              )}
            </label>

            <label htmlFor="url">
              Resource URL
              <input
                id="url"
                name="url"
                type="url"
                value={formData.url}
                onChange={handleInputChange}
                placeholder="https://example.org/resource"
              />
              {errors.url && <span className="field-error">{errors.url}</span>}
            </label>

            <div className="two-column-fields">
              <label htmlFor="language">
                Language tag
                <input
                  id="language"
                  name="language"
                  type="text"
                  value={formData.language}
                  onChange={handleInputChange}
                  placeholder="e.g. Arabic"
                />
                {errors.language && (
                  <span className="field-error">{errors.language}</span>
                )}
              </label>

              <label htmlFor="tags">
                Topic tags
                <input
                  id="tags"
                  name="tags"
                  type="text"
                  value={formData.tags}
                  onChange={handleInputChange}
                  placeholder="anxiety, youth, hotline"
                />
              </label>
            </div>

            <button type="submit" className="primary-btn form-submit-btn">
              Submit resource
            </button>

            {statusMessage && <p className="form-status">{statusMessage}</p>}
          </form>
        </section>
      </main>
    </div>
  )
}

export default App
