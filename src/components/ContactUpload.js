import "./ContactUpload.css";
import CreateTableForContactUpload from "./CreateTableForContactUpload";
import { useNavigate,useLocation } from "react-router-dom";
export default function ContactUpload() {
  const navigate = useNavigate();
  const location = useLocation();
  const file = location.state?.file;


  return (
    <>
      <div className="header-container">
        <button className="header-button" onClick={() => navigate("/")}>
          ← Back to Upload
        </button>

        <div className="header-title-group">
          <h1 className="header-title">Phonebook Data</h1>
          <p className="header-subtitle">Manage your imported contacts</p>
        </div>

        <button className="header-button" onClick={() => navigate("/")}>
          New Upload
        </button>
      </div>

      <div>
        <CreateTableForContactUpload/>
      </div>
    </>
  );
}
