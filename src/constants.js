import { isDevelopment, isProduction } from "./functions";

export const AUTH_DATA_KEY = 'auth';
export const USER_DATA_KEY = 'user'
let BACKEND_URL = isProduction() ?  "https://backoffice-v1.theinnvista.com" :'https://hms-v1.atslng.com' 
if (isDevelopment()) {
    BACKEND_URL = "http://localhost:3330"
}
export { BACKEND_URL }