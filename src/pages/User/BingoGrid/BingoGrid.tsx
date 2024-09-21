import { useEffect, useState } from "react";
import { getBingoMatrix } from "../../../apis/common";
import { useParams } from "react-router-dom";
import GridComponent from "./components/GridComponent/GridComponent";
import { GridLoader } from "react-spinners";

interface BingoCell {
  name: string | undefined;
  liner: string;
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

  const [cells, setCells] = useState<BingoCell[][]>([
    [
      { name: "John", liner: "A friendly neighbor" },
      { name: "Jane", liner: "Loves gardening" },
      { name: "Alice", liner: "Enjoys painting" },
      { name: "Bob", liner: "Avid reader" },
      { name: "Charlie", liner: "Tech enthusiast" },
    ],
    [
      { name: "David", liner: "Fitness freak" },
      { name: "Eve", liner: "Music lover" },
      { name: "Frank", liner: "Foodie" },
      { name: "Grace", liner: "Travel blogger" },
      { name: "Hank", liner: "History buff" },
    ],
    [
      { name: "Ivy", liner: "Nature lover" },
      { name: "Jack", liner: "Sports fan" },
      { name: "Kathy", liner: "Bookworm" },
      { name: "Leo", liner: "Movie critic" },
      { name: "Mona", liner: "Fashionista" },
    ],
    [
      { name: "Nina", liner: "Yoga instructor" },
      { name: "Oscar", liner: "Photographer" },
      { name: "Paul", liner: "Chef" },
      { name: "Quinn", liner: "Cyclist" },
      { name: "Rita", liner: "Artist" },
    ],
    [
      { name: "Sam", liner: "Gamer" },
      { name: "Tina", liner: "Dancer" },
      { name: "Uma", liner: "Writer" },
      { name: "Vince", liner: "Entrepreneur" },
      { name: "Walt", liner: "Musician" },
    ],
  ]);

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

  return <GridComponent cells={cells} letters={letters} showNames={true} />;
};

export default BingoGrid;
