var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
* Board
*/
var Board = (function () {
    function Board(selector) {
        this.squares = new Array();
        for (var i = 1; i <= 8; i++) {
            for (var j = 1; j <= 8; j++) {
                this.squares.push(new Square(i, j));
            }
        }
        this.writeBoard(selector);
    }
    ;
    Board.prototype.writeBoard = function (selector) {
        this.boardContainer = $(selector).first();
        var newBoardElement = this.boardContainer.append("table");
    };
    ;
    return Board;
}());
var Chess = (function () {
    function Chess(selector) {
        this.board = new Board(selector);
        this.playedMoves = new Array();
        this.players = [new Player(Color.White), new Player(Color.Black)];
        this.toMove = this.players[Color.White];
    }
    Chess.prototype.startMove = function (startSquare) { };
    ;
    Chess.prototype.endMove = function (endSquare) { };
    ;
    ;
    return Chess;
}());
var Move = (function () {
    function Move() {
    }
    return Move;
}());
/**
 * Piece
 *
 */
var Piece = (function () {
    function Piece(piceType, pieceColor, placedAt) {
        if (piceType === void 0) { piceType = PieceType.Pawn; }
        if (pieceColor === void 0) { pieceColor = Color.White; }
        if (placedAt === void 0) { placedAt = null; }
        this.type = piceType;
        this.color = pieceColor;
        this.placedAt;
        placedAt;
        this.moved = false;
        this.captured = false;
    }
    return Piece;
}());
var King = (function (_super) {
    __extends(King, _super);
    function King(pieceColor, placedAt) {
        _super.call(this, PieceType.King, pieceColor, placedAt);
    }
    return King;
}(Piece));
var Queen = (function (_super) {
    __extends(Queen, _super);
    function Queen(pieceColor, placedAt) {
        _super.call(this, PieceType.Queen, pieceColor, placedAt);
    }
    return Queen;
}(Piece));
var Bishop = (function (_super) {
    __extends(Bishop, _super);
    function Bishop(pieceColor, placedAt) {
        _super.call(this, PieceType.Bishop, pieceColor, placedAt);
    }
    return Bishop;
}(Piece));
var Knight = (function (_super) {
    __extends(Knight, _super);
    function Knight(pieceColor, placedAt) {
        _super.call(this, PieceType.Knight, pieceColor, placedAt);
    }
    return Knight;
}(Piece));
var Tower = (function (_super) {
    __extends(Tower, _super);
    function Tower(pieceColor, placedAt) {
        _super.call(this, PieceType.Knight, pieceColor, placedAt);
    }
    return Tower;
}(Piece));
var Pawn = (function (_super) {
    __extends(Pawn, _super);
    function Pawn(pieceColor, placedAt) {
        _super.call(this, PieceType.Pawn, pieceColor, placedAt);
    }
    return Pawn;
}(Piece));
/**
 * Square
 */
var Square = (function () {
    function Square(row, column) {
        this.row = row;
        this.column = column;
    }
    return Square;
}());
/**
 * Player
 */
var Player = (function () {
    function Player(color) {
        var startigRow = color + 1;
        this.color = color;
        this.direction = color == Color.White ? MoveDirection.Up : MoveDirection.Down;
        this.pieces = new Array(new Tower(color, { column: Columns.A, row: startigRow }), new Tower(color, { column: Columns.H, row: startigRow }), new Knight(color, { column: Columns.B, row: startigRow }), new Knight(color, { column: Columns.G, row: startigRow }), new Bishop(color, { column: Columns.C, row: startigRow }), new Bishop(color, { column: Columns.F, row: startigRow }), new Queen(color, { column: Columns.D, row: startigRow }), new King(color, { column: Columns.E, row: startigRow })).concat(this.getStartingPawns());
    }
    Player.prototype.getStartingPawns = function () {
        var pawns = new Array();
        for (var i = 1; i <= 8; i++) {
            pawns.push(new Pawn(this.color, {
                column: i,
                row: this.color == Color.White ? 2 : 7
            }));
        }
        return pawns;
    };
    return Player;
}());
var PieceType;
(function (PieceType) {
    PieceType[PieceType["King"] = 0] = "King";
    PieceType[PieceType["Queen"] = 1] = "Queen";
    PieceType[PieceType["Rook"] = 2] = "Rook";
    PieceType[PieceType["Knight"] = 3] = "Knight";
    PieceType[PieceType["Bishop"] = 4] = "Bishop";
    PieceType[PieceType["Tower"] = 5] = "Tower";
    PieceType[PieceType["Pawn"] = 6] = "Pawn";
})(PieceType || (PieceType = {}));
var Color;
(function (Color) {
    Color[Color["White"] = 0] = "White";
    Color[Color["Black"] = 1] = "Black";
})(Color || (Color = {}));
var MoveDirection;
(function (MoveDirection) {
    MoveDirection[MoveDirection["Up"] = 0] = "Up";
    MoveDirection[MoveDirection["Down"] = 1] = "Down";
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
    var chessGame = new Chess($("#board"));
});
//# sourceMappingURL=chess.js.map