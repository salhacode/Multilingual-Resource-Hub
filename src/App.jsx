import { useEffect, useMemo, useRef, useState } from 'react'
import heroImg from './assets/hero.png'
import './App.css'
import {
  createResource,
  deleteResource,
  fetchResources,
  updateResource,
} from './services/resourcesApi'

/** Languages the hub highlights for tagging and discovery (community can add others). */
const SUPPORTED_LANGUAGES = [
  'Arabic',
  'Bengali',
  'Burmese',
  'Cambodian',
  'Cantonese',
  'Chinese',
  'English',
  'Farsi',
  'Fujianese',
  'Gujarati',
  'Haitian Creole',
  'Hindi',
  'Japanese',
  'Karen',
  'Korean',
  'Laotian',
  'Mandarin',
  'Nepali',
  'Punjabi',
  'Russian',
  'Spanish',
  'Tagalog',
  'Tamil',
  'Thai',
  'Urdu',
  'Vietnamese',
]

const initialFormState = {
  title: '',
  description: '',
  url: '',
  language: '',
  tags: '',
}

function splitLanguages(value) {
  if (Array.isArray(value)) {
    return value.map((lang) => String(lang).trim()).filter(Boolean)
  }
  return String(value ?? '')
    .split(/[,/;]+/)
    .map((lang) => lang.trim())
    .filter(Boolean)
}

/** Rough card height for masonry-style column balancing (px). */
function estimateResourceCardHeight(resource) {
  const titleLines = Math.ceil((resource.title?.length ?? 0) / 42)
  const descLines = Math.ceil((resource.description?.length ?? 0) / 72)
  const langRows = Math.ceil((resource.languages?.length ?? 0) / 4)
  const tagRows = Math.ceil((resource.tags?.length ?? 0) / 4)

  return (
    140 +
    titleLines * 28 +
    descLines * 22 +
    langRows * 36 +
    tagRows * 36
  )
}

/** Place each card in whichever column is shorter so items tuck under shorter neighbors. */
function distributeIntoTwoColumns(items) {
  const left = []
  const right = []
  let leftHeight = 0
  let rightHeight = 0

  for (const item of items) {
    const cardHeight = estimateResourceCardHeight(item)
    if (leftHeight <= rightHeight) {
      left.push(item)
      leftHeight += cardHeight + 12
    } else {
      right.push(item)
      rightHeight += cardHeight + 12
    }
  }

  return [left, right]
}

function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia(query).matches
  })

  useEffect(() => {
    const media = window.matchMedia(query)
    const onChange = () => setMatches(media.matches)
    media.addEventListener('change', onChange)
    setMatches(media.matches)
    return () => media.removeEventListener('change', onChange)
  }, [query])

  return matches
}

function normalizeResource(resource, fallbackId) {
  const rawLanguage = resource.language ?? resource.languageCode ?? 'Unknown'
  const languages = splitLanguages(rawLanguage)
  return {
    id: resource.id ?? fallbackId,
    title: resource.title ?? '',
    description: resource.description ?? '',
    language: languages.join(', ') || 'Unknown',
    languages: languages.length > 0 ? languages : ['Unknown'],
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
  const [resourceActionError, setResourceActionError] = useState('')
  const [isLoadingResources, setIsLoadingResources] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingResourceId, setEditingResourceId] = useState(null)
  const [deletingResourceId, setDeletingResourceId] = useState(null)
  const [selectedLanguage, setSelectedLanguage] = useState('All languages')
  const [selectedTag, setSelectedTag] = useState('All topics')
  const submitSectionRef = useRef(null)

  useEffect(() => {
    if (editingResourceId === null) {
      return
    }

    submitSectionRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }, [editingResourceId])

  useEffect(() => {
    let isMounted = true

    const loadResources = async () => {
      setIsLoadingResources(true)
      setResourceLoadError('')
      setResourceActionError('')

      try {
        const apiResources = await fetchResources()
        if (!isMounted) {
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

        setResources([])
        const msg = String(error?.message ?? '')
        const networkish =
          msg === 'Failed to fetch' ||
          msg.toLowerCase().includes('networkerror')
        const hint = networkish
          ? ' Start the API with `npm run backend:dev` (default http://127.0.0.1:4000). Optional root `.env`: `DATABASE_URL`, `PORT`, `VITE_API_BASE_URL` if the API is not on 4000. Then `npm run dev`.'
          : ''
        setResourceLoadError(
          `Could not load resources from API. ${error.message}.${hint}`,
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
    ...new Set([
      ...SUPPORTED_LANGUAGES,
      ...resources.flatMap((resource) => resource.languages),
    ]),
  ].sort((a, b) => {
    if (a === 'All languages') return -1
    if (b === 'All languages') return 1
    return a.localeCompare(b)
  })

  const tagOptions = [
    'All topics',
    ...new Set(resources.flatMap((resource) => resource.tags)),
  ]

  const filteredResources = resources.filter((resource) => {
    const languageMatches =
      selectedLanguage === 'All languages' ||
      resource.languages.includes(selectedLanguage)
    const tagMatches =
      selectedTag === 'All topics' || resource.tags.includes(selectedTag)

    return languageMatches && tagMatches
  })

  const useTwoColumnLayout = useMediaQuery('(min-width: 921px)')
  const [leftColumnResources, rightColumnResources] = useMemo(
    () => distributeIntoTwoColumns(filteredResources),
    [filteredResources],
  )

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setFormData((previous) => ({ ...previous, [name]: value }))
    setErrors((previous) => ({ ...previous, [name]: '' }))
    setStatusMessage('')
    setResourceActionError('')
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
    setResourceActionError('')
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
      if (editingResourceId) {
        const updatedResource = await updateResource(editingResourceId, nextResource)
        const normalizedResource = normalizeResource(
          updatedResource,
          editingResourceId,
        )
        setResources((previous) =>
          previous.map((resource) =>
            resource.id === editingResourceId ? normalizedResource : resource,
          ),
        )
        setStatusMessage('Resource updated successfully.')
      } else {
        const createdResource = await createResource(nextResource)
        const normalizedResource = normalizeResource(createdResource, Date.now())
        setResources((previous) => [normalizedResource, ...previous])
        setStatusMessage('Resource submitted successfully.')
      }

      setFormData(initialFormState)
      setEditingResourceId(null)
    } catch (error) {
      setResourceActionError(error.message)
      setStatusMessage('Could not save resource.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditResource = (resource) => {
    setFormData({
      title: resource.title,
      description: resource.description,
      url: resource.url,
      language: resource.language,
      tags: resource.tags.join(', '),
    })
    setEditingResourceId(resource.id)
    setErrors({})
    setStatusMessage('')
    setResourceActionError('')
  }

  const handleCancelEdit = () => {
    setEditingResourceId(null)
    setFormData(initialFormState)
    setErrors({})
    setStatusMessage('')
    setResourceActionError('')
  }

  const handleDeleteResource = async (resource) => {
    const confirmed = window.confirm(
      `Delete "${resource.title}"?\n\nThis action cannot be undone.`,
    )

    if (!confirmed) {
      return
    }

    const resourceId = resource.id
    setDeletingResourceId(resourceId)
    setStatusMessage('')
    setResourceActionError('')

    try {
      await deleteResource(resourceId)
      setResources((previous) =>
        previous.filter((resource) => resource.id !== resourceId),
      )
      setStatusMessage('Resource deleted successfully.')
      if (editingResourceId === resourceId) {
        handleCancelEdit()
      }
    } catch (error) {
      setResourceActionError(error.message)
    } finally {
      setDeletingResourceId(null)
    }
  }

  const renderResourceCard = (resource) => (
    <article key={resource.id} className="resource-item">
      <h3>{resource.title}</h3>
      <p>{resource.description}</p>

      <div className="chip-group">
        <p className="resource-meta">Languages:</p>
        <div className="tag-row">
          {resource.languages.map((lang) => (
            <span key={`${resource.id}-lang-${lang}`} className="tag-chip">
              {lang}
            </span>
          ))}
        </div>
      </div>

      {resource.tags.length > 0 && (
        <div className="chip-group">
          <p className="resource-meta">Topics:</p>
          <div className="tag-row">
            {resource.tags.map((tag) => (
              <span key={`${resource.id}-${tag}`} className="tag-chip">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
      <a href={resource.url} target="_blank" rel="noreferrer">
        Visit resource
      </a>
      <div className="resource-actions">
        <button
          type="button"
          className="inline-btn"
          onClick={() => handleEditResource(resource)}
        >
          Edit
        </button>
        <button
          type="button"
          className="inline-btn danger-btn"
          onClick={() => handleDeleteResource(resource)}
          disabled={deletingResourceId === resource.id}
        >
          {deletingResourceId === resource.id ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </article>
  )

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
            <h1
              className="hero-title"
              style={{
                lineHeight: '1.15',
                letterSpacing: '-0.4px',
                margin: '0 0 12px',
              }}
            >
              Mental health resources in every language
            </h1>
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
            {resourceActionError && (
              <p className="api-feedback error-message">{resourceActionError}</p>
            )}
          </div>

          <section
            id="languages"
            className="supported-languages"
            aria-labelledby="supported-languages-heading"
          >
            <h3 id="supported-languages-heading">Supported languages</h3>
            <ul className="language-chip-list">
              {SUPPORTED_LANGUAGES.map((language) => (
                <li key={language}>
                  <span className="tag-chip">{language}</span>
                </li>
              ))}
            </ul>
          </section>

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
            useTwoColumnLayout ? (
              <div className="resource-columns">
                <div className="resource-column">
                  {leftColumnResources.map((resource) =>
                    renderResourceCard(resource),
                  )}
                </div>
                <div className="resource-column">
                  {rightColumnResources.map((resource) =>
                    renderResourceCard(resource),
                  )}
                </div>
              </div>
            ) : (
              <div className="resource-column resource-column--single">
                {filteredResources.map((resource) =>
                  renderResourceCard(resource),
                )}
              </div>
            )
          ) : (
            <p className="empty-state">
              No resources match your current filters. Try another language or
              topic.
            </p>
          )}

        </section>

        <section
          id="submit"
          ref={submitSectionRef}
          className="submit-section"
        >
          <div className="submit-header">
            <h2>
              {editingResourceId ? 'Update resource' : 'Submit a new resource'}
            </h2>
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
              {isSubmitting
                ? editingResourceId
                  ? 'Updating...'
                  : 'Submitting...'
                : editingResourceId
                  ? 'Update resource'
                  : 'Submit resource'}
            </button>
            {editingResourceId && (
              <button
                type="button"
                className="secondary-btn form-submit-btn"
                onClick={handleCancelEdit}
              >
                Cancel edit
              </button>
            )}

            {statusMessage && <p className="form-status">{statusMessage}</p>}
          </form>
        </section>
      </main>
    </div>
  )
}

export default App
