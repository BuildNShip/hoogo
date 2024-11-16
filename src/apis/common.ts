import toast from "react-hot-toast";
import { publicGateway } from "../../services/apiGateways";
import { commonUrls } from "../../services/urls";
import { NavigateFunction } from "react-router-dom";
import { EventType } from "../pages/User/StartGame/types";

interface BingoCell {
  image: string | undefined;
  name: string | undefined;
  liner: string | undefined;
}

export const getBingoMatrix = async (
  eventName: string | undefined,
  ticketCode: string | undefined,
  setLoading?: React.Dispatch<React.SetStateAction<boolean>>
) => {
  try {
    const response = await publicGateway.get(
      commonUrls.getBingoMatrix(eventName as string, ticketCode as string)
    );

    return response.data.response;
  } catch (error) {
    if (setLoading) setLoading(false);
    return error;
  }
};

export const postUserInput = async (
  eventName: string,
  ticketCode: string,
  letter: string,
  image: File,
  name: string,
  liner: string,
  indexi: number,
  indexj: number,
  setCells: React.Dispatch<React.SetStateAction<BingoCell[][]>>,
  setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>,
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
) => {
  setIsSubmitting(true);
  publicGateway
    .post(
      commonUrls.userInput(eventName, ticketCode),
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
    )
    .then((response) => {
      toast.success(
        response.data.message.general[0] || "Successfully added Information"
      );
      setCells((prev) => {
        const newCells = [...prev];
        newCells[indexi][indexj] = {
          image: response.data.response.image,
          name: response.data.response.name,
          liner: response.data.response.liner,
        };
        return newCells;
      });
      setIsOpen(false);
    })
    .catch((error) => {
      toast.error(error?.response?.message.general[0] || "User was not added");
    })
    .finally(() => {
      setIsSubmitting(false);
    });
};

export const validateTicketCode = async (
  eventName: string,
  ticketCode: string,
  navigate: NavigateFunction,
  setIsValidating: React.Dispatch<React.SetStateAction<boolean>>,
  setError: React.Dispatch<React.SetStateAction<string>>
) => {
  setIsValidating(true);
  return publicGateway
    .post(commonUrls.validateTicket(eventName, ticketCode))
    .then((response) => {
      const userName = response.data.response.name;
      if (userName) localStorage.setItem("userName", userName);
      navigate("/" + eventName + "/" + ticketCode);
    })
    .catch((error) => {
      toast.error(
        error?.response?.data.message.general[0] || "Invalid Ticket Code",
        {
          id: "ticketCode",
        }
      );
      setError(
        error?.response?.data.message.general[0] || "Invalid Ticket Code"
      );
    })
    .finally(() => {
      setIsValidating(false);
    });
};

export const getEventInfo = async (
  eventName: string,
  setEventInfo: React.Dispatch<React.SetStateAction<EventType | undefined>>
) => {
  publicGateway
    .get(commonUrls.getEventInfo(eventName))
    .then((response) => {
      const eventInfo = response.data.response;
      if (eventInfo.matrix.length === 0) {
        const matrix = Array.from({ length: 5 }, () =>
          Array.from({ length: 5 }, () => "")
        );
        eventInfo.matrix = matrix;
      }
      setEventInfo(eventInfo);
    })
    .catch((error) => {
      toast.error(
        error?.response?.data.message.general[0] || "Invalid Event Name"
      );
    });
};
