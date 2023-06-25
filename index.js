$(document).ready(function() {
    let arrayIndex = 0;
    const array = ['Pendente', 'Pendente.', 'Pendente..', 'Pendente...'];
    let status = '';

    const updateStatus = function() {
        const bodyElement = $('body');
        const statusElement = $('#status');

        if (status === '') {
            bodyElement.removeClass('error success').addClass('pending');
            statusElement.text(array[arrayIndex]);
            arrayIndex = (arrayIndex + 1) % array.length;
        } else if (status === 'Operacional!') {
            bodyElement.removeClass('error pending').addClass('success');
            statusElement.text(status);
            clearInterval(intervaloArray);
        } else {
            bodyElement.removeClass('pending success').addClass('error');
            statusElement.text('Não Operacional!');
            clearInterval(intervaloArray);
        }
    };

    const fetchData = function() {
        $.ajax({
            url: 'https://cherrybot.arandas.repl.co/status',
            dataType: 'json',
            success: function(data) {
                status = data.status || '';
                updateStatus();
            },
            error: function(error) {
                status = '';
                updateStatus();
                console.error(error);
            }
        });
    };

    fetchData();

    const intervaloAtualizacao = 5 * 1000; // 5 segundos

    const intervaloArray = setInterval(fetchData, intervaloAtualizacao);
});