import { publicGateway } from "../../services/apiGateways";
import { buildVerse } from "../../services/urls";
import { FormDataType } from "../pages/Authentication/types";
import toast from "react-hot-toast";

export const generateOTP = async (
    email: string,
    type: string,
    setFormData: React.Dispatch<React.SetStateAction<FormDataType>>,
    setError: React.Dispatch<React.SetStateAction<string>>,
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
    setIsLoading(true);
    return publicGateway
        .post(buildVerse.generateOTP, { email, type })
        .then((response) => {
            if (response.data.statusCode === 200)
                setFormData({
                    email: {
                        value: email,
                        showField: true,
                        disabled: true,
                    },
                    name: {
                        value: "",
                        showField: false,
                        disabled: false,
                    },
                    password: {
                        value: "",
                        showField: false,
                        disabled: false,
                    },
                    otp: {
                        value: "",
                        showField: true,
                        disabled: false,
                    },
                });
        })
        .catch((error) => {
            if (error.response.data.statusCode === 1001) {
                preRegister(email, setFormData, setError, setIsLoading);
            }
        })
        .finally(() => setIsLoading(false));
};

export const preRegister = async (
    email: string,
    setFormData: React.Dispatch<React.SetStateAction<FormDataType>>,
    setError: React.Dispatch<React.SetStateAction<string>>,
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
    setIsLoading(true);
    return publicGateway
        .post(buildVerse.preRegister, { email })
        .then((response) => {
            toast.success(response.data.message.general[0]);
            if (response.data.statusCode === 200)
                setFormData({
                    email: {
                        value: email,
                        showField: true,
                        disabled: true,
                    },
                    name: {
                        value: "",
                        showField: true,
                        disabled: false,
                    },
                    password: {
                        value: "",
                        showField: false,
                        disabled: false,
                    },
                    otp: {
                        value: "",
                        showField: true,
                        disabled: false,
                    },
                });
        })
        .catch((error) => {
            setError(error.response.data.message);
        })
        .finally(() => setIsLoading(false));
};
