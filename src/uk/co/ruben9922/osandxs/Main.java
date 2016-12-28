package uk.co.ruben9922.osandxs;

import uk.co.ruben9922.utilities.consoleutilities.InputUtilities;

import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.println("Welcome to Naughts and Crosses (OsAndXs) Game!");
        System.out.println();

        // Input number of players
        final int PLAYER_COUNT = InputUtilities.inputInt(scanner, "Number of players: ", 0, 10);
        System.out.println();
        scanner.nextLine();

        // Create array storing player data, and input names of each player and symbols for each player
        // Check that player name and symbol are each unique (neither has already been used by another player)
        Player[] players = new Player[PLAYER_COUNT];
        for (int i = 0; i < PLAYER_COUNT; i++) {
            String name;
            char symbol;
            boolean unique;
            do {
                // May change so name and symbol checked separately
                System.out.format("Player %d name: ", i);
                name = scanner.nextLine(); // TODO: Ensure a name is entered
                System.out.format("Player %d symbol: ", i);
                symbol = scanner.nextLine().toUpperCase().charAt(0); // TODO: Ensure a non-whitespace character is entered

                unique = true;
                for (int j = 0; j < i; j++) {
                    if (players[j].getName().equals(name)) {
                        unique = false;
                        System.out.println("Name is taken!");
                        System.out.println();
                        break;
                    }
                    if (players[j].getSymbol() == symbol) {
                        unique = false;
                        System.out.println("Symbol is taken!");
                        System.out.println();
                        break;
                    }
                }
            } while (!unique);

            players[i] = new Player(name, symbol);
            System.out.format("Created player with name %s and symbol %c\n", players[i].getName(), players[i].getSymbol());
            System.out.println();
        }

        waitForEnter(scanner, "Press enter to begin...");

        // Create then display board
        Board board = new Board(3, 3);
        board.display();
    }

    private static void waitForEnter(Scanner scanner, String prompt) {
        System.out.print(prompt);
        scanner.nextLine();
        System.out.println();
    }

    private static void waitForEnter(Scanner scanner) {
        waitForEnter(scanner, "Press enter to continue...");
    }
}
