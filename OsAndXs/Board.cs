using System;
using System.Collections;
using System.Collections.Generic;

namespace OsAndXs
{
    class Board
    {
        char[,] cells { get; set; }

        public Board(int size)
        {
            cells = new char[size, size];
            cells.Fill('c');
        }
    }
}