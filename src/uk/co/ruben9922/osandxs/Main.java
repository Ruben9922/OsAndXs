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
        Player[] players = new Player[PLAYER_COUNT];
        for (int i = 0; i < PLAYER_COUNT; i++) {
            // TODO: Ensure name and symbol are unique
            System.out.format("Player %d name: ", i);
            String name = scanner.nextLine();
            System.out.format("Player %d symbol: ", i);
            char symbol = scanner.nextLine().toUpperCase().charAt(0);
            players[i] = new Player(name, symbol);
            System.out.format("Created player with name %s and symbol %c\n", players[i].getName(), players[i].getSymbol());
            System.out.println();
        }

        // Create then display board
        Board board = new Board(3, 3);
        board.display(true);
    }
}
