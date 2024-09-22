import { useEffect, useState } from "react";
import { getBingoMatrix } from "../../../apis/common";
import { useParams } from "react-router-dom";
import GridComponent from "./components/GridComponent/GridComponent";
import { GridLoader } from "react-spinners";

interface BingoCell {
  image: string | undefined;
  name: string | undefined;
  liner: string | undefined;
}

const BingoGrid = () => {
  const { eventName, ticketCode } = useParams();

  const [letters, setLetters] = useState<string[][]>([
    ["A", "B", "C", "D", "E"],
    ["F", "G", "H", "I", "J"],
    ["K", "L", "M", "N", "O"],
    ["P", "Q", "R", "S", "T"],
    ["U", "V", "W", "X", "Y"],
  ]);

  const [cells, setCells] = useState<BingoCell[][]>([]);

  useEffect(() => {
    getBingoMatrix(eventName, ticketCode).then((data) => {
      setCells(data.answer);
      setLetters(data.question);
      console.log(data);
    });
  }, [eventName, ticketCode]);

  if (letters.length == 0 || cells.length == 0)
    return (
      <GridLoader
        color="#000000"
        loading
        size={10}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    );

  return <GridComponent cells={cells} letters={letters} setCells={setCells} />;
};

export default BingoGrid;
