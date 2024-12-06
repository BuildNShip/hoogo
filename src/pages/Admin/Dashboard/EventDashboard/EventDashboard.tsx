import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./EventDashboard.module.css";
import toast from "react-hot-toast";
import { getEventInfo } from "../../../../apis/common";
import { deleteEvent, importGrid, updateEvent } from "../../../../apis/admin";
import Modal from "../../../../components/Modal/Modal";
import Footer from "../../../../components/Footer/Footer";
import { formatDateTime } from "../../../../functions";
import { BeatLoader, PacmanLoader } from "react-spinners";

import { FiEdit2 } from "react-icons/fi";
import Navbar from "../../../../components/Navbar/Navbar";
import { EventType, MMPEventListType, TemplateUploadType } from "./types";
import { MdClose, MdDeleteOutline, MdOutlineContentCopy } from "react-icons/md";
import Select from "react-select";
import customReactSelectStyles from "./common";
import { listMmpEvents } from "../../../../apis/user";
import { BsQrCodeScan } from "react-icons/bs";
import QRCodeStyling from "qr-code-styling";

const qrCode = new QRCodeStyling({
    width: 250,
    height: 250,
    image: "/qrLogo.svg",
    dotsOptions: {
        color: "#fff",
        type: "rounded",
    },
    backgroundOptions: {
        color: "#202020",
    },
    imageOptions: {
        crossOrigin: "anonymous",

        margin: 5, // Reduced margin to increase image size
        imageSize: 0.4, // Added imageSize to increase the image size
    },
});

const EventDashboard = () => {
    const { eventName } = useParams<{ eventName: string }>();
    const [eventInfo, setEventInfo] = useState<EventType>();
    const [isEditNameModalOpen, setIsEditNameModalOpen] = useState(false);
    const [isEditMmpIdModalOpen, setIsEditMmpIdModalOpen] = useState(false);
    const [isEditGridModalOpen, setIsEditGridModalOpen] = useState(false);
    const [isQRModalOpen, setIsQRModalOpen] = useState(false);
    const [isQRLoaded, setIsQRLoaded] = useState(false);
    const [isdownloading, setIsDownloading] = useState(false);
    const [mmpEvents, setMmpEvents] = useState<MMPEventListType[]>();

    const [generateGridConfirmation, setGenerateGridConfirmation] = useState(false);
    const [importingGrid, setImportingGrid] = useState(false);
    const [deleteEventConfirmation, setDeleteEventConfirmation] = useState(false);
    const [updateGridConfirmation, setUpdateGridConfirmation] = useState(false);
    const [uploadTemplates, setUploadTemplates] = useState<TemplateUploadType>({
        postTemplate: null,
        storyTemplate: null,
        showModal: false,
    });

    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    // Fetch event data on mount
    useEffect(() => {
        if (eventName) {
            getEventInfo(eventName, setEventInfo, setIsLoading);
            listMmpEvents(setMmpEvents);
        }
    }, [eventName]);

    useEffect(() => {
        const emptyMatrix = Array.from({ length: 5 }, () => Array.from({ length: 5 }, () => ""));

        if (eventInfo) {
            setUploadTemplates({
                postTemplate: eventInfo.post_template,
                storyTemplate: eventInfo.story_template,
                showModal: false,
            });

            if (!eventInfo.matrix || eventInfo.matrix.length === 0) {
                setEventInfo({ ...eventInfo, matrix: emptyMatrix });
            }
        }
    }, [eventInfo]);

    const handleUpdateName = () => {
        if (!eventInfo) return;
        const formData = new FormData();
        formData.append("name", eventInfo?.name);
        updateEvent(eventInfo?.id, formData).then(() => {
            getEventInfo(eventInfo?.name, setEventInfo);
            navigate(`/dashboard/${eventInfo?.name}`);
            setIsEditNameModalOpen(false);
        });
        toast.success("Event name updated successfully!");
    };

    const handleUpdateMmpId = (isRemove?: boolean) => {
        if (!eventInfo) return;
        const formData = new FormData();
        if (isRemove) formData.append("mmp_event_id", "null");
        else formData.append("mmp_event_id", eventInfo?.mmp_event_id || "null");
        updateEvent(eventInfo?.id, formData);
        toast.success("MakeMyPass Event ID updated successfully!");
    };

    const updateTemplates = () => {
        if (!eventInfo) return;

        let dataChanged = false;
        if (
            uploadTemplates?.postTemplate !== eventInfo?.post_template ||
            uploadTemplates?.storyTemplate !== eventInfo?.story_template
        ) {
            dataChanged = true;
        }

        if (dataChanged)
            if (uploadTemplates?.storyTemplate && uploadTemplates?.postTemplate) {
                const formData = new FormData();
                if (
                    uploadTemplates?.postTemplate &&
                    typeof uploadTemplates.postTemplate !== "string"
                ) {
                    formData.append("post_template", uploadTemplates.postTemplate);
                }
                if (
                    uploadTemplates?.storyTemplate &&
                    typeof uploadTemplates.storyTemplate !== "string"
                ) {
                    formData.append("story_template", uploadTemplates.storyTemplate);
                }

                updateEvent(eventInfo?.id, formData).then(() => {
                    setUploadTemplates((prev) => ({
                        ...prev,
                        showModal: false,
                    }));
                    toast.success("Templates uploaded successfully!");
                });
            } else {
                toast.error(
                    "Please upload both the templates, else default templates will be used"
                );
            }
        else {
            setUploadTemplates((prev) => ({
                ...prev,
                showModal: false,
            }));
        }
    };

    const handleMatrixUpdate = () => {
        const formData = new FormData();
        eventInfo?.matrix.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                formData.append(`matrix[${rowIndex}][${colIndex}]`, cell);
            });
        });

        if (eventInfo?.id) {
            updateEvent(eventInfo?.id, formData).then(() => {
                getEventInfo(eventInfo?.name, setEventInfo);
                setIsEditGridModalOpen(false);
                setUpdateGridConfirmation(false);
            });
        }
    };

    const generateRandomGrid = () => {
        if (eventInfo?.name && eventInfo.mmp_event_id)
            importGrid(
                eventInfo?.name,
                setEventInfo,
                setImportingGrid,
                setGenerateGridConfirmation
            );
        else {
            toast.error("Connect to MakeMyPass to generate Grid using CheckIn Participant Data");
        }
    };

    const handleGridChange = (value: string, row: number, col: number) => {
        const newMatrix = [...eventInfo!.matrix];
        newMatrix[row][col] = value.toUpperCase().slice(0, 1);
        setEventInfo({ ...eventInfo!, matrix: newMatrix });
    };

    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (ref.current && isQRModalOpen) {
            qrCode.append(ref.current);
            setIsQRLoaded(true);
        }
    }, [isQRModalOpen]);

    useEffect(() => {
        qrCode.update({
            data: new URL(`https://hoogo.makemypass.com/${eventInfo?.name}`).href,
        });
    }, [eventInfo]);

    const onDownloadClick = () => {
        setIsDownloading(true);
        qrCode.download({
            extension: "png",
        });
    };

    return (
        <>
            <div className={styles.backgroundContainer}>
                <div className={styles.outerContainer}>
                    <Navbar />
                    {!isLoading ? (
                        <div className={styles.dashboardContainer}>
                            <div className={styles.eventThemeHeader}>
                                <div className={styles.headerActions}>
                                    <div
                                        className={styles.backButton}
                                        onClick={() => {
                                            navigate("/dashboard");
                                        }}
                                    >
                                        {"<"}
                                    </div>
                                    <h1 className={styles.eventTitle}>
                                        {eventInfo?.name}
                                        <FiEdit2
                                            className={styles.editIcon}
                                            size={18}
                                            color="#fff"
                                            onClick={() => setIsEditNameModalOpen(true)}
                                        />
                                        <MdDeleteOutline
                                            className={styles.deleteIcon}
                                            size={20}
                                            color="#fff"
                                            onClick={() => setDeleteEventConfirmation(true)}
                                        />
                                    </h1>
                                </div>

                                <div
                                    className={`${styles.mmpConnectedPill} ${
                                        eventInfo?.mmp_event_id ? styles.active : ""
                                    }`}
                                    onClick={() => setIsEditMmpIdModalOpen(true)}
                                >
                                    {eventInfo?.mmp_event_id ? (
                                        <p
                                            className={`${styles.mmpConnectedText} ${
                                                eventInfo?.mmp_event_id ? styles.active : ""
                                            }`}
                                        >
                                            makemypass connected
                                        </p>
                                    ) : (
                                        <p className={styles.mmpNotConnectedText}>
                                            makemypass not connected
                                        </p>
                                    )}

                                    <FiEdit2
                                        className={styles.editIcon}
                                        size={12}
                                        color={eventInfo?.mmp_event_id ? "#252525" : "#fff"}
                                    />
                                </div>
                            </div>

                            <div className={styles.dashboardMainContainer}>
                                <div className={styles.eventDetails}>
                                    <p>
                                        <strong>Created At:</strong>{" "}
                                        {formatDateTime(
                                            eventInfo?.created_at
                                                ? new Date(eventInfo.created_at)
                                                : new Date()
                                        )}
                                    </p>
                                    <p>
                                        <strong>Participants:</strong>{" "}
                                        {eventInfo?.participant_count}
                                    </p>
                                </div>

                                {/* Public Link Section */}
                                <div className={styles.publicLinkContainer}>
                                    <p className={styles.publicLink}>
                                        {
                                            new URL(`/${eventInfo?.name}`, window.location.origin)
                                                .href
                                        }
                                    </p>
                                    <button
                                        className={styles.generateQrButton}
                                        onClick={() =>
                                            toast.success("Link copied to clipboard", {
                                                icon: "📋",
                                            }) &&
                                            navigator.clipboard.writeText(
                                                new URL(
                                                    `/${eventInfo?.name}`,
                                                    window.location.origin
                                                ).href
                                            )
                                        }
                                    >
                                        <MdOutlineContentCopy size={18} color="#1d1d1d" />
                                        <span className={styles.qrText}>Copy</span>
                                    </button>
                                    <button
                                        className={styles.generateQrButton}
                                        onClick={() => {
                                            setIsQRModalOpen(true);
                                            setIsQRLoaded(false);
                                        }}
                                    >
                                        <BsQrCodeScan size={18} color="#1d1d1d" />
                                        <span className={styles.qrText}>Generate QR</span>
                                    </button>
                                </div>

                                {/* Bingo Grid Section */}

                                <div className={styles.gridContainer}>
                                    <div className={styles.gridHeaderContainer}>
                                        <div className={styles.gridHeaderTexts}>
                                            <h2
                                                className={styles.gridHeader}
                                                style={{
                                                    color: "#1ED45E",
                                                }}
                                            >
                                                Bingo Grid
                                            </h2>
                                            <p className={styles.gridDescription}>
                                                This is current Bingo grid for the event.
                                            </p>
                                        </div>
                                        <div className={styles.headerButtons}>
                                            <button
                                                className={styles.editButton}
                                                onClick={() => setIsEditGridModalOpen(true)}
                                            >
                                                Edit Grid
                                            </button>
                                            <button
                                                className={styles.editButton}
                                                onClick={() => {
                                                    setUploadTemplates({
                                                        postTemplate:
                                                            uploadTemplates?.postTemplate ?? null,
                                                        storyTemplate:
                                                            uploadTemplates?.storyTemplate ?? null,
                                                        showModal: true,
                                                    });
                                                }}
                                            >
                                                Upload Templates
                                            </button>
                                        </div>
                                    </div>

                                    {eventInfo?.matrix && (
                                        <div className={styles.centerGridContainer}>
                                            <div className={styles.grid}>
                                                {eventInfo?.matrix.map((row, rowIndex) =>
                                                    row.map((cell, colIndex) => (
                                                        <div
                                                            key={`${rowIndex}-${colIndex}`}
                                                            className={styles.gridCell}
                                                        >
                                                            {cell}
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    <div className={styles.buttonsContainer}>
                                        <button
                                            className={styles.leaderboardButton}
                                            onClick={() =>
                                                navigate(`/${eventInfo?.name}/leaderboard`)
                                            }
                                        >
                                            Show Leaderboard
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Modals */}
                            {isEditNameModalOpen && (
                                <Modal
                                    title="Edit Event Name"
                                    onClose={() => setIsEditNameModalOpen(false)}
                                >
                                    <div className={styles.modalContent}>
                                        <label className={styles.modalLabel}>Event Name</label>
                                        <p className={styles.modalLabelDescription}>
                                            This name will be used in the urls and public links,
                                            only alphanumeric characters are allowed.
                                        </p>
                                        <input
                                            type="text"
                                            value={eventInfo?.name}
                                            onChange={(e) => {
                                                //only allow alphanumeric characters
                                                if (/^[a-zA-Z0-9-&_]*$/.test(e.target.value))
                                                    setEventInfo({
                                                        ...eventInfo!,
                                                        name: e.target.value,
                                                    });
                                                else {
                                                    toast.error(
                                                        "Only alphanumeric characters are allowed"
                                                    );
                                                }
                                            }}
                                            className={styles.modalInput}
                                            autoFocus
                                        />
                                        <button
                                            className={styles.saveButton}
                                            onClick={() => {
                                                handleUpdateName();
                                            }}
                                        >
                                            Save Name
                                        </button>
                                    </div>
                                </Modal>
                            )}

                            {isEditMmpIdModalOpen && (
                                <Modal
                                    title="Connect MakeMyPass Event"
                                    onClose={() => setIsEditMmpIdModalOpen(false)}
                                >
                                    <div className={styles.modalContent}>
                                        {mmpEvents && mmpEvents?.length > 0 ? (
                                            <>
                                                <label className={styles.modalLabel}>
                                                    MakeMyPass Event ID
                                                </label>
                                                <p className={styles.modalLabelDescription}>
                                                    Enter the MakeMyPass Event ID to connect the
                                                    event and sync participants
                                                </p>

                                                <Select
                                                    isSearchable
                                                    options={mmpEvents?.map((event) => ({
                                                        value: event.event_id,
                                                        label: event.event_name,
                                                    }))}
                                                    placeholder="Select Event"
                                                    value={
                                                        eventInfo?.mmp_event_id
                                                            ? {
                                                                  value: eventInfo.mmp_event_id,
                                                                  label:
                                                                      mmpEvents?.find(
                                                                          (event) =>
                                                                              event.event_id ===
                                                                              eventInfo.mmp_event_id
                                                                      )?.event_name || "",
                                                              }
                                                            : undefined
                                                    }
                                                    styles={{
                                                        ...customReactSelectStyles,
                                                    }}
                                                    onChange={(selectedOption) => {
                                                        if (
                                                            selectedOption &&
                                                            !Array.isArray(selectedOption)
                                                        ) {
                                                            const option = selectedOption as {
                                                                value: string;
                                                                label: string;
                                                            };
                                                            setEventInfo({
                                                                ...eventInfo!,
                                                                mmp_event_id: option.value,
                                                            });
                                                        }
                                                    }}
                                                />
                                                <p className={styles.modalInputHelperText}>
                                                    <span>Note:</span> Connecting to MakeMyPass will
                                                    help auto-load the grid from checked-in
                                                    participants and validate the players.
                                                </p>
                                                <div
                                                    className={styles.confirmationButtonsContainer}
                                                >
                                                    <button
                                                        className={styles.saveButton}
                                                        onClick={() => {
                                                            handleUpdateMmpId();
                                                            setIsEditMmpIdModalOpen(false);
                                                        }}
                                                    >
                                                        Save ID
                                                    </button>
                                                    <button
                                                        className={styles.cancelButton}
                                                        onClick={() => {
                                                            setEventInfo({
                                                                ...eventInfo!,
                                                                mmp_event_id: null,
                                                            });
                                                            handleUpdateMmpId(true);
                                                            setIsEditMmpIdModalOpen(false);
                                                        }}
                                                    >
                                                        Disconnect
                                                    </button>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <label className={styles.modalLabel}>
                                                    You don't have any events on MakeMyPass
                                                </label>
                                                <p className={styles.modalLabelDescription}>
                                                    Kindly create an event on MakeMyPass to connect
                                                    it with this hoogo. You should be either the
                                                    admin or owner of the event
                                                </p>
                                                <div
                                                    className={styles.confirmationButtonsContainer}
                                                >
                                                    <a
                                                        href={import.meta.env.VITE_MAKEMYPASS_URL}
                                                        target="_blank"
                                                    >
                                                        <button className={styles.saveButton}>
                                                            Create MakeMyPass Event
                                                        </button>
                                                    </a>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </Modal>
                            )}

                            {isEditGridModalOpen && (
                                <Modal
                                    title="Edit Bingo Grid"
                                    onClose={() => setIsEditGridModalOpen(false)}
                                >
                                    <div className={styles.row}>
                                        <label className={styles.modalLabel}>
                                            Bingo Grid (5x5, A-Z)
                                        </label>
                                        <button
                                            className={styles.editButtonSmall}
                                            onClick={() => {
                                                if (eventInfo?.mmp_event_id)
                                                    setGenerateGridConfirmation(true);
                                                else
                                                    toast.error(
                                                        "Connect to MakeMyPass to generate Grid using CheckIn Participant Data"
                                                    );
                                            }}
                                            style={!eventInfo?.mmp_event_id ? { opacity: 0.5 } : {}}
                                        >
                                            Generate Grid
                                        </button>
                                    </div>

                                    <p
                                        className={styles.modalLabelDescription}
                                        style={{
                                            maxWidth: "20rem",
                                        }}
                                    >
                                        Edit the Bingo grid for the event. You can also generate a
                                        random grid.
                                    </p>

                                    <div
                                        className={styles.modalContent}
                                        style={{
                                            justifyContent: "center",
                                            alignItems: "center",
                                        }}
                                    >
                                        <div className={styles.grid}>
                                            {eventInfo?.matrix.map((row, rowIndex) =>
                                                row.map((cell, colIndex) => (
                                                    <input
                                                        key={`${rowIndex}-${colIndex}`}
                                                        type="text"
                                                        value={cell}
                                                        maxLength={1}
                                                        onChange={(e) =>
                                                            handleGridChange(
                                                                e.target.value,
                                                                rowIndex,
                                                                colIndex
                                                            )
                                                        }
                                                        className={styles.gridInput}
                                                        autoFocus={rowIndex === 0 && colIndex === 0}
                                                    />
                                                ))
                                            )}
                                        </div>
                                        <div className={styles.buttonsContainer}>
                                            <button
                                                className={styles.saveButton}
                                                onClick={() => {
                                                    setUpdateGridConfirmation(true);
                                                }}
                                            >
                                                Save Grid
                                            </button>
                                        </div>
                                        <div className={styles.infoContainer}>
                                            <p className={styles.infoText}>
                                                <span>Note: </span>
                                                The grid letters should from the names of the people
                                                checked-in for the event.
                                            </p>
                                        </div>
                                    </div>
                                </Modal>
                            )}

                            {isQRModalOpen && (
                                <Modal title="QR Code" onClose={() => setIsQRModalOpen(false)}>
                                    <div className={styles.qrContainer}>
                                        <div
                                            className={styles.qrLoaderContainer}
                                            style={{ display: isQRLoaded ? "none" : "flex" }}
                                        >
                                            <PacmanLoader
                                                color="#1ED45E"
                                                size={25}
                                                className={styles.pacmanLoader}
                                            />
                                            <p className={styles.loaderText}>
                                                Hang tight! Generating QR Code...
                                            </p>
                                        </div>

                                        <div
                                            className={styles.qrImageContainer}
                                            style={{
                                                display: isQRLoaded ? "flex" : "none",
                                            }}
                                        >
                                            <div ref={ref}></div>
                                            <div
                                                className={styles.row}
                                                style={{
                                                    gap: "10px",
                                                }}
                                            >
                                                <button
                                                    className={styles.copyQr}
                                                    onClick={() => {
                                                        onDownloadClick();
                                                    }}
                                                >
                                                    {isdownloading ? (
                                                        <BeatLoader color="#272727" size={10} />
                                                    ) : (
                                                        "Download QR"
                                                    )}
                                                </button>
                                                <button
                                                    className={styles.copyQr}
                                                    onClick={() => {
                                                        navigate(`/${eventInfo?.name}/qr`);
                                                    }}
                                                >
                                                    Full Screen
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </Modal>
                            )}

                            {uploadTemplates?.showModal && (
                                <Modal
                                    title="Upload Templates"
                                    onClose={() =>
                                        setUploadTemplates({
                                            ...uploadTemplates,
                                            showModal: false,
                                            postTemplate: uploadTemplates?.postTemplate ?? null,
                                            storyTemplate: uploadTemplates?.storyTemplate ?? null,
                                        })
                                    }
                                >
                                    <div className={styles.form}>
                                        <div className={styles.inputGroup}>
                                            <label htmlFor="postTemplate" className={styles.label}>
                                                Upload the Post Template{" "}
                                                <span> (760px x 760px)</span>
                                            </label>

                                            <p className={styles.inputFieldDescription}>
                                                This template will be used for the final grid
                                            </p>

                                            {uploadTemplates?.postTemplate ? (
                                                <div className={styles.previewImageContainer}>
                                                    <a
                                                        href={
                                                            typeof uploadTemplates.postTemplate ===
                                                            "string"
                                                                ? uploadTemplates.postTemplate
                                                                : URL.createObjectURL(
                                                                      uploadTemplates.postTemplate
                                                                  )
                                                        }
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        <img
                                                            src={
                                                                typeof uploadTemplates.postTemplate ===
                                                                "string"
                                                                    ? uploadTemplates.postTemplate
                                                                    : URL.createObjectURL(
                                                                          uploadTemplates.postTemplate
                                                                      )
                                                            }
                                                            alt="Preview"
                                                            style={{
                                                                width: "100px",
                                                                objectFit: "cover",
                                                                marginTop: "10px",
                                                            }}
                                                        />
                                                    </a>
                                                    <button
                                                        className={styles.removeButton}
                                                        onClick={() => {
                                                            setUploadTemplates({
                                                                ...uploadTemplates,
                                                                storyTemplate: null,
                                                            });
                                                        }}
                                                    >
                                                        Remove
                                                    </button>
                                                    <div
                                                        className={styles.closeButton}
                                                        title="Remove Image"
                                                    >
                                                        <MdClose
                                                            onClick={() => {
                                                                setUploadTemplates({
                                                                    ...uploadTemplates,
                                                                    postTemplate: null,
                                                                });
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            ) : (
                                                <input
                                                    type="file"
                                                    id="postTemplate"
                                                    accept="image/*"
                                                    onChange={(e) => {
                                                        if (
                                                            e.target.files &&
                                                            e.target.files.length > 0
                                                        ) {
                                                            setUploadTemplates({
                                                                ...uploadTemplates,
                                                                postTemplate: e.target.files[0],
                                                            });
                                                        }
                                                    }}
                                                    className={styles.fileInput}
                                                />
                                            )}
                                        </div>
                                        <div className={styles.inputGroup}>
                                            <label htmlFor="storyTemplate" className={styles.label}>
                                                Upload the Story Template
                                                <span> (760px x 760px)</span>
                                            </label>

                                            <p className={styles.inputFieldDescription}>
                                                This template will be used for the story grid
                                            </p>

                                            {uploadTemplates?.storyTemplate ? (
                                                <div className={styles.previewImageContainer}>
                                                    <a
                                                        href={
                                                            typeof uploadTemplates.storyTemplate ===
                                                            "string"
                                                                ? uploadTemplates.storyTemplate
                                                                : URL.createObjectURL(
                                                                      uploadTemplates.storyTemplate
                                                                  )
                                                        }
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        <img
                                                            src={
                                                                typeof uploadTemplates.storyTemplate ===
                                                                "string"
                                                                    ? uploadTemplates.storyTemplate
                                                                    : URL.createObjectURL(
                                                                          uploadTemplates.storyTemplate
                                                                      )
                                                            }
                                                            alt="Preview"
                                                            style={{
                                                                width: "100px",
                                                                objectFit: "cover",
                                                                marginTop: "10px",
                                                            }}
                                                        />
                                                    </a>
                                                    <button
                                                        className={styles.removeButton}
                                                        onClick={() => {
                                                            setUploadTemplates({
                                                                ...uploadTemplates,
                                                                storyTemplate: null,
                                                            });
                                                        }}
                                                    >
                                                        Remove
                                                    </button>
                                                    <div
                                                        className={styles.closeButton}
                                                        title="Remove Image"
                                                    >
                                                        <MdClose
                                                            onClick={() => {
                                                                setUploadTemplates({
                                                                    ...uploadTemplates,
                                                                    storyTemplate: null,
                                                                });
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            ) : (
                                                <input
                                                    type="file"
                                                    id="storyTemplate"
                                                    accept="image/*"
                                                    onChange={(e) => {
                                                        if (
                                                            e.target.files &&
                                                            e.target.files.length > 0
                                                        ) {
                                                            setUploadTemplates({
                                                                ...uploadTemplates,
                                                                storyTemplate: e.target.files[0],
                                                            });
                                                        }
                                                    }}
                                                    className={styles.fileInput}
                                                />
                                            )}
                                        </div>

                                        <button
                                            className={styles.submitButton}
                                            onClick={updateTemplates}
                                            type="submit"
                                        >
                                            Submit
                                        </button>
                                    </div>
                                </Modal>
                            )}

                            {updateGridConfirmation && (
                                <Modal
                                    title="Confirmation"
                                    onClose={() => setUpdateGridConfirmation(false)}
                                >
                                    <div className={styles.modalContent}>
                                        <label className={styles.confirmationModalLabel}>
                                            Update Confirmation
                                        </label>
                                        <p className={styles.confirmationModalDescription}>
                                            Are you sure you want to update the grid? This action
                                            cannot be undone.
                                        </p>
                                        <div className={styles.confirmationButtonsContainer}>
                                            <button
                                                className={styles.saveButton}
                                                onClick={() => {
                                                    handleMatrixUpdate();
                                                }}
                                            >
                                                Confirm
                                            </button>
                                            <button className={styles.cancelButton}>Cancel</button>
                                        </div>
                                    </div>
                                </Modal>
                            )}

                            {generateGridConfirmation && (
                                <Modal
                                    title="Import Grid Confirmation"
                                    onClose={() => setGenerateGridConfirmation(false)}
                                >
                                    <div className={styles.modalContent}>
                                        <label className={styles.confirmationModalLabel}>
                                            Import Grid From MakeMyPass
                                        </label>
                                        <p className={styles.confirmationModalDescription}>
                                            Are you sure you want to import the grid from
                                            MakeMyPass? This action will overwrite the current grid.
                                        </p>
                                        <div className={styles.confirmationButtonsContainer}>
                                            <button
                                                className={styles.saveButton}
                                                onClick={() => {
                                                    generateRandomGrid();
                                                }}
                                            >
                                                {importingGrid ? (
                                                    <BeatLoader color="#272727" size={10} />
                                                ) : (
                                                    "Confirm"
                                                )}
                                            </button>
                                            <button
                                                className={styles.cancelButton}
                                                onClick={() => setGenerateGridConfirmation(false)}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                </Modal>
                            )}

                            {deleteEventConfirmation && (
                                <Modal
                                    title="Delete Event Confirmation"
                                    onClose={() => setDeleteEventConfirmation(false)}
                                >
                                    <div className={styles.modalContent}>
                                        <label className={styles.confirmationModalLabel}>
                                            Delete Event
                                        </label>
                                        <p className={styles.confirmationModalDescription}>
                                            Are you sure you want to delete the event? This action
                                            cannot be undone.
                                        </p>
                                        <div className={styles.confirmationButtonsContainer}>
                                            <button
                                                className={styles.saveButton}
                                                onClick={() => {
                                                    if (eventInfo?.id)
                                                        deleteEvent(eventInfo?.id, navigate);
                                                }}
                                            >
                                                Confirm
                                            </button>
                                            <button
                                                className={styles.cancelButton}
                                                onClick={() => setDeleteEventConfirmation(false)}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                </Modal>
                            )}
                        </div>
                    ) : (
                        <div className={styles.dashboardContainer}>
                            <div className={styles.loaderContainer}>
                                <div className={styles.pacLoader}>
                                    <PacmanLoader
                                        color="#1ED45E"
                                        loading
                                        size={25}
                                        aria-label="Loading Spinner"
                                        data-testid="loader"
                                    />
                                </div>
                                <p className={styles.loadingText}>
                                    Hang tight! Loading the event details...
                                </p>
                            </div>
                        </div>
                    )}
                    <Footer />
                </div>
            </div>
        </>
    );
};

export default EventDashboard;
