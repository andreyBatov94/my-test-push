self.addEventListener('push', function(event) {
    const data = event.data ? event.data.json() : { title: 'Тест', body: 'Пустое сообщение' };
    
    event.waitUntil(
        self.registration.showNotification(data.title, {
            body: data.body,
            icon: 'https://via.placeholder.com/128' 
        })
    );
});