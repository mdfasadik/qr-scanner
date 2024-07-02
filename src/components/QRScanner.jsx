"use client";

import React, { useEffect, useRef, useState } from 'react';
import { IoQrCodeSharp } from "react-icons/io5";
import QrScanner from 'qr-scanner';
import Image from 'next/image';

export default function QRScanner() {
    const scanner = useRef(null);
    const videoEl = useRef(null);
    const qrBoxEl = useRef(null);

    const [qrOn, setQrOn] = useState(false);
    const [scannedResult, setScannedResult] = useState("");
    const [cameraError, setCameraError] = useState("");

    const onScanSuccess = (result) => {
        console.log(result);
        setScannedResult(result?.data);
    };

    const onScanFail = (err) => {
        console.log(err);
    };

    const handleStartQrScan = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoEl?.current) {
                videoEl.current.srcObject = stream;
                scanner.current = new QrScanner(videoEl.current, onScanSuccess, {
                    onDecodeError: onScanFail,
                    preferredCamera: "environment",
                    highlightScanRegion: true,
                    highlightCodeOutline: true,
                    overlay: qrBoxEl?.current || undefined,
                });

                await scanner.current.start();
                setQrOn(true);
            }
        } catch (err) {
            console.error(err);
            setCameraError("Camera is blocked or not accessible. Please allow camera access in your browser settings and reload.");
            setQrOn(false);
        }
    };

    useEffect(() => {
        if (qrOn) {
            setCameraError("");
        }

        return () => {
            if (scanner.current) {
                scanner.current.stop();
                scanner.current = null;
            }
        };
    }, [qrOn]);

    return (
        <>
            <video ref={videoEl}></video>
            {/* Uncomment and use the div below if you have a custom overlay */}
            {/* <div ref={qrBoxEl} className="qr-box">
                <Image
                    src={"/qr-frame.svg"}
                    alt="Qr Frame"
                    width={256}
                    height={256}
                    className="qr-frame"
                />
            </div> */}

            {scannedResult && (
                <p
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        zIndex: 99999,
                        color: "white",
                    }}
                >
                    Scanned Result: {scannedResult}
                </p>
            )}

            {cameraError && (
                <p>
                    {cameraError}
                </p>
            )}

            <button onClick={handleStartQrScan} className='p-4 z-50 fixed bottom-10 right-10 text-5xl bg-green-500 rounded-full text-white font-bold shadow-lg shadow-green-500/30 active:bg-green-600'>
                <IoQrCodeSharp />
            </button>
        </>
    );
}
