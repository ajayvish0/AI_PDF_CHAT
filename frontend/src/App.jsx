import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Test from "./pages/Test";

import UploadComponent from "./pages/Upload";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/test" element={<Test />} />
          <Route path="/upload" element={<UploadComponent />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
