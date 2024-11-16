import toast from "react-hot-toast";
import { privateGateway } from "../../services/apiGateways";
import { commonUrls } from "../../services/urls";

export const listUserEvents = async (
  setEvents: React.Dispatch<React.SetStateAction<Event[] | undefined>>
) => {
  privateGateway
    .get(commonUrls.listUserEvents)
    .then((response) => {
      setEvents(response.data.response);
    })
    .catch((error) => {
      toast.error(error?.response?.message.general[0] || "No events found", {
        id: "listUserEvents",
      });
    });
};
