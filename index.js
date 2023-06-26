$(document).ready(function () {
    let arrayIndex = 0;
    const array = ['Pendente', 'Pendente.', 'Pendente..', 'Pendente...'];
    let status = '';
    let temporizadorDeVelocidade = 500;

    const updateStatus = function () {
        const bodyElement = $('body');
        const statusElement = $('#status');

        if (status === '') {
            bodyElement.removeClass('error success').addClass('pending');
            statusElement.text(array[arrayIndex]);
            arrayIndex = (arrayIndex + 1) % array.length;
        } else if (status === 'Inoperante') {
            bodyElement.removeClass('success pending').addClass('error');
            statusElement.text('inoperante!');
        } else {
            bodyElement.removeClass('pending error').addClass('success');
            statusElement.text('Operacional!');
        }
    };

    const fetchData = function () {
        $.ajax({
            url: 'https://cherrybot.arandas.repl.co/status',
            dataType: 'json',
            timeout: temporizadorDeVelocidade,
            success: function (data) {
                status = data.status || '';
                updateStatus();
                setTimeout(fetchData, temporizadorDeVelocidade); // Chama novamente após o tempo definido
            },
            error: function (error) {
                status = '';
                updateStatus();
                console.error(error);
                setTimeout(fetchData, temporizadorDeVelocidade); // Chama novamente após o tempo definido
            }
        });
    };

    const connectToServerEvents = function () {
        const eventSource = new EventSource('https://cherrybot.arandas.repl.co/status-stream');

        eventSource.onmessage = function (event) {
            const data = JSON.parse(event.data);
            const newStatus = data.status || '';
            status = newStatus;
            updateStatus();
        };

        eventSource.onerror = function () {
            // Reconectar em caso de erro de conexão
            setTimeout(connectToServerEvents, 2000);
        };
    };

    fetchData(); // Inicia a busca imediatamente
    connectToServerEvents();
});
