"use client";

import { useState, useEffect, useRef } from "react";

interface PupilProps {
  size?: number;
  maxDistance?: number;
  pupilColor?: string;
  forceLookX?: number;
  forceLookY?: number;
}

const Pupil = ({
  size = 12,
  maxDistance = 5,
  pupilColor = "black",
  forceLookX,
  forceLookY,
}: PupilProps) => {
  const [mouseX, setMouseX] = useState<number>(0);
  const [mouseY, setMouseY] = useState<number>(0);
  const pupilRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouseX(e.clientX);
      setMouseY(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const calculatePupilPosition = () => {
    if (!pupilRef.current) return { x: 0, y: 0 };
    if (forceLookX !== undefined && forceLookY !== undefined) {
      return { x: forceLookX, y: forceLookY };
    }
    const pupil = pupilRef.current.getBoundingClientRect();
    const pupilCenterX = pupil.left + pupil.width / 2;
    const pupilCenterY = pupil.top + pupil.height / 2;
    const deltaX = mouseX - pupilCenterX;
    const deltaY = mouseY - pupilCenterY;
    const distance = Math.min(Math.sqrt(deltaX ** 2 + deltaY ** 2), maxDistance);
    const angle = Math.atan2(deltaY, deltaX);
    return { x: Math.cos(angle) * distance, y: Math.sin(angle) * distance };
  };

  const pos = calculatePupilPosition();

  return (
    <div
      ref={pupilRef}
      className="rounded-full"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: pupilColor,
        transform: `translate(${pos.x}px, ${pos.y}px)`,
        transition: "transform 0.1s ease-out",
      }}
    />
  );
};

interface EyeBallProps {
  size?: number;
  pupilSize?: number;
  maxDistance?: number;
  eyeColor?: string;
  pupilColor?: string;
  isBlinking?: boolean;
  forceLookX?: number;
  forceLookY?: number;
}

const EyeBall = ({
  size = 48,
  pupilSize = 16,
  maxDistance = 10,
  eyeColor = "white",
  pupilColor = "black",
  isBlinking = false,
  forceLookX,
  forceLookY,
}: EyeBallProps) => {
  const [mouseX, setMouseX] = useState<number>(0);
  const [mouseY, setMouseY] = useState<number>(0);
  const eyeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouseX(e.clientX);
      setMouseY(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const calculatePupilPosition = () => {
    if (!eyeRef.current) return { x: 0, y: 0 };
    if (forceLookX !== undefined && forceLookY !== undefined) {
      return { x: forceLookX, y: forceLookY };
    }
    const eye = eyeRef.current.getBoundingClientRect();
    const eyeCenterX = eye.left + eye.width / 2;
    const eyeCenterY = eye.top + eye.height / 2;
    const deltaX = mouseX - eyeCenterX;
    const deltaY = mouseY - eyeCenterY;
    const distance = Math.min(Math.sqrt(deltaX ** 2 + deltaY ** 2), maxDistance);
    const angle = Math.atan2(deltaY, deltaX);
    return { x: Math.cos(angle) * distance, y: Math.sin(angle) * distance };
  };

  const pos = calculatePupilPosition();

  return (
    <div
      ref={eyeRef}
      className="rounded-full flex items-center justify-center transition-all duration-150"
      style={{
        width: `${size}px`,
        height: isBlinking ? "3px" : `${size}px`,
        backgroundColor: eyeColor,
        overflow: "hidden",
      }}
    >
      {!isBlinking && (
        <div
          className="rounded-full"
          style={{
            width: `${pupilSize}px`,
            height: `${pupilSize}px`,
            backgroundColor: pupilColor,
            transform: `translate(${pos.x}px, ${pos.y}px)`,
            transition: "transform 0.1s ease-out",
          }}
        />
      )}
    </div>
  );
};

interface AnimatedCharactersProps {
  isTyping?: boolean;
  password?: string;
  showPassword?: boolean;
  scale?: number;
}

export function AnimatedCharacters({
  isTyping = false,
  password = "",
  showPassword = false,
  scale = 1,
}: AnimatedCharactersProps) {
  const [mouseX, setMouseX] = useState<number>(0);
  const [mouseY, setMouseY] = useState<number>(0);
  const [isPurpleBlinking, setIsPurpleBlinking] = useState(false);
  const [isBlackBlinking, setIsBlackBlinking] = useState(false);
  const [isLookingAtEachOther, setIsLookingAtEachOther] = useState(false);
  const [isPurplePeeking, setIsPurplePeeking] = useState(false);
  const purpleRef = useRef<HTMLDivElement>(null);
  const blackRef = useRef<HTMLDivElement>(null);
  const yellowRef = useRef<HTMLDivElement>(null);
  const orangeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouseX(e.clientX);
      setMouseY(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const schedule = () => {
      const t = setTimeout(() => {
        setIsPurpleBlinking(true);
        setTimeout(() => { setIsPurpleBlinking(false); schedule(); }, 150);
      }, Math.random() * 4000 + 3000);
      return t;
    };
    const t = schedule();
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const schedule = () => {
      const t = setTimeout(() => {
        setIsBlackBlinking(true);
        setTimeout(() => { setIsBlackBlinking(false); schedule(); }, 150);
      }, Math.random() * 4000 + 3000);
      return t;
    };
    const t = schedule();
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (isTyping) {
      setIsLookingAtEachOther(true);
      const timer = setTimeout(() => setIsLookingAtEachOther(false), 800);
      return () => clearTimeout(timer);
    } else {
      setIsLookingAtEachOther(false);
    }
  }, [isTyping]);

  useEffect(() => {
    if (password.length > 0 && showPassword) {
      const t = setTimeout(() => {
        setIsPurplePeeking(true);
        setTimeout(() => setIsPurplePeeking(false), 800);
      }, Math.random() * 3000 + 2000);
      return () => clearTimeout(t);
    } else {
      setIsPurplePeeking(false);
    }
  }, [password, showPassword, isPurplePeeking]);

  const calcPos = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (!ref.current) return { faceX: 0, faceY: 0, bodySkew: 0 };
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 3;
    const dx = mouseX - cx;
    const dy = mouseY - cy;
    return {
      faceX: Math.max(-11, Math.min(11, dx / 24)),
      faceY: Math.max(-8, Math.min(8, dy / 36)),
      bodySkew: Math.max(-4, Math.min(4, -dx / 150)),
    };
  };

  const pp = calcPos(purpleRef);
  const bp = calcPos(blackRef);
  const yp = calcPos(yellowRef);
  const op = calcPos(orangeRef);

  const hiding = password.length > 0 && showPassword;
  const active = isTyping || (password.length > 0 && !showPassword);

  return (
    <div className="relative w-full h-full overflow-hidden">
      <div
        className="absolute inset-0 origin-bottom transition-transform duration-500"
        style={{ transform: `scale(${scale})` }}
      >
      {/* Purple — tall back */}
      <div
        ref={purpleRef}
        className="absolute bottom-0 transition-all duration-700 ease-in-out"
        style={{
          left: "12%",
          width: "28%",
          height: active ? "95%" : "85%",
          backgroundColor: "#6C3FF5",
          borderRadius: "14px 14px 0 0",
          zIndex: 1,
          transform: hiding
            ? "skewX(0deg)"
            : active
              ? `skewX(${(pp.bodySkew || 0) - 12}deg) translateX(40px)`
              : `skewX(${pp.bodySkew || 0}deg)`,
          transformOrigin: "bottom center",
        }}
      >
        <div
          className="absolute flex gap-[30%] transition-all duration-700 ease-in-out"
          style={{
            left: hiding ? "12%" : isLookingAtEachOther ? "30%" : `${25 + pp.faceX}%`,
            top: hiding ? "8%" : isLookingAtEachOther ? "14%" : `${10 + pp.faceY}%`,
          }}
        >
          <EyeBall size={24} pupilSize={9} maxDistance={6} eyeColor="white" pupilColor="#2D2D2D" isBlinking={isPurpleBlinking}
            forceLookX={hiding ? (isPurplePeeking ? 4 : -4) : isLookingAtEachOther ? 3 : undefined}
            forceLookY={hiding ? (isPurplePeeking ? 5 : -4) : isLookingAtEachOther ? 4 : undefined}
          />
          <EyeBall size={24} pupilSize={9} maxDistance={6} eyeColor="white" pupilColor="#2D2D2D" isBlinking={isPurpleBlinking}
            forceLookX={hiding ? (isPurplePeeking ? 4 : -4) : isLookingAtEachOther ? 3 : undefined}
            forceLookY={hiding ? (isPurplePeeking ? 5 : -4) : isLookingAtEachOther ? 4 : undefined}
          />
        </div>
      </div>

      {/* Black — medium middle */}
      <div
        ref={blackRef}
        className="absolute bottom-0 transition-all duration-700 ease-in-out"
        style={{
          left: "38%",
          width: "20%",
          height: "68%",
          backgroundColor: "#2D2D2D",
          borderRadius: "12px 12px 0 0",
          zIndex: 2,
          transform: hiding
            ? "skewX(0deg)"
            : isLookingAtEachOther
              ? `skewX(${(bp.bodySkew || 0) * 1.5 + 10}deg) translateX(20px)`
              : active
                ? `skewX(${(bp.bodySkew || 0) * 1.5}deg)`
                : `skewX(${bp.bodySkew || 0}deg)`,
          transformOrigin: "bottom center",
        }}
      >
        <div
          className="absolute flex gap-[28%] transition-all duration-700 ease-in-out"
          style={{
            left: hiding ? "10%" : isLookingAtEachOther ? "28%" : `${22 + bp.faceX}%`,
            top: hiding ? "9%" : isLookingAtEachOther ? "5%" : `${10 + bp.faceY}%`,
          }}
        >
          <EyeBall size={20} pupilSize={7} maxDistance={5} eyeColor="white" pupilColor="#2D2D2D" isBlinking={isBlackBlinking}
            forceLookX={hiding ? -4 : isLookingAtEachOther ? 0 : undefined}
            forceLookY={hiding ? -4 : isLookingAtEachOther ? -4 : undefined}
          />
          <EyeBall size={20} pupilSize={7} maxDistance={5} eyeColor="white" pupilColor="#2D2D2D" isBlinking={isBlackBlinking}
            forceLookX={hiding ? -4 : isLookingAtEachOther ? 0 : undefined}
            forceLookY={hiding ? -4 : isLookingAtEachOther ? -4 : undefined}
          />
        </div>
      </div>

      {/* Orange — semi-circle front left */}
      <div
        ref={orangeRef}
        className="absolute bottom-0 transition-all duration-700 ease-in-out"
        style={{
          left: "0%",
          width: "38%",
          height: "45%",
          zIndex: 3,
          backgroundColor: "#FF9B6B",
          borderRadius: "50% 50% 0 0",
          transform: hiding ? "skewX(0deg)" : `skewX(${op.bodySkew || 0}deg)`,
          transformOrigin: "bottom center",
        }}
      >
        <div
          className="absolute flex gap-[18%] transition-all duration-200 ease-out"
          style={{
            left: hiding ? "28%" : `${36 + (op.faceX || 0)}%`,
            top: hiding ? "42%" : `${45 + (op.faceY || 0)}%`,
          }}
        >
          <Pupil size={16} maxDistance={6} pupilColor="#2D2D2D" forceLookX={hiding ? -5 : undefined} forceLookY={hiding ? -4 : undefined} />
          <Pupil size={16} maxDistance={6} pupilColor="#2D2D2D" forceLookX={hiding ? -5 : undefined} forceLookY={hiding ? -4 : undefined} />
        </div>
      </div>

      {/* Yellow — rounded front right */}
      <div
        ref={yellowRef}
        className="absolute bottom-0 transition-all duration-700 ease-in-out"
        style={{
          left: "56%",
          width: "24%",
          height: "52%",
          backgroundColor: "#E8D754",
          borderRadius: "50% 50% 0 0",
          zIndex: 4,
          transform: hiding ? "skewX(0deg)" : `skewX(${yp.bodySkew || 0}deg)`,
          transformOrigin: "bottom center",
        }}
      >
        <div
          className="absolute flex gap-[22%] transition-all duration-200 ease-out"
          style={{
            left: hiding ? "18%" : `${32 + (yp.faceX || 0)}%`,
            top: hiding ? "16%" : `${20 + (yp.faceY || 0)}%`,
          }}
        >
          <Pupil size={16} maxDistance={6} pupilColor="#2D2D2D" forceLookX={hiding ? -5 : undefined} forceLookY={hiding ? -4 : undefined} />
          <Pupil size={16} maxDistance={6} pupilColor="#2D2D2D" forceLookX={hiding ? -5 : undefined} forceLookY={hiding ? -4 : undefined} />
        </div>
        {/* Mouth */}
        <div
          className="absolute w-[55%] h-[5px] bg-[#2D2D2D] rounded-full transition-all duration-200 ease-out"
          style={{
            left: hiding ? "12%" : `${24 + (yp.faceX || 0)}%`,
            top: hiding ? "50%" : `${48 + (yp.faceY || 0)}%`,
          }}
        />
      </div>
      </div>
    </div>
  );
}

export default AnimatedCharacters;
