self.addEventListener('install', (event) => {
    // Пропускаем ожидание и активируем новый воркер сразу
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    // Заставляем новый воркер сразу взять управление страницами
    event.waitUntil(clients.claim());
});

self.addEventListener('push', function(event) {
    const data = event.data ? event.data.json() : { title: 'Тест', body: 'Пустое сообщение' };
    
    event.waitUntil(
        self.registration.showNotification(data.title, {
            body: data.body,
            icon: 'https://via.placeholder.com/128' 
        })
    );
});
