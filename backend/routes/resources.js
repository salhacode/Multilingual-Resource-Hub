import { Router } from 'express'
import pool from '../db/pool.js'

const resourcesRouter = Router()

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

resourcesRouter.post('/', (_request, response) => {
  response.status(501).json({
    error: 'Resources submission route is not implemented yet.',
  })
})

export default resourcesRouter
