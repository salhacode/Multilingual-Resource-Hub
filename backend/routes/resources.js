import { Router } from 'express'
import pool from '../db/pool.js'
import { translateSummary } from '../services/translationService.js'

const resourcesRouter = Router()

function isValidHttpUrl(value) {
  try {
    const parsedUrl = new URL(value)
    return ['http:', 'https:'].includes(parsedUrl.protocol)
  } catch {
    return false
  }
}

function parseTags(value) {
  if (Array.isArray(value)) {
    return value.map((tag) => String(tag).trim()).filter(Boolean)
  }

  if (typeof value === 'string') {
    return value
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean)
  }

  return []
}

function normalizeResourceRow(resource) {
  return {
    id: resource.id,
    title: resource.title,
    description: resource.description,
    url: resource.url,
    language: resource.language,
    tags: resource.tags,
    translatedSummary: resource.translated_summary ?? null,
    createdAt: resource.created_at,
    updatedAt: resource.updated_at,
  }
}

resourcesRouter.get('/', async (request, response) => {
  const language = request.query.language?.toString().trim() || null
  const tag = request.query.tag?.toString().trim() || null

  const query = `
    SELECT
      id,
      title,
      description,
      url,
      language,
      tags,
      translated_summary AS "translatedSummary",
      created_at AS "createdAt",
      updated_at AS "updatedAt"
    FROM resources
    WHERE ($1::text IS NULL OR LOWER(language) = LOWER($1))
      AND ($2::text IS NULL OR $2 = ANY(tags))
    ORDER BY created_at DESC
  `

  try {
    const { rows } = await pool.query(query, [language, tag])
    response
      .status(200)
      .json({ resources: rows.map((resource) => normalizeResourceRow(resource)) })
  } catch (error) {
    response.status(500).json({
      error: 'Failed to fetch resources.',
      details: error.message,
    })
  }
})

resourcesRouter.post('/', async (request, response) => {
  const title = request.body.title?.toString().trim()
  const description = request.body.description?.toString().trim()
  const url = request.body.url?.toString().trim()
  const language = request.body.language?.toString().trim()
  const tags = parseTags(request.body.tags)
  const translatedSummaryInput = request.body.translatedSummary ?? null

  if (!title || !description || !url || !language) {
    response.status(400).json({
      error: 'title, description, url, and language are required.',
    })
    return
  }

  if (!isValidHttpUrl(url)) {
    response.status(400).json({
      error: 'url must be a valid http or https URL.',
    })
    return
  }

  const insertQuery = `
    INSERT INTO resources (title, description, url, language, tags, translated_summary)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
  `

  try {
    const translatedSummary =
      translatedSummaryInput ??
      (await translateSummary({
        text: description,
        sourceLanguage: language,
      }))

    const { rows } = await pool.query(insertQuery, [
      title,
      description,
      url,
      language,
      tags,
      translatedSummary,
    ])

    response.status(201).json(normalizeResourceRow(rows[0]))
  } catch (error) {
    response.status(500).json({
      error: 'Failed to create resource.',
      details: error.message,
    })
  }
})

resourcesRouter.put('/:id', async (request, response) => {
  const id = Number.parseInt(request.params.id, 10)
  const title = request.body.title?.toString().trim()
  const description = request.body.description?.toString().trim()
  const url = request.body.url?.toString().trim()
  const language = request.body.language?.toString().trim()
  const tags = parseTags(request.body.tags)
  const translatedSummaryInput = request.body.translatedSummary ?? null

  if (!Number.isInteger(id) || id <= 0) {
    response.status(400).json({ error: 'id must be a positive integer.' })
    return
  }

  if (!title || !description || !url || !language) {
    response.status(400).json({
      error: 'title, description, url, and language are required.',
    })
    return
  }

  if (!isValidHttpUrl(url)) {
    response.status(400).json({
      error: 'url must be a valid http or https URL.',
    })
    return
  }

  const updateQuery = `
    UPDATE resources
    SET
      title = $1,
      description = $2,
      url = $3,
      language = $4,
      tags = $5,
      translated_summary = $6,
      updated_at = NOW()
    WHERE id = $7
    RETURNING *
  `

  try {
    const translatedSummary =
      translatedSummaryInput ??
      (await translateSummary({
        text: description,
        sourceLanguage: language,
      }))

    const { rows } = await pool.query(updateQuery, [
      title,
      description,
      url,
      language,
      tags,
      translatedSummary,
      id,
    ])

    if (rows.length === 0) {
      response.status(404).json({ error: 'Resource not found.' })
      return
    }

    response.status(200).json(normalizeResourceRow(rows[0]))
  } catch (error) {
    response.status(500).json({
      error: 'Failed to update resource.',
      details: error.message,
    })
  }
})

resourcesRouter.delete('/:id', async (request, response) => {
  const id = Number.parseInt(request.params.id, 10)

  if (!Number.isInteger(id) || id <= 0) {
    response.status(400).json({ error: 'id must be a positive integer.' })
    return
  }

  try {
    const { rowCount } = await pool.query('DELETE FROM resources WHERE id = $1', [
      id,
    ])

    if (rowCount === 0) {
      response.status(404).json({ error: 'Resource not found.' })
      return
    }

    response.status(204).send()
  } catch (error) {
    response.status(500).json({
      error: 'Failed to delete resource.',
      details: error.message,
    })
  }
})

export default resourcesRouter
