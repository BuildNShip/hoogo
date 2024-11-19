import toast from "react-hot-toast";
import { privateGateway } from "../../services/apiGateways";
import { commonUrls } from "../../services/urls";
import { EventType } from "../pages/Admin/Dashboard/types";

export const listUserEvents = async (
    setEvents: React.Dispatch<React.SetStateAction<EventType[] | undefined>>
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

export const listMmpEvents = async (
    setEvents: React.Dispatch<React.SetStateAction<any[] | undefined>>
) => {
    privateGateway
        .get(commonUrls.listMmpEvents)
        .then((response) => {
            setEvents(response.data.response);
        })
        .catch((error) => {
            toast.error(error?.response?.message.general[0] || "No events found", {
                id: "listMmpEvents",
            });
        });
};
