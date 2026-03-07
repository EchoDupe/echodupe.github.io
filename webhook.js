// webhook.js
async function sendPurchaseNotification(username, cart, total) {
    const cfg = window.config;
    if (!cfg.webhookUrl || cfg.webhookUrl === "YOUR_DISCORD_WEBHOOK_URL_HERE") return;

    const itemsList = Object.values(cart).map(item => 
        `• \`${item.quantity}x\` **${item.name}** — $${(item.price * item.quantity).toFixed(2)}`
    ).join('\n');

    const payload = {
        username: "EchoDupe Store Logger",
        embeds: [{
            title: "💎 NEW PAYMENT INTENT",
            color: 0x06b6d4,
            fields: [
                { name: "👤 Player", value: `**${username}**`, inline: true },
                { name: "💰 Amount", value: `\`$${total.toFixed(2)}\``, inline: true },
                { name: "📦 Items", value: itemsList || "No items" }
            ],
            timestamp: new Date().toISOString()
        }]
    };

    try {
        await fetch(cfg.webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
    } catch (err) {
        console.error("Webhook failed:", err);
    }
}
