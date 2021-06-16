'use strict';
/**
 * Board
 */
class Board {
    constructor(boardSelector, statusSelector, startingPieces) {
        this.boardContainer = boardSelector.first();
        this.statusContainer = statusSelector.first();
        this.writeBoard();
        this.writePieces(startingPieces);
    }
    markActive(square) {
        this.removeActive();
        var active = 'active';
        var jqSquare = this.boardContainer.find(square.getSelector());
        jqSquare.addClass(active);
    }
    removeActive() {
        this.boardContainer.find('.chess-square').removeClass('active');
    }
    writePieces(pieces) {
        $('.chess-piece').remove();
        pieces.forEach((p) => {
            $('#' + p.placedAt.getName()).html(`<span id=${p.getId()}
            class='chess-piece chess-piece-${p.getColorName().toLocaleLowerCase()}'>
            ${p.symbol}
            </span>`);
        });
    }
    ;
    writeBoard() {
        let newBoardElement = this.boardContainer.html("<table id='chessTable'><thead id='chessHead'></thead></thead><tbody id='chessBody'></tbody><tfoot id='chessFoot'></tfoot></table>");
        let chessBody = $('#chessBody');
        this.squares = new Array();
        for (var i = 8; i >= 1; i--) {
            let rowString = "chessRow" + i;
            chessBody.append(`<tr id='${rowString}'></tr>`);
            for (var j = 1; j <= 8; j++) {
                let square = new Square(i, j);
                this.squares.push(square);
                $('#' + rowString).append(`<td id='${square.getName()}' data-row='${square.row}' data-col='${square.column}' class='chess-square chess-${this.colorClass(square)}'></td>`);
            }
        }
        return newBoardElement;
    }
    ;
    writeStatus(playedMoves, toMove) {
        var moveList = this.statusContainer.find('#moves').html('');
        ;
        playedMoves.forEach((move) => {
            moveList.append(`<li>${move.getNotation()}</li>`);
        });
        var colorClass = `chess-${this.colorClass(toMove)}`;
        this.statusContainer.find('#nextMove').removeClass().addClass(colorClass);
        return this.statusContainer;
    }
    ;
    colorClass(T) { return T.getColorName().toLowerCase(); }
}
class Chess {
    constructor(selector, statusSelector) {
        this.players = [new Player(Color.White), new Player(Color.Black)];
        this.toMove = this.players[Color.White];
        this.playedMoves = new Array();
        this.board = new Board(selector, statusSelector, this.getPieces());
        this.bindEvents(selector);
        this.selector = selector;
    }
    startMove(piece) {
        this.board.markActive(piece.placedAt);
        piece.selected = true;
        this.activeMove = new Move(piece.placedAt, piece);
    }
    ;
    endMove(piece, newSquare, piceToCapture) {
        if (!newSquare && !piece && this.activeMove == null)
            return false;
        this.activeMove.completeMove(newSquare, piceToCapture);
        this.playedMoves.push(this.activeMove);
        this.activeMove = null;
        this.board.removeActive();
        piece.placedAt = newSquare;
        piece.moved = true;
        piece.selected = false;
        var colorToMoveNext = this.toMove.color === Color.White ? Color.Black : Color.White;
        this.toMove = this.players[colorToMoveNext];
        return true;
    }
    ;
    getPieces() {
        let pieces = new Array().concat(this.players[Color.Black].pieces, this.players[Color.White].pieces);
        return pieces;
    }
    updateBoard() {
        this.board.writePieces(this.getPieces().filter((p) => !p.captured));
        this.board.writeStatus(this.playedMoves, this.toMove);
    }
    ;
    pieceClick(event) {
        var pieceId = event.target.id;
        var pieces = this.getPieces();
        var anySelected = this.anySelected(pieces);
        var piece = pieces.find((p) => p.getId() === pieceId);
        if (anySelected && this.toMove.color !== piece.color) { //capture piece 
            this.capturePiece(piece, pieces.find((p) => p.selected));
        }
        else if (this.toMove.color === piece.color) {
            pieces.forEach((p) => p.selected = false);
            this.startMove(piece);
        }
        this.updateBoard();
        return false;
    }
    ;
    squareClick(event) {
        if (event.currentTarget !== event.target)
            return false;
        var squareId = event.target.id;
        var pieces = this.getPieces();
        var anySelected = this.anySelected(pieces);
        var square = this.board.squares.find((s) => s.getName() == event.target.id);
        if (anySelected && this.activeMove) { //Todo: This will not work for en passant as you are not clicking a piece. 
            var currentMove = this.activeMove;
            this.endMove(currentMove.piece, square, null);
        }
        this.updateBoard();
        return false;
    }
    bindEvents(selector) {
        selector.on('click', '.chess-piece', (eventObject) => {
            this.pieceClick(eventObject);
        });
        selector.on('click', '.chess-square', (eventObject) => {
            this.squareClick(eventObject);
        });
    }
    ;
    ;
    capturePiece(pieceToCapture, pieceToMove) {
        if (pieceToCapture.color === pieceToMove.color && this.playedMoves[this.playedMoves.length])
            return false;
        pieceToCapture.captured = true;
        this.endMove(pieceToMove, pieceToCapture.placedAt, pieceToCapture);
        return false;
    }
    ;
    anySelected(pieces) {
        return pieces.some((p) => p.selected);
    }
    getLastMove() {
        var length = this.playedMoves.length;
        if (length === 0)
            return null;
        return this.playedMoves[length - 1];
    }
    replaceLastMove(move) {
        this.playedMoves.pop();
        return this.playedMoves.push(move);
    }
}
class Move {
    constructor(start, piece) {
        this.isComplete = false;
        this.capture = null;
        this.piece = piece;
        this.start = start;
    }
    getNotation() {
        return this.piece.symbol + this.start.getName() + (this.capture ? 'x' + this.capture.symbol : '') + ' ' + this.end.getName();
    }
    completeMove(end, capture) {
        this.isComplete = true;
        this.capture = capture;
        this.end = end;
        return this;
    }
}
/**
 * Piece
 *
 */
class Piece {
    constructor(piceType, pieceColor, startAt, symbol) {
        this.type = piceType;
        this.color = pieceColor;
        this.placedAt = startAt;
        this.startAt = startAt;
        this.symbol = symbol;
        this.moved = false;
        this.captured = false;
        this.selected = false;
    }
    getId() {
        return this.startAt.getName() + this.symbol;
    }
    getColorName() {
        return Color[this.color];
    }
}
class King extends Piece {
    constructor(pieceColor, placedAt) {
        var symbol = pieceColor === Color.White ? '♔' : '♚';
        super(PieceType.King, pieceColor, placedAt, symbol);
    }
}
class Queen extends Piece {
    constructor(pieceColor, placedAt) {
        var symbol = pieceColor === Color.White ? '♕' : '♛';
        super(PieceType.Queen, pieceColor, placedAt, symbol);
    }
}
class Bishop extends Piece {
    constructor(pieceColor, placedAt) {
        var symbol = pieceColor === Color.White ? '♗' : '♝';
        super(PieceType.Bishop, pieceColor, placedAt, symbol);
    }
}
class Knight extends Piece {
    constructor(pieceColor, placedAt) {
        var symbol = pieceColor === Color.White ? '♘' : '♞';
        super(PieceType.Knight, pieceColor, placedAt, symbol);
    }
}
class Rook extends Piece {
    constructor(pieceColor, placedAt) {
        var symbol = pieceColor === Color.White ? '♖' : '♜';
        super(PieceType.Rook, pieceColor, placedAt, symbol);
    }
}
class Pawn extends Piece {
    constructor(pieceColor, placedAt) {
        var symbol = pieceColor === Color.White ? '♙' : '♟';
        super(PieceType.Pawn, pieceColor, placedAt, symbol);
    }
}
/**
 * Square
 */
class Square {
    constructor(row, column) {
        this.row = row;
        this.column = column;
    }
    getLetter() {
        return Columns[this.column];
    }
    ;
    getName() {
        return this.getLetter() + this.row;
    }
    getSelector() {
        return '#' + this.getName();
    }
    getColor() {
        return (this.row + this.column - 1) % 2;
    }
    getColorName() {
        return Color[this.getColor()];
    }
}
/**
 * Player
 */
class Player {
    constructor(color) {
        this.color = color;
        this.direction = color == Color.White ? MoveDirection.Up : MoveDirection.Down;
        let startingRow = this.isWhite() ? 1 : 8;
        this.pieces = new Array(new Rook(color, new Square(startingRow, Columns.A)), new Rook(color, new Square(startingRow, Columns.H)), new Knight(color, new Square(startingRow, Columns.G)), new Bishop(color, new Square(startingRow, Columns.C)), new Bishop(color, new Square(startingRow, Columns.F)), new Knight(color, new Square(startingRow, Columns.B)), new Queen(color, new Square(startingRow, Columns.D)), new King(color, new Square(startingRow, Columns.E))).concat(this.getStartingPawns());
    }
    isWhite() {
        return this.color === Color.White;
    }
    getColorName() {
        return Color[this.color];
    }
    getStartingPawns() {
        var pawns = new Array();
        for (var i = 1; i <= 8; i++) {
            pawns.push(new Pawn(this.color, new Square(this.isWhite() ? 2 : 7, i)));
        }
        return pawns;
    }
}
var PieceType;
(function (PieceType) {
    PieceType[PieceType["King"] = 1] = "King";
    PieceType[PieceType["Queen"] = 2] = "Queen";
    PieceType[PieceType["Rook"] = 3] = "Rook";
    PieceType[PieceType["Knight"] = 4] = "Knight";
    PieceType[PieceType["Bishop"] = 5] = "Bishop";
    PieceType[PieceType["Tower"] = 6] = "Tower";
    PieceType[PieceType["Pawn"] = 7] = "Pawn";
})(PieceType || (PieceType = {}));
var Color;
(function (Color) {
    Color[Color["White"] = 0] = "White";
    Color[Color["Black"] = 1] = "Black";
})(Color || (Color = {}));
var MoveDirection;
(function (MoveDirection) {
    MoveDirection[MoveDirection["Up"] = 1] = "Up";
    MoveDirection[MoveDirection["Down"] = -1] = "Down";
})(MoveDirection || (MoveDirection = {}));
var Columns;
(function (Columns) {
    Columns[Columns["A"] = 1] = "A";
    Columns[Columns["B"] = 2] = "B";
    Columns[Columns["C"] = 3] = "C";
    Columns[Columns["D"] = 4] = "D";
    Columns[Columns["E"] = 5] = "E";
    Columns[Columns["F"] = 6] = "F";
    Columns[Columns["G"] = 7] = "G";
    Columns[Columns["H"] = 8] = "H";
})(Columns || (Columns = {}));
$(function () {
    const chessGame = new Chess($("#board"), $("#status"));
});

//# sourceMappingURL=chess.js.map
