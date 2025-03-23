
export const API_SERVER_URL = import.meta.env.VITE_API_SERVER_URL || 'http://localhost:8000'

export const USER_RESOURCE = `${API_SERVER_URL}/user-management/user/`
export const LOGIN = `${USER_RESOURCE}login`
export const VERIFY_MAIL = `${USER_RESOURCE}email-verify`
export const UPDATE_PWD = `${USER_RESOURCE}update-pwd`

export const UNIVERSITY_RESOURCE = `${API_SERVER_URL}/university-management/state_university/`

export const TOP_UNIVERSITIES_LLM = `${API_SERVER_URL}/llm/llm/top-universities`
export const TOP_GPT_UNIVERSITIES_LLM = `${API_SERVER_URL}/llm/llm/top-universities-gpt`
export const UNIVERSITIS_DATA_GPT = `${API_SERVER_URL}/llm/llm/gpt-universities-data`
export const BOT_GEMINI = `${API_SERVER_URL}/llm/llm/`
export const UNIVERSITIES_COMPARE = `${API_SERVER_URL}/llm/llm/compare-universities-llm`

// Response structure types for the bot
export const BOT_RESPONSE_TYPES = {
  UNIVERSITIES: 'universities',
  COURSES: 'courses',
  FEES: 'fees',
  REQUIREMENTS: 'requirements',
  SCHOLARSHIPS: 'scholarships',
  LIVING_COSTS: 'living_costs',
  RANKINGS: 'rankings',
  ADMISSION_RATE: 'admission_rate',
  CAMPUS_LIFE: 'campus_life',
  NOTABLE_ALUMNI: 'notable_alumni',
  RESEARCH: 'research',
  STUDENT_BODY: 'student_body',
  MESSAGE: 'message',
  ASSISTANT_INFO: 'assistant_info'
}
