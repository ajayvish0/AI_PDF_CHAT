import { Link } from "react-router-dom";
import Logo from "../utils/Logo";
import gala_add from "../assets/gala_add.svg";
import pdf from "../assets/pdf.svg";

const Navbar = ({ name }) => {
  return (
    <div className="  shadow-lg bg-white sticky top-0 w-full  py-2 px-1 md:px-[2rem] flex justify-between">
      <div>
        <Logo />
      </div>
      <div className="  items-center flex  ">
        {name && (
          <div className="flex items-center gap-x-1">
            <img src={pdf} />
            <h1 className="font-semibold text-[0.7rem] pr-2 md:text-[0.8rem] lg:pr-8   text-green-500 md:pr-4">
              {name}
            </h1>
          </div>
        )}
        <Link to="/upload">
          <div className="border-2 border-black px-1 py-2 md:px-[1.7rem]  rounded-xl flex gap-x-2">
            <img src={gala_add} className=" max-md:w-[2rem] w-[1.4rem]" />
            <h1 className="font-semibold max-md:hidden">Upload PDF</h1>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
