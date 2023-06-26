$(document).ready(function () {
    const array = ['Pendente', 'Pendente.', 'Pendente..', 'Pendente...'];
    let status = '';
    let arrayIndex = 0;
    let timeoutID = null;
    const velocidadeMaxima = 100;

    const updateStatus = function () {
        const bodyElement = $('body');
        const statusElement = $('#status');

        if (status === '') {
            bodyElement.attr('class', 'pending');
            statusElement.text(array[arrayIndex]);
            arrayIndex = (arrayIndex + 1) % array.length;
        } else if (status === 'Inoperante') {
            bodyElement.attr('class', 'error');
            statusElement.text('inoperante!');
        } else {
            bodyElement.attr('class', 'success');
            statusElement.text('Operacional!');
        }
    };

    const fetchData = function () {
        $.ajax({
            url: 'https://cherrybot.arandas.repl.co/status',
            dataType: 'json',
            timeout: velocidadeMaxima,
            success: function (data) {
                status = data.status || '';
                updateStatus();
                timeoutID = setTimeout(fetchData, velocidadeMaxima);
            },
            error: function (error) {
                status = '';
                updateStatus();
                console.error(error);
                timeoutID = setTimeout(fetchData, velocidadeMaxima);
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
            setTimeout(connectToServerEvents, 2000);
        };
    };

    fetchData();
    connectToServerEvents();
});
.