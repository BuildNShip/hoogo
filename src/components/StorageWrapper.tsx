import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import styles from "./StorageWrapper.module.css";

interface StorageWrapperProps {
    errorMessage?: string; // Optional custom error message
}

const StorageWrapper: React.FC<StorageWrapperProps> = ({ errorMessage }) => {
    const [isStorageAccessible, setIsStorageAccessible] =
        useState<boolean>(true);

    useEffect(() => {
        try {
            const testKey = "storage_test_key";
            localStorage.setItem(testKey, "test");
            localStorage.removeItem(testKey);
            setIsStorageAccessible(true);
        } catch (error) {
            console.error("Storage is not accessible:", error);
            setIsStorageAccessible(false);
        }
    }, []);

    if (!isStorageAccessible) {
        return (
            <div className={styles.errorContainer}>
                {errorMessage || (
                    <>
                        <h2 className={styles.errorTitle}>
                            Browser Localstorage Unavailable
                        </h2>
                        <p className={styles.errorMessage}>
                            It looks like your browser's storage is disabled or
                            not accessible. Please enable storage to continue
                            using this application.
                        </p>
                    </>
                )}
            </div>
        );
    }

    return <Outlet />;
};

export default StorageWrapper;
