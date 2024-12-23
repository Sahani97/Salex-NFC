// Startdatum der Beziehung (4. Februar 2022)
const startDate = new Date('2022-02-04');
const today = new Date();

// Differenz berechnen
let years = today.getFullYear() - startDate.getFullYear();
let months = today.getMonth() - startDate.getMonth();
let days = today.getDate() - startDate.getDate();

// Korrektur der Monate und Tage, falls negativ
if (days < 0) {
    months--;
    days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
}
if (months < 0) {
    years--;
    months += 12;
}

// Ergebnis anzeigen
document.getElementById('together-date').innerText = 
    `${years} years, ${months} months and ${days} days`;
