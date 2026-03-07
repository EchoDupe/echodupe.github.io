// webhook.js - Managed by Skitxoe
async function sendPurchaseNotification(username, cart, total) {
    // Access the config from the global window object
    const cfg = window.config;

    // Check if webhook is configured
    if (!cfg || !cfg.webhookUrl || cfg.webhookUrl === "YOUR_DISCORD_WEBHOOK_URL_HERE") {
        console.warn("Webhook URL not configured in config.js. Notification skipped.");
        return;
    }

    // Format the items list for a clean Discord view
    const itemsList = Object.values(cart).map(item => 
        `• \`${item.quantity}x\` **${item.name}** — $${(item.price * item.quantity).toFixed(2)}`
    ).join('\n');

    const payload = {
        username: "EchoDupe Store Logger",
        avatar_url: "https://i.imgur.com/W9vU71v.png",
        embeds: [{
            title: "💎 NEW PAYMENT INTENT",
            description: `A player has initiated a checkout via CashApp. Check your account to confirm funds.`,
            color: 0x06b6d4, // Echo Cyan
            fields: [
                { name: "👤 Player", value: `**${username}**`, inline: true },
                { name: "💰 Amount Due", value: `\`$${total.toFixed(2)}\``, inline: true },
                { name: "📋 Status", value: "🟡 **PENDING VERIFICATION**", inline: true },
                { name: "📦 Cart Content", value: itemsList || "No items recorded" }
            ],
            footer: { 
                text: `EchoDupeLS Store v${cfg.version || '1.0.0'} | Developed by ${cfg.developedBy || 'Skitxoe'}` 
            },
            timestamp: new Date().toISOString()
        }]
    };

    try {
        const response = await fetch(cfg.webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error(`Discord API error: ${response.status}`);
        console.log("Purchase notification sent to Discord.");
    } catch (err) {
        console.error("CRITICAL: Webhook failed to send:", err);
    }
}
