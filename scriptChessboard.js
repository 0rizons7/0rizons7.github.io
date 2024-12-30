import {Chess} from "./libs/chess.js";
let game = new Chess();

function onDragStart(source, piece, position, orientation) {
    if (game.game_over()) return false;
    if ((game.turn() === 'w' && piece.search(/^b/) !== -1) ||
        (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
        return false;
    }
    renderMoveOptions(source);
}

function onDrop(source, target) {
    let move = game.move({
        from: source,
        to: target,
        promotion: 'q'
    });
    $('.square-legal').removeClass('square-legal')
    if (move === null) return 'snapback';

    let history = game.history();
    console.log(`${source}${target}`, history[history.length -1]);
    
    
}

function updateChessboard() {
    board.position(game.fen());
    $('#fen').text(game.fen());
    $('#pgn').text(game.pgn());
    $('#pgn').scrollLeft($('#pgn')[0].scrollWidth);

    let history = game.history({ verbose: true });
    history = history.map(move => move.from + move.to);
    makeRequest(
        "https://explorer.lichess.ovh/masters",
        {
            topGames: 0,
            moves: 5,
            play: history.join(','),
        }
    ).done(function (data) {
        console.log(data);
        try {
            $('#openingName').html(data.opening.name.replace(":", ":<br>"))
        } catch {}
    })
        .fail(function (error) {
            console.error(error);
        });
}

function renderMoveOptions(source) {
    let moves = game.moves({square:source});
    moves.forEach(function (move) {
        $('.square-'+move).addClass('square-legal')
    });
}

// Initialisation de l'échiquier
let board = Chessboard('board', {
    draggable: true,
    onDragStart: onDragStart,
    onDrop: onDrop,
    onSnapEnd: updateChessboard,
});

$(document).ready(updateChessboard);
