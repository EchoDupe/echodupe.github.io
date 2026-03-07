const config = {
    serverName: "EchoDupeLS",
    serverIP: "play.echodupels.minehut.gg",
    serverPort: 25565, // Default MC port
    
    discordLink: "https://discord.gg/yourlink",
    cashAppTag: "$YourTagHere", // Replace with your actual tag
    
    // For the purchase notifications
    webhookUrl: "YOUR_DISCORD_WEBHOOK_URL_HERE",

    colors: {
        primary: "#06b6d4",    // Echo Cyan
        secondary: "#0891b2",  // Deep Cyan
        background: "#000000",
        error: "#ef4444",      // Red for Offline status
    },

    status: {
        refreshInterval: 30000, // 30 seconds
        showPlayersOnline: true
    },

    developedBy: "Skitxoe",
    version: "1.2.0" // Incremented for Live Status update
};

export default config;
