
/**
* Board
*/
class Board {
    squares: Square[];
    boardContainer: JQuery;
    constructor(selector: JQuery) {
        this.writeBoard(selector);
    };

    writeBoard(selector: JQuery) {
        this.boardContainer = $(selector).first();
        let newBoardElement = this.boardContainer.html("<table id='chessTable'><thead id='chessHead'></thead></thead><tbody id='chessBody'></tbody><tfoot id='chessFoot'></tfoot></table>");
        let chessBody = $('#chessBody');
        this.squares = new Array<Square>();
        for (var i = 8; i >= 1; i--) {
            let rowString = "chessRow" + i;
            chessBody.append(`<tr id='${rowString}'></tr>`);
            for (var j = 1; j <= 8; j++) {
                let square = new Square(i,j);
                this.squares.push(square);
                $('#'+rowString).append(`<td id='${square.getName()}' data-row='${square.row}' data-col='${square.column}' class='chess-square chess-${square.getColorName().toLocaleLowerCase()}'></td>`);
            }
        }
    };
}

class Chess {
    board: Board;
    playedMoves: Move[];
    toMove: Player;
    players: Player[];

    startMove(startSquare: Square) { };
    endMove(endSquare: Square) { };

    constructor(selector: JQuery) {
        this.board = new Board(selector);
        this.playedMoves = new Array<Move>();
        this.players = [new Player(Color.White), new Player(Color.Black)];
        this.toMove = this.players[Color.White];
    };
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
        piceType: PieceType = PieceType.Pawn,
        pieceColor: Color = Color.White,
        placedAt: Square = null) {
        this.type = piceType;
        this.color = pieceColor;
        this.placedAt = placedAt;
        this.moved = false;
        this.captured = false;
    }
    color: Color;
    placedAt: Square;
    type: PieceType;
    moved: boolean;
    captured: boolean;
}

class King extends Piece {
    constructor(pieceColor: Color, placedAt: Square) {
        super(PieceType.King, pieceColor, placedAt);
    }
}

class Queen extends Piece {
    constructor(pieceColor: Color, placedAt: Square) {
        super(PieceType.Queen, pieceColor, placedAt);
    }
}

class Bishop extends Piece {
    constructor(pieceColor: Color, placedAt: Square) {
        super(PieceType.Bishop, pieceColor, placedAt);
    }
}

class Knight extends Piece {
    constructor(pieceColor: Color, placedAt: Square) {
        super(PieceType.Knight, pieceColor, placedAt);
    }
}

class Tower extends Piece {
    constructor(pieceColor: Color, placedAt: Square) {
        super(PieceType.Knight, pieceColor, placedAt);
    }
}

class Pawn extends Piece {
    constructor(pieceColor: Color, placedAt: Square) {
        super(PieceType.Pawn, pieceColor, placedAt);
    }
}

/**
 * Square
 */
class Square {
    row: number;
    column: Columns;
    
    getLetter(){
        return Columns[this.column];
    };
    
    getName() {
        return this.getLetter() + this.column;        
    }
    
    getColor(){
        return (this.row + this.column-1) % 2
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


    constructor(color: Color) {
        let startingRow = color + 1;

        this.color = color;
        this.direction = color == Color.White ? MoveDirection.Up : MoveDirection.Down;
        this.pieces = new Array<Piece>(
            new Tower(color, new Square(startingRow, Columns.A)),
            new Tower(color, new Square(startingRow, Columns.H)),
            new Knight(color, new Square(startingRow, Columns.G )),
            new Bishop(color, new Square(startingRow, Columns.C )),
            new Bishop(color, new Square(startingRow, Columns.F )),
            new Knight(color, new Square(startingRow, Columns.B )),
            new Queen(color, new Square(startingRow, Columns.D )),
            new King(color, new Square(startingRow, Columns.E ))
        ).concat(this.getStartingPawns());
    }

    private getStartingPawns(): Pawn[] {
        var pawns = new Array<Pawn>();
        for (var i = 1; i <= 8; i++) {
            pawns.push(new Pawn(this.color, new Square(this.color == Color.White ? 2 : 7, i)));
        }
        return pawns;
    }
}

enum PieceType { King, Queen, Rook, Knight, Bishop, Tower, Pawn }
enum Color { White, Black }
enum MoveDirection { Up, Down }
enum Columns { A = 1, B, C, D, E, F, G, H }


$(function() {
    var chessGame = new Chess($("#board"));
});



