import { useEffect, useState } from "react";
import { getBingoMatrix } from "../../../apis/common";
import { useParams } from "react-router-dom";
import GridComponent from "./components/GridComponent/GridComponent";
import { GridLoader } from "react-spinners";
import Navbar from "../../../components/Navbar/Navbar";
import Footer from "../../../components/Footer/Footer";

interface BingoCell {
  image: string | undefined;
  name: string | undefined;
  liner: string | undefined;
}

const BingoGrid = () => {
  const { eventName, ticketCode } = useParams();
  const [loading, setLoading] = useState(true);

  const [letters, setLetters] = useState<string[][]>([]);

  const [cells, setCells] = useState<BingoCell[][]>([]);

  useEffect(() => {
    setLoading(true);
    getBingoMatrix(eventName, ticketCode, setLoading)
      .then((data) => {
        setCells(data.answer);
        setLetters(data.question);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [eventName, ticketCode]);

  if (loading)
    return (
      <GridLoader
        color="#000000"
        loading
        size={10}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    );

  return (
    <>
      <Navbar />
      <GridComponent cells={cells} letters={letters} setCells={setCells} />
    </>
  );
};

export default BingoGrid;
