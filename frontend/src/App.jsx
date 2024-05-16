import axios from "axios";
import { useState } from "react";
function App() {
  const [file, setFile] = useState(null);
  const [question, setQuestion] = useState("");

  const [final, setFinal] = useState([]);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };
  const submitImage = async (event) => {
    event.preventDefault();

    if (!file) {
      console.error("No file selected.");
      return;
    }

    const formData = new FormData();
    formData.append("files", file); // Use "files" to match the server-side expectation
    console.log([...formData]); // Log formData content for debugging

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/upload_pdf/",
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
    }
  };

  return (
    <div>
      <form onSubmit={submitImage}>
        <div className="flex gap-x-9">
          {file && (
            <div id="fileTitle" className="text-green-400 font-semibold">
              {file.name}
            </div>
          )}
          <input
            type="file"
            id="fileInput"
            accept=".pdf"
            onChange={handleFileChange}
            className="hidden " // Hide the default file input
          />
          <label
            htmlFor="fileInput"
            id="fileInputLabel"
            className="cursor-pointer font-semibold text-lg border-2 px-[2rem] py-1 border-black rounded-xl"
          >
            Upload PDF
          </label>
          <button>submit</button>
        </div>
      </form>
      <div className="h-full pt-[4rem]">
        <div className="overflow-y-scroll h-[500px]">
          {final.map((item, index) => (
            <div key={index}>
              <h1 className="bg-slate-700 p-2 m-1">{item.question}</h1>
              <p className="bg-slate-400 p-2 m-1">{item.answer}</p>
            </div>
          ))}
        </div>

        <input
          className="border-black border-2"
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <button
          onClick={async () => {
            const payload = { question };
            console.log("Request Payload:", payload);
            setFinal([...final, { question, answer: "loading..." }]);
            try {
              const response = await axios.post(
                "http://127.0.0.1:8000/ask_question/",
                payload, // Ensure the payload is structured correctly
                {
                  headers: { "Content-Type": "application/json" }, // Ensure the header is set correctly
                }
              );

              setFinal([
                ...final,
                { question, answer: response.data.response },
              ]);
              console.log(response.data.response); // Handle the response as needed
            } catch (error) {
              console.error(
                "Error asking question:",
                error.response ? error.response.data : error.message
              );
            } finally {
              setQuestion("");
            }
          }}
        >
          submit
        </button>
      </div>
    </div>
  );
}

export default App;
