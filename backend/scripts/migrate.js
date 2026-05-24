import { readFile, readdir } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import pool from '../db/pool.js'

const currentDirectory = dirname(fileURLToPath(import.meta.url))
const schemaDirectory = join(currentDirectory, '..', 'db')

async function runMigrations() {
  const files = await readdir(schemaDirectory)
  const sqlFiles = files.filter((file) => file.endsWith('.sql')).sort()

  if (sqlFiles.length === 0) {
    console.log('No schema SQL files found in backend/db.')
    return
  }

  for (const file of sqlFiles) {
    const filePath = join(schemaDirectory, file)
    const sql = await readFile(filePath, 'utf-8')
    await pool.query(sql)
    console.log(`Applied schema: ${file}`)
  }
}

runMigrations()
  .then(async () => {
    await pool.end()
    console.log('Migrations completed successfully.')
  })
  .catch(async (error) => {
    await pool.end()
    console.error('Migration failed:', error.message)
    process.exit(1)
  })
