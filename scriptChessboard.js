import {Chess} from "./libs/chess.js";
let game = new Chess();
const castling = {
    "O-O" : {
        b : "g8",
        w : "g1"
    },
    "O-O-O" : {
        b : "c8",
        w : "c1"
    },
}

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
    $('.square-legal-take').removeClass('square-legal-take')
    if (move === null) return 'snapback';

    let history = game.history();
    console.log(history[history.length -1]);
}

function updateChessboard() {
    board.position(game.fen());
    $('#pgn').text(game.pgn()).scrollLeft($('#pgn')[0].scrollWidth);;

    let history = game.history({ verbose: true });
    history = history.map(move => move.from + move.to);
    
    makeRequest(
        "https://explorer.lichess.ovh/masters",
        {
        topGames: 0,
        moves: 5,
        play: history.join(','),
        },
    ).done(function (data) {
        data = JSON.parse(data);
        try {
            $('#openingName').html(data.opening.name.replace(":", ":<br>"))
        } catch (error) {
            console.error(error.message);
        }
    })

    makeRequest(
        "https://lichess.org/api/cloud-eval",
        {
        fen: game.fen(),
        },
    ).done(function (data) {
        data = JSON.parse(data);
        const variation = data.pvs[0]
        try {
            let cp = variation.cp
            let cp_rounded = Math.abs(Math.round(cp/10)/10)
            if ("mate" in variation) {
                cp = game.turn() == "w" ? 1000 : -1000
                cp_rounded = `#${variation.mate}`
            }
            $('#whiteEval').css("height", `${(cp + 1000)/20}%`)
            $('#eval').text(cp_rounded)
            
            if (cp < 0){
                $('#eval').css("top", "-20px").css("color", "white")
            } else {
                $('#eval').css("top", "0px").css("color", "black")
            }
        } catch (error) {
            console.error(error.message);
        }
    })
}

function renderMoveOptions(source) {
    let moves = game.moves({square:source});
    if (moves[moves.length - 1] in castling) {
        moves[moves.length - 1] = castling[moves[moves.length - 1]][game.turn()]
    }
    console.log(moves)
    moves.forEach(function (move) {
        if (move.endsWith("#") || move.endsWith("+")) {
            move = move.slice(0, -1)
        }
        if (move.includes("x")) {
            $('.square-'+move.slice(-2)).addClass('square-legal-take')
        } else {
            $('.square-'+move.slice(-2)).addClass('square-legal')
        }
        
    });
}


let board = Chessboard('board', {
    draggable: true,
    onDragStart: onDragStart,
    onDrop: onDrop,
    onSnapEnd: updateChessboard,
});

$(document).ready(updateChessboard);
