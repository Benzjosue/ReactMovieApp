import { Link } from "react-router-dom";
import "../css/NavBar.css"

function NavBar(){
    return <nav className= 'navbar'>
        <div ClassName = "navbar-brand">
            <Link to= "/"> Movie App</Link>
        </div>
        <div className = "navbar-links">
            <Link to= '/' ClassName = "nav-link">Home</Link>
            <Link to= '/favorites' ClassName = "nav-link">Favorites</Link>
        </div>
    </nav>
}

export default NavBar