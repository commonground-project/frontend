self.addEventListener("push", (event) => {
    const data = event.data ? event.data.json() : {};
    const title = data.title || "New Notification";
    const options = {
        body: data.body || "You have a new message.",
        icon: data.icon || "/icon.png",
        badge: data.badge || "/badge.png",
        data: { url: data.url || "/" },
    };

    event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
    event.notification.close();
    event.waitUntil(clients.openWindow(event.notification.data.url));
});
