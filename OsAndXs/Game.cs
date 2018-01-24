using System;
namespace OsAndXs
{
    public class Game
    {
        Board board = new Board(3);
        Player[] players = new Player[2];

        public void Play()
        {
            Console.WriteLine("Os and Xs Game");
            Console.WriteLine();

            Console.WriteLine("Number of players: 2");
            for (int i = 0; i < players.Length; i++)
            {
                String name = GetPlayerName(i);
                char symbol = GetPlayerSymbol(i, name);
                players[i] = new Player(name, symbol);
            }
        }

        string GetPlayerName(int index)
        {
            string playerName;
            do
            {
                // Input player name
                // Replace with default "Player X" name if left blank
                // Check entered name is unique
                string defaultPlayerName = String.Format("Player {0}", index + 1);
                Console.Write("Enter name for Player {0} (leave blank for \"{1}\"): ", index + 1, defaultPlayerName);
                playerName = Console.ReadLine();
                if (String.IsNullOrWhiteSpace(playerName))
                {
                    playerName = defaultPlayerName;
                }
            } while (!IsPlayerNameUnique(index, playerName));

            return playerName;
        }

        bool IsPlayerNameUnique(int index, string playerName)
        {
            // Check if player name is unique using linear search on existing players (players with index than given index)
            for (int i = 0; i < Math.Min(index, players.Length); i++)
            {
                if (playerName == players[i].Name)
                {
                    return false;
                }
            }

            return true;
        }

        char GetPlayerSymbol(int index, string playerName)
        {
            // Input player symbol
            // Check entered string has length of exactly one and is unique
            string input;
            bool valid;
            char? symbol;
            do
            {
                Console.Write("Enter symbol for {0}: ", playerName);
                input = Console.ReadLine();
                if (input.Length == 1)
                {
                    symbol = input[0];
                    valid = !Char.IsWhiteSpace(symbol.GetValueOrDefault()) && isPlayerSymbolUnique(index, symbol.GetValueOrDefault());
                }
                else
                {
                    valid = false;
                    symbol = null;
                }
            } while (!valid);
            return symbol.GetValueOrDefault();
        }

        bool isPlayerSymbolUnique(int index, char playerSymbol)
        {
            // Check if player symbol is unique using linear search on existing players (players with index than given index)
            for (int i = 0; i < Math.Min(index, players.Length); i++)
            {
                if (playerSymbol == players[i].Symbol)
                {
                    return false;
                }
            }

            return true;
        }
    }
}
