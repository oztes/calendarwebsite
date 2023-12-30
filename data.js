function handleSheetData(sheetData) {
    const headers = sheetData.values[0];
    const rows = sheetData.values.slice(1); 
    const jsonData = rows.map((row) => {
        let rowData = {};
        row.forEach((value, index) => {
            rowData[headers[index]] = value;
        });
        return rowData;
    });

    // Filter events for the current week
    const startOfWeek = moment().startOf('week');
    const endOfWeek = moment().endOf('week');
    const weeklyEvents = jsonData.filter(event => {
        const eventDate = moment(event.Date, 'M/D/YYYY');
        return eventDate.isBetween(startOfWeek, endOfWeek, null, '[]');
    });

    // Map events to calendar format
    const calendarEvents = weeklyEvents.map(event => ({
        title: event['Event Title'],
        start: moment(event.Date, 'M/D/YYYY').format('YYYY-MM-DD'),
        description: event['Event Description'],
        location: event.Location
    }));

    // Initialize calendar
    const calendarEl = document.getElementById('calendar');
    const calendar = new FullCalendar.Calendar(calendarEl, {
        plugins: ['dayGrid'],
        defaultView: 'dayGridWeek',
        events: calendarEvents
    });

    createCalendarStructure();
    jsonData.forEach(event => {
        const eventDate = new Date(event.Date);
        const dayName = eventDate.toLocaleString('en-US', { weekday: 'long' });
        const hour = eventDate.getHours();
        const minute = eventDate.getMinutes();

        const eventElement = document.createElement('div');
        eventElement.classList.add('event');
        eventElement.textContent = event['Event Title'];

        const slotId = `${dayName}-${hour}-${minute}`;
        const timeSlot = document.getElementById(slotId);
        if (timeSlot) {
            timeSlot.appendChild(eventElement);
        }
    });

    calendar.render();
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



function createCalendarStructure() {
    const calendarContainer = document.getElementById('calendar');
    calendarContainer.innerHTML = ''; // Clear previous content

    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    daysOfWeek.forEach(day => {
        const dayColumn = document.createElement('div');
        dayColumn.classList.add('day-column');
        dayColumn.innerHTML = `<h3>${day}</h3>`;

        for (let hour = 0; hour < 24; hour++) {
            for (let minute = 0; minute < 60; minute += 10) {
                const timeSlot = document.createElement('div');
                timeSlot.classList.add('time-slot');
                timeSlot.id = `${day}-${hour}-${minute}`;
                dayColumn.appendChild(timeSlot);
            }
        }

        calendarContainer.appendChild(dayColumn);
    });
}



loadGoogleSheetData();


