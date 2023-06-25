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
                } else {
                    bodyElement.removeClass('pending success').addClass('error');
                }

                const array = ['Pendente', 'Pendente.', 'Pendente..', 'Pendente...'];
                let currentIndex = 0; // Índice atual do item a ser exibido

                function exibirProximoItem() {
                    statusElement.text(array[currentIndex]);
                    currentIndex = (currentIndex + 1) % array.length;
                }

                const intervalo = 500; // 0,5 segundos
                setInterval(exibirProximoItem, intervalo);
            },
            error: function(error) {
                const bodyElement = $('body');
                const statusElement = $('#status');

                statusElement.text('Não Operacional!');
                bodyElement.removeClass('pending success').addClass('error');
                console.error(error);
            }
        });
    }());

    const intervaloAtualizacao = 5 * 1000; // 5 segundos

    // Define a função para atualizar o status em intervalos regulares
    (function atualizarAutomaticamente() {
        atualizarStatus();
        setTimeout(atualizarAutomaticamente, intervaloAtualizacao);
    }())
});