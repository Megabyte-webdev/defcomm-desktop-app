const ScanLogin = ({ onToggle }) => {
  return (
    <div className="w-full max-w-[400px] bg-white text-black p-8 rounded-2xl shadow-xl flex flex-col items-center">
      <h2 className="text-lg font-semibold mb-4 text-center">Scan to Login</h2>
      <div className="bg-gray-200 w-full h-60 rounded-lg flex items-center justify-center text-gray-600">
        [QR Scanner Placeholder]
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
