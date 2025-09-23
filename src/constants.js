import { isProduction } from "./functions";

export const AUTH_DATA_KEY = 'auth';
export const USER_DATA_KEY = 'user'
export const BACKEND_URL = isProduction() ?  "https://theinnvista.com" :'https://hms-v1.atslng.com' 
export const DATABASE_KEY = '3vXAQue4AvFC4CLyo689mLS6fVAP-8dPukQPCVzKwYfKWfV9RNeEf2mRZzBHSsiJ.eTBwUTJpLXFZSkpydmlsag.CFjxJU_Be2Lkh12fFZfR8SSwiFi6xY5FCSh-0VtHr14';
