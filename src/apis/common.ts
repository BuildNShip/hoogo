import toast from "react-hot-toast";
import { publicGateway } from "../../services/apiGateways";
import { commonUrls } from "../../services/urls";
import { NavigateFunction } from "react-router-dom";
import { EventType } from "../pages/User/StartGame/types";
import imageCompression from "browser-image-compression";

interface BingoCell {
  image: string | undefined;
  name: string | undefined;
  liner: string | undefined;
}

export const getBingoMatrix = async (
  eventName: string | undefined,
  ticketCode: string | undefined,
  setLoading?: React.Dispatch<React.SetStateAction<boolean>>,
  noCreate?: boolean
) => {
  if (setLoading) setLoading(true);
  try {
    const response = await publicGateway.get(
      commonUrls.getBingoMatrix(eventName as string, ticketCode as string) +
        (noCreate ? "?create=false" : "")
    );

    return response.data.response;
  } catch (error) {
    if (setLoading) setLoading(false);
    return error;
  } finally {
    if (setLoading) setLoading(false);
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
  const compImage = await imageCompression(image, {
    maxWidthOrHeight: 600, // Set the max width/height (optional)
    useWebWorker: true, // Option to use Web Worker for faster compression
  });
  console.log(image.size, compImage.size);
  publicGateway
    .post(
      commonUrls.userInput(eventName, ticketCode),
      {
        letter,
        image: compImage,
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
  const data = localStorage.getItem("ticketCode");
  return publicGateway
    .post(commonUrls.validateTicket(eventName, ticketCode), {
      name_validation: data ? false : true,
    })
    .then((response) => {
      const userName = response.data.response.name;
      if (userName) localStorage.setItem("userName", userName);
      if (ticketCode) localStorage.setItem("ticketCode", ticketCode);
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
  setEventInfo: React.Dispatch<React.SetStateAction<EventType | undefined>>,
  setIsLoading?: React.Dispatch<React.SetStateAction<boolean>>
) => {
  if (setIsLoading) setIsLoading(true);
  publicGateway
    .get(commonUrls.getEventInfo(eventName))
    .then((response) => {
      setEventInfo(response.data.response);
    })
    .catch((error) => {
      toast.error(
        error?.response?.data.message.general[0] || "Invalid Event Name"
      );
    })
    .finally(() => {
      if (setIsLoading) setIsLoading(false);
    });
};
