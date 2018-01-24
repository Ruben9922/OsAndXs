using System;
using System.Linq;

namespace OsAndXs
{
    class Board
    {
        public const char Blank = ' ';

        public char[,] Cells { get; }
        public Coordinates? LastCoordinates { get; set; } = null;

        public Board(int size)
        {
            Cells = new char[size, size];
            Cells.Fill(Blank);
        }

        public void Display()
        {
            Console.WriteLine("Board:");
            Console.Write("  ");
            for (int j = 0; j < Cells.GetLength(1); j++)
            {
                Console.Write(" ");
                Console.Write(j);
                if (j != Cells.GetLength(1) - 1)
                {
                    Console.Write("  ");
                }
            }
            Console.WriteLine();
            for (int i = 0; i < Cells.GetLength(0); i++)
            {
                Console.Write(" ");
                Console.Write(i);
                for (int j = 0; j < Cells.GetLength(1); j++)
                {
                    Console.Write(" ");
                    if (LastCoordinates.HasValue && LastCoordinates.Value.Row == i && LastCoordinates.Value.Column == j)
                    {
                        Console.ForegroundColor = ConsoleColor.Yellow;
                        Console.Write(Cells[i, j]);
                        Console.ResetColor();
                    }
                    else
                    {
                        Console.Write(Cells[i, j]);
                    }
                    if (j != Cells.GetLength(1) - 1)
                    {
                        Console.Write(" |");
                    }
                }
                Console.WriteLine();
                if (i != Cells.GetLength(0) - 1)
                {
                    Console.Write("  ");
                    for (int j = 0; j < Cells.GetLength(1); j++)
                    {
                        Console.Write("---");
                        if (j != Cells.GetLength(1) - 1)
                        {
                            Console.Write("+");
                        }
                    }
                    Console.WriteLine();
                }
            }
        }

        public BoardState ComputeBoardState()
        {
            if (ContainsWinningLines())
            {
                return BoardState.Win;
            }
            if (IsFull())
            {
                return BoardState.Draw;
            }
            return BoardState.Unfinished;
        }

        private bool ContainsWinningLines()
        {
            return ContainsWinningRows() || ContainsWinningColumns() || ContainsWinningDiagonals();
        }

        private bool ContainsWinningRows()
        {
            // Check for rows containing same symbol
            for (int i = 0; i < Cells.GetLength(0); i++)
            {
                if (Cells.GetLength(1) < 1) continue;

                char first = Cells[i, 0];
                if (first == Blank) continue;

                bool winning = true;
                for (int j = 1; j < Cells.GetLength(1); j++)
                {
                    if (Cells[i, j] != first)
                    {
                        winning = false;
                        break;
                    }
                }
                if (winning)
                {
                    return true;
                }
            }
            return false;
        }

        private bool ContainsWinningColumns()
        {
            // Check for columns containing same symbol
            for (int i = 0; i < Cells.GetLength(1); i++)
            {
                if (Cells.GetLength(0) < 1) continue;

                char first = Cells[0, i];
                if (first == Blank) continue;

                bool winning = true;
                for (int j = 1; j < Cells.GetLength(0); j++)
                {
                    if (Cells[j, i] != first)
                    {
                        winning = false;
                        break;
                    }
                }
                if (winning)
                {
                    return true;
                }
            }
            return false;
        }

        private bool ContainsWinningDiagonals()
        {
            if (Cells.GetLength(0) < 1 || Cells.GetLength(1) < 1) return false;

            // Check for same symbol diagonally down
            {
                char first = Cells[0, 0];
                if (first != Blank)
                {
                    bool winning = true;
                    for (int i = 1; i < Math.Min(Cells.GetLength(0), Cells.GetLength(1)); i++)
                    {
                        if (Cells[i, i] != first)
                        {
                            winning = false;
                        }
                    }
                    if (winning)
                    {
                        return true;
                    }
                }
            }

            // Check for same symbol diagonally up
            {
                char first = Cells[Cells.GetLength(0) - 1, 0];
                if (first != Blank)
                {
                    bool winning = true;
                    for (int i = 1; i < Math.Min(Cells.GetLength(0), Cells.GetLength(1)); i++)
                    {
                        if (Cells[Cells.GetLength(0) - 1 - i, i] != first)
                        {
                            winning = false;
                        }
                    }
                    if (winning)
                    {
                        return true;
                    }
                }
            }
            return false;
        }

        private bool IsFull()
        {
            return Cells.Cast<char>().All(cell => cell != Blank);
        }

        public struct Coordinates
        {
            public int Row, Column;

            public Coordinates(int row, int column)
            {
                this.Row = row;
                this.Column = column;
            }
        }

        public enum BoardState
        {
            Win,
            Draw,
            Unfinished
        }
    }
}