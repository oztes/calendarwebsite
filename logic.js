
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

    // Display the data in a table
    displayDataAsTable(jsonData);
}

function displayDataAsTable(data) {
    const container = document.getElementById('data-table');
    let table = '<table><tr>';
    
    // Add headers
    if(data.length > 0) {
        Object.keys(data[0]).forEach(header => {
            table += `<th>${header}</th>`;
        });
        table += '</tr>';
    
        // Add row data
        data.forEach(row => {
            table += '<tr>';
            Object.values(row).forEach(value => {
                table += `<td>${value}</td>`;
            });
            table += '</tr>';
        });
    }

    table += '</table>';
    container.innerHTML = table;
}

function loadGoogleSheetData() {
    const spreadsheetId = '1Fb7arltsEVfxRTm8o5wJ12Gb90n-oyWgA1po6jAB2ts';
    const apiKey = 'AIzaSyB1RrNZJCDKBkWl4htKf3C0VtuGSj4LZ2s'; 
    const range = 'Sheet1';

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error fetching data: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            handleSheetData(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

loadGoogleSheetData();
