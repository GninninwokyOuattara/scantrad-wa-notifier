console.log("listener listening...");
global.client.onMessage(async (message) => {
    if (message.body) {
        await client.sendText(message.from, message.body);
    }
});
