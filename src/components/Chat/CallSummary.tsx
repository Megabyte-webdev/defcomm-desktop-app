import React from "react";

interface CallSummaryProps {
  callSummary: { caller: string; duration: number; receiver: string } | null;
}

function CallSummary({ callSummary }: CallSummaryProps) {
  if (!callSummary) return null;

  return (
    <div className="w-full mb-4 p-4 bg-gray-100 text-center rounded-md flex flex-col items-center">
      <p className="text-gray-700 font-semibold mb-2">Call Summary</p>

      <div className="grid grid-cols-2 text-gray-600 text-sm text-left gap-y-1 place-items-center">
        <strong className="pr-2">Caller:</strong>{" "}
        <span>{callSummary.caller}</span>
        <strong className="pr-2">Receiver:</strong>{" "}
        <span>{callSummary.receiver}</span>
        <strong className="pr-2">Duration:</strong>
        <span>
          {new Date(callSummary.duration * 1000).toISOString().substr(14, 5)}
        </span>
      </div>
    </div>
  );
}

export default CallSummary;
