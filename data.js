
function handleSheetData(sheetData) {
    const headers = sheetData.values[0];
    const rows = sheetData.values.slice(1); // Excludes the first row of headers
    const jsonData = rows.map((row) => {
        let rowData = {};
        row.forEach((value, index) => {
            rowData[headers[index]] = value;
        });
        return rowData;
    });

    // Here we have the data in JSON format
    console.log(jsonData);

    // TODO: Use jsonData as needed
}

// This function will load the Google Sheet data
function loadGoogleSheetData() {
    const spreadsheetId = '1Fb7arltsEVfxRTm8o5wJ12Gb90n-oyWgA1po6jAB2ts';
    const apiKey = 'AIzaSyB1RrNZJCDKBkWl4htKf3C0VtuGSj4LZ2s'; // Replace with your actual API key
    const range = 'Sheet1'; // Update the range to include all columns we need

    // Construct the URL for the Google Sheets API request
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`;

    // Fetch the data
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error fetching data: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            // Pass the sheet data to the handler function
            handleSheetData(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// Call the function to load the data
loadGoogleSheetData();
