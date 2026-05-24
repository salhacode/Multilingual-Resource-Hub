import pool from '../db/pool.js'

const seedResources = [
  {
    title: 'Crisis Text Line',
    description:
      'Free text-based crisis counseling available 24/7 with trained responders.',
    url: 'https://www.crisistextline.org/',
    language: 'English',
    tags: ['crisis', 'text', 'youth'],
    translatedSummary:
      'Free crisis counseling by text message, available day and night.',
  },
  {
    title: 'Linea 988 en Espanol',
    description:
      'Apoyo telefonico en espanol para momentos de crisis emocional en los Estados Unidos.',
    url: 'https://988lifeline.org/help-yourself/en-espanol/',
    language: 'Spanish',
    tags: ['hotline', 'crisis', 'phone'],
    translatedSummary:
      'Spanish-language hotline for urgent emotional distress in the United States.',
  },
  {
    title: 'Naseeha Muslim Youth Helpline',
    description:
      'Confidential support for Muslim youth, including stress and anxiety concerns.',
    url: 'https://naseeha.org/',
    language: 'Arabic',
    tags: ['faith', 'youth', 'support'],
    translatedSummary:
      'Confidential emotional support service for Muslim youth and families.',
  },
  {
    title: 'Kids Help Phone',
    description:
      'Mental health support and counseling access for children and youth in Canada.',
    url: 'https://kidshelpphone.ca/',
    language: 'French',
    tags: ['youth', 'chat', 'phone'],
    translatedSummary:
      'Counseling and support resources for children and teens across Canada.',
  },
]

async function seed() {
  await pool.query('DELETE FROM resources')

  const insertQuery = `
    INSERT INTO resources (title, description, url, language, tags, translated_summary)
    VALUES ($1, $2, $3, $4, $5, $6)
  `

  for (const resource of seedResources) {
    await pool.query(insertQuery, [
      resource.title,
      resource.description,
      resource.url,
      resource.language,
      resource.tags,
      resource.translatedSummary,
    ])
  }

  console.log(`Seeded ${seedResources.length} resources.`)
}

seed()
  .then(async () => {
    await pool.end()
  })
  .catch(async (error) => {
    await pool.end()
    console.error('Seeding failed:', error.message)
    process.exit(1)
  })
