import { NavigateFunction } from "react-router-dom";
import { privateGateway, publicGateway } from "../../services/apiGateways";
import { buildVerse, commonUrls } from "../../services/urls";
import { FormDataType } from "../pages/Authentication/types";
import toast from "react-hot-toast";
import { TokenResponse } from "@react-oauth/google";

export const generateOTP = async (
    email: string,
    type: string,
    setFormData: React.Dispatch<React.SetStateAction<FormDataType>>,
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
    setIsLoading(true);
    return publicGateway
        .post(buildVerse.generateOTP, { email, type })
        .then((response) => {
            if (response.data.statusCode === 200) {
                toast.success(response.data.message.general[0]);
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
                    apiName: "login",
                    resendOtpType: "Login",
                });
            }
        })
        .catch((error) => {
            if (error.response.data.statusCode === 1001) {
                preRegister(email, setFormData, setIsLoading);
            }
            const errorFields: (keyof FormDataType)[] = ["email", "name", "password", "otp"];
            errorFields.forEach((field) => {
                if (error.response.data.message[field]) {
                    setFormData((prev) => ({
                        ...prev,
                        [field]: {
                            ...(typeof prev[field] === "object" ? prev[field] : {}),
                            error: error.response.data.message[field][0],
                        },
                    }));
                }
            });
        })
        .finally(() => setIsLoading(false));
};

export const preRegister = async (
    email: string,
    setFormData: React.Dispatch<React.SetStateAction<FormDataType>>,
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
    setIsLoading(true);
    return publicGateway
        .post(buildVerse.preRegister, { email })
        .then((response) => {
            toast.success(response.data.message.general[0]);
            if (response.data.statusCode === 200) {
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
                    apiName: "register",
                    resendOtpType: "Register",
                });
            }
        })
        .catch((error) => {
            setFormData((prev) => ({
                ...prev,
                generalError: error.response.data.message.general[0],
            }));
            const errorFields: (keyof FormDataType)[] = ["email", "name", "password", "otp"];
            errorFields.forEach((field) => {
                if (error.response.data.message[field]) {
                    setFormData((prev) => ({
                        ...prev,
                        [field]: {
                            ...(typeof prev[field] === "object" ? prev[field] : {}),
                            error: error.response.data.message[field][0],
                        },
                    }));
                }

                setFormData((prev) => ({
                    ...prev,
                    generalError: error.response.data.message.general[0],
                    apiName: "generateOTP",
                }));
            });
        })
        .finally(() => setIsLoading(false));
};

export const register = async (
    email: string,
    name: string,
    otp: string,
    navigate: NavigateFunction,
    setFormData: React.Dispatch<React.SetStateAction<FormDataType>>,
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
    setIsLoading(true);
    return publicGateway
        .post(buildVerse.register, { email, name, otp })
        .then((response) => {
            if (response.data.statusCode === 200) {
                toast.success(response.data.message.general[0]);
                localStorage.setItem("accessToken", response.data.response.access_token);
                localStorage.setItem("refreshToken", response.data.response.refresh_token);
                localStorage.setItem("userEmail", response.data.response.email);
                localStorage.setItem("profile_pic_url", response.data.response.profile_pic_url);
                setTimeout(() => {
                    onboardUser(setIsLoading, navigate);
                    toast.success("Registration Successful");
                }, 1000);
            }
        })
        .catch((error) => {
            setFormData((prev) => ({
                ...prev,
                generalError: error.response.data.message.general[0],
            }));

            setFormData({
                email: {
                    value: email,
                    showField: true,
                    disabled: true,
                },
                name: {
                    value: name,
                    showField: true,
                    disabled: false,
                },
                password: {
                    value: "",
                    showField: false,
                    disabled: false,
                },
                otp: {
                    value: otp,
                    showField: true,
                    disabled: false,
                    error: error.response.data.message.otp[0],
                },
                apiName: "register",
                resendOtpType: "Register",
            });
        })
        .finally(() => setIsLoading(false));
};

export const login = async (
    email: string,
    otp: string,
    navigate: NavigateFunction,
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setFormData: React.Dispatch<React.SetStateAction<FormDataType>>
) => {
    setIsLoading(true);
    return publicGateway
        .post(buildVerse.login, { email, otp })
        .then((response) => {
            if (response.data.statusCode === 200) {
                toast.success("Login Successful");
                localStorage.setItem("accessToken", response.data.response.access_token);
                localStorage.setItem("refreshToken", response.data.response.refresh_token);
                localStorage.setItem("userEmail", response.data.response.email);
                localStorage.setItem("profile_pic_url", response.data.response.profile_pic_url);
                setTimeout(() => {
                    onboardUser(setIsLoading, navigate);
                }, 1000);
            }
        })
        .catch((error) => {
            setFormData((prev) => ({
                ...prev,
                generalError: error.response.data.message.general[0],
            }));
            const errorFields: (keyof FormDataType)[] = ["email", "name", "password", "otp"];
            errorFields.forEach((field) => {
                if (error.response.data.message[field]) {
                    setFormData((prev) => ({
                        ...prev,
                        [field]: {
                            ...(typeof prev[field] === "object" ? prev[field] : {}),
                            error: error.response.data.message[field][0],
                        },
                    }));
                }
            });
        })
        .finally(() => setIsLoading(false));
};

export const onboardUser = async (
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
    navigate: NavigateFunction
) => {
    privateGateway
        .post(commonUrls.onboardUser)
        .then((response) => {
            if (response.data.statusCode === 200) {
                navigate("/dashboard");
            }
        })
        .finally(() => setIsLoading(false));
};

export const loginUsingGoogle = async (
    credentialResponse: Omit<TokenResponse, "error" | "error_description" | "error_uri">,
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
    navigate: NavigateFunction
) => {
    try {
        const { access_token } = credentialResponse;
        if (!access_token) {
            console.error("No Google access token received");
            return;
        }
        // Send the token to FastAPI backend for verification
        const response = await publicGateway.post(buildVerse.googleLogin, {
            token: access_token,
        });
        localStorage.setItem("accessToken", response.data.response.access_token);
        localStorage.setItem("refreshToken", response.data.response.refresh_token);
        localStorage.setItem("userEmail", response.data.response.email);
        localStorage.setItem("userImage", response.data.response.profile_pic_url);

        onboardUser(setIsLoading, navigate);
    } catch (error) {
        console.error("Google login error:", error);
        toast.error("Google login Failed");
    }
};
