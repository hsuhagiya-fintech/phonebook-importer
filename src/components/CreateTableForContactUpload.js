import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { useLocation } from "react-router-dom";
import "./CreateTableForContactUpload.css";
import { validateRow, VISIBLE_HEADERS } from "../utils/dataValidation";

export default function CreateTableForContactUpload() {
  const location = useLocation();
  const file = location.state?.file;

  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [editingRow, setEditingRow] = useState(null);
  const [editData, setEditData] = useState({});
  const [searchTerm, setSearchTerm] = useState(""); // ✅ added

  useEffect(() => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const binaryStr = e.target.result;
      const workbook = XLSX.read(binaryStr, { type: "binary" });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
      const validatedData = jsonData.map(validateRow);
      setData(validatedData);
    };

    reader.readAsBinaryString(file);
  }, [file]);

  const handleEdit = (rowIndex) => {
    setEditingRow(rowIndex);
    setEditData({ ...data[rowIndex] });
  };

  const handleEditChange = (key, value) => {
    setEditData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = (rowIndex) => {
    const validatedRow = validateRow(editData);
    const newData = [...data];
    newData[rowIndex] = validatedRow;
    setData(newData);
    setEditingRow(null);
    setEditData({});
  };

  const handleCancel = () => {
    setEditingRow(null);
    setEditData({});
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
    setCurrentPage(1); // reset to first page on new search
  };

  const handleExportValidData = () => {
    const validData = data.filter((row) => !row.hasError);
    const worksheet = XLSX.utils.json_to_sheet(validData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Valid Contacts");
    XLSX.writeFile(workbook, "valid_contacts.xlsx");
  };

  if (!file) {
    return (
      <div className="error-message">
        No file uploaded. Please upload a file to view contacts.
      </div>
    );
  }

  const filteredData = data.filter((row) =>
    VISIBLE_HEADERS.some((key) =>
      String(row[key]).toLowerCase().includes(searchTerm)
    )
  );

  const totalEntries = filteredData.length;
  const totalPages = Math.ceil(totalEntries / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, totalEntries);
  const paginatedData = filteredData.slice(startIndex, endIndex);

  const handleRowsChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const getPageNumbers = () => {
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  return (
    <div className="table-container">
      {data.length > 0 ? (
        <>
          <div className="table-header">
            <div className="search-container">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search contacts..."
                value={searchTerm}
                onChange={handleSearch}
                className="search-input"
              />
            </div>
            <div className="header-actions">
              <button
                onClick={handleExportValidData}
                className="export-btn"
                disabled={data.filter((d) => !d.hasError).length === 0}
              >
                <svg
                  className="download-icon"
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                >
                  <path
                    fill="currentColor"
                    d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"
                  />
                </svg>
                Export Valid Data
              </button>
              <div className="counts">
                <div className="count-box total">
                  <span className="count-label">Total:</span>
                  <span className="count-value">{data.length}</span>
                </div>
                <div className="count-box valid">
                  <span className="count-label">Valid:</span>
                  <span className="count-value">
                    {data.filter((d) => !d.hasError).length}
                  </span>
                </div>
                <div className="count-box error">
                  <span className="count-label">Errors:</span>
                  <span className="count-value">
                    {data.filter((d) => d.hasError).length}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <table className="contact-upload-table">
            <thead>
              <tr>
                <th>ID</th>
                {VISIBLE_HEADERS.map((key) => (
                  <th key={key}>{key}</th>
                ))}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((row, index) => {
                const absoluteIndex = startIndex + index;
                const isEditing = editingRow === absoluteIndex;

                return (
                  <tr
                    key={absoluteIndex}
                    className={row.hasError ? "row-error" : ""}
                  >
                    <td>{absoluteIndex + 1}</td>
                    {VISIBLE_HEADERS.map((key) => (
                      <td
                        key={key}
                        className={row._errors?.[key] ? "cell-error" : ""}
                        title={row._errors?.[key] || ""}
                      >
                        {isEditing ? (
                          <input
                            type="text"
                            value={editData[key] || ""}
                            onChange={(e) =>
                              handleEditChange(key, e.target.value)
                            }
                            className={
                              editData._errors?.[key] ? "edit-input-error" : ""
                            }
                          />
                        ) : (
                          row[key]
                        )}
                      </td>
                    ))}
                    <td>
                      {isEditing ? (
                        <>
                          <button
                            onClick={() => handleSave(absoluteIndex)}
                            className="save-btn"
                          >
                            Save
                          </button>
                          <button onClick={handleCancel} className="cancel-btn">
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleEdit(absoluteIndex)}
                          className="edit-btn"
                        >
                          Edit
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="pagination-ui">
            <div className="entries-control">
              <label>
                Show&nbsp;
                <select value={rowsPerPage} onChange={handleRowsChange}>
                  {[10, 25, 50, 100].map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
                &nbsp;entries
              </label>
            </div>

            <div className="entries-info">
              Showing {startIndex + 1} to {endIndex} of {totalEntries} entries
            </div>

            <div className="pagination-buttons">
              <button onClick={() => goToPage(1)} disabled={currentPage === 1}>
                «
              </button>
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                ‹
              </button>
              {getPageNumbers().map((page) => (
                <button
                  key={page}
                  className={currentPage === page ? "active" : ""}
                  onClick={() => goToPage(page)}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                ›
              </button>
              <button
                onClick={() => goToPage(totalPages)}
                disabled={currentPage === totalPages}
              >
                »
              </button>
            </div>
          </div>
        </>
      ) : (
        <p className="upload-message">Parsing file...</p>
      )}
    </div>
  );
}
