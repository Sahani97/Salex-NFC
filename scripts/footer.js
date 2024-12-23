// Define the hex code and its plain text translation
const hexCodeElement = document.getElementById('hex-code');
const hexCode = "49206c6f766520796f7520736f206d75636821"; // Hexadecimal code
const plainText = "I love you so much!"; // Translation

// Event listeners for mouse events
hexCodeElement.addEventListener('mousedown', () => {
    hexCodeElement.innerText = plainText; // Show plain text on click
});

hexCodeElement.addEventListener('mouseup', () => {
    hexCodeElement.innerText = hexCode; // Revert to hex code on release
});

// Optional: Support for touch devices
hexCodeElement.addEventListener('touchstart', () => {
    hexCodeElement.innerText = plainText;
});

hexCodeElement.addEventListener('touchend', () => {
    hexCodeElement.innerText = hexCode;
});
