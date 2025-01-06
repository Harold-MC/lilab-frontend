import { useNavigate } from "react-router-dom"
import { TOKEN_KEY, USER_KEY, useAuth } from "./useAuth"

export const logout = () => {
    localStorage.removeItem(USER_KEY)
    localStorage.removeItem(TOKEN_KEY)

    window.location.href = '/'
}

const useLogout = () => {
    const navigate = useNavigate()
    const { setToken, setUser } = useAuth()

    return () => {
        navigate('/')
        setToken(null)
        setUser(null)
    }
}

export default useLogout