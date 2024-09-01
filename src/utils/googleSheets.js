import { GoogleSpreadsheet } from 'google-spreadsheet';

// Load environment variables
const SPREADSHEET_ID = process.env.REACT_APP_GOOGLE_SHEETS_ID;
const CLIENT_EMAIL = process.env.REACT_APP_GOOGLE_SHEETS_CLIENT_EMAIL;
const PRIVATE_KEY = process.env.REACT_APP_GOOGLE_SHEETS_PRIVATE_KEY;

export const submitRecipe = async (recipe) => {
  try {
    console.log('Starting submitRecipe function');
    console.log('Spreadsheet ID:', SPREADSHEET_ID || 'Spreadsheet ID not found');
    console.log('Client Email:', CLIENT_EMAIL || 'Client Email not found');

    // Check if PRIVATE_KEY is defined and log its length
    if (!PRIVATE_KEY) {
      console.error('Error: PRIVATE_KEY is undefined. Please check your environment variable settings.');
      return; // Exit early if the private key is missing
    }
    console.log('Private Key Length:', PRIVATE_KEY.length);

    // Initialize the Google Spreadsheet
    const doc = new GoogleSpreadsheet(SPREADSHEET_ID);
    console.log('Google Spreadsheet initialized.');

    // Authenticate using the service account credentials
    await doc.useServiceAccountAuth({
      client_email: CLIENT_EMAIL,
      private_key: PRIVATE_KEY.replace(/\\n/g, '\n'), // Correct newline formatting
    });
    console.log('Authenticated with service account.');

    // Load the spreadsheet info
    await doc.loadInfo();
    console.log('Spreadsheet loaded:', doc.title);

    // Access the first sheet
    const sheet = doc.sheetsByIndex[0];
    console.log('Accessed first sheet:', sheet.title);

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
    console.error('Error during Google Sheets operation:', error.message);
    console.error('Full error details:', error);
  }
};
