

const LoadingOverlay = () => (
  <div className="fixed inset-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-20">
  <div className="text-white">
    <div className="loader-container">
      <div className="loader" />
    </div>
  </div>
  <style>{`
    .loader-container {
      width: 120px;
      height: 120px;
    }

    .loader {
      border: 16px solid #f3f3f3;
      border-radius: 50%;
      border-top: 16px solid orange;
      width: 100%;
      height: 100%;
      -webkit-animation: spin 2s linear infinite;
      animation: spin 2s linear infinite;
    }

    @-webkit-keyframes spin {
      0% { -webkit-transform: rotate(0deg); }
      100% { -webkit-transform: rotate(360deg); }
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `}</style>
</div>

);


export default LoadingOverlay;
