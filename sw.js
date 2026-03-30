self.addEventListener('install', (event) => {
    self.skipWaiting(); // Принудительно активируем новый SW
});

self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim()); // Берем управление страницами сразу
});

self.addEventListener('push', function(event) {
    // Получаем данные из payload, который прислал send.js
    const data = event.data ? event.data.json() : { title: 'Bazhane', body: 'Default message' };
    
    const options = {
        body: data.body,
        icon: 'https://bazhane.com.ua/apple-touch-icon.png',
        badge: 'https://bazhane.com.ua/apple-touch-icon.png',
        data: {
            url: data.data ? data.data.url : 'https://bazhane.com.ua/'
        }
    };

    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

// Обработка клика (чтобы ссылка открывалась)
self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    event.waitUntil(
        clients.openWindow(event.notification.data.url)
    );
});
