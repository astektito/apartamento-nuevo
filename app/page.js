"use client";

import { useState, useEffect, useRef } from "react";

/* =========================================================
   ✏️  PERSONALIZA AQUÍ (cambia estos textos y ya está)
   ========================================================= */
const CONFIG = {
  paraQuien: "Para Eve 🌷",
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
      emoji: Math.random() > 0.5 ? "🌷" : "🌼",
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
              fontSize: `${p.size}px`,
            }}
          >
            {p.emoji}
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
