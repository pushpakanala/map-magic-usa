export const API_SERVER_URL = import.meta.env.VITE_API_SERVER_URL || 'http://localhost:8000'

export const USER_RESOURCE = `${API_SERVER_URL}/user-management/user/`
export const LOGIN = `${USER_RESOURCE}login`

export const UNIVERSITY_RESOURCE = `${API_SERVER_URL}/university-management/state_university/`