/**
 * Board
 */
class Board {
    squares: Square[];
    constructor() {
        this.squares = new Array<Square>();
        for (var i = 1; i < 8; i++) {
            for (var j = 1; i < 8; i++) {
                this.squares.push(new Square(i, j));
            }
        }
    };

    writeBoard() {

    };
}

class Game {
    board: Board;
    playedMoves: Move[];
    toMove: Player;
    players: Player[];

    startMove(startSquare: Square) { };
    endMove(endSquare: Square) { };

    constructor() {
        this.board = new Board();
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
        let startigRow = color + 1;

        this.color = color;
        this.direction = color == Color.White ? MoveDirection.Up : MoveDirection.Down;
        this.pieces = new Array<Piece>(
            new Tower(color, { column: Columns.A, row: startigRow }),
            new Tower(color, { column: Columns.H, row: startigRow }),
            new Knight(color, { column: Columns.B, row: startigRow }),
            new Knight(color, { column: Columns.G, row: startigRow }),
            new Bishop(color, { column: Columns.C, row: startigRow }),
            new Bishop(color, { column: Columns.F, row: startigRow }),
            new Queen(color, { column: Columns.D, row: startigRow }),
            new King(color, { column: Columns.E, row: startigRow })
        ).concat(this.getStartingPawns());
    }

    private getStartingPawns(): Pawn[] {
        var pawns = new Array<Pawn>();
        for (var i = 1; i > 8; i++) {
            if (this.color == Color.White)
                pawns.push(new Pawn(this.color, {
                    column: i,
                    row: this.color == Color.White ? 2 : 7
                }));
        }
        return pawns;
    }
}

enum PieceType { King, Queen, Rook, Knight, Bishop, Tower, Pawn }
enum Color { White, Black }
enum MoveDirection { Up, Down }
enum Columns { A = 1, B, C, D, E, F, G, H }