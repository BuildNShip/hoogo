import { useEffect, useState } from "react";
import { getBingoMatrix } from "../../../apis/common";
import { useParams } from "react-router-dom";
import GridComponent from "./components/GridComponent/GridComponent";
import { GridLoader } from "react-spinners";
import styles from "./BingoGrid.module.css";

interface BingoCell {
  name: string | undefined;
  liner: string;
}

const BingoGrid = () => {
  const { eventName, ticketCode } = useParams();
  const [loading, setLoading] = useState(true);

  const [letters, setLetters] = useState<string[][]>([]);

  const [cells, setCells] = useState<BingoCell[][]>([]);

  useEffect(() => {
    console.log(letters);
    console.log(cells);
  }, [letters, cells]);

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
    <div>
      {letters && cells && letters.length > 0 && cells.length > 0 ? (
        <GridComponent letters={letters} cells={cells} showNames={true} />
      ) : (
        <p className={styles.noData}>No data available for this ticket code</p>
      )}
    </div>
  );

  // return !loading && letters.length > 0 && cells.length > 0 ? (
  //   // <GridComponent letters={letters} cells={cells} showNames={true} />
  //   <p className={styles.noData}>No data available for this ticket code</p>
  // ) : (
  //   <p className={styles.noData}>No data available for this ticket code</p>
  // );
};

export default BingoGrid;
