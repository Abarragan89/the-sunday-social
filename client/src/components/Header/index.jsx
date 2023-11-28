/* eslint-disable react/prop-types */
import { NavLink } from "react-router-dom";
import Navigation from "../Navigation";
import './index.css'

function Header({ photoURL, triggerRefreshAmongPages }) {

    return (
        <header className="header">
            <NavLink to='/'>
                <img className="logo" src="/logo2.png"></img>
            </NavLink>
            <Navigation 
            photoURL={photoURL} 
            triggerRefreshAmongPages={triggerRefreshAmongPages}
            />  
        </header>
    )
}

export default Header;