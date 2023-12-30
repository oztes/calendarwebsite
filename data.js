// Handles the Sheets Data
function handleSheetData(sheetData) {
    // ID headers & rows
    const headers = sheetData.values[0];
    const rows = sheetData.values.slice(1);

    // Turns into JSON
    const jsonData = rows.map((row) => {
        let rowData = {};
        row.forEach((value, index) => {
            rowData[headers[index]] = value; // Assign each value to its header
        });
        return rowData;
    });


    createCalendarStructure(); // calendar setup

    // Loop through each event and add it to the calendar
    jsonData.forEach(event => {
       
        const eventStart = new Date(event.Date + ' ' + event['Starting Time']);
        const eventEnd = new Date(event.Date + ' ' + event['Ending Time']);
        let currentTime = new Date(eventStart);

        // Place the event in the correct time slots on calendar
        while (currentTime <= eventEnd) {
            const dayName = currentTime.toLocaleString('en-US', { weekday: 'long' });
            const hour = currentTime.getHours();
            const minute = currentTime.getMinutes();

            // visual representation of event
            const eventElement = document.createElement('div');
            eventElement.classList.add('event');
            eventElement.textContent = event['Event Title'] + ' - ' + event['Event Description'];


            const adjustedMinute = Math.floor(minute / 10) * 10; //nearest 10 minute adjustment but shouldn't be necessary if you do drop-down on calendar. So we will need to use original time variable for the event description (hovering over it with a mouse or when clicked on, etc)

            // Find the right slot and add the event
            const slotId = `${dayName}-${hour}-${adjustedMinute}`;
            const timeSlot = document.getElementById(slotId);
            if (timeSlot) {
                timeSlot.appendChild(eventElement);
            }

            // Move to the next 10-minute interval
            currentTime.setMinutes(currentTime.getMinutes() + 10);
        }
    });
}



// Sets up the calendar structure
function createCalendarStructure() {
    const calendarContainer = document.getElementById('calendar');
    calendarContainer.innerHTML = ''; // Clearing any old content

  
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    // Create columns for each day with time slots
    daysOfWeek.forEach(day => {
        const dayColumn = document.createElement('div');
        dayColumn.classList.add('day-column');
        dayColumn.innerHTML = `<h3>${day}</h3>`;

        // Generate time slots for each day
        for (let hour = 0; hour < 24; hour++) {
            for (let minute = 0; minute < 60; minute += 10) {
                const timeSlot = document.createElement('div');
                timeSlot.classList.add('time-slot');
                timeSlot.id = `${day}-${hour}-${minute}`; // Unique ID for each slot
                dayColumn.appendChild(timeSlot);
            }
        }

        calendarContainer.appendChild(dayColumn); // Add the day column to the calendar
    });
}

// Loads data from Google Sheets
function loadGoogleSheetData() {

    // ID
    const spreadsheetId = '1Fb7arltsEVfxRTm8o5wJ12Gb90n-oyWgA1po6jAB2ts';
    const apiKey = 'AIzaSyB1RrNZJCDKBkWl4htKf3C0VtuGSj4LZ2s';
    const range = 'Sheet1';


    fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`)
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
