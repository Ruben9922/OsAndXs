﻿using System;
using System.Collections;
using System.Collections.Generic;

namespace OsAndXs
{
    class Board
    {
        public const char Blank = ' ';

        public char[,] Cells { get; set; }

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
                    Console.Write(Cells[i, j]);
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
    }
}
