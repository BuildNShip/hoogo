import { NavigateFunction } from "react-router-dom";
import { privateGateway } from "../../services/apiGateways";
import { commonUrls } from "../../services/urls";
import toast from "react-hot-toast";
import { EventType } from "../pages/User/StartGame/types";
import { Dispatch, SetStateAction } from "react";

export const createNewEvent = (name: string, navigate: NavigateFunction) => {
    privateGateway
        .post(commonUrls.createEvent, {
            name,
        })
        .then(() => {
            toast.success("Event created successfully");
            navigate(`/dashboard/${name}`);
        })
        .catch((error) => {
            console.error(error);
            toast.error("Failed to create event");
        });
};

export const updateEvent = (eventId: string, formData: FormData): Promise<void> => {
    return new Promise((resolve, reject) => {
        privateGateway
            .patch(commonUrls.updateEvent(eventId), formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then(() => {
                resolve();
            })
            .catch((error) => {
                reject(error);
            });
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
