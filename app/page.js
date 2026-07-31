"use client";

import { useState, useEffect } from "react";

/* =========================================================
   ✏️  PERSONALIZA AQUÍ (cambia estos textos y ya está)
   ========================================================= */
const CONFIG = {
  paraQuien: "Para ti 🌻",
  titulo: "¡Felicidades por tu nuevo apartamento!",
  mensaje:
    "Que este nuevo hogar se llene de risas, buenos momentos y muchos recuerdos bonitos. Te lo mereces todo. 💛",
  firma: "Con mucho cariño",
};
// 👆 Si quieres cambiar el nombre o el mensaje, edita las líneas de arriba.
/* ========================================================= */

export default function Home() {
  const [abierto, setAbierto] = useState(false);
  const [petalos, setPetalos] = useState([]);

  // Generar los pétalos que caen (solo en cliente para evitar desajustes)
  useEffect(() => {
    const nuevos = Array.from({ length: 22 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 8,
      duration: 7 + Math.random() * 8,
      size: 14 + Math.random() * 18,
      emoji: Math.random() > 0.5 ? "🌻" : "🌼",
    }));
    setPetalos(nuevos);
  }, []);

  return (
    <main className="pantalla">
      {/* Pétalos / flores cayendo de fondo */}
      <div className="lluvia" aria-hidden="true">
        {petalos.map((p) => (
          <span
            key={p.id}
            className="petalo"
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
        <button className="sobre" onClick={() => setAbierto(true)}>
          <div className="sobre-emoji">💌</div>
          <h1 className="sobre-titulo">Una sorpresa para ti</h1>
          <p className="sobre-sub">{CONFIG.paraQuien}</p>
          <span className="toca">Toca para abrir 👆</span>
        </button>
      ) : (
        /* ---- Tarjeta abierta ---- */
        <section className="tarjeta">
          {/* Flor amarilla animada (hecha con CSS) */}
          <div className="flor" aria-hidden="true">
            <div className="tallo" />
            <div className="hoja hoja-izq" />
            <div className="hoja hoja-der" />
            <div className="cabeza">
              <div className="centro" />
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="petalo-flor"
                  style={{ transform: `rotate(${i * 30}deg)` }}
                />
              ))}
            </div>
          </div>

          <h2 className="titulo">{CONFIG.titulo}</h2>
          <p className="mensaje">{CONFIG.mensaje}</p>
          <p className="firma">
            {CONFIG.firma} <span className="corazon">💛</span>
          </p>
        </section>
      )}
    </main>
  );
}
