import React, { useEffect, useState } from "react";
import styles from "./Authentication.module.css";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { BeatLoader } from "react-spinners";
import { generateOTP, login, loginUsingGoogle, preRegister, register } from "../../apis/auth";
import { FormDataType } from "./types";
import { useNavigate } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import { useGoogleLogin } from "@react-oauth/google";

const Authentication = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [generateOTPTimer, setGenerateOTPTimer] = useState(0);
    const navigate = useNavigate();
    const [formData, setFormData] = useState<FormDataType>({
        email: {
            value: "",
            showField: true,
            disabled: false,
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
            showField: false,
            disabled: false,
        },
        apiName: "generateOTP",
        resendOtpType: null,
        generalError: "",
    });

    useEffect(() => {
        if (formData.resendOtpType === "Login" || formData.resendOtpType === "Register") {
            setGenerateOTPTimer(30);
        }
    }, [formData.resendOtpType]);

    useEffect(() => {
        if (generateOTPTimer > 0) {
            const interval = setInterval(() => {
                setGenerateOTPTimer((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [generateOTPTimer]);

    const handleSubmit = () => {
        if (formData.email.value !== "") {
            if (formData.apiName === "generateOTP") {
                generateOTP(formData.email.value, "Login", setFormData, setIsLoading);
            } else if (formData.apiName === "register") {
                if (formData.name.value === "") {
                    setFormData({
                        ...formData,
                        name: {
                            ...formData.name,
                            error: "Name cannot be empty",
                        },
                    });
                    return;
                }
                register(
                    formData.email.value,
                    formData.name.value,
                    formData.otp.value,
                    navigate,
                    setFormData,
                    setIsLoading
                );
            } else if (formData.apiName === "login") {
                if (formData.otp.value !== "") {
                    login(
                        formData.email.value,
                        formData.otp.value,
                        navigate,
                        setIsLoading,
                        setFormData
                    );
                } else {
                    setFormData({
                        ...formData,
                        otp: {
                            ...formData.otp,
                            error: "OTP cannot be empty",
                        },
                    });
                }
            }
        } else {
            setFormData({
                ...formData,
                email: {
                    ...formData.email,
                    error: "Email cannot be empty",
                },
            });
        }
    };

    const handleGoogleLogin = useGoogleLogin({
        // flow: 'auth-code',
        onSuccess: (credentialResponse) => {
            loginUsingGoogle(credentialResponse, setIsLoading, navigate);
        },
        onError: () => {
            console.error("Google Sign-In was unsuccessful");
        },
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: {
                value: e.target.value,
                showField: true,
            },
        });
    };

    useEffect(() => {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
            navigate("/dashboard");
        }
    }, [navigate]);

    return (
        <>
            <div className={styles.backgroundContainer}>
                <div className={styles.outerContainer}>
                    <Navbar showActionButtons={false} />
                    <div className={styles.mainContainer}>
                        <p className={styles.pageHeaderText}>
                            Welcome to <span>Hoogo</span> 👋
                        </p>

                        <div className={styles.loginContainer}>
                            <div className={styles.logoContainerHeader}>
                                <p className={styles.loginContainerHeaderText}>
                                    {formData.apiName === "generateOTP"
                                        ? "Login to Hoogo"
                                        : formData.apiName === "register"
                                        ? "Register Now"
                                        : "Login to Hoogo"}
                                </p>
                                <p className={styles.loginContainerDescription}>
                                    {
                                        // Show the description based on the API name
                                        formData.apiName === "generateOTP"
                                            ? "Enter your email to get started"
                                            : formData.apiName === "register"
                                            ? "Enter your details to register"
                                            : "Enter the OTP sent to your email"
                                    }
                                </p>
                            </div>

                            <div className={styles.inputFieldsContainer}>
                                <div className={styles.inputFieldContainer}>
                                    <p className={styles.inputFieldLabel}>Email *</p>
                                    <input
                                        name="email"
                                        type="email"
                                        style={{
                                            opacity: formData.email.disabled ? 0.5 : 1,
                                        }}
                                        className={styles.inputField}
                                        placeholder="your@email.com"
                                        value={formData.email?.value}
                                        onChange={handleInputChange}
                                        disabled={formData.email?.disabled}
                                    />
                                    {
                                        // Show the error message if the email field is empty
                                        formData.email.error && (
                                            <p className={styles.errorText}>
                                                {formData?.email?.error}
                                            </p>
                                        )
                                    }
                                </div>

                                {formData.name.showField && (
                                    <div className={styles.inputFieldContainer}>
                                        <p className={styles.inputFieldLabel}>Full Name *</p>
                                        <input
                                            name="name"
                                            type="text"
                                            className={styles.inputField}
                                            placeholder="John Doe"
                                            value={formData.name?.value}
                                            onChange={handleInputChange}
                                            disabled={formData.name?.disabled}
                                        />
                                        {
                                            // Show the error message if the name field is empty
                                            formData.name.error && (
                                                <p className={styles.errorText}>
                                                    {formData?.name?.error}
                                                </p>
                                            )
                                        }
                                    </div>
                                )}

                                {formData.password.showField && (
                                    <div className={styles.inputFieldContainer}>
                                        <p className={styles.inputFieldLabel}>Password *</p>
                                        <input
                                            name="password"
                                            type="password"
                                            className={styles.inputField}
                                            placeholder="••••••••"
                                            value={formData.password?.value}
                                            onChange={handleInputChange}
                                            disabled={formData.password?.disabled}
                                        />
                                        {
                                            // Show the error message if the password field is empty
                                            formData.password.error && (
                                                <p className={styles.errorText}>
                                                    {formData?.password?.error}
                                                </p>
                                            )
                                        }
                                    </div>
                                )}
                                {formData.otp.showField && (
                                    <div className={styles.inputFieldContainer}>
                                        <p className={styles.inputFieldLabel}>OTP *</p>
                                        <p className={styles.inputFieldDescription}>
                                            Enter the OTP sent to your email
                                        </p>
                                        <input
                                            name="otp"
                                            type="number"
                                            className={styles.inputField}
                                            placeholder="Enter OTP"
                                            value={formData.otp?.value}
                                            onChange={handleInputChange}
                                            disabled={formData.otp?.disabled}
                                        />
                                        {
                                            // Show the error message if the OTP field is empty
                                            formData.otp.error && (
                                                <p className={styles.errorText}>
                                                    {formData?.otp?.error}
                                                </p>
                                            )
                                        }
                                    </div>
                                )}

                                {formData.generalError && (
                                    <p className={styles.errorText}>{formData?.generalError}</p>
                                )}

                                <div className={styles.modalFooter}>
                                    <div className={styles.buttonsContainer}>
                                        <button
                                            className={styles.loginButton}
                                            onClick={handleSubmit}
                                        >
                                            {isLoading ? (
                                                <div className={styles.loaderContainer}>
                                                    <BeatLoader
                                                        color="#252525"
                                                        loading
                                                        size={8}
                                                        aria-label="Loading Spinner"
                                                        data-testid="loader"
                                                    />
                                                </div>
                                            ) : formData.apiName === "generateOTP" ? (
                                                "Generate OTP"
                                            ) : formData.apiName === "register" ? (
                                                "Register"
                                            ) : (
                                                "Login"
                                            )}
                                        </button>

                                        {formData.resendOtpType &&
                                            formData.resendOtpType.length > 0 && (
                                                <button
                                                    className={styles.resentOtpButton}
                                                    onClick={() => {
                                                        if (
                                                            typeof formData.resendOtpType ===
                                                                "string" &&
                                                            formData.resendOtpType === "Login"
                                                        )
                                                            generateOTP(
                                                                formData.email.value,
                                                                formData.resendOtpType,
                                                                setFormData,
                                                                setIsLoading
                                                            );
                                                        else if (
                                                            typeof formData.resendOtpType ===
                                                                "string" &&
                                                            formData.resendOtpType === "Register"
                                                        )
                                                            preRegister(
                                                                formData.email.value,
                                                                setFormData,
                                                                setIsLoading
                                                            );
                                                    }}
                                                    disabled={isLoading || generateOTPTimer > 0}
                                                    style={{
                                                        cursor:
                                                            isLoading || generateOTPTimer > 0
                                                                ? "not-allowed"
                                                                : "pointer",
                                                        opacity:
                                                            isLoading || generateOTPTimer > 0
                                                                ? 0.5
                                                                : 1,
                                                    }}
                                                >
                                                    Resend OTP
                                                </button>
                                            )}
                                    </div>

                                    {generateOTPTimer > 0 && (
                                        <div className={styles.timerAlert}>
                                            {generateOTPTimer > 0 && (
                                                <p>
                                                    Resend in{" "}
                                                    <span className={styles.timerText}>
                                                        {generateOTPTimer} seconds
                                                    </span>
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className={styles.signUpWithGoogle}>
                            <button
                                className={styles.resentOtpButton}
                                onClick={() => {
                                    handleGoogleLogin();
                                }}
                            >
                                <FaGoogle color="#fff" size={20} />
                                Google Sign In
                            </button>
                        </div>
                    </div>
                    <Footer />
                </div>
            </div>
        </>
    );
};

export default Authentication;
