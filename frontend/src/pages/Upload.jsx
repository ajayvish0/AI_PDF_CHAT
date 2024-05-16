import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BounceLoader } from "react-spinners";
import pdf from "../assets/pdf.svg";

const UploadComponent = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const Navigate = useNavigate();

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };
  const submitImage = async (event) => {
    event.preventDefault();

    if (!file) {
      console.error("No file selected.");
      return;
    }
    setLoading(true);

    const formData = new FormData();
    formData.append("files", file); // Use "files" to match the server-side expectation
    console.log([...formData]);

    try {
      const response = await axios.post(
        "https://ai-pdf-chat.onrender.com/upload_pdf/",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      console.log(response.data);
    } catch (error) {
      console.error(
        "Error uploading file:",
        error.response ? error.response.data : error.message
      );
    } finally {
      setLoading(false);
      Navigate("/", { state: { fileName: file.name } });
    }
  };
  return (
    <div className=" h-screen flex justify-center items-center ">
      <form onSubmit={submitImage}>
        <div className="border-4 border-dotted w-[600px]  text-center p-6 cursor-pointer">
          <input
            type="file"
            id="fileInput"
            accept=".pdf"
            onChange={handleFileChange}
            className="hidden " // Hide the default file input
          />
          <label htmlFor="fileInput" id="fileInputLabel">
            <div className="flex justify-center items-center cursor-pointer">
              <img src={pdf} alt="pdf_logo" className="w-[60px]" />
            </div>
            <div className="flex justify-center items-center pt-5">
              {file !== null ? (
                <div id="fileTitle" className="text-green-400 font-semibold">
                  {file.name}
                </div>
              ) : (
                <div className="cursor-pointer text-xl">
                  Upload your PDF file here!!
                </div>
              )}
            </div>
          </label>

          <div className=" flex justify-center items-center gap-x-3 pt-5 ">
            <div>{loading && <BounceLoader size={30} color="#36d7b7" />}</div>
            <button
              disabled={loading}
              className="text-xl text-green-500 shadow-lg py-2 px-5 border-2 border-slate-300 rounded-lg hover:bg-green-400 hover:text-white "
            >
              Upload pdf
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UploadComponent;
