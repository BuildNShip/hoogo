import toast from "react-hot-toast";
import { publicGateway } from "../../services/apiGateways";
import { commonUrls } from "../../services/urls";

interface BingoCell {
  image: string | undefined;
  name: string | undefined;
  liner: string | undefined;
}

export const getBingoMatrix = async (
  eventName: string | undefined,
  ticketCode: string | undefined
) => {
  try {
    const response = await publicGateway.get(
      commonUrls.getBingoMatrix(eventName as string, ticketCode as string)
    );

    return response.data.response;
  } catch (error) {
    return error;
  }
};

export const postUserInput = async (
  eventName: string | undefined,
  ticketCode: string | undefined,
  letter: string | undefined,
  image: File | null,
  name: string | null,
  liner: string | null,
  indexi: number,
  indexj: number,
  setCells: React.Dispatch<React.SetStateAction<BingoCell[][]>>
) => {
  try {
    const response = await publicGateway.post(
      commonUrls.userInput(eventName as string, ticketCode as string),
      {
        letter,
        image,
        name,
        liner,
        "cords[x]": indexi,
        "cords[y]": indexj,
      },
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    toast.success(response.data.message || "Succesfully added Information");
    setCells((prev) => {
      const newCells = [...prev];
      newCells[indexi][indexj] = {
        image: response.data.response.image,
        name: response.data.response.name,
        liner: response.data.response.liner,
      };
      return newCells;
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    toast.error(error?.response?.data.msg || "User was not added");
  }
};
