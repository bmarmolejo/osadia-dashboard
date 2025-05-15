import { Link } from "react-router-dom";
import "../components/Button.scss";

function Button({ children, className = "", onClick, to, type = "" }) {
  return to ? (
    <Link to={to} className={`btn ${className}`}>
      {children}
    </Link>
  ) : (
    <button type={type} className={`btn ${className}`} onClick={onClick}>
      {children}
    </button>
  );
}

export default Button;