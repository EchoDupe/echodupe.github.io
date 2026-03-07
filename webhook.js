// webhook.js - Managed by Skitxoe
import config from './config.js';

export async function sendPurchaseNotification(username, cart, total) {
    // Check if webhook is configured in config.js
    if (!config.webhookUrl || config.webhookUrl === "YOUR_DISCORD_WEBHOOK_URL_HERE") {
        console.warn("Webhook URL not configured. Notification skipped.");
        return;
    }

    // Format the items list for a clean Discord view
    const itemsList = Object.values(cart).map(item => 
        `• \`${item.quantity}x\` **${item.name}** — $${(item.price * item.quantity).toFixed(2)}`
    ).join('\n');

    const payload = {
        username: "EchoDupe Store Logger",
        avatar_url: "https://i.imgur.com/W9vU71v.png", // Verify this link works or use a custom one
        embeds: [{
            title: "💎 NEW PAYMENT INTENT",
            description: `A player has initiated a checkout via CashApp. Check your account to confirm the funds before delivering items.`,
            color: 0x06b6d4, // Echo Cyan
            fields: [
                { 
                    name: "👤 Player", 
                    value: `**${username}**`, 
                    inline: true 
                },
                { 
                    name: "💰 Amount Due", 
                    value: `\`$${total.toFixed(2)}\``, 
                    inline: true 
                },
                { 
                    name: "📋 Status", 
                    value: "🟡 **PENDING VERIFICATION**", 
                    inline: true 
                },
                { 
                    name: "📦 Cart Content", 
                    value: itemsList || "No items recorded" 
                },
                { 
                    name: "💳 Quick Actions", 
                    value: `[Verify on CashApp](https://cash.app/$${config.cashAppTag.replace('$', '')}) • [Check Server Status](https://mcsrvstat.us/server/${config.serverIP})` 
                }
            ],
            footer: { 
                text: `EchoDupeLS Store v${config.version} | Developed by ${config.developedBy}` 
            },
            timestamp: new Date().toISOString()
        }]
    };

    try {
        const response = await fetch(config.webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`Discord API returned ${response.status}`);
        }
    } catch (err) {
        console.error("CRITICAL: Webhook failed to send:", err);
    }
}
