$(document).ready(function () {
    let arrayIndex = 0;
    const array = ['Pendente', 'Pendente.', 'Pendente..', 'Pendente...'];
    let status = '';

    const updateStatus = function () {
        const bodyElement = $('body');
        const statusElement = $('#status');

        if (status === '') {
            bodyElement.removeClass('error success').addClass('pending');
            statusElement.text(array[arrayIndex]);
            arrayIndex = (arrayIndex + 1) % array.length;
        } else if (status === 'Inoperante') {
            bodyElement.removeClass('success pending').addClass('error');
            statusElement.text('Não Operacional!');
            clearInterval(intervaloArray);
        } else {
            bodyElement.removeClass('pending error').addClass('success');
            statusElement.text('Operacional!');
            clearInterval(intervaloArray);
        }
    };

    const fetchData = function () {
        $.ajax({
            url: 'https://cherrybot.arandas.repl.co/status',
            dataType: 'json',
            success: function (data) {
                status = data.status || '';
                updateStatus();
            },
            error: function (error) {
                status = '';
                updateStatus();
                console.error(error);
            }
        });
    };

    const intervaloAtualizacao = 5 * 1000; // 5 segundos

    const intervaloArray = setInterval(fetchData, intervaloAtualizacao);

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

    connectToServerEvents();
});
