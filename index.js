fetch('https://cherrybot.arandas.repl.co/status')
    .then(response => response.json())
    .then(data => {
        const status = data.status || '';
        const bodyElement = document.body;
        const statusElement = document.getElementById('status');
        statusElement.textContent = status;

        if (status === '') {
            bodyElement.classList.remove('error', 'success');
            bodyElement.classList.add('pending');
        } else if (status === 'Operacional!') {
            bodyElement.classList.remove('error', 'pending');
            bodyElement.classList.add('success');
        } else {
            bodyElement.classList.remove('pending', 'success');
            bodyElement.classList.add('error');
        }
    })
    .catch(error => {
        const bodyElement = document.body;
        const statusElement = document.getElementById('status');
        statusElement.textContent = 'Não Operacional!';
        bodyElement.classList.remove('pending', 'success');
        bodyElement.classList.add('error');
        console.error(error);
    });
/*
// Faz uma requisição AJAX para obter o status do servidor
                var xhr = new XMLHttpRequest();
                xhr.open('GET', '/status', true);
                xhr.onreadystatechange = function () {
                    if (xhr.readyState === 4 && xhr.status === 200) {
                        var statusElement = document.getElementById('status');
                        var response = JSON.parse(xhr.responseText);
                        statusElement.textContent = `Status: ${response.status}`;
                    }
                };
                xhr.send();
*/
