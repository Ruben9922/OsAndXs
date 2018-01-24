using System;
using System.Collections;
using System.Collections.Generic;

namespace OsAndXs
{
    class Board
    {
        public const char blank = ' ';

        public char[,] cells { get; set; }

        public Board(int size)
        {
            cells = new char[size, size];
            cells.Fill(blank);
        }

        public void Display()
        {
            Console.WriteLine("Board:");
            Console.Write("  ");
            for (int j = 0; j < cells.GetLength(1); j++)
            {
                Console.Write(" ");
                Console.Write(j);
                if (j != cells.GetLength(1) - 1)
                {
                    Console.Write("  ");
                }
            }
            Console.WriteLine();
            for (int i = 0; i < cells.GetLength(0); i++)
            {
                Console.Write(" ");
                Console.Write(i);
                for (int j = 0; j < cells.GetLength(1); j++)
                {
                    Console.Write(" ");
                    Console.Write(cells[i, j]);
                    if (j != cells.GetLength(1) - 1)
                    {
                        Console.Write(" |");
                    }
                }
                Console.WriteLine();
                if (i != cells.GetLength(0) - 1)
                {
                    Console.Write("  ");
                    for (int j = 0; j < cells.GetLength(1); j++)
                    {
                        Console.Write("---");
                        if (j != cells.GetLength(1) - 1)
                        {
                            Console.Write("+");
                        }
                    }
                    Console.WriteLine();
                }
            }
        }
    }
}
