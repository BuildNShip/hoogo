import { publicGateway } from "../../services/apiGateways";
import { buildVerse } from "../../services/urls";
import { FormDataType } from "../pages/Authentication/types";

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
                //Call PreRegister
            }
        })
        .finally(() => setIsLoading(false));
};
