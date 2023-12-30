// Function to handle and process data from Google Sheets
function handleSheetData(sheetData) {
    // Extract headers from the first row of the sheet data
    const headers = sheetData.values[0];
    // Extract data rows (excluding the header row)
    const rows = sheetData.values.slice(1);

    // Convert rows to JSON format for easier handling
    const jsonData = rows.map((row) => {
        let rowData = {};
        row.forEach((value, index) => {
            rowData[headers[index]] = value; // Map each cell to its corresponding header
        });
        return rowData;
    });

    // Generate the structure of the calendar
    createCalendarStructure();

    // Process each event and place it in the calendar
    jsonData.forEach(event => {
        const eventStart = new Date(event.Date + ' ' + event['Starting Time']);
        const eventEnd = new Date(event.Date + ' ' + event['Ending Time']);
        let currentTime = new Date(eventStart);

        while (currentTime <= eventEnd) {
            const dayName = currentTime.toLocaleString('en-US', { weekday: 'long' });
            const hour = currentTime.getHours();
            const minute = currentTime.getMinutes();

            // Create an element for the event
            const eventElement = document.createElement('div');
            eventElement.classList.add('event');
            eventElement.textContent = event['Event Title'] + ' - ' + event['Event Description'];

            // Adjust minute to the nearest 10-minute interval
            const adjustedMinute = Math.floor(minute / 10) * 10;

            // Find the corresponding time slot in the calendar
            const slotId = `${dayName}-${hour}-${adjustedMinute}`;
            const timeSlot = document.getElementById(slotId);
            if (timeSlot) {
                timeSlot.appendChild(eventElement);
            }

            // Increment current time by 10 minutes for the next iteration
            currentTime.setMinutes(currentTime.getMinutes() + 10);
        }
    });
}

// Function to load data from Google Sheets
function loadGoogleSheetData() {
    const spreadsheetId = 'your_spreadsheet_id_here';
    const apiKey = 'your_api_key_here';
    const range = 'Sheet1';

    // Construct the URL for the Google Sheets API
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`;

    // Fetch data from the API
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error fetching data: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            handleSheetData(data); // Process the received data
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// Function to create the structure of the calendar
function createCalendarStructure() {
    const calendarContainer = document.getElementById('calendar');
    calendarContainer.innerHTML = ''; // Clear any previous content

    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    // Create columns for each day of the week
    daysOfWeek.forEach(day => {
        const dayColumn = document.createElement('div');
        dayColumn.classList.add('day-column');
        dayColumn.innerHTML = `<h3>${day}</h3>`;

        // Create time slots for each day
        for (let hour = 0; hour < 24; hour++) {
            for (let minute = 0; minute < 60; minute += 10) {
                const timeSlot = document.createElement('div');
                timeSlot.classList.add('time-slot');
                timeSlot.id = `${day}-${hour}-${minute}`; // ID based on day, hour, and minute
                dayColumn.appendChild(timeSlot);
            }
        }

        calendarContainer.appendChild(dayColumn); // Append the day column to the calendar
    });
}

// Call the function to start loading data
loadGoogleSheetData();
