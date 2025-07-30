import React from "react";
import { MdAttachFile } from "react-icons/md";

interface ChatFilePreviewProps {
    fileType: string;
    fileUrl: string;
    fileName: string;
    isMyChat: boolean; // Determines if the message belongs to the user
}

function ChatFilePreview({ fileType, fileUrl, fileName, isMyChat }: ChatFilePreviewProps) {
    return (
        <div className={`flex flex-col p-2 rounded-lg max-w-60 shadow-md font-medium text-sm ${isMyChat ? "bg-oliveLight text-white self-end" : "bg-gray-100 text-black self-start"}`}>
            {fileType.startsWith("image/") ? (
                <img src={fileUrl} alt="Uploaded file" className="max-w-full h-auto max-h-40 rounded-lg" />
            ) : (fileType === "application/pdf" || fileType === "pdf") ? (
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <MdAttachFile size={20}  />
                        <span className="truncate max-w-40">{fileName || "PDF File"}</span>
                    </div>
                    <iframe
                        src={fileUrl}
                        className="w-full h-40 rounded-lg border"
                        title="PDF Preview"
                    />
                    <a
                        href={fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-300 hover:underline text-sm"
                    >
                        View / Download PDF
                    </a>
                </div>
            ) : (
                <div className="flex items-center gap-2">
                    <MdAttachFile size={20}  />
                    <a
                        href={fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="truncate max-w-40 hover:underline"
                    >
                        {fileName || "Download File"}
                    </a>
                </div>
            )}
        </div>
    );
}

export default ChatFilePreview;
