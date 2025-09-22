import { QRCodeCanvas } from "qrcode.react";
import useAuth from "../hooks/useAuth";
import { useState, useEffect, useRef } from "react";
import { FaSpinner } from "react-icons/fa";
const ScanLogin = ({ onToggle }) => {
  const { qrCreate, isLoading, useQrStatus, logQrUser } = useAuth();
  const [qrValue, setQrValue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const refreshTimer = useRef(null);

  // Start polling only when qrValue exists
  const { data: qrStatus } = useQrStatus(
    qrValue ? JSON.parse(qrValue)?.code : null
  );

  const fetchQrCode = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data } = await qrCreate();
      if (data?.qr_payload && data?.expires_at) {
        setQrValue(data.qr_payload);

        if (refreshTimer.current) clearTimeout(refreshTimer.current);

        const expiry = new Date(data.expires_at).getTime();
        const now = Date.now();
        const timeout = expiry - now - 2000;

        if (timeout > 0) {
          refreshTimer.current = setTimeout(fetchQrCode, timeout);
        }
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err) {
      setError("Failed to generate QR code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQrCode();
    return () => {
      if (refreshTimer.current) clearTimeout(refreshTimer.current);
    };
  }, []);

  const isLoggingIn = logQrUser.isPending;

  return (
    <div className="w-full max-w-[400px] bg-white text-black p-8 rounded-2xl shadow-xl flex flex-col items-center">
      <h2 className="text-lg font-semibold mb-4 text-center">Scan to Login</h2>

      {/* QR Code / Loading / Error / Logging In */}
      <div className="bg-gray-200 w-full h-60 rounded-lg flex items-center justify-center">
        {loading || isLoading?.qrCreate ? (
          <FaSpinner className="animate-spin text-oliveLight text-3xl" />
        ) : isLoggingIn ? (
          <div className="flex flex-col items-center gap-2">
            <FaSpinner className="animate-spin text-oliveLight text-3xl" />
            <p className="text-gray-600 text-sm">Logging you in…</p>
          </div>
        ) : error ? (
          <p className="text-red-500 text-sm text-center px-4">{error}</p>
        ) : (
          <QRCodeCanvas
            value={qrValue}
            size={180}
            bgColor={"#ffffff"}
            fgColor={"#000000"}
            level={"H"}
            includeMargin={true}
          />
        )}
      </div>

      <p className="text-sm mt-4 text-gray-500 text-center">
        Scan the QR code with your Defcomm mobile app to log in securely.
      </p>

      <div className="mt-6 text-center w-full">
        <button
          onClick={onToggle}
          className="text-oliveDark hover:text-oliveLight text-sm font-medium transition-colors"
        >
          Prefer phone login?
        </button>
      </div>
    </div>
  );
};

export default ScanLogin;
