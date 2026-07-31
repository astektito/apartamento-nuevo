"use client";

import { useState, useEffect, useRef } from "react";

/* =========================================================
   ✏️  PERSONALIZA AQUÍ (cambia estos textos y ya está)
   ========================================================= */
const CONFIG = {
  paraQuien: "Para Eve 🌼",
  titulo: "¡Felicidades Eve por tu nuevo apartamento!",
  mensaje:
    "Que este nuevo hogar se llene de risas, buenos momentos y muchos recuerdos bonitos. Te lo mereces todo. 💛",
  firma: "Con mucho cariño",

  // 🎵 Música: pon el archivo en public/malibu.mp3 (ver instrucciones del chat)
  musica: "/malibu.mp3",

  // 🖼️ Fotos: pon las imágenes en public/fotos/ y escribe aquí sus nombres.
  //    Ejemplo: fotos: ["foto1.jpg", "foto2.jpg", "foto3.jpg"]
  fotos: ["677b828e-0bb0-41eb-b0b1-527d1f0c04a7.png"],
};
/* ========================================================= */

export default function Home() {
  const [abierto, setAbierto] = useState(false);
  const [sonando, setSonando] = useState(false);
  const [petalos, setPetalos] = useState([]);
  const audioRef = useRef(null);

  // Generar los pétalos que caen (solo en cliente para evitar desajustes)
  useEffect(() => {
    const nuevos = Array.from({ length: 22 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 8,
      duration: 7 + Math.random() * 8,
      size: 14 + Math.random() * 18,
    }));
    setPetalos(nuevos);
  }, []);

  const abrir = () => {
    setAbierto(true);
    // Reproducir música tras el gesto del usuario (permitido por el navegador)
    const audio = audioRef.current;
    if (audio) {
      audio.volume = 0.6;
      audio
        .play()
        .then(() => setSonando(true))
        .catch(() => setSonando(false));
    }
  };

  const toggleMusica = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play().then(() => setSonando(true)).catch(() => {});
    } else {
      audio.pause();
      setSonando(false);
    }
  };

  const Tulipan = ({ clase }) => (
    <div className={`tulipan ${clase}`} aria-hidden="true">
      <div className="bloom">
        <span className="petalo p-izq" />
        <span className="petalo p-cen" />
        <span className="petalo p-der" />
      </div>
      <div className="tallo" />
      <div className="hoja hoja-der" />
      <div className="hoja hoja-izq" />
    </div>
  );

  // Tulipán amarillo pequeño (dibujado) para la lluvia de fondo
  const TulipanMini = ({ size }) => (
    <svg
      width={size}
      height={size * 1.4}
      viewBox="0 0 24 34"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* tallo */}
      <path d="M12 14 V33" stroke="#43a047" strokeWidth="2" strokeLinecap="round" />
      {/* hojas */}
      <path d="M12 24 C7 22 5 26 6 29 C10 29 12 27 12 24 Z" fill="#4caf50" />
      <path d="M12 22 C17 20 19 24 18 27 C14 27 12 25 12 22 Z" fill="#66bb6a" />
      {/* copa del tulipán (3 pétalos) */}
      <path d="M4 8 C4 3 7 1 8 1 C8 6 8 12 6 14 C4 13 4 11 4 8 Z" fill="#f5b400" />
      <path d="M20 8 C20 3 17 1 16 1 C16 6 16 12 18 14 C20 13 20 11 20 8 Z" fill="#f5b400" />
      <path d="M12 1 C9 1 6 3 6 9 C6 12 8 14 12 14 C16 14 18 12 18 9 C18 3 15 1 12 1 Z" fill="#ffd633" />
    </svg>
  );

  return (
    <main className="pantalla">
      {/* Audio (se reproduce al abrir) */}
      <audio ref={audioRef} src={CONFIG.musica} loop preload="auto" />

      {/* Pétalos / flores cayendo de fondo */}
      <div className="lluvia" aria-hidden="true">
        {petalos.map((p) => (
          <span
            key={p.id}
            className="petalo-cae"
            style={{
              left: `${p.left}%`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
            }}
          >
            <TulipanMini size={p.size + 6} />
          </span>
        ))}
      </div>

      {!abierto ? (
        /* ---- Portada: toca para abrir ---- */
        <button className="sobre" onClick={abrir}>
          <div className="sobre-emoji">💌</div>
          <h1 className="sobre-titulo">Una sorpresa para ti</h1>
          <p className="sobre-sub">{CONFIG.paraQuien}</p>
          <span className="toca">Toca para abrir 👆</span>
        </button>
      ) : (
        /* ---- Tarjeta abierta ---- */
        <section className="tarjeta">
          {/* Ramo de tulipanes amarillos */}
          <div className="ramo">
            <Tulipan clase="t-izq" />
            <Tulipan clase="t-cen" />
            <Tulipan clase="t-der" />
          </div>

          <h2 className="titulo">{CONFIG.titulo}</h2>
          <p className="mensaje">{CONFIG.mensaje}</p>

          {/* Galería de fotos (si hay) */}
          {CONFIG.fotos.length > 0 && (
            <div className="galeria">
              {CONFIG.fotos.map((f, i) => (
                <img
                  key={i}
                  src={`/fotos/${f}`}
                  alt={`Recuerdo ${i + 1}`}
                  className="foto"
                  loading="lazy"
                />
              ))}
            </div>
          )}

          <p className="firma">
            {CONFIG.firma} <span className="corazon">💛</span>
          </p>
        </section>
      )}

      {/* Botón de música */}
      {abierto && (
        <button className="btn-musica" onClick={toggleMusica} title="Música">
          {sonando ? "🔊" : "🔇"}
        </button>
      )}
    </main>
  );
}
