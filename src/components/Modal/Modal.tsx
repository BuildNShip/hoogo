import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./Modal.module.css";

interface ModalProps {
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    style?: React.CSSProperties;
}

const Modal: React.FC<ModalProps> = ({ onClose, title, children, style }) => {
    useEffect(() => {
        const handleEscapeKey = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        document.addEventListener("keydown", handleEscapeKey);

        return () => {
            document.removeEventListener("keydown", handleEscapeKey);
        };
    }, [onClose]);

    return (
        <AnimatePresence>
            <motion.div
                className={styles.modalOverlay}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                onClick={onClose}
            >
                <motion.div
                    className={styles.modalContent}
                    style={style}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {title && (
                        <div className={styles.modalHeader}>
                            <h2 className={styles.modalTitle}>{title}</h2>
                            <button className={styles.closeButton} onClick={onClose}>
                                &times;
                            </button>
                        </div>
                    )}
                    <div className={styles.modalBody}>{children}</div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default Modal;
