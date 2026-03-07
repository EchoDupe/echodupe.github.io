// webhook.js - Managed by Skitxoe
import config from './config.js';

const DISCORD_WEBHOOK_URL = "YOUR_WEBHOOK_URL_HERE"; // PASTE YOUR URL HERE

export async function sendPurchaseNotification(username, cart, total) {
    if (DISCORD_WEBHOOK_URL === "YOUR_WEBHOOK_URL_HERE") return;

    // Format the items list for the embed
    const itemsList = Object.values(cart).map(item => 
        `• **${item.quantity}x** ${item.name} ($${(item.price * item.quantity).toFixed(2)})`
    ).join('\n');

    const embed = {
        username: "Store Bot",
        avatar_url: "https://i.imgur.com/W9vU71v.png", // Custom bot icon
        embeds: [{
            title: "🛒 New Payment Intent",
            color: 0x06b6d4, // Cyan
            fields: [
                { name: "👤 Player Username", value: `\`${username}\``, inline: true },
                { name: "💰 Total Amount", value: `**$${total.toFixed(2)}**`, inline: true },
                { name: "📦 Items Ordered", value: itemsList || "No items recorded" },
                { name: "🔗 CashApp Link", value: `[Click to Check Payment](https://cash.app/$${config.cashAppTag.replace('$', '')}/${total.toFixed(2)})` }
            ],
            footer: { text: "EchoDupeLS | Payment Logger" },
            timestamp: new Date()
        }]
    };

    try {
        await fetch(DISCORD_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(embed)
        });
    } catch (err) {
        console.error("Webhook failed to send:", err);
    }
}
