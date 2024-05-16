import { Link } from "react-router-dom";
import Logo from "../utils/Logo";

const Test = () => {
  return (
    <div className="pt-5">
      <Logo />
      <Link to="/upload">Upload PDF</Link>
    </div>
  );
};

export default Test;
