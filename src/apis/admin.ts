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
            toast.error(error?.response?.data.message.general[0] || "Failed to create event");
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
    setEventInfo: Dispatch<SetStateAction<EventType | undefined>>,
    setImportingGrid: Dispatch<SetStateAction<boolean>>,
    setGenerateGridConfirmation: Dispatch<SetStateAction<boolean>>
) => {
    setImportingGrid(true);
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

            setGenerateGridConfirmation(false);
        })
        .catch((error) => {
            console.error(error);
        })
        .finally(() => {
            setImportingGrid(false);
        });
};

export const deleteEvent = (eventId: string, navigate: NavigateFunction) => {
    privateGateway
        .delete(commonUrls.deleteEvent(eventId))
        .then(() => {
            toast.success("Event deleted successfully");
            navigate("/dashboard");
        })
        .catch((error) => {
            console.error(error);
            toast.error("Failed to delete event");
        });
};
