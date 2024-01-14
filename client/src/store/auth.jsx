/* eslint-disable react-refresh/only-export-components */
import { createContext } from "react";

export const authStatusContext = createContext({
    isLoggedIn: localStorage.getItem('isLoggedIn'),
    logoutUser: () => {},
    loginUser: () => {}
})

// eslint-disable-next-line react/prop-types
function UserAuthProvider({ children }) {

    function logoutUser() {
        localStorage.removeItem('isLoggedIn')
    }   

    function loginUser() {
        localStorage.setItem('isLoggedIn', 'true')
    }

    const value ={
        isLoggedIn: localStorage.getItem('isLoggedIn'),
        logoutUser,
        loginUser,
    }

    return (
        <authStatusContext.Provider value={value}>
            {children}
        </authStatusContext.Provider>
    )
}

export default UserAuthProvider;