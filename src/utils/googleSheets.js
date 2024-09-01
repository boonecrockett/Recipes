import { GoogleSpreadsheet } from 'google-spreadsheet';

const SPREADSHEET_ID = process.env.REACT_APP_GOOGLE_SHEETS_ID;
const CLIENT_EMAIL = process.env.REACT_APP_GOOGLE_SHEETS_CLIENT_EMAIL;
const PRIVATE_KEY = process.env.REACT_APP_GOOGLE_SHEETS_PRIVATE_KEY;

export const submitRecipe = async (recipe) => {
  try {
    console.log('Starting submitRecipe function');
    console.log('Spreadsheet ID:', SPREADSHEET_ID);
    console.log('Client Email:', CLIENT_EMAIL);
    console.log('Private Key length:', PRIVATE_KEY.length);

    // Initialize Google Spreadsheet
    const doc = new GoogleSpreadsheet(SPREADSHEET_ID);
    console.log('Google Spreadsheet initialized.');

    // Authenticate using the service account
    await doc.useServiceAccountAuth({
      client_email: CLIENT_EMAIL,
      private_key: PRIVATE_KEY.replace(/\\n/g, '\n'), // Correct private key format
    });
    console.log('Authenticated with service account.');

    // Load the spreadsheet info
    await doc.loadInfo();
    console.log('Spreadsheet loaded:', doc.title);

    // Access the first sheet
    const sheet = doc.sheetsByIndex[0];
    console.log('Accessed first sheet:', sheet.title);
    console.log('Sheet Headers:', sheet.headerValues);

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

    // Add a new row
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
    // Log detailed error information
    console.error('Error during Google Sheets operation:', error.message);
    console.error('Full error details:', error);

    // If available, log API response details
    if (error.response) {
      console.error('API Response:', error.response.status, error.response.statusText);
      console.error('Response Data:', error.response.data);
    }
  }
};
