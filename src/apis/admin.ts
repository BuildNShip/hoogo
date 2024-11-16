import { privateGateway } from "../../services/apiGateways";
import { commonUrls } from "../../services/urls";

export const createEvent = (
  name: string,
  mmp_id: string,
  matrix: string[][]
) => {
  privateGateway
    .post(commonUrls.createEvent, {
      name,
      mmp_id,
      matrix,
    })
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.error(error);
    });
};
