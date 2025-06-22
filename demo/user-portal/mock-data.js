document.addEventListener('DOMContentLoaded', () => {
    const files = [
        'contract.pdf',
        'invoice-01.pdf',
        'report.docx'
    ];
    const ul = document.getElementById('files');
    files.forEach(name => {
        const li = document.createElement('li');
        li.textContent = name;
        ul.appendChild(li);
    });
});
