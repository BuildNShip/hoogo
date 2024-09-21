import { publicGateway } from "../../services/apiGateways";
import { commonUrls } from "../../services/urls";
export const postLogin = async (ticketCode: string) => {
  try {
    const response = await publicGateway.post(commonUrls.postLogin, {
      ticket_code: ticketCode,
    });
    return response.data;
  } catch (error) {
    return error;
  }
};
