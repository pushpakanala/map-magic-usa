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