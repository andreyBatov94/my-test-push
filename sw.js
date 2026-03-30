self.addEventListener('push', function(event) {
    const data = event.data ? event.data.json() : {};
    
    const options = {
        body: data.body || 'Новое уведомление',
        icon: 'https://bazhane.com.ua/apple-touch-icon.png',
        actions: [
        {
            action: 'open_url', // Идентификатор действия
            title: 'Перейти' // Текст на кнопке
        },
        {
            action: 'close',
            title: 'Закрыть'
        }
    ],
        data: {
            url: data.data ? data.data.url : 'https://bazhane.com.ua/'
        }
    };

    event.waitUntil(
        self.registration.showNotification(data.title || 'Bazhane', options)
    );
});

// ЭТОТ БЛОК ОТВЕЧАЕТ ЗА ОТКРЫТИЕ ССЫЛКИ
self.addEventListener('notificationclick', function(event) {
    // Закрываем уведомление на экране
    event.notification.close();

    // Достаем URL, который мы сохранили выше
    const targetUrl = event.notification.data.url;

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(windowClients) {
            // Если вкладка уже открыта, просто переключаемся на нее
            for (var i = 0; i < windowClients.length; i++) {
                var client = windowClients[i];
                if (client.url === targetUrl && 'focus' in client) {
                    return client.focus();
                }
            }
            // Если вкладок нет — открываем новую
            if (clients.openWindow) {
                return clients.openWindow(targetUrl);
            }
        })
    );
});
