"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useOutsideClick } from "@/hooks/use-outside-click";

export default function ProductShowcase() {
  const [active, setActive] = useState<(typeof cards)[number] | boolean | null>(
    null
  );
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActive(false);
      }
    }

    if (active && typeof active === "object") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useOutsideClick(ref, () => setActive(null));

  return (
    <>
      <AnimatePresence>
        {active && typeof active === "object" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 h-full w-full z-10"
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {active && typeof active === "object" ? (
          <div className="fixed inset-0  grid place-items-center z-[100]">
            <motion.button
              key={`button-${active.title}-${id}`}
              layout
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
                transition: {
                  duration: 0.05,
                },
              }}
              className="flex absolute top-2 right-2 lg:hidden items-center justify-center bg-white rounded-full h-6 w-6"
              onClick={() => setActive(null)}
            >
              <CloseIcon />
            </motion.button>
            <motion.div
              layoutId={`card-${active.title}-${id}`}
              ref={ref}
              className="w-full max-w-[500px]  h-full md:h-fit md:max-h-[90%]  flex flex-col bg-white dark:bg-neutral-900 sm:rounded-3xl overflow-hidden"
            >
              <motion.div layoutId={`image-${active.title}-${id}`}>
                <img
                  width={200}
                  height={200}
                  src={active.src}
                  alt={active.title}
                  className="w-full h-80 lg:h-80 sm:rounded-tr-lg sm:rounded-tl-lg object-cover object-top"
                />
              </motion.div>

              <div>
                <div className="flex justify-between items-start p-4">
                  <div className="">
                    <motion.h3
                      layoutId={`title-${active.title}-${id}`}
                      className="font-medium text-neutral-700 dark:text-neutral-200 text-base"
                    >
                      {active.title}
                    </motion.h3>
                    <motion.p
                      layoutId={`description-${active.description}-${id}`}
                      className="text-neutral-600 dark:text-neutral-400 text-base"
                    >
                      {active.description}
                    </motion.p>
                  </div>

                  <motion.a
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    href={active.ctaLink}
                    target="_blank"
                    className="px-4 py-3 text-sm rounded-full font-bold bg-green-500 text-white"
                  >
                    {active.ctaText}
                  </motion.a>
                </div>
                <div className="pt-4 relative px-4">
                  <motion.div
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-neutral-600 text-xs md:text-sm lg:text-base h-40 md:h-fit pb-10 flex flex-col items-start gap-4 overflow-auto dark:text-neutral-400 [mask:linear-gradient(to_bottom,white,white,transparent)] [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch]"
                  >
                    {typeof active.content === "function"
                      ? active.content()
                      : active.content}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
      <ul className="max-w-2xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 items-start gap-4">
        {cards.map((card, index) => (
          <motion.div
            layoutId={`card-${card.title}-${id}`}
            key={card.title}
            onClick={() => setActive(card)}
            className="p-4 flex flex-col hover:bg-neutral-800 rounded-xl cursor-pointer"
          >
            <div className="flex gap-4 flex-col  w-full">
              <motion.div layoutId={`image-${card.title}-${id}`}>
                <img
                  width={100}
                  height={100}
                  src={card.src}
                  alt={card.title}
                  className="h-60 w-full rounded-lg object-cover object-top"
                />
              </motion.div>
              <div className="flex justify-center items-center flex-col">
                <motion.h3
                  layoutId={`title-${card.title}-${id}`}
                  className="font-medium text-neutral-200 text-center md:text-left text-base"
                >
                  {card.title}
                </motion.h3>
                <motion.p
                  layoutId={`description-${card.description}-${id}`}
                  className="text-neutral-400 text-center md:text-left text-base"
                >
                  {card.description}
                </motion.p>
              </div>
            </div>
          </motion.div>
        ))}
      </ul>
    </>
  );
}

export const CloseIcon = () => {
  return (
    <motion.svg
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
        transition: {
          duration: 0.05,
        },
      }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 text-black"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </motion.svg>
  );
};

const cards = [
  {
    description: "Real-time text communication",
    title: "Realtime Chat App",
    src: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'%3E%3Cdefs%3E%3ClinearGradient id='bg' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%234f46e5'/%3E%3Cstop offset='100%25' style='stop-color:%237c3aed'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='800' height='600' fill='url(%23bg)'/%3E%3Cg transform='translate(100,100)'%3E%3Crect x='0' y='0' width='600' height='400' rx='20' fill='white' opacity='0.95'/%3E%3Crect x='20' y='20' width='560' height='60' rx='10' fill='%23f3f4f6'/%3E%3Ctext x='40' y='50' font-family='Arial' font-size='24' font-weight='bold' fill='%23374151'%3EChat Messages%3C/text%3E%3Crect x='40' y='100' width='300' height='40' rx='20' fill='%234f46e5'/%3E%3Ctext x='60' y='125' font-family='Arial' font-size='14' fill='white'%3EHey, how's the project going?%3C/text%3E%3Crect x='260' y='160' width='280' height='40' rx='20' fill='%23e5e7eb'/%3E%3Ctext x='280' y='185' font-family='Arial' font-size='14' fill='%23374151'%3EGreat! Just finished the frontend%3C/text%3E%3Crect x='40' y='220' width='200' height='40' rx='20' fill='%234f46e5'/%3E%3Ctext x='60' y='245' font-family='Arial' font-size='14' fill='white'%3EAwesome work! 👍%3C/text%3E%3Ccircle cx='520' cy='340' r='30' fill='%2310b981'/%3E%3Ctext x='510' y='348' font-family='Arial' font-size='20' fill='white'%3E💬%3C/text%3E%3C/g%3E%3C/svg%3E",
    ctaText: "View Project",
    ctaLink: "/chat",
    content: () => (
      <p>
        A real-time chat application using <strong>Socket.IO</strong> and <strong>WebSockets</strong>, supporting
        private messaging, typing indicators, and persistent chat history.
      </p>
    ),
  },
  {
    description: "Peer-to-peer video calls",
    title: "Video Chat App",
    src: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'%3E%3Cdefs%3E%3ClinearGradient id='videoBg' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%2306b6d4'/%3E%3Cstop offset='100%25' style='stop-color:%233b82f6'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='800' height='600' fill='url(%23videoBg)'/%3E%3Cg transform='translate(50,50)'%3E%3Crect x='0' y='0' width='700' height='500' rx='20' fill='%23111827' opacity='0.95'/%3E%3Crect x='40' y='40' width='300' height='200' rx='15' fill='%234b5563'/%3E%3Ccircle cx='190' cy='110' r='35' fill='%23f3f4f6'/%3E%3Ccircle cx='175' cy='100' r='4' fill='%23374151'/%3E%3Ccircle cx='205' cy='100' r='4' fill='%23374151'/%3E%3Cpath d='M165 125 Q190 140 215 125' stroke='%23374151' stroke-width='3' fill='none'/%3E%3Ctext x='190' y='185' text-anchor='middle' font-family='Arial' font-size='16' fill='%23f9fafb'%3EJohn Doe%3C/text%3E%3Ctext x='190' y='205' text-anchor='middle' font-family='Arial' font-size='12' fill='%2310b981'%3E🎤 Speaking%3C/text%3E%3Crect x='360' y='40' width='300' height='200' rx='15' fill='%234b5563'/%3E%3Ccircle cx='510' cy='110' r='35' fill='%23f3f4f6'/%3E%3Ccircle cx='495' cy='100' r='4' fill='%23374151'/%3E%3Ccircle cx='525' cy='100' r='4' fill='%23374151'/%3E%3Cpath d='M485 125 Q510 140 535 125' stroke='%23374151' stroke-width='3' fill='none'/%3E%3Ctext x='510' y='185' text-anchor='middle' font-family='Arial' font-size='16' fill='%23f9fafb'%3EYou%3C/text%3E%3Ctext x='510' y='205' text-anchor='middle' font-family='Arial' font-size='12' fill='%236b7280'%3E🔇 Muted%3C/text%3E%3Crect x='40' y='260' width='140' height='100' rx='10' fill='%234b5563'/%3E%3Ccircle cx='110' cy='290' r='15' fill='%23f3f4f6'/%3E%3Ctext x='110' y='320' text-anchor='middle' font-family='Arial' font-size='12' fill='%23f9fafb'%3ESarah%3C/text%3E%3Crect x='200' y='260' width='140' height='100' rx='10' fill='%234b5563'/%3E%3Ccircle cx='270' cy='290' r='15' fill='%23f3f4f6'/%3E%3Ctext x='270' y='320' text-anchor='middle' font-family='Arial' font-size='12' fill='%23f9fafb'%3EMike%3C/text%3E%3Crect x='360' y='260' width='140' height='100' rx='10' fill='%234b5563'/%3E%3Ccircle cx='430' cy='290' r='15' fill='%23f3f4f6'/%3E%3Ctext x='430' y='320' text-anchor='middle' font-family='Arial' font-size='12' fill='%23f9fafb'%3EAlex%3C/text%3E%3Crect x='520' y='260' width='140' height='100' rx='10' fill='%234b5563'/%3E%3Ctext x='590' y='310' text-anchor='middle' font-family='Arial' font-size='20' fill='%236b7280'%3E+3%3C/text%3E%3Cg transform='translate(200,400)'%3E%3Ccircle cx='50' cy='25' r='25' fill='%2310b981'/%3E%3Ctext x='50' y='32' text-anchor='middle' font-family='Arial' font-size='20' fill='white'%3E🎥%3C/text%3E%3Ccircle cx='125' cy='25' r='25' fill='%23ef4444'/%3E%3Ctext x='125' y='32' text-anchor='middle' font-family='Arial' font-size='20' fill='white'%3E🎤%3C/text%3E%3Ccircle cx='200' cy='25' r='25' fill='%236b7280'/%3E%3Ctext x='200' y='32' text-anchor='middle' font-family='Arial' font-size='20' fill='white'%3E💬%3C/text%3E%3Crect x='250' y='0' width='100' height='50' rx='25' fill='%23ef4444'/%3E%3Ctext x='300' y='30' text-anchor='middle' font-family='Arial' font-size='14' fill='white'%3EEnd Call%3C/text%3E%3C/g%3E%3C/g%3E%3C/svg%3E",
    ctaText: "View Project",
    ctaLink: "https://your-video-app-link.com",
    content: () => (
      <p>
        A video conferencing platform built using <strong>WebRTC</strong>, enabling
        seamless peer-to-peer video and audio communication.
      </p>
    ),
  },
  {
    description: "Live collaborative drawing",
    title: "Collaborative Drawing Board",
    src: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'%3E%3Cdefs%3E%3ClinearGradient id='drawBg' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23f59e0b'/%3E%3Cstop offset='100%25' style='stop-color:%23ef4444'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='800' height='600' fill='url(%23drawBg)'/%3E%3Cg transform='translate(50,50)'%3E%3Crect x='0' y='0' width='700' height='500' rx='15' fill='white' opacity='0.95'/%3E%3Crect x='20' y='20' width='660' height='60' rx='10' fill='%23f3f4f6'/%3E%3Ccircle cx='60' cy='50' r='15' fill='%23ef4444'/%3E%3Ccircle cx='100' cy='50' r='15' fill='%2310b981'/%3E%3Ccircle cx='140' cy='50' r='15' fill='%233b82f6'/%3E%3Crect x='180' y='35' width='80' height='30' rx='5' fill='%236b7280'/%3E%3Ctext x='220' y='55' text-anchor='middle' font-family='Arial' font-size='12' fill='white'%3EBrush%3C/text%3E%3Crect x='20' y='100' width='660' height='380' rx='10' fill='%23fefefe' stroke='%23e5e7eb' stroke-width='2'/%3E%3Cg stroke-width='3' fill='none'%3E%3Cpath d='M100 150 Q200 200 300 180 T500 200' stroke='%23ef4444'/%3E%3Cpath d='M150 250 Q250 300 350 280 T550 300' stroke='%2310b981'/%3E%3Ccircle cx='400' cy='350' r='30' fill='%233b82f6' opacity='0.7'/%3E%3Cpath d='M200 400 L250 350 L300 400 Z' stroke='%23f59e0b' stroke-width='4' fill='%23fbbf24' opacity='0.5'/%3E%3C/g%3E%3Ctext x='600' y='470' font-family='Arial' font-size='12' fill='%236b7280'%3E3 users online%3C/text%3E%3C/g%3E%3C/svg%3E",
    ctaText: "View Project",
    ctaLink: "https://your-drawing-board-link.com",
    content: () => (
      <p>
        A collaborative canvas tool where multiple users can draw in real-time.
        Built with <strong>Canvas API</strong> and real-time sync using <strong>Socket.IO</strong>.
      </p>
    ),
  },
  {
    description: "Upload and share media",
    title: "Media Sharing App",
    src: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'%3E%3Cdefs%3E%3ClinearGradient id='mediaBg' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%236366f1'/%3E%3Cstop offset='100%25' style='stop-color:%238b5cf6'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='800' height='600' fill='url(%23mediaBg)'/%3E%3Cg transform='translate(80,80)'%3E%3Crect x='0' y='0' width='640' height='440' rx='20' fill='white' opacity='0.95'/%3E%3Crect x='20' y='20' width='600' height='80' rx='10' fill='%23f8fafc'/%3E%3Ctext x='40' y='50' font-family='Arial' font-size='20' font-weight='bold' fill='%23334155'%3EMedia Gallery%3C/text%3E%3Crect x='450' y='40' width='120' height='40' rx='20' fill='%236366f1'/%3E%3Ctext x='510' y='65' text-anchor='middle' font-family='Arial' font-size='14' fill='white'%3EUpload%3C/text%3E%3Cg transform='translate(40,120)'%3E%3Crect x='0' y='0' width='160' height='120' rx='8' fill='%23e2e8f0'/%3E%3Crect x='10' y='10' width='140' height='80' rx='4' fill='%236366f1' opacity='0.2'/%3E%3Ctext x='80' y='55' text-anchor='middle' font-family='Arial' font-size='24' fill='%236366f1'%3E📷%3C/text%3E%3Ctext x='80' y='110' text-anchor='middle' font-family='Arial' font-size='12' fill='%23475569'%3Evacation.jpg%3C/text%3E%3C/g%3E%3Cg transform='translate(220,120)'%3E%3Crect x='0' y='0' width='160' height='120' rx='8' fill='%23e2e8f0'/%3E%3Crect x='10' y='10' width='140' height='80' rx='4' fill='%23ef4444' opacity='0.2'/%3E%3Ctext x='80' y='55' text-anchor='middle' font-family='Arial' font-size='24' fill='%23ef4444'%3E🎥%3C/text%3E%3Ctext x='80' y='110' text-anchor='middle' font-family='Arial' font-size='12' fill='%23475569'%3Epresentation.mp4%3C/text%3E%3C/g%3E%3Cg transform='translate(400,120)'%3E%3Crect x='0' y='0' width='160' height='120' rx='8' fill='%23e2e8f0'/%3E%3Crect x='10' y='10' width='140' height='80' rx='4' fill='%2310b981' opacity='0.2'/%3E%3Ctext x='80' y='55' text-anchor='middle' font-family='Arial' font-size='24' fill='%2310b981'%3E🎵%3C/text%3E%3Ctext x='80' y='110' text-anchor='middle' font-family='Arial' font-size='12' fill='%23475569'%3Esong.mp3%3C/text%3E%3C/g%3E%3Cg transform='translate(130,260)'%3E%3Crect x='0' y='0' width='300' height='100' rx='10' fill='%23f1f5f9' stroke='%23cbd5e1' stroke-width='2' stroke-dasharray='10,5'/%3E%3Ctext x='150' y='40' text-anchor='middle' font-family='Arial' font-size='16' fill='%23475569'%3EDrag files here%3C/text%3E%3Ctext x='150' y='65' text-anchor='middle' font-family='Arial' font-size='14' fill='%236b7280'%3Eor click to browse%3C/text%3E%3C/g%3E%3C/g%3E%3C/svg%3E",
    ctaText: "View Project",
    ctaLink: "https://your-media-app-link.com",
    content: () => (
      <p>
        Share images, videos, and audio files with friends in a clean UI. Built using
        <strong> Next.js, MongoDB</strong> and <strong>Cloudinary</strong> for uploads.
      </p>
    ),
  },
  {
    description: "Play with friends online",
    title: "Dumb-Charades Game",
    src: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'%3E%3Cdefs%3E%3ClinearGradient id='gameBg' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23ec4899'/%3E%3Cstop offset='100%25' style='stop-color:%236366f1'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='800' height='600' fill='url(%23gameBg)'/%3E%3Cg transform='translate(50,50)'%3E%3Crect x='0' y='0' width='700' height='500' rx='20' fill='white' opacity='0.95'/%3E%3Ctext x='350' y='50' text-anchor='middle' font-family='Arial' font-size='32' font-weight='bold' fill='%23ec4899'%3EDumb Charades%3C/text%3E%3Crect x='50' y='80' width='600' height='200' rx='15' fill='%23f8fafc' stroke='%23e2e8f0' stroke-width='2'/%3E%3Ctext x='350' y='130' text-anchor='middle' font-family='Arial' font-size='48' font-weight='bold' fill='%236366f1'%3EMOVIE%3C/text%3E%3Ctext x='350' y='180' text-anchor='middle' font-family='Arial' font-size='24' fill='%23475569'%3E3 Words%3C/text%3E%3Ctext x='350' y='210' text-anchor='middle' font-family='Arial' font-size='20' fill='%23ef4444'%3E⏰ 2:45%3C/text%3E%3Ctext x='350' y='250' text-anchor='middle' font-family='Arial' font-size='16' fill='%236b7280'%3EAlex is acting...%3C/text%3E%3Crect x='100' y='320' width='150' height='100' rx='10' fill='%23374151'/%3E%3Ccircle cx='175' cy='350' r='15' fill='%23f3f4f6'/%3E%3Ccircle cx='170' cy='345' r='2' fill='%23374151'/%3E%3Ccircle cx='180' cy='345' r='2' fill='%23374151'/%3E%3Cpath d='M165 355 Q175 365 185 355' stroke='%23374151' stroke-width='1' fill='none'/%3E%3Ctext x='175' y='390' text-anchor='middle' font-family='Arial' font-size='12' fill='%23f9fafb'%3EAlex%3C/text%3E%3Ctext x='175' y='405' text-anchor='middle' font-family='Arial' font-size='10' fill='%2310b981'%3E●%3C/text%3E%3Crect x='270' y='320' width='150' height='100' rx='10' fill='%23374151'/%3E%3Ccircle cx='345' cy='350' r='15' fill='%23f3f4f6'/%3E%3Ccircle cx='340' cy='345' r='2' fill='%23374151'/%3E%3Ccircle cx='350' cy='345' r='2' fill='%23374151'/%3E%3Cpath d='M335 355 Q345 365 355 355' stroke='%23374151' stroke-width='1' fill='none'/%3E%3Ctext x='345' y='390' text-anchor='middle' font-family='Arial' font-size='12' fill='%23f9fafb'%3ESarah%3C/text%3E%3Ctext x='345' y='405' text-anchor='middle' font-family='Arial' font-size='10' fill='%2310b981'%3E●%3C/text%3E%3Crect x='440' y='320' width='150' height='100' rx='10' fill='%23374151'/%3E%3Ccircle cx='515' cy='350' r='15' fill='%23f3f4f6'/%3E%3Ccircle cx='510' cy='345' r='2' fill='%23374151'/%3E%3Ccircle cx='520' cy='345' r='2' fill='%23374151'/%3E%3Cpath d='M505 355 Q515 365 525 355' stroke='%23374151' stroke-width='1' fill='none'/%3E%3Ctext x='515' y='390' text-anchor='middle' font-family='Arial' font-size='12' fill='%23f9fafb'%3EMike%3C/text%3E%3Ctext x='515' y='405' text-anchor='middle' font-family='Arial' font-size='10' fill='%2310b981'%3E●%3C/text%3E%3Crect x='250' y='450' width='100' height='40' rx='20' fill='%2310b981'/%3E%3Ctext x='300' y='475' text-anchor='middle' font-family='Arial' font-size='16' fill='white'%3EGuess!%3C/text%3E%3Crect x='370' y='450' width='100' height='40' rx='20' fill='%23ef4444'/%3E%3Ctext x='420' y='475' text-anchor='middle' font-family='Arial' font-size='16' fill='white'%3ESkip%3C/text%3E%3C/g%3E%3C/svg%3E",
    ctaText: "Play Now",
    ctaLink: "https://your-charades-game-link.com",
    content: () => (
      <p>
        A multiplayer online dumb-charades game with live camera and timed rounds.
        Built using <strong>WebRTC</strong>, <strong>React</strong>, and <strong>Socket.IO</strong>.
      </p>
    ),
  },
  {
    description: "Virtual office simulation",
    title: "Workplace Simulator",
    src: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'%3E%3Cdefs%3E%3ClinearGradient id='officeBg' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%2306b6d4'/%3E%3Cstop offset='100%25' style='stop-color:%2310b981'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='800' height='600' fill='url(%23officeBg)'/%3E%3Cg transform='translate(50,50)'%3E%3Crect x='0' y='0' width='700' height='500' rx='20' fill='white' opacity='0.95'/%3E%3Ctext x='350' y='40' text-anchor='middle' font-family='Arial' font-size='24' font-weight='bold' fill='%2306b6d4'%3EVirtual Office%3C/text%3E%3Crect x='30' y='60' width='200' height='150' rx='10' fill='%23f1f5f9' stroke='%23cbd5e1' stroke-width='2'/%3E%3Ctext x='130' y='85' text-anchor='middle' font-family='Arial' font-size='16' font-weight='bold' fill='%23475569'%3EMeeting Room A%3C/text%3E%3Ccircle cx='80' cy='120' r='20' fill='%2310b981'/%3E%3Ctext x='80' y='128' text-anchor='middle' font-family='Arial' font-size='16' fill='white'%3EJ%3C/text%3E%3Ccircle cx='130' cy='120' r='20' fill='%233b82f6'/%3E%3Ctext x='130' y='128' text-anchor='middle' font-family='Arial' font-size='16' fill='white'%3ES%3C/text%3E%3Ccircle cx='180' cy='120' r='20' fill='%23ef4444'/%3E%3Ctext x='180' y='128' text-anchor='middle' font-family='Arial' font-size='16' fill='white'%3EM%3C/text%3E%3Ctext x='130' y='180' text-anchor='middle' font-family='Arial' font-size='12' fill='%236b7280'%3E3 people in meeting%3C/text%3E%3Crect x='250' y='60' width='200' height='150' rx='10' fill='%23f8fafc' stroke='%23e2e8f0' stroke-width='2'/%3E%3Ctext x='350' y='85' text-anchor='middle' font-family='Arial' font-size='16' font-weight='bold' fill='%23475569'%3EOpen Workspace%3C/text%3E%3Crect x='270' y='100' width='40' height='30' rx='5' fill='%2310b981'/%3E%3Ctext x='290' y='120' text-anchor='middle' font-family='Arial' font-size='10' fill='white'%3EA%3C/text%3E%3Crect x='320' y='100' width='40' height='30' rx='5' fill='%23f59e0b'/%3E%3Ctext x='340' y='120' text-anchor='middle' font-family='Arial' font-size='10' fill='white'%3EB%3C/text%3E%3Crect x='370' y='100' width='40' height='30' rx='5' fill='%236b7280'/%3E%3Ctext x='390' y='120' text-anchor='middle' font-family='Arial' font-size='10' fill='white'%3EC%3C/text%3E%3Crect x='270' y='140' width='40' height='30' rx='5' fill='%23ef4444'/%3E%3Ctext x='290' y='160' text-anchor='middle' font-family='Arial' font-size='10' fill='white'%3ED%3C/text%3E%3Crect x='320' y='140' width='40' height='30' rx='5' fill='%238b5cf6'/%3E%3Ctext x='340' y='160' text-anchor='middle' font-family='Arial' font-size='10' fill='white'%3EE%3C/text%3E%3Crect x='370' y='140' width='40' height='30' rx='5' fill='%2306b6d4'/%3E%3Ctext x='390' y='160' text-anchor='middle' font-family='Arial' font-size='10' fill='white'%3EF%3C/text%3E%3Ctext x='350' y='195' text-anchor='middle' font-family='Arial' font-size='12' fill='%236b7280'%3E6 desks available%3C/text%3E%3Crect x='470' y='60' width='200' height='150' rx='10' fill='%23fef3c7' stroke='%23f59e0b' stroke-width='2'/%3E%3Ctext x='570' y='85' text-anchor='middle' font-family='Arial' font-size='16' font-weight='bold' fill='%23451a03'%3ECoffee Corner%3C/text%3E%3Ctext x='570' y='120' text-anchor='middle' font-family='Arial' font-size='32' fill='%23f59e0b'%3E☕%3C/text%3E%3Ctext x='570' y='155' text-anchor='middle' font-family='Arial' font-size='14' fill='%23451a03'%3ECasual chat zone%3C/text%3E%3Ctext x='570' y='180' text-anchor='middle' font-family='Arial' font-size='12' fill='%236b7280'%3E2 people chatting%3C/text%3E%3Crect x='50' y='240' width='600' height='60' rx='10' fill='%23f1f5f9'/%3E%3Ctext x='80' y='265' font-family='Arial' font-size='14' font-weight='bold' fill='%23334155'%3ETeam Status:%3C/text%3E%3Ccircle cx='80' cy='285' r='5' fill='%2310b981'/%3E%3Ctext x='95' y='290' font-family='Arial' font-size='12' fill='%23475569'%3EAvailable (8)%3C/text%3E%3Ccircle cx='200' cy='285' r='5' fill='%23f59e0b'/%3E%3Ctext x='215' y='290' font-family='Arial' font-size='12' fill='%23475569'%3EBusy (3)%3C/text%3E%3Ccircle cx='300' cy='285' r='5' fill='%23ef4444'/%3E%3Ctext x='315' y='290' font-family='Arial' font-size='12' fill='%23475569'%3EIn Meeting (5)%3C/text%3E%3Ccircle cx='450' cy='285' r='5' fill='%236b7280'/%3E%3Ctext x='465' y='290' font-family='Arial' font-size='12' fill='%23475569'%3EAway (2)%3C/text%3E%3Crect x='200' y='330' width='120' height='40' rx='20' fill='%2310b981'/%3E%3Ctext x='260' y='355' text-anchor='middle' font-family='Arial' font-size='14' fill='white'%3EJoin Space%3C/text%3E%3Crect x='340' y='330' width='120' height='40' rx='20' fill='%233b82f6'/%3E%3Ctext x='400' y='355' text-anchor='middle' font-family='Arial' font-size='14' fill='white'%3ECreate Room%3C/text%3E%3C/g%3E%3C/svg%3E",
    ctaText: "Explore",
    ctaLink: "https://your-workplace-sim-link.com",
    content: () => (
      <p>
        A virtual workplace experience simulating real-time team collaboration,
        status updates, and meeting rooms. Built with <strong>Next.js</strong> and <strong>WebRTC</strong>.
      </p>
    ),
  },
];

