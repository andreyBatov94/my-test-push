// Принудительное обновление Service Worker
self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim());
});

// 1. Обработка входящего PUSH
self.addEventListener('push', function(event) {
    const data = event.data ? event.data.json() : {};
    
    const options = {
        body: data.body || 'У нас есть что-то новое для вас!',
        icon: 'https://bazhane.com.ua/apple-touch-icon.png',
        badge: 'https://bazhane.com.ua/apple-touch-icon.png', // Маленькая иконка для статус-бара
        // Кнопки действий
        actions: [
            {
                action: 'open_url',
                title: 'Перейти'
            },
            {
                action: 'close',
                title: 'Закрыть'
            }
        ],
        // Метаданные (невидимые для юзера)
        data: {
            url: (data.data && data.data.url) ? data.data.url : 'https://bazhane.com.ua/'
        }
    };

    event.waitUntil(
        self.registration.showNotification(data.title || 'Bazhane', options)
    );
});

// 2. Обработка КЛИКА по уведомлению или кнопкам
self.addEventListener('notificationclick', function(event) {
    // Всегда закрываем уведомление после клика
    event.notification.close();

    // Если нажата кнопка "Закрыть", просто выходим из функции
    if (event.action === 'close') {
        return;
    }

    // В остальных случаях (клик на "Перейти" или на само тело пуша) — открываем ссылку
    const targetUrl = event.notification.data.url;

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(windowClients) {
            // Проверяем, не открыт ли уже этот URL
            for (var i = 0; i < windowClients.length; i++) {
                var client = windowClients[i];
                if (client.url === targetUrl && 'focus' in client) {
                    return client.focus();
                }
            }
            // Если вкладка не найдена — открываем новую
            if (clients.openWindow) {
                return clients.openWindow(targetUrl);
            }
        })
    );
});
