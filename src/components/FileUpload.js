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
  try {
    const res = await analyzeUncommittedChanges1(op);
    op.appendLine("✅ Uncommitted Analysis response:\n" + JSON.stringify(res, null, 2));
  } catch (err) {
    if (err instanceof NetworkError) {
      op.appendLine("❌ Network error during Uncommitted Analysis. Please check your connection.");
    } else if (err instanceof APIError) {
      op.appendLine("❌ API error during Uncommitted Analysis: " + err.message);
    } else {
      op.appendLine("❌ Unexpected error during Uncommitted Analysis:\n" + err.message);
    }
  }
const validateFile = (file) => {
  if (!file) {
    alert("Please select a file to upload.");
    return false;
  }
  console.log("File selected:", file.name);
  return true;
};

const handleError = (err) => {
  if (err instanceof NetworkError) {
    return "❌ Network error during Uncommitted Analysis. Please check your connection.";
  } else if (err instanceof APIError) {
    return "❌ API error during Uncommitted Analysis: " + err.message;
  } else {
    return "❌ Unexpected error during Uncommitted Analysis:\n" + err.message;
  }
};

const handleFileUpload = async (event) => {
  const file = event.target.files[0];
  if (!validateFile(file)) return;

  try {
    const res = await analyzeUncommittedChanges1(op);
    op.appendLine("✅ Uncommitted Analysis response:\n" + JSON.stringify(res, null, 2));
  } catch (err) {
    op.appendLine(handleError(err));
  }

  navigate("/upload", { state: { file } });
};
  try {
    const res = await analyzeUncommittedChanges1(op);
    op.appendLine("✅ Uncommitted Analysis response:\n" + JSON.stringify(res, null, 2));
  } catch (err) {
    if (err instanceof NetworkError) {
      op.appendLine("❌ Network error during Uncommitted Analysis. Please check your connection.");
    } else if (err instanceof APIError) {
      op.appendLine("❌ API error during Uncommitted Analysis: " + err.message);
    } else {
      op.appendLine("❌ Unexpected error during Uncommitted Analysis:\n" + err.message);
    }
  }
const handleAnalysis = async (op) => {
    try {
        const res = await analyzeUncommittedChanges1(op);
        op.appendLine("✅ Uncommitted Analysis response:\n" + JSON.stringify(res, null, 2));
    } catch (err) {
        if (err instanceof NetworkError) {
            op.appendLine("❌ Network error during Uncommitted Analysis. Please check your connection.");
        } else if (err instanceof APIError) {
            op.appendLine("❌ API error during Uncommitted Analysis: " + err.message);
        } else {
            op.appendLine("❌ Unexpected error during Uncommitted Analysis:\n" + err.message);
        }
    }
};

// In the handleFileUpload function
await handleAnalysis(op);
try {
  const res = await analyzeUncommittedChanges1(op);
  op.appendLine("✅ Uncommitted Analysis response:\n" + JSON.stringify(res, null, 2));
} catch (err) {
  if (err instanceof NetworkError) {
    op.appendLine("❌ Network error during Uncommitted Analysis. Please check your connection.");
  } else if (err instanceof APIError) {
    op.appendLine("❌ API error during Uncommitted Analysis: " + err.message);
  } else {
    op.appendLine("❌ Unexpected error during Uncommitted Analysis:\n" + err.message);
  }
}
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
