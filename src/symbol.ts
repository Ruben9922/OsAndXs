import {IconType} from "react-icons";
import {CgClose, CgShapeCircle} from "react-icons/cg";

export function symbolToIcon(symbol: Symbol): IconType {
  switch (symbol) {
    case "X":
      return CgClose;
    case "O":
      return CgShapeCircle;
  }
}

type Symbol = "X" | "O";

export default Symbol;
