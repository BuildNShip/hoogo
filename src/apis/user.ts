import toast from "react-hot-toast";
import { privateGateway } from "../../services/apiGateways";
import { commonUrls } from "../../services/urls";
import { EventType } from "../pages/Admin/Dashboard/types";
import { MMPEventListType } from "../pages/Admin/Dashboard/EventDashboard/types";

export const listUserEvents = async (
    setEvents: React.Dispatch<React.SetStateAction<EventType[] | undefined>>,
    setIsEventsLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
    setIsEventsLoading(true);
    privateGateway
        .get(commonUrls.listUserEvents)
        .then((response) => {
            setEvents(response.data.response);
        })
        .catch((error) => {
            toast.error(error?.response?.message.general[0] || "No events found", {
                id: "listUserEvents",
            });
        })
        .finally(() => {
            setIsEventsLoading(false);
        });
};

export const listMmpEvents = async (
    setEvents: React.Dispatch<React.SetStateAction<MMPEventListType[] | undefined>>
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
