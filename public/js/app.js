async function loadHeader() {
    const response = await fetch('templates/header.html');
    const header = await response.text();
    document.getElementById('header').innerHTML = header;
}

document.addEventListener('DOMContentLoaded', () => {
    loadHeader();
});
