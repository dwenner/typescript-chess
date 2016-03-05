'use strict'
/**
* Board
*/
class Board {
    squares: Square[];
    boardContainer: JQuery;
    constructor(selector: JQuery, startingPieces: Piece[]) {
        this.writeBoard(selector);
        this.writePieces(startingPieces);
    };

    markActive(square: Square) {
        var active = 'active';
        this.boardContainer.find('.chess-square').removeClass(active)
        var jqSquare = this.boardContainer.find(square.getSelector());
        jqSquare.addClass(active);
    }

    removeActive() {
        this.boardContainer.find('.chess-square').removeClass('active');
    }

    writePieces(pieces: Piece[]): void {
        $('.chess-piece').remove();
        pieces.forEach((p) => {
            $('#' + p.placedAt.getName()).html(`<span id=${p.getId()}
            class='chess-piece chess-piece-${p.getColorName().toLocaleLowerCase()}'>
            ${p.symbol}
            </span>`);
        });
    };

    writeBoard(selector: JQuery): JQuery {
        this.boardContainer = $(selector).first();
        let newBoardElement = this.boardContainer.html("<table id='chessTable'><thead id='chessHead'></thead></thead><tbody id='chessBody'></tbody><tfoot id='chessFoot'></tfoot></table>");
        let chessBody = $('#chessBody');
        this.squares = new Array<Square>();
        for (var i = 8; i >= 1; i--) {
            let rowString = "chessRow" + i;
            chessBody.append(`<tr id='${rowString}'></tr>`);
            for (var j = 1; j <= 8; j++) {
                let square = new Square(i, j);
                this.squares.push(square);
                $('#' + rowString).append(`<td id='${square.getName()}' data-row='${square.row}' data-col='${square.column}' class='chess-square chess-${square.getColorName().toLocaleLowerCase()}'></td>`);
            }
        }
        return newBoardElement;
    };
}

class Chess {
    board: Board;
    playedMoves: Move[];
    activeMove; Move;
    toMove: Player;
    players: Player[];
    selector: JQuery;

    startMove(piece: Piece) {
        this.board.markActive(piece.placedAt);
        piece.selected = true;
        this.activeMove = {
            start: piece.placedAt,
            piece: piece,
            end: null,
            isComplete: false
        };
    };
    endMove(piece: Piece, newSquare: Square) : boolean {
        if (!newSquare && !piece) return false;
        this.activeMove = null;
        this.board.removeActive();
        this.playedMoves.push({
            start: piece.placedAt,
            piece: piece,
            end: newSquare,
            isComplete: true
        });
        piece.placedAt  = newSquare;
        piece.moved = true;
        piece.selected = false;
        var colorToMoveNext = this.toMove.color === Color.White ? Color.Black : Color.White; 
        this.toMove = this.players[colorToMoveNext];
        return true;
    };
    getPieces(): Piece[] {
        let pieces = new Array<Piece>().concat(
            this.players[Color.Black].pieces,
            this.players[Color.White].pieces
        );
        return pieces;
    }

    updateBoard(): void {
        this.board.writePieces(this.getPieces().filter((p) => !p.captured));
    };

    pieceClick(event: JQueryEventObject): boolean {
        var pieceId = event.target.id;
        var pieces = this.getPieces();
        var anySelected = this.anySelected(pieces);

        var piece = pieces.find((p) => p.getId() === pieceId);
        if (anySelected && this.toMove.color !== piece.color) {//capture piece 
            this.capturePiece(piece, pieces.find((p) => p.selected));
        }
        else if (this.toMove.color === piece.color) {
            pieces.forEach((p) => p.selected = false);
            this.startMove(piece);
        }
        this.updateBoard();
        return false;
    };

    squareClick(event: JQueryEventObject): boolean {
        
        if(event.currentTarget !== event.target) return false;
        var squareId = event.target.id;
        var pieces = this.getPieces();
        var anySelected = this.anySelected(pieces);
        
        var square = this.board.squares.find((s) => s.getName() == event.target.id)
        if (anySelected && this.activeMove) {
            var currentMove = this.activeMove;
            this.endMove(currentMove.piece, square);
        }
        this.updateBoard();
        return false;
    }

    bindEvents(selector: JQuery): void {
        selector.on('click', '.chess-piece', (eventObject: JQueryEventObject) => {
            this.pieceClick(eventObject);
        });
        selector.on('click', '.chess-square', (eventObject: JQueryEventObject) => {
            this.squareClick(eventObject);
        });
    };
    constructor(selector: JQuery) {

        this.players = [new Player(Color.White), new Player(Color.Black)];
        this.toMove = this.players[Color.White];
        this.playedMoves = new Array<Move>();
        this.board = new Board(selector, this.getPieces());
        this.bindEvents(selector);
        this.selector = selector;
    };
    private capturePiece(pieceToCapture: Piece, pieceToMove: Piece): boolean {
        if (pieceToCapture.color === pieceToMove.color && this.playedMoves[this.playedMoves.length])
            return false;
        pieceToCapture.captured = true;
        this.endMove(pieceToMove, pieceToCapture.placedAt);
        return false;
    };
    private anySelected(pieces: Piece[]): boolean {
        return pieces.some((p) => p.selected);
    }
    private getLastMove(): Move {
        var length = this.playedMoves.length;
        if (length == 0) return null;
        return this.playedMoves[length - 1];
    }

    private replaceLastMove(move: Move): number {
        this.playedMoves.pop();
        return this.playedMoves.push(move);
    }
}

class Move {
    start: Square;
    end: Square;
    piece: Piece;
    isComplete: boolean;
}

/**
 * Piece
 *
 */
class Piece {
    constructor(
        piceType: PieceType,
        pieceColor: Color,
        startAt: Square,
        symbol: string) {
        this.type = piceType;
        this.color = pieceColor;
        this.placedAt = startAt;
        this.startAt = startAt;
        this.symbol = symbol;
        this.moved = false;
        this.captured = false;
        this.selected = false;
    }
    color: Color;
    placedAt: Square;
    startAt: Square;
    type: PieceType;
    moved: boolean;
    captured: boolean;
    selected: boolean;
    symbol: string;

    getId(): string {
        return this.startAt.getName() + this.symbol;
    }

    getColorName(): string {
        return Color[this.color];
    }
}

class King extends Piece {
    constructor(pieceColor: Color, placedAt: Square) {
        var symbol = pieceColor === Color.White ? '♔' : '♚';
        super(PieceType.King, pieceColor, placedAt, symbol);
    }
}

class Queen extends Piece {
    constructor(pieceColor: Color, placedAt: Square) {
        var symbol = pieceColor === Color.White ? '♕' : '♛';
        super(PieceType.Queen, pieceColor, placedAt, symbol);
    }
}

class Bishop extends Piece {
    constructor(pieceColor: Color, placedAt: Square) {
        var symbol = pieceColor === Color.White ? '♗' : '♝';
        super(PieceType.Bishop, pieceColor, placedAt, symbol);
    }
}

class Knight extends Piece {
    constructor(pieceColor: Color, placedAt: Square) {
        var symbol = pieceColor === Color.White ? '♘' : '♞';
        super(PieceType.Knight, pieceColor, placedAt, symbol);

    }
}

class Tower extends Piece {
    constructor(pieceColor: Color, placedAt: Square) {
        var symbol = pieceColor === Color.White ? '♖' : '♜';
        super(PieceType.Knight, pieceColor, placedAt, symbol);
    }
}

class Pawn extends Piece {
    constructor(pieceColor: Color, placedAt: Square) {
        var symbol = pieceColor === Color.White ? '♙' : '♟';
        super(PieceType.Pawn, pieceColor, placedAt, symbol);
    }
}



/**
 * Square
 */
class Square {
    row: number;
    column: Columns;

    getLetter() {
        return Columns[this.column];
    };

    getName(): string {
        return this.getLetter() + this.row;
    }

    getSelector(): string {
        return '#' + this.getName();
    }

    getColor() {
        return (this.row + this.column - 1) % 2
    }

    getColorName() {
        return Color[this.getColor()];
    }

    constructor(row: number, column: Columns) {
        this.row = row;
        this.column = column;
    }

}


/**
 * Player
 */
class Player {
    color: Color;
    direction: MoveDirection;
    pieces: Piece[];

    isWhite(): boolean {
        return this.color == Color.White;
    }

    constructor(color: Color) {
        this.color = color;
        this.direction = color == Color.White ? MoveDirection.Up : MoveDirection.Down;
        let startingRow = this.isWhite() ? 1 : 8;
        this.pieces = new Array<Piece>(
            new Tower(color, new Square(startingRow, Columns.A)),
            new Tower(color, new Square(startingRow, Columns.H)),
            new Knight(color, new Square(startingRow, Columns.G)),
            new Bishop(color, new Square(startingRow, Columns.C)),
            new Bishop(color, new Square(startingRow, Columns.F)),
            new Knight(color, new Square(startingRow, Columns.B)),
            new Queen(color, new Square(startingRow, Columns.D)),
            new King(color, new Square(startingRow, Columns.E))
        ).concat(this.getStartingPawns());
    }

    private getStartingPawns(): Pawn[] {
        var pawns = new Array<Pawn>();
        for (var i = 1; i <= 8; i++) {
            pawns.push(new Pawn(this.color, new Square(this.isWhite() ? 2 : 7, i)));
        }
        return pawns;
    }
}

enum PieceType { King = 1, Queen, Rook, Knight, Bishop, Tower, Pawn }
enum Color { White, Black }
enum MoveDirection { Up = 1, Down = -1 }
enum Columns { A = 1, B, C, D, E, F, G, H }


$(function() {
    var chessGame = new Chess($("#board"));
});



