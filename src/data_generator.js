// src/data_generator.js
const XLSX = require('xlsx');
const { faker } = require('@faker-js/faker');

// Function to generate exactly 10 digit phone number
function generatePhoneNumber() {
  return faker.string.numeric({ length: 10 });
}

// Function to generate test data with controlled errors
function generateTestData(numRecords = 20000, errorRate = 0.2) {
  const rows = [];
  
  for (let i = 1; i <= numRecords; i++) {
    const isErrorRow = Math.random() < errorRate;
    let name = faker.person.fullName();
    let email = faker.internet.email();
    let phoneNo = generatePhoneNumber();
    let notes = faker.lorem.sentence();

    // Introduce specific error types
    if (isErrorRow) {
      const errorType = Math.floor(Math.random() * 4); // 4 error types
      
      switch(errorType) {
        case 0: // Missing name
          name = '';
          break;
        case 1: // Invalid phone (not 10 digits)
          phoneNo = faker.string.numeric({ length: Math.random() > 0.5 ? 5 : 15 });
          break;
        case 2: // Missing both email and phone
          email = '';
          phoneNo = '';
          break;
        case 3: // Invalid email format
          email = 'invalid-email';
          break;
      }
    }

    rows.push({
      Name: name,
      Email: email,
      PhoneNo: phoneNo,
      Notes: notes,
      Address: faker.location.streetAddress(),
      Company: faker.company.name(),
    });
  }

  return rows;
}

// Main function to generate and save the Excel file
function generatePhonebook() {
  try {
    const testData = generateTestData();
    const worksheet = XLSX.utils.json_to_sheet(testData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Contacts');
    
    XLSX.writeFile(workbook, 'phonebook.xlsx');
    console.log('Successfully generated phonebook.xlsx with test data');
    console.log('File contains 20,000 records with ~20% error rate');
  } catch (error) {
    console.error('Error generating phonebook:', error);
  }
}

// Run the generator
generatePhonebook();