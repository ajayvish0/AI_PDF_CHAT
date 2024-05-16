import axios from "axios";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import { BeatLoader } from "react-spinners";
import iconoir_send from "../assets/Vector.png";
import Icon from "../assets/logo.png";
import nameicon from "../assets/name.png";

const Home = () => {
  const location = useLocation();
  const fileName = location.state?.fileName;

  const [final, setFinal] = useState([]);
  const [question, setQuestion] = useState("");
  const [button, setButton] = useState(false);

  const handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      handleButtonClick();
    }
  };

  const handleButtonClick = async () => {
    setButton(true);
    const payload = { question };
    console.log("Request Payload:", payload);
    setFinal([...final, { question, answer: "loading..." }]);
    try {
      const response = await axios.post(
        "https://ai-pdf-chat.onrender.com/ask_question/",
        payload, // Ensure the payload is structured correctly
        {
          headers: { "Content-Type": "application/json" }, // Ensure the header is set correctly
        }
      );

      setFinal([...final, { question, answer: response.data.response }]);
      console.log(response.data.response); // Handle the response as needed
    } catch (error) {
      console.error(
        "Error asking question:",
        error.response ? error.response.data : error.message
      );
    } finally {
      setQuestion("");
      setButton(false);
    }
  };

  return (
    <div className="relative h-screen">
      <Navbar name={fileName} />

      <div className="pt-[1rem] sm:px-[8rem] px-[2rem]">
        {final.map((item, index) => (
          <div key={index}>
            <div className="flex gap-x-3 mt-[1.3rem]">
              <img src={nameicon} alt="usrname" />
              <h1 className="text-black p-2 m-1">{item.question}</h1>
            </div>
            {item.answer === "loading..." ? (
              <BeatLoader size={10} color="#36d7b7" />
            ) : (
              <div className="flex items-center gap-x-3 mt-[2rem]">
                <img src={Icon} alt="icon" />
                <p className=" text-black p-2 m-1">{item.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="fixed bottom-0 w-full flex justify-center pb-4 sm:px-[8rem] px-[2rem]  ">
        <div className="border-slate-300 border-2 rounded-xl px-6 h-[50px] w-full shadow-xl  flex items-center">
          <input
            type="text"
            value={question}
            onKeyDown={handleKeyDown}
            placeholder="Send a message..."
            className="outline-none border-none bg-inherit mr-2 w-full  px-2"
            onChange={(e) => setQuestion(e.target.value)}
          />
          <button
            disabled={button}
            className="cursor-pointer"
            onClick={handleButtonClick}
          >
            <img src={iconoir_send} alt="send" className="w-[30px]" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
