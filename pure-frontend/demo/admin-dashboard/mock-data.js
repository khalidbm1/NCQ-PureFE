document.addEventListener('DOMContentLoaded', () => {
    const activity = [
        'Payment processed for order #1234',
        'New tenant created: Example Corp',
        'System status: All services operational'
    ];
    const ul = document.getElementById('activity');
    activity.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        ul.appendChild(li);
    });
});
