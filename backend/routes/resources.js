import { Router } from 'express'
import pool from '../db/pool.js'

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
    response.status(200).json({ resources: rows })
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
  const translatedSummary = request.body.translatedSummary ?? null

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
    RETURNING
      id,
      title,
      description,
      url,
      language,
      tags,
      translated_summary AS "translatedSummary",
      created_at AS "createdAt",
      updated_at AS "updatedAt"
  `

  try {
    const { rows } = await pool.query(insertQuery, [
      title,
      description,
      url,
      language,
      tags,
      translatedSummary,
    ])

    response.status(201).json(rows[0])
  } catch (error) {
    response.status(500).json({
      error: 'Failed to create resource.',
      details: error.message,
    })
  }
})

export default resourcesRouter
