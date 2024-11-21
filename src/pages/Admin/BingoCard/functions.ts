import html2canvas from "html2canvas";

export const captureAndDownload = async ({
    setIsDownloading,
    gridRef,
    storyTemplateImage,
    canvasRef,
    downloadImage,
}: {
    setIsDownloading: React.Dispatch<React.SetStateAction<{ story: boolean; post: boolean }>>;
    gridRef: React.RefObject<HTMLDivElement>;
    storyTemplateImage: HTMLImageElement | null;
    canvasRef: React.RefObject<HTMLCanvasElement>;
    downloadImage: () => void;
}) => {
    setIsDownloading({ story: true, post: false });
    if (gridRef.current && storyTemplateImage) {
        try {
            console.log(gridRef.current);
            // Capture the grid as an image using html2canvas
            const gridCanvas = await html2canvas(gridRef.current, {
                useCORS: true,
                allowTaint: false,
                backgroundColor: null,
                scale: 4, // Increase scale for higher resolution
            });

            const gridImage = gridCanvas.toDataURL("image/png");

            // Draw the captured grid on the template
            const canvas = canvasRef.current;
            if (canvas) {
                const ctx = canvas.getContext("2d");
                if (ctx) {
                    // Set canvas dimensions to match the template
                    canvas.width = storyTemplateImage.width;
                    canvas.height = storyTemplateImage.height;

                    // Draw the template on the canvas
                    ctx.drawImage(storyTemplateImage, 0, 0);

                    // Overlay the grid onto the template
                    const gridImgObj = new Image();
                    gridImgObj.src = gridImage;
                    gridImgObj.crossOrigin = "anonymous";
                    gridImgObj.onload = () => {
                        ctx.drawImage(gridImgObj, 85, 275, 583, 583); // Adjust positions as needed
                        downloadImage(); // Automatically download after merging
                    };
                }
            }
        } catch (error) {
            console.error("Error capturing the grid:", error);
        } finally {
            setIsDownloading({ story: false, post: false });
        }
    }
};

export const captureAndDownloadPost = async ({
    setIsDownloading,
    gridRef,
    postTemplateImage,
    canvasRef,
    downloadPostImage,
}: {
    setIsDownloading: React.Dispatch<React.SetStateAction<{ story: boolean; post: boolean }>>;
    gridRef: React.RefObject<HTMLDivElement>;
    postTemplateImage: HTMLImageElement | null;
    canvasRef: React.RefObject<HTMLCanvasElement>;
    downloadPostImage: () => void;
}) => {
    setIsDownloading({ story: false, post: true });
    if (gridRef.current && postTemplateImage) {
        try {
            const gridCanvas = await html2canvas(gridRef.current, {
                useCORS: true,
                allowTaint: false,
                backgroundColor: null,
                scale: 4, // Increase scale for higher resolution
            });

            const gridImage = gridCanvas.toDataURL("image/png");

            const canvas = canvasRef.current;
            if (canvas) {
                const ctx = canvas.getContext("2d");
                if (ctx) {
                    canvas.width = postTemplateImage.width;
                    canvas.height = postTemplateImage.height;

                    ctx.drawImage(postTemplateImage, 0, 0);

                    const gridImgObj = new Image();
                    gridImgObj.src = gridImage;
                    gridImgObj.crossOrigin = "anonymous";
                    gridImgObj.onload = () => {
                        ctx.drawImage(gridImgObj, 75, 230, 350, 350);
                        downloadPostImage();
                    };
                }
            }
        } catch (error) {
            console.error("Error capturing the grid:", error);
        } finally {
            setIsDownloading({ story: false, post: false });
        }
    }
};
