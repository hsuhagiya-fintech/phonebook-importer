import { useNavigate } from "react-router-dom";
import "./ FileUpload.css";

export default function FileUpload() {
  const navigate=useNavigate()
  const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (!file) {
    alert("Please select a file to upload.");
    return;
  } else {
    console.log("File selected:", file.name);
    navigate("/upload", { state: { file } });
  }
};

  return (
    <div clasName="container">
      <h2 className="phonebook-title">PhoneBook Manager</h2>
      <h2 className="phonebook-subtitle">
        Import and manage your contacts with Excel import and real-time
        validation
      </h2>

      <div className="upload-card">
        <h3 className="upload-title">
          <span role="img">📄</span> Phonebook Excel Import
        </h3>

        <p className="upload-desc">Import your contacts from an Excel file.</p>

        <label className="file-upload-label">
          <span children="upload-icon">⬆️</span>
          <input
            type="file"
            accept=".xlsx,.xls,.csv"
            className="upload-input"
            onChange={handleFileUpload}
          />
          <h3> Drop Your Excel File here or Click to browse</h3>
          {/* <button> Choose File </button> */}
        </label>
      </div>
    </div>
  );
}
