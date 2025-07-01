'use client'

import { Button } from "@/components/ui/button"
import { useEffect, useRef, useState } from "react"
import { io, Socket } from "socket.io-client"

export default function FacetimePage() {
    const videoRef = useRef<HTMLVideoElement | null>(null)
    const streamRef = useRef<MediaStream | null>(null)
    const [streaming, setStreaming] = useState(false)
    const [partnerId, setPartnerId] = useState("")
    const socketRef = useRef<Socket | null>(null)

    useEffect(() => {
        socketRef.current = io("http://localhost:5000/facetime")
        
        socketRef.current.on("partner_found", (id: string) => {
            console.log("Partner Found: ", id);
            setPartnerId(id)
        })

        return () => {
            socketRef.current?.disconnect();
            socketRef.current = null;
        };
    },[])

    const findPartner = () => {
        socketRef.current?.emit("find_partner");
    }

    const startCamera = async () => {
     try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        })
        
        if (videoRef.current) {
            videoRef.current.srcObject = stream
        }

        streamRef.current = stream;
        setStreaming(true)
     } catch (err) {
        console.log("Error accessing webcam", err);
     }   
    }

    const stopCamera = () => {
        setStreaming(false)

        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => {
                track.stop();
            });

            if (videoRef.current) {
                videoRef.current.srcObject = null
            }
        }
        streamRef.current = null
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-black text-white space-y-4">
            <h1 className="text-3xl font-bold">Facetime</h1>

            <Button onClick={startCamera}>
                Start Camera
            </Button>

            <Button onClick={stopCamera}>
                Stop Camera
            </Button>

            <Button onClick={findPartner}>Find Match</Button>

            <p className="text-sm mt-2">
                {partnerId ? `Matched with: ${partnerId}` : "Not matched yet."}
            </p>

            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full max-w-md rounded shadow-lg"
            />
        </div>
    )
}