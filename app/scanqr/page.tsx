"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import QrReader from "react-qr-reader";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import ReactDOM from "react-dom";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import LoadingOverlay from "../loading";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

export default function QRScanner() {
  const search = useSearchParams();
  const [result, setResult] = useState<string | null>(null);
  const [merchantId, setMerchantId] = useState<string | null>(null);
  const [showDiv, setShowDiv] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const router = useRouter();
  const [shouldRefresh, setShouldRefresh] = useState(false);
  const [name, setName] = useState<string | null>(null);

  useEffect(() => {
    const storedName = sessionStorage.getItem("id");
    setName(storedName);
  }, []);
  const handleScan = async (data: string | null) => {
    if (data) {
      // ตรวจสอบว่า Swal ยังไม่ถูกแสดง
      if (!Swal.isVisible()) {
        setResult(data);
        const scannedMerchantId = data.slice(83, 96);
        setMerchantId(scannedMerchantId);
  
        // แสดงกล่อง SweetAlert
        Swal.fire({
          title: "Are you sure?",
          text: "Confirm for save data!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#007AFF",
          cancelButtonColor: "#d33",
          confirmButtonText: "Confirm",
        }).then(async (result) => {
          if (result.isConfirmed) {
            try {
              const iconElement = React.createElement(FontAwesomeIcon, {
                icon: faCircleNotch,
                spin: true,
              });
              const iconStyle = {
                fontSize: "80px",
                margin: "auto",
                display: "block",
              };
              const styleIconElement = React.createElement(
                "div",
                { style: iconStyle },
                iconElement
              );
  
              Swal.fire({
                showConfirmButton: false,
                allowOutsideClick: false,
                html: (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.5em",
                      color: "#007AFF",
                    }}
                  >
                    {styleIconElement}
                    <div>Saving...</div>
                  </div>
                ),
                didOpen: () => {

                  Swal.showLoading();
                  const loadingElement = document.querySelector(".swal2-loading");
                  if (loadingElement) {
                    ReactDOM.render(
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                        }}
                      >
                        {styleIconElement}
                        <div>Saving...</div>
                      </div>,
                      loadingElement
                    );
                  }
                },
              });
  
             
              const response = await fetch("/api/data", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, merchantId: scannedMerchantId }),
              });
  
            
              Swal.fire({
                
                title: "Success!",
                icon: "success",
                confirmButtonColor: "#007AFF",
              }).then(() => {
                  window.location.reload();
              });
            } finally {
              setLoading(false);
           
            }
          }
        });
      }
    } 
  };
  
  

  const handleError = (err: any) => {
    console.error("Error accessing camera:", err);
    // Handle error here, for example show a user-friendly message
  };

  return (
    <main className="bg-gray-100 rounded-md items-center justify-center mb-10 p-4 lg:w-3/4 xl:w-2/3 mx-auto">
    {loading && <LoadingOverlay />}
    <>
      <div className="flex">
        <div className="flex-none w-5 h-4"></div>
        <div></div>
      </div>
      <div className="flex">
        <div className="flex-none w-5 h-1"></div>
        <div
          className="flex item-center justify-first mb-5"
          style={{ zIndex: showDiv ? 11 : 11 }}
        >
          {showDiv ? (
            <CloseOutlinedIcon
              onClick={() => {
               
                window.location.reload();
              }}
              style={{
                marginRight: "30px",
                fontSize: "45px",
                color: "white",
              }}
            />
          ) : (
            <ArrowBackIosIcon
              onClick={() => {
                router.push("/user");
              }}
              style={{
                marginRight: "30px",
                fontSize: "45px",
                color: "black",
              }}
            />
          )}
        </div>
      </div>
    </>
  
    {!showDiv && (
      <div className="flex justify-center mt-20">
        <div
          className="border border-solid border-black rounded-md p-4 cursor-pointer"
          onClick={() => setShowDiv(!showDiv)}
        >
          <QrCodeScannerIcon style={{ fontSize: "10rem" }} />
          <p style={{ marginLeft: "50px" }}>
            <b>ScanQR</b>
          </p>
        </div>
      </div>
    )}
    {showDiv && (
      <div
        style={{
          marginBottom: "50px",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 10,
        }}
      >
        <div className="flex items-center justify-center">
          <QrReader
            delay={300}
            onError={handleError}
            onScan={handleScan}
            style={{
              width: "100%",
              height: "100",
              borderRadius: "30px",
            }}
          />
        </div>
        <div className="flex items-center justify-center"></div>
      </div>
    )}
    <div
      id="white-box"
      className="fixed top-10 right-10 bg-white p-4 border border-solid border-gray-300 rounded-md"
    >
      {name && (
        <p>
          <div className="flex justify-center"> ID : {name}</div>
        </p>
      )}
    </div>
    <div className="flex justify-center">
      <h1 style={{ marginBottom: "200px", marginLeft: "20px" }}>
        Just scan QR code for save data.
      </h1>
    </div>
  </main>
  );
}
