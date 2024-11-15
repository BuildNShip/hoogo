import React, { useState } from "react";
import styles from "./Authentication.module.css";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { BeatLoader } from "react-spinners";
import { generateOTP } from "../../apis/auth";
import { FormDataType } from "./types";

const Authentication = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>("");
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
    });

    const handleSubmit = () => {
        if (formData.email.value && !formData.otp.showField && !formData.password.showField) {
            generateOTP(formData.email.value, "Login", setFormData, setError, setIsLoading);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: {
                value: e.target.value,
                showField: true,
            },
        });
    };

    return (
        <>
            <Navbar />
            <div className={styles.mainContainer}>
                <p className={styles.pageHeaderText}>
                    Welcome to <span>Hoogo</span> 👋
                </p>

                <div className={styles.loginContainer}>
                    <div className={styles.logoContainerHeader}>
                        <p className={styles.loginContainerHeaderText}>Login to Continue</p>
                        <p className={styles.loginContainerDescription}>
                            Enter your credentials to access your account
                        </p>
                    </div>

                    <div className={styles.inputFieldsContainer}>
                        <div className={styles.inputFieldContainer}>
                            <p className={styles.inputFieldLabel}>Email *</p>
                            <input
                                name="email"
                                type="email"
                                className={styles.inputField}
                                placeholder="your@email.com"
                                value={formData.email.value}
                                onChange={handleInputChange}
                                disabled={formData.email.disabled}
                            />
                        </div>

                        {formData.name.showField && (
                            <div className={styles.inputFieldContainer}>
                                <p className={styles.inputFieldLabel}>Full Name *</p>
                                <input
                                    name="name"
                                    type="text"
                                    className={styles.inputField}
                                    placeholder="John Doe"
                                    value={formData.name.value}
                                    onChange={handleInputChange}
                                    disabled={formData.name.disabled}
                                />
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
                                    value={formData.password.value}
                                    onChange={handleInputChange}
                                    disabled={formData.password.disabled}
                                />
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
                                    type="text"
                                    className={styles.inputField}
                                    placeholder="000000"
                                    value={formData.otp.value}
                                    onChange={handleInputChange}
                                    disabled={formData.otp.disabled}
                                />
                            </div>
                        )}
                        {error && <p className={styles.errorText}>{error}</p>}

                        <button className={styles.loginButton} onClick={handleSubmit}>
                            {isLoading ? (
                                <div className={styles.loaderContainer}>
                                    <BeatLoader
                                        color="#ffd700"
                                        loading
                                        size={8}
                                        aria-label="Loading Spinner"
                                        data-testid="loader"
                                    />
                                </div>
                            ) : (
                                "Login"
                            )}
                        </button>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Authentication;
