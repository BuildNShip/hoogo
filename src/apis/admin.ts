import { NavigateFunction } from "react-router-dom";
import { privateGateway } from "../../services/apiGateways";
import { commonUrls } from "../../services/urls";
import toast from "react-hot-toast";

export const createNewEvent = (name: string, navigate: NavigateFunction) => {
  toast.promise(
    privateGateway
      .post(commonUrls.createEvent, {
        name,
      })
      .then(() => {
        navigate(`/${name}`);
      })
      .catch((error) => {
        console.error(error);
      }),
    {
      loading: "Creating event...",
      success: "Event created successfully",
      error: "Failed to create event",
    }
  );
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
