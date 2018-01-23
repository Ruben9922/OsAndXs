using System;
using System.Collections.Generic;

namespace OsAndXs
{
    static class ExtensionMethods
    {
        public static void Fill<T>(this T[,] array, T element)
        {
            for (int i = 0; i < array.GetLength(0); i++)
            {
                for (int j = 0; j < array.GetLength(1); j++)
                {
                    array[i, j] = element;
                }
            }
        }
    }
}
