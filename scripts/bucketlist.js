const SHEET_ID = '1DjuodlHui3JjxJkOE9wCU8SGOn1F-6Ru1_keqbBdiq4'; // Deine Tabelle-ID
const SHEETS_API_KEY = 'AIzaSyA0TVxZI4ySQ-XANSUllwCbwSdxrVBOWe4';
const ACCESS_TOKEN = 'DEIN_ACCESS_TOKEN'; // Ersetze dies mit deinem Zugriffstoken
const RANGE = 'Sheet1!A:B'; // Bereich der Tabelle (Spalten Task und Done)

// Bucket-Liste aus Google Sheets laden und anzeigen
async function loadBucketList() {
    try {
        const response = await fetch(
            `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${SHEETS_API_KEY}`
        );

        if (!response.ok) {
            throw new Error(`HTTP-Fehler: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        if (!data.values) {
            throw new Error("Keine Daten gefunden. Bitte überprüfe den Tabellenbereich und die Freigabe.");
        }

        const rows = data.values;
        const bucketListSection = document.getElementById('bucketlist');
        bucketListSection.innerHTML = ''; // Liste leeren

        rows.slice(1).forEach((row, index) => {
            const [task, done] = row;

            const li = document.createElement('li');
            li.textContent = task;

            if (done?.toUpperCase() === 'TRUE') {
                li.classList.add('done');
            }

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = done?.toUpperCase() === 'TRUE';

            checkbox.addEventListener('change', () => {
                li.classList.toggle('done', checkbox.checked);
                updateTaskStatus(index + 2, checkbox.checked); // Zeilenindex anpassen (Header überspringen)
            });

            li.prepend(checkbox);
            bucketListSection.appendChild(li);
        });
    } catch (error) {
        console.error("Fehler beim Laden der Bucketliste:", error.message);
        document.getElementById('bucketlist').innerText =
            "Fehler beim Laden der Bucket-Liste. Bitte die Konsole prüfen.";
    }
}

// Funktion, um eine Zelle in Google Sheets zu aktualisieren
async function updateTaskStatus(row, status) {
    const requestBody = {
        values: [[status ? 'TRUE' : 'FALSE']]
    };

    try {
        const response = await fetch(
            `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/B${row}?valueInputOption=USER_ENTERED`,
            {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${ACCESS_TOKEN}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            }
        );

        if (!response.ok) {
            throw new Error(`Fehler beim Aktualisieren des Tasks: ${response.status}`);
        }
    } catch (error) {
        console.error("Fehler beim Aktualisieren der Task-Status:", error.message);
    }
}

// Funktion, um ein neues Item hinzuzufügen
async function addNewTask(taskName) {
    const requestBody = {
        values: [[taskName, 'FALSE']]
    };

    try {
        const response = await fetch(
            `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}:append?valueInputOption=USER_ENTERED`,
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${ACCESS_TOKEN}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            }
        );

        if (!response.ok) {
            throw new Error(`Fehler beim Hinzufügen eines neuen Tasks: ${response.status}`);
        }

        loadBucketList(); // Liste neu laden
    } catch (error) {
        console.error("Fehler beim Hinzufügen eines neuen Tasks:", error.message);
    }
}

// Plus-Button für neue Einträge
document.getElementById('add-task-button').addEventListener('click', () => {
    const taskName = prompt('Neuen Task eingeben:');
    if (taskName) {
        addNewTask(taskName);
    }
});

// Lade die Bucketliste beim Start der Seite
loadBucketList();
