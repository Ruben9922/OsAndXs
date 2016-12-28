package uk.co.ruben9922.osandxs;

public class Board {
    private final char[][] board;

    public Board(int height, int width) {
        this.board = new char[height][width];
        fill(' ');
    }

    public void display() {
        int height = board.length;
        for (int i = 0; i < height; i++) {
            int rowLength = board[i].length;
            for (int j = 0; j < rowLength; j++) {
                System.out.print(" " + board[i][j] + " ");
                if (j != rowLength - 1) {
                    System.out.print("|");
                } else {
                    System.out.print(" ");
                }
            }
            System.out.println(i);
            if (i != height - 1) {
                for (int j = 0; j < rowLength; j++) {
                    System.out.print("---");
                    if (j != rowLength - 1) {
                        System.out.print("+");
                    }
                }
                System.out.println();
            }
        }
        if (height >= 1) {
            for (int i = 0; i < board[0].length; i++) { // Assuming inner arrays are of same length
                System.out.print(" " + i);
                if (i != board[0].length - 1) {
                    System.out.print("  ");
                }
            }
            System.out.println();
        }
    }

    private void fill(char ch) {
        for (int i = 0; i < board.length; i++) {
            for (int j = 0; j < board[i].length; j++) {
                board[i][j] = ch;
            }
        }
    }
}
