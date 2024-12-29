let board = Chessboard('board1', {
    draggable: true,
    position : "start"
});

function makeRequest(url, params) {
    return $.ajax({
        url: url,
        method: 'GET',
        data: params,
        dataType: 'json',
        success: function(data) {
            return data;
        },
        error: function(xhr, status, error) {
            console.error(`Erreur HTTP: ${xhr.status} ${xhr.statusText}`);
            throw new Error(`Erreur HTTP: ${xhr.status} ${xhr.statusText}`);
        }
    });
}

$(document).ready(function() {
    makeRequest('https://explorer.lichess.ovh/masters', { topGames: 0, moves: 5 })
        .done(function(data) {
            console.log(data);
        })
        .fail(function(error) {
            console.error(error);
        });
});

