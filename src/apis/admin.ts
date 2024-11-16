import { NavigateFunction } from "react-router-dom";
import { privateGateway } from "../../services/apiGateways";
import { commonUrls } from "../../services/urls";

export const createEvent = (name: string, navigate: NavigateFunction) => {
  privateGateway
    .post(commonUrls.createEvent, {
      name,
    })
    .then(() => {
      navigate(`/${name}`);
    })
    .catch((error) => {
      console.error(error);
    });
};

export const updateEvent = (
  eventId: string,
  matrix: string[][],
  mmpEventId?: string | null
) => {
  privateGateway
    .patch(commonUrls.updateEvent(eventId), {
      mmp_event_id: mmpEventId,
      matrix,
    })
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.error(error);
    });
};
