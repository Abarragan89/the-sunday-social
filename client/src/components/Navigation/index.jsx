/* eslint-disable react/prop-types */
import NavLinks from "../NavLinks"
import './index.css';

function Navigation({ triggerRefreshAmongPages }) {
    return (
        <nav className="navigation">
            <NavLinks 
                triggerRefreshAmongPages={triggerRefreshAmongPages}
            />
        </nav>
    )
}

export default Navigation;