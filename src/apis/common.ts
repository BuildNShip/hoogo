import { publicGateway } from "../../services/apiGateways";
import { commonUrls } from "../../services/urls";

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
