chrome.runtime.onInstalled.addListener(() => {
    chrome.alarms.create('updateExtensions', { periodInMinutes: 5 });
});

chrome.alarms.onAlarm.addListener(() => {
    chrome.runtime.sendMessage({ action: 'updateExtensions' });
});

// Listen for messages
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'updateExtensions') {
        console.log('Received updateExtensions message');
        // Add additional logic here if needed
    }
});
