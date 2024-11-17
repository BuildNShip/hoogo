import { NavigateFunction } from "react-router-dom";
import { privateGateway } from "../../services/apiGateways";
import { commonUrls } from "../../services/urls";
import toast from "react-hot-toast";
import { EventType } from "../pages/User/StartGame/types";
import { Dispatch, SetStateAction } from "react";

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

export const importGrid = (
  eventName: string,
  setEventInfo: Dispatch<SetStateAction<EventType | undefined>>
) => {
  privateGateway
    .post(commonUrls.importGrid(eventName))
    .then((response) => {
      const matrix = response.data.response.grid;
      if (setEventInfo) {
        setEventInfo((prev) => {
          if (prev) {
            return {
              ...prev,
              matrix,
            };
          }
          return prev;
        });
      }
    })
    .catch((error) => {
      console.error(error);
    });
};
