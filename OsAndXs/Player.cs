using System;
namespace OsAndXs
{
    class Player
    {
        public string Name { get; set; }
        public char Symbol { get; set; }

        public Player(string name, char symbol)
        {
            Name = name;
            Symbol = symbol;
        }
    }
}
