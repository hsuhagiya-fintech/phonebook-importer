
export const VISIBLE_HEADERS=["Name", "Email", "GST Number","Country","PhoneNo","Notes", "Address"];

export const validateRow = (row) => {
  const errors = {};

  // Name should be present
  if (!row.Name || row.Name.trim() === "") {
    errors.Name = "Name is required";
  }

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.Email);
  const phoneValid = /^\d{10}$/.test(row.PhoneNo); // Exactly 10 digits
  
  

  // At least one of Email or PhoneNo must be valid
  if (!emailValid && !phoneValid) {
    if (!row.Email) errors.Email = "Email is required";
    else if (!emailValid) errors.Email = "Invalid email format";

    if (!row.PhoneNo) errors.PhoneNo = "Phone is required";
    else if (!phoneValid) errors.PhoneNo = "Phone must be 10 digits";
  }

  return {
    ...row,
    _errors: errors,
    hasError: Object.keys(errors).length > 0
  };
};