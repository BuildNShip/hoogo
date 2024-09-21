import toast from "react-hot-toast";
import { publicGateway } from "../../services/apiGateways";
import { commonUrls } from "../../services/urls";

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
  eventName: string | undefined,
  ticketCode: string | undefined
) => {
  try {
    const response = await publicGateway.post(
      commonUrls.userInput(eventName as string, ticketCode as string)
    );

    return response.data.response;
  } catch (error) {
    toast.error("Error in submitting the input");
    return error;
  }
};
