import pool from '../db/pool.js'
import { seedResources } from './seed.js'

async function backfillSummaries() {
  let updated = 0

  for (const resource of seedResources) {
    const summary = resource.translatedSummary?.toString().trim()
    if (!summary) continue

    const { rowCount } = await pool.query(
      `UPDATE resources
       SET translated_summary = $2, updated_at = NOW()
       WHERE title = $1
         AND (translated_summary IS NULL OR translated_summary = '')`,
      [resource.title, summary],
    )

    updated += rowCount
  }

  console.log(`Backfilled English summaries on ${updated} resource(s).`)
}

backfillSummaries()
  .then(async () => {
    await pool.end()
  })
  .catch(async (error) => {
    await pool.end()
    console.error('Backfill failed:', error.message)
    process.exit(1)
  })
