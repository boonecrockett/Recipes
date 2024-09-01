// Simple test function to verify variable loading
export const testEnvVars = () => {
  console.log('Running environment variable check');
  console.log('SPREADSHEET_ID:', process.env.REACT_APP_GOOGLE_SHEETS_ID || 'SPREADSHEET_ID is undefined');
  console.log('CLIENT_EMAIL:', process.env.REACT_APP_GOOGLE_SHEETS_CLIENT_EMAIL || 'CLIENT_EMAIL is undefined');
  console.log('PRIVATE_KEY:', process.env.REACT_APP_GOOGLE_SHEETS_PRIVATE_KEY ? `Length: ${process.env.REACT_APP_GOOGLE_SHEETS_PRIVATE_KEY.length}` : 'PRIVATE_KEY is undefined');
};

testEnvVars();

import { GoogleSpreadsheet } from 'google-spreadsheet';

// Load environment variables
const SPREADSHEET_ID = process.env.REACT_APP_GOOGLE_SHEETS_ID;
const CLIENT_EMAIL = process.env.REACT_APP_GOOGLE_SHEETS_CLIENT_EMAIL;
const PRIVATE_KEY = process.env.REACT_APP_GOOGLE_SHEETS_PRIVATE_KEY;

export const submitRecipe = async (recipe) => {
  try {
    // Debugging: Log environment variables
    console.log('Environment Variables Check:');
    console.log('SPREADSHEET_ID:', SPREADSHEET_ID || 'SPREADSHEET_ID is undefined');
    console.log('CLIENT_EMAIL:', CLIENT_EMAIL || 'CLIENT_EMAIL is undefined');
    console.log('PRIVATE_KEY:', PRIVATE_KEY ? `Length: ${PRIVATE_KEY.length}` : 'PRIVATE_KEY is undefined');

    // Check if PRIVATE_KEY is defined
    if (!PRIVATE_KEY) {
      console.error('Error: PRIVATE_KEY is undefined. Please check your environment variable settings.');
      return; // Exit early if the private key is missing
    }

    // Initialize Google Spreadsheet
    const doc = new GoogleSpreadsheet(SPREADSHEET_ID);
    console.log('Google Spreadsheet initialized.');

    // Authenticate using the service account credentials
    await doc.useServiceAccountAuth({
      client_email: CLIENT_EMAIL,
      private_key: PRIVATE_KEY.replace(/\\n/g, '\n'), // Correct newline formatting
    });
    console.log('Authenticated with service account.');

    // Load the spreadsheet information
    await doc.loadInfo();
    console.log('Spreadsheet loaded:', doc.title);

    // Access the first sheet
    const sheet = doc.sheetsByIndex[0];
    console.log('Accessed first sheet:', sheet.title);
    console.log('Sheet Headers:', sheet.headerValues); // Log the headers to verify

    // Check for expected headers
    const expectedHeaders = [
      'Recipe Name',
      'Ingredients',
      'Preparation Steps',
      'Game Type',
      'Cooking Method',
      'Cooking/Preparation Time'
    ];

    const missingHeaders = expectedHeaders.filter(header => !sheet.headerValues.includes(header));
    if (missingHeaders.length > 0) {
      console.error(`Missing headers in sheet: ${missingHeaders.join(', ')}`);
      return; // Exit if required headers are missing
    }

    // Add a new row with the recipe data
    await sheet.addRow({
      'Recipe Name': recipe.name,
      'Ingredients': recipe.ingredients,
      'Preparation Steps': recipe.steps,
      'Game Type': recipe.gameType,
      'Cooking Method': recipe.cookingMethod,
      'Cooking/Preparation Time': recipe.cookingTime,
    });
    console.log('Row added successfully with data:', recipe);

  } catch (error) {
    // Detailed error logging
    console.error('Error during Google Sheets operation:', error.message);
    console.error('Full error details:', error);

    // If available, log API response details
    if (error.response) {
      console.error('API Response:', error.response.status, error.response.statusText);
      console.error('Response Data:', error.response.data);
    }
  }
};
