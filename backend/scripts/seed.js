import path from 'node:path'
import { fileURLToPath } from 'node:url'
import pool from '../db/pool.js'

const seedScriptPath = fileURLToPath(import.meta.url)

export const seedResources = [
  {
    title: 'Linea 988 - Ayuda en Espanol',
    description:
      'Sitio oficial en espanol del 988 Suicide & Crisis Lifeline. Marca el 988 y presiona 2 para hablar con un consejero, envia AYUDA al 988 para chatear por mensaje de texto, o usa el chat en linea, todo en espanol y disponible 24/7/365.',
    url: 'https://988lifeline.org/es/inicio/',
    language: 'Spanish, English',
    tags: ['crisis', 'hotline', 'Latino/Hispanic'],
    translatedSummary:
      'US 988 Suicide & Crisis Lifeline Spanish-language access: dial or text 988 and press 2, or chat, 24/7.',
  },
  {
    title: 'Crisis Text Line',
    description:
      'Free, confidential 24/7 crisis support by text in the United States. Text HOME to 741741 for English or AYUDA to 741741 for Spanish to connect with a trained volunteer Crisis Counselor.',
    url: 'https://www.crisistextline.org/',
    language: 'English, Spanish',
    tags: ['crisis', 'text', 'general'],
    translatedSummary:
      'Text HOME (English) or AYUDA (Spanish) to 741741 for free 24/7 crisis support in the US.',
  },
  {
    title: 'Asian LifeNet Hotline (AASPE)',
    description:
      'Hotline listed by Asian American Suicide Prevention & Education: call 1-877-990-8585 to reach the Asian LifeNet Hotline, available 24 hours, with support in Cantonese, Mandarin, Japanese, Korean, and Fujianese.',
    url: 'https://aaspe.net/',
    language: 'Cantonese, Mandarin, Japanese, Korean, Fujianese, English',
    tags: ['crisis', 'hotline', 'AAPI'],
    translatedSummary:
      'NYC-based Asian American suicide prevention site listing the Asian LifeNet Hotline (1-877-990-8585) in Cantonese, Mandarin, Japanese, Korean, and Fujianese.',
  },
  {
    title: 'Latinx Therapy',
    description:
      'US-based bilingual mental health platform founded by Adriana Alejandre, LMFT. Offers a national directory of Latinx therapists, the Spanish/English Latinx Therapy podcast, courses, and workshops dedicated to breaking mental health stigma in Latinx communities.',
    url: 'https://latinxtherapy.com/',
    language: 'Spanish, English',
    tags: ['therapy', 'directory', 'Latino/Hispanic'],
    translatedSummary:
      'Bilingual US directory and podcast helping Latinx individuals find Spanish-speaking therapists.',
  },
  {
    title: 'NAMI Hispanic/Latinx Community Resources',
    description:
      'NAMI national page focused on mental health in the Hispanic/Latinx community in the US. Covers barriers to care, culturally competent care, the bilingual "Compartiendo Esperanza" video series, and a list of Spanish-language resources and directories.',
    url: 'https://www.nami.org/community-and-culture/hispanic-latinx/',
    language: 'English, Spanish',
    tags: ['education', 'support', 'Latino/Hispanic'],
    translatedSummary:
      'NAMI resource hub on Hispanic/Latinx mental health in the US, including the bilingual Compartiendo Esperanza program.',
  },
  {
    title: 'Khalil Center',
    description:
      'US nonprofit psychological and spiritual wellness center providing Islamically integrated psychotherapy (TIIP) for adults, youth, children, couples, and families. Offers mental health services, community education, and clinician training across multiple US cities and via telehealth.',
    url: 'https://khalilcenter.com/mental-health-services',
    language: 'English, Arabic, Urdu',
    tags: ['therapy', 'Muslim', 'telehealth'],
    translatedSummary:
      'US Islamically integrated psychotherapy and counseling for Muslim individuals and families.',
  },
  {
    title: 'Asian Mental Health Collective – Asian Therapist Directory',
    description:
      'Searchable directory of 3,000+ Asian therapist profiles across the US and Canada. Filter by US state, ethnicity, spoken language (including Arabic, Bengali, Cantonese, Farsi, Filipino, Gujarati, Hindi, Japanese, Korean, Mandarin, Punjabi, Tamil, Thai, Urdu, Vietnamese, and more), insurance, and specialty.',
    url: 'https://www.asianmhc.org/therapists/',
    language:
      'English, Mandarin, Cantonese, Vietnamese, Korean, Tagalog, Hindi, Urdu, Japanese, Arabic, Bengali, Farsi, Punjabi, Tamil, Thai',
    tags: ['therapy', 'directory', 'AAPI', 'South Asian'],
    translatedSummary:
      'Find Asian American therapists in the US filtered by spoken language, state, ethnicity, and specialty.',
  },
  {
    title: 'South Asian Therapists',
    description:
      'International directory of South Asian therapists, including clinicians of Indian, Pakistani, Bangladeshi, Sri Lankan, Afghani, and Nepali heritage, many of whom practice in the United States and offer culturally responsive care in South Asian languages and English.',
    url: 'https://southasiantherapists.org/',
    language: 'English, Hindi, Urdu, Punjabi, Tamil, Bengali, Gujarati, Nepali',
    tags: ['therapy', 'directory', 'South Asian'],
    translatedSummary:
      'Directory of South Asian therapists offering culturally informed care in English and South Asian languages.',
  },
  {
    title: 'The Loveland Foundation',
    description:
      'US nonprofit founded by Rachel Cargle that covers the cost of therapy for Black women and non-binary individuals through its Therapy Fund. Provides therapy vouchers, mental health resources, and invests in the professional development of BIPOC therapists.',
    url: 'https://thelovelandfoundation.org/',
    language: 'English',
    tags: ['therapy fund', 'support', 'Black/African American'],
    translatedSummary:
      'US therapy fund providing vouchers for Black women and non-binary individuals to access therapy.',
  },
  {
    title: 'Therapy for Black Girls',
    description:
      'US directory, podcast, and online community supporting the mental wellness of Black women and girls. The provider directory at providers.therapyforblackgirls.com lets you search culturally responsive therapists by state and specialty.',
    url: 'https://therapyforblackgirls.com/',
    language: 'English',
    tags: ['therapy', 'directory', 'Black/African American'],
    translatedSummary:
      'US therapist directory, podcast, and community for the mental wellness of Black women and girls.',
  },
  {
    title: 'BEAM – Black Emotional and Mental Health Collective',
    description:
      'US collective focused on the healing, wellness, and liberation of Black and marginalized communities. Provides free toolkits on emotional care, peer support, and wellness; virtual trainings; and community workshops that center Black mental and emotional health.',
    url: 'https://beam.community/',
    language: 'English',
    tags: ['education', 'support', 'Black/African American'],
    translatedSummary:
      'US collective offering toolkits, trainings, and community resources for Black emotional and mental health.',
  },
  {
    title: 'Boriken Neighborhood Health Center – Behavioral Health',
    description:
      'Federally Qualified Health Center in East Harlem, New York City. The Behavioral Health team provides screening, evaluation, individual, group, family and medication therapy, and care coordination for children, adolescents, adults, and seniors, with bilingual Spanish-English staff serving the Puerto Rican and broader Latino community.',
    url: 'https://boriken.org/programs/services/',
    language: 'Spanish, English',
    tags: ['therapy', 'community clinic', 'Latino/Hispanic'],
    translatedSummary:
      'Bilingual (Spanish/English) behavioral health care in East Harlem, NYC.',
  },
  {
    title: 'Hamilton-Madison House – Behavioral Health',
    description:
      'Lower East Side NYC nonprofit and leading provider of behavioral health services for the Asian American community. Offers outpatient Chinese, Korean, Japanese, and Southeast Asian clinics; addiction recovery in six languages and seven dialects; psychiatry; supportive housing; and community-based services.',
    url: 'https://hamiltonmadisonhouse.org/behavioral-health/',
    language: 'Mandarin, Cantonese, Korean, Japanese, Vietnamese, English',
    tags: ['therapy', 'community clinic', 'AAPI'],
    translatedSummary:
      'NYC Asian American outpatient mental health clinic with services in Chinese, Korean, Japanese, and Southeast Asian languages.',
  },
  {
    title: 'Jewish Board – Seymour Askin Counseling Center',
    description:
      'Jewish Board outpatient mental health clinic at 2020 Coney Island Ave, Brooklyn. Provides individual, group, and family therapy for ages 5+, plus psychiatric care and medication-assisted treatment, with services available in English, Spanish, and Russian.',
    url: 'https://jewishboard.org/program-directory/the-seymour-askin-counseling-center/',
    language: 'English, Spanish, Russian',
    tags: ['therapy', 'community clinic', 'Russian/Slavic'],
    translatedSummary:
      'Brooklyn outpatient mental health clinic offering services in English, Spanish, and Russian.',
  },
  {
    title: 'Jewish Board Children\'s Mental Health (NYC)',
    description:
      'Jewish Board mental health services for children, teens, and young adults across NYC, including the Children\'s Mobile Crisis Team, Home-Based Crisis Intervention, Loss and Bereavement Program, Youth ACT (ages 10-21), youth residential care, and Supervised Independent Living.',
    url: 'https://jewishboard.org/how-we-can-help/childrens-mental-health/',
    language: 'English, Spanish, Russian, Haitian Creole',
    tags: ['therapy', 'children/teens', 'multilingual'],
    translatedSummary:
      'NYC mental health programs for children, teens, and young adults with multilingual clinicians.',
  },
  {
    title: 'HCC BeWell – Haitian-American Community Coalition (Brooklyn)',
    description:
      'BeWell is the mental health clinic of the Haitian-American Community Coalition in Brooklyn, NYC. It provides culturally responsive, trauma-informed counseling, assessment, and psychiatry/medication management in English, Haitian Creole, and Spanish for underserved minority communities.',
    url: 'https://www.hccinc.org/brooklyn-empowerment-wellness-cente',
    language: 'Haitian Creole, English, Spanish',
    tags: ['therapy', 'community clinic', 'Haitian/Caribbean'],
    translatedSummary:
      'Brooklyn mental health clinic offering trauma-informed care in Haitian Creole, English, and Spanish.',
  },
  {
    title: 'Arab American Family Support Center',
    description:
      'Brooklyn-based nonprofit that has served NYC immigrant, refugee, and marginalized communities for 30+ years. AAFSC helps families access mental health counseling, government benefits, English classes, citizenship support, affordable housing, parenting workshops, and youth programs, with culturally responsive services for Arab, Middle Eastern, North African, Muslim, and South Asian families.',
    url: 'https://aafscny.org/',
    language: 'Arabic, Bengali, Urdu, English',
    tags: ['therapy', 'community', 'MENA', 'South Asian', 'Black/African American', 'Muslim'],
    translatedSummary:
      'NYC nonprofit providing mental health counseling and family services for Arab, MENA, Muslim, and South Asian families.',
  },
  {
    title: 'UPAC Counseling & Treatment Center (San Diego)',
    description:
      'Union of Pan Asian Communities (UPAC) outpatient mental health clinic in San Diego, CA, providing culturally sensitive services for Asian and Pacific Islander adults 18+. Services include assessments, individual and group therapy, peer support, case management, and psychiatric medication management, offered in English, Tagalog, Vietnamese, Cambodian, Laotian, Chinese, Karen, Burmese, Japanese, Korean, and other Asian and Pacific Islander languages.',
    url: 'https://www.upacsd.org/services/adult-and-older-adult-mental-health-programs/counseling-treatment-center/',
    language: 'English, Tagalog, Vietnamese, Cambodian, Laotian, Chinese, Karen, Burmese, Japanese, Korean',
    tags: ['therapy', 'community clinic', 'AAPI'],
    translatedSummary:
      'San Diego mental health clinic for Asian and Pacific Islander adults, with services in Tagalog, Vietnamese, Cambodian, Laotian, Chinese, Korean, Japanese, and more.',
  },
  {
    title: 'StrongHearts Native Helpline',
    description:
      'Culturally appropriate, anonymous, and confidential 24/7 domestic and sexual violence helpline for Native Americans and Alaska Natives in the United States. Call or text 1-844-7NATIVE (762-8483), or chat on the website, for peer support, safety planning, crisis intervention, and Native-centered referrals.',
    url: 'https://strongheartshelpline.org/',
    language: 'English',
    tags: ['crisis', 'hotline', 'Native American'],
    translatedSummary:
      'US 24/7 domestic and sexual violence helpline for Native Americans and Alaska Natives: 1-844-762-8483.',
  },
  {
    title: 'Korean American Mental Health Association (KAMHA)',
    description:
      'Orange County, California nonprofit dedicated to Korean American mental health. KAMHA offers community education, events, and referrals to culturally responsive Korean-speaking providers for individuals and families.',
    url: 'https://www.kamhaoc.org/',
    language: 'Korean, English',
    tags: ['community', 'education', 'Korean'],
    translatedSummary:
      'Orange County nonprofit offering Korean American mental health education and provider referrals in Korean and English.',
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

const isSeedCli =
  process.argv[1] && path.resolve(process.argv[1]) === seedScriptPath

if (isSeedCli) {
  seed()
    .then(async () => {
      await pool.end()
    })
    .catch(async (error) => {
      await pool.end()
      console.error('Seeding failed:', error.message)
      process.exit(1)
    })
}
