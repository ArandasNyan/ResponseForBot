$(document).ready(function() {
    (function atualizarStatus() {
        $.ajax({
            url: 'https://cherrybot.arandas.repl.co/status',
            dataType: 'json',
            success: function(data) {
                let status = data.status || '';
                const bodyElement = $('body');
                const statusElement = $('#status');

                if (status === '') {
                    bodyElement.removeClass('error success').addClass('pending');
                } else if (status === 'Operacional!') {
                    bodyElement.removeClass('error pending').addClass('success');
                    statusElement.text(status); // Atualiza o status diretamente com o valor do JSON
                    clearInterval(intervaloArray); // Limpa o intervalo de exibição do array
                } else {
                    bodyElement.removeClass('pending success').addClass('error');
                    statusElement.text(status); // Atualiza o status diretamente com o valor do JSON
                    clearInterval(intervaloArray); // Limpa o intervalo de exibição do array
                }
            },
            error: function(error) {
                const bodyElement = $('body');
                const statusElement = $('#status');

                statusElement.text('Não Operacional!');
                bodyElement.removeClass('pending success').addClass('error');
                console.error(error);
            }
        });
    })();

    const intervaloAtualizacao = 5 * 1000; // 5 segundos

    // Define o intervalo de atualização automática
    setInterval(atualizarStatus, intervaloAtualizacao);

    const array = ['Pendente', 'Pendente.', 'Pendente..', 'Pendente...'];
    let currentIndex = 0; // Índice atual do item a ser exibido

    function exibirProximoItem() {
        const statusElement = $('#status');
        statusElement.text(array[currentIndex]);
        currentIndex = (currentIndex + 1) % array.length;
    };

    const intervaloArray = setInterval(exibirProximoItem, 500); 
});