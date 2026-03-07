// --- CONFIGURATION ---
const API_URL = "https://api.counterapi.dev/v1/echodupe_ls_official";
const SERVER_IP = "play.echodupels.minehut.gg";

// --- GLOBAL CLICKER LOGIC ---
function getESTDateKey() {
    // Generates a unique key based on the EST date (MM-DD-YYYY)
    // When the day changes, the key changes, resetting the count to 0.
    const now = new Date();
    const est = new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York' }).format(now);
    return est.replace(/\//g, '-'); 
}

async function updateGlobalDisplay() {
    const key = getESTDateKey();
    const display = document.getElementById('global-click-count');
    try {
        const res = await fetch(`${API_URL}/${key}`);
        const data = await res.json();
        display.innerText = (data.count || 0).toLocaleString();
    } catch (err) {
        display.innerText = "0";
    }
}

async function pressGlobalButton() {
    const key = getESTDateKey();
    const display = document.getElementById('global-click-count');
    try {
        const res = await fetch(`${API_URL}/${key}/up`);
        const data = await res.json();
        display.innerText = (data.count || 0).toLocaleString();
    } catch (err) {
        console.error("Global click failed.");
    }
}

function updateCountdown() {
    const now = new Date();
    // Get current time in New York
    const estTime = new Date(now.toLocaleString("en-US", {timeZone: "America/New_York"}));
    
    // Set "tomorrow" at midnight EST
    const tomorrow = new Date(estTime);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const diff = tomorrow - estTime;
    const h = Math.floor(diff / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);

    const countdownElement = document.getElementById('reset-countdown');
    if (countdownElement) {
        countdownElement.innerText = 
            `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
}

// --- SERVER STATUS LOGIC ---
async function fetchServerStatus() {
    const indicator = document.getElementById('status-indicator');
    const statusText = document.getElementById('status-text');
    const countDisplay = document.getElementById('player-count');
    
    try {
        const res = await fetch(`https://api.mcsrvstat.us/2/${SERVER_IP}`);
        const data = await res.json();
        
        if (data.online) {
            indicator.className = "w-2.5 h-2.5 bg-cyan-500 rounded-full pulse";
            statusText.innerText = "Live";
            statusText.className = "text-cyan-500";
            countDisplay.innerText = data.players.online;
        } else {
            indicator.className = "w-2.5 h-2.5 bg-red-500 rounded-full";
            statusText.innerText = "Offline";
            statusText.className = "text-red-500";
            countDisplay.innerText = "0";
        }
    } catch (err) {
        console.error("Status fetch failed.");
    }
}

// --- UTILITIES ---
let cart = JSON.parse(localStorage.getItem('echo_cart')) || {};

window.toggleCart = () => {
    document.getElementById('cart-sidebar').classList.toggle('cart-active');
};

window.copyIP = (btn) => {
    navigator.clipboard.writeText(SERVER_IP);
    const originalText = btn.innerText;
    btn.innerText = "COPIED!";
    setTimeout(() => btn.innerText = originalText, 2000);
};

// --- INITIALIZATION ---
function init() {
    updateGlobalDisplay();
    fetchServerStatus();
    
    // Updates
    setInterval(updateCountdown, 1000);
    setInterval(updateGlobalDisplay, 10000); // Sync global clicks every 10s
    setInterval(fetchServerStatus, 30000);   // Sync server status every 30s
}

// Start when the page loads
document.addEventListener('DOMContentLoaded', init);
