using System;
using Ruben9922.Utilities.ConsoleUtilities;

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
            Console.WriteLine();

            Console.Write("Press any key to start the game...");
            Console.ReadKey();
            Console.Clear();

            int moveCount = 0;
            while (true)
            {
                Player currentPlayer = players[moveCount % players.Length];
                Console.WriteLine("{0}'s Turn", currentPlayer.Name);
                Console.WriteLine();
                
                board.Display();
                Console.WriteLine();

                Console.WriteLine("Enter coordinates of cell to fill");
                bool valid;
                do
                {
                    int row = ConsoleReadUtilities.ReadInt($"Row number [0-{board.cells.GetLength(0) - 1}]: ", 0, board.cells.GetLength(0), $"Row number must be between 0 and {board.cells.GetLength(0) - 1} (incl.)");
                    int column = ConsoleReadUtilities.ReadInt($"Column number [0-{board.cells.GetLength(1) - 1}]: ", 0, board.cells.GetLength(1), $"Column number must be between 0 and {board.cells.GetLength(1) - 1} (incl.)");
                    if (board.cells[row, column] == Board.blank)
                    {
                        board.cells[row, column] = currentPlayer.Symbol;
                        valid = true;
                    }
                    else
                    {
                        Console.WriteLine("Cell already filled; please choose an empty cell");
                        valid = false;
                    }
                    Console.WriteLine();
                } while (!valid);
                Console.Clear();

                Console.WriteLine("{0}'s Turn", currentPlayer.Name);
                Console.WriteLine();

                board.Display();
                Console.WriteLine();

                Console.Write("Press any key to continue...");
                Console.ReadKey();
                Console.Clear();

                moveCount++;
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
