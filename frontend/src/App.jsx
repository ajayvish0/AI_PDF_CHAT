import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";

import UploadComponent from "./pages/Upload";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/upload" element={<UploadComponent />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
