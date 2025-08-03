import "./App.css";
import FileUpload from "./components/ FileUpload.js";
import ContactUpload from "./components/ContactUpload.js";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

//add the fn
function App() {
  return (
    <BrowserRouter>
      <Routes>
      <Route path="/" element={<FileUpload />} />
      <Route path="/upload" element={<ContactUpload />} />
      <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

// #export the fn

export default App;
