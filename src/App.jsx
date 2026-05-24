import { useEffect, useState } from 'react'
import heroImg from './assets/hero.png'
import './App.css'
import { createResource, fetchResources } from './services/resourcesApi'

const initialResources = [
  {
    id: 1,
    title: 'Crisis Text Line',
    description:
      'Free text-based crisis counseling available 24/7 with trained responders.',
    language: 'English',
    tags: ['crisis', 'text', 'youth'],
    url: 'https://www.crisistextline.org/',
  },
  {
    id: 2,
    title: 'Linea 988 en Espanol',
    description:
      'Spanish-language phone support for urgent emotional distress in the US.',
    language: 'Spanish',
    tags: ['hotline', 'crisis', 'phone'],
    url: 'https://988lifeline.org/help-yourself/en-espanol/',
  },
  {
    id: 3,
    title: 'Naseeha Muslim Youth Helpline',
    description:
      'Confidential support for Muslim youth, including concerns around stress and anxiety.',
    language: 'Arabic',
    tags: ['youth', 'faith', 'phone'],
    url: 'https://naseeha.org/',
  },
  {
    id: 4,
    title: 'Kids Help Phone',
    description:
      'Mental health support and counseling access for young people across Canada.',
    language: 'French',
    tags: ['youth', 'chat', 'phone'],
    url: 'https://kidshelpphone.ca/',
  },
  {
    id: 5,
    title: 'Mind in Mandarin Community Guide',
    description:
      'Practical self-help and community mental health resources in Mandarin.',
    language: 'Mandarin',
    tags: ['community', 'self-help', 'guide'],
    url: 'https://www.mind.org.uk/information-support/',
  },
]

const initialFormState = {
  title: '',
  description: '',
  url: '',
  language: '',
  tags: '',
}

function normalizeResource(resource, fallbackId) {
  return {
    id: resource.id ?? fallbackId,
    title: resource.title ?? '',
    description: resource.description ?? '',
    language: resource.language ?? resource.languageCode ?? 'Unknown',
    tags: Array.isArray(resource.tags)
      ? resource.tags
      : String(resource.tags ?? '')
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean),
    url: resource.url ?? '#',
  }
}

function App() {
  const [resources, setResources] = useState([])
  const [formData, setFormData] = useState(initialFormState)
  const [errors, setErrors] = useState({})
  const [statusMessage, setStatusMessage] = useState('')
  const [resourceLoadError, setResourceLoadError] = useState('')
  const [isLoadingResources, setIsLoadingResources] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState('All languages')
  const [selectedTag, setSelectedTag] = useState('All topics')

  useEffect(() => {
    let isMounted = true

    const loadResources = async () => {
      setIsLoadingResources(true)
      setResourceLoadError('')

      try {
        const apiResources = await fetchResources()
        if (!isMounted) {
          return
        }

        if (apiResources.length === 0) {
          setResources(initialResources)
          setResourceLoadError(
            'API returned no resources. Showing local starter data for now.',
          )
          return
        }

        setResources(
          apiResources.map((resource, index) =>
            normalizeResource(resource, Date.now() + index),
          ),
        )
      } catch (error) {
        if (!isMounted) {
          return
        }

        setResources(initialResources)
        setResourceLoadError(
          `Could not load resources from API. Showing local data instead. ${error.message}`,
        )
      } finally {
        if (isMounted) {
          setIsLoadingResources(false)
        }
      }
    }

    loadResources()

    return () => {
      isMounted = false
    }
  }, [])

  const languageOptions = [
    'All languages',
    ...new Set(resources.map((resource) => resource.language)),
  ]

  const tagOptions = [
    'All topics',
    ...new Set(resources.flatMap((resource) => resource.tags)),
  ]

  const filteredResources = resources.filter((resource) => {
    const languageMatches =
      selectedLanguage === 'All languages' ||
      resource.language === selectedLanguage
    const tagMatches =
      selectedTag === 'All topics' || resource.tags.includes(selectedTag)

    return languageMatches && tagMatches
  })

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

  const handleSubmit = async (event) => {
    event.preventDefault()
    const nextErrors = validateForm()

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      setStatusMessage('Please fix the errors before submitting.')
      return
    }

    setErrors({})
    const normalizedTags = formData.tags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean)
    const nextResource = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      language: formData.language.trim(),
      tags: normalizedTags.length > 0 ? normalizedTags : ['general'],
      url: formData.url.trim(),
    }
    setIsSubmitting(true)

    try {
      const createdResource = await createResource(nextResource)
      const normalizedResource = normalizeResource(createdResource, Date.now())
      setResources((previous) => [normalizedResource, ...previous])
      setStatusMessage('Resource submitted successfully.')
      setFormData(initialFormState)
    } catch (error) {
      const fallbackResource = {
        ...nextResource,
        id: Date.now(),
      }
      setResources((previous) => [fallbackResource, ...previous])
      setStatusMessage(
        `API unavailable, so the resource was saved locally. ${error.message}`,
      )
    } finally {
      setIsSubmitting(false)
    }
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

        <section id="resources" className="resources-section">
          <div className="resources-header">
            <h2>Resource library</h2>
            <p>
              Filter by language or topic to quickly find support resources for
              different community needs.
            </p>
            {resourceLoadError && (
              <p className="api-feedback error-message">{resourceLoadError}</p>
            )}
          </div>

          <div className="resource-filters" aria-label="Resource filters">
            <label htmlFor="languageFilter" className="filter-group">
              Language
              <select
                id="languageFilter"
                value={selectedLanguage}
                onChange={(event) => setSelectedLanguage(event.target.value)}
              >
                {languageOptions.map((language) => (
                  <option key={language} value={language}>
                    {language}
                  </option>
                ))}
              </select>
            </label>

            <label htmlFor="tagFilter" className="filter-group">
              Topic
              <select
                id="tagFilter"
                value={selectedTag}
                onChange={(event) => setSelectedTag(event.target.value)}
              >
                {tagOptions.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {isLoadingResources ? (
            <p className="api-feedback loading-message">Loading resources...</p>
          ) : filteredResources.length > 0 ? (
            <div className="resource-list">
              {filteredResources.map((resource) => (
                <article key={resource.id} className="resource-item">
                  <h3>{resource.title}</h3>
                  <p>{resource.description}</p>
                  <p className="resource-meta">Language: {resource.language}</p>
                  <div className="tag-row">
                    {resource.tags.map((tag) => (
                      <span key={`${resource.id}-${tag}`} className="tag-chip">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <a href={resource.url} target="_blank" rel="noreferrer">
                    Visit resource
                  </a>
                </article>
              ))}
            </div>
          ) : (
            <p className="empty-state">
              No resources match your current filters. Try another language or
              topic.
            </p>
          )}

          <article id="languages" className="info-card">
            <h2>Support many languages</h2>
            <p>
              We are building language tagging and translation support to reduce
              access barriers.
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

            <button
              type="submit"
              className="primary-btn form-submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit resource'}
            </button>

            {statusMessage && <p className="form-status">{statusMessage}</p>}
          </form>
        </section>
      </main>
    </div>
  )
}

export default App
