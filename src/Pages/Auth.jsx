
import { USER_DATA_KEY } from "@/constants";
import { createContext, useContext } from "react"
import { Navigate } from "react-router-dom";



export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const userData = JSON.parse(localStorage.getItem(USER_DATA_KEY) || '{}')
   
    return (
        <AuthContext.Provider value={{...userData}}>
            {children}
        </AuthContext.Provider>
    )
} 
export const RequireAuth = ({children}) => {
    const user = useContext(AuthContext)

    if(!user?.id){
        return <Navigate to={'/'} replace/>
    }

    return(
        <AuthProvider>
            {children}
        </AuthProvider>
    )
}    