import React, { useEffect, useState, useMemo } from "react";
import * as XLSX from "xlsx";
import { useLocation } from "react-router-dom";
import "./CreateTableForContactUpload.css";
import { validateRow, VISIBLE_HEADERS } from "../utils/dataValidation";
import { useSelector, useDispatch } from "react-redux";
import { setExcelData, updateRow } from "../slices/excelSlice";

export default function CreateTableForContactUpload() {
  // Get the uploaded file from navigation state
  const location = useLocation();
  const file = location.state?.file;

  // Redux state for Excel data
  const dispatch = useDispatch();
  const data = useSelector((state) => state.excel.data);

  // Local state for UI only
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [editingRow, setEditingRow] = useState(null);
  const [editData, setEditData] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [dataFilter, setDataFilter] = useState("all");

  // Parse and validate Excel file, then store in Redux
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
      dispatch(setExcelData(validatedData));
    };
    reader.readAsBinaryString(file);
  }, [file, dispatch]);

  // Memoized: Filter and search data for display (no sorting)
  // const processedData = useMemo(() => {
  //   let result = [...data];
  //   if (dataFilter === "valid") {
  //     result = result.filter((row) => !row.hasError);
  //   } else if (dataFilter === "invalid") {
  //     result = result.filter((row) => row.hasError);
  //   }
  //   if (searchTerm) {
  //     result = result.filter((row) =>
  //       VISIBLE_HEADERS.some((key) =>
  //         String(row[key]).toLowerCase().includes(searchTerm)
  //       )
  //     );
  //   }
  //   return result;
  // }, [data, dataFilter, searchTerm]);

  // Change filter (all/valid/invalid)
  const handleFilterChange = (filterType) => {
    setDataFilter(filterType);
    setCurrentPage(1);
  };

  // Start editing a row
  const handleEdit = (rowIndex) => {
    setEditingRow(rowIndex);
    setEditData({ ...processedData[rowIndex] });
  };

  // Handle input change in edit mode
  const handleEditChange = (key, value) => {
    setEditData((prev) => ({ ...prev, [key]: value }));
  };

  // Save edited row using Redux
  const handleSave = (rowIndex) => {
    const validatedRow = validateRow(editData);
    const absoluteIndex = (currentPage - 1) * rowsPerPage + rowIndex;
    dispatch(updateRow({ index: absoluteIndex, row: validatedRow }));
    setEditingRow(null);
    setEditData({});
  };

  // Cancel editing
  const handleCancel = () => {
    setEditingRow(null);
    setEditData({});
  };

  // Handle search input change
  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
    setCurrentPage(1);
  };

  // Export valid data to Excel
  const handleExportValidData = () => {
    const validData = processedData.filter((row) => !row.hasError);
    const worksheet = XLSX.utils.json_to_sheet(validData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Valid Contacts");
    XLSX.writeFile(workbook, "valid_contacts.xlsx");
  };

  // Export invalid data to Excel
  const handleExportInValidData = () => {
    const invalidData = processedData.filter((row) => row.hasError);
    const worksheet = XLSX.utils.json_to_sheet(invalidData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "InValid Contacts");
    XLSX.writeFile(workbook, "invalid_contacts.xlsx");
  };

  if (!file) {
    return (
      <div className="error-message">
        No file uploaded. Please upload a file to view contacts.
      </div>
    );
  }

  // Pagination calculations
  const totalEntries = processedData.length;
  const totalPages = Math.ceil(totalEntries / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, totalEntries);
  const paginatedData = processedData.slice(startIndex, endIndex);

  // Change rows per page
  const handleRowsChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  // Go to a specific page
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // Get visible page numbers for pagination
  const getPageNumbers = () => {
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  // Render the component
  return (
    <div className="table-container">
      {data.length > 0 ? (
        <>
          {/* Header: Search, Export, and Counts */}
          <div className="table-header">
            <div className="search-container">
              {/* Search input for filtering contacts */}
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search contacts..."
                value={searchTerm}
                onChange={handleSearch}
                className="search-input"
              />
            </div>
            <div className="header-actions-right">
              {/* Export valid data button */}
              <button
                onClick={handleExportValidData}
                className="export-btn"
                disabled={processedData.filter((d) => !d.hasError).length === 0}
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
              {/* Export invalid data button */}
              <button
                onClick={handleExportInValidData}
                className="export-btn"
                disabled={processedData.filter((d) => !d.hasError).length === 0}
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
                Export InValid Data
              </button>
              {/* Counts for total, valid, and error rows */}
              <div className="counts-horizontal">
                <div className="count-box total">
                  <span className="count-label">Total:</span>
                  <span className="count-value">
                    {processedData.length.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="count-box valid">
                  <span className="count-label">Valid:</span>
                  <span className="count-value">
                    {processedData
                      .filter((d) => !d.hasError)
                      .length.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="count-box error">
                  <span className="count-label">Errors:</span>
                  <span className="count-value">
                    {processedData
                      .filter((d) => d.hasError)
                      .length.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Data Table */}
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
                          {/* Save and Cancel buttons for editing */}
                          <button
                            onClick={() => handleSave(index)}
                            className="save-btn"
                          >
                            Save
                          </button>
                          <button onClick={handleCancel} className="cancel-btn">
                            Cancel
                          </button>
                        </>
                      ) : (
                        // Edit button
                        <button
                          onClick={() => handleEdit(index)}
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

          {/* Pagination Controls */}
          <div className="pagination-ui">
            <div className="entries-control">
              <label>
                Show&nbsp;
                <select value={rowsPerPage} onChange={handleRowsChange}>
                  {[10, 25, 50, 100,].map((num) => (
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
        <div className="upload-loader">
          <div className="spinner"></div>
          <p className="upload-message">Parsing file, please wait...</p>
        </div>
      )}
    </div>
  );
}
