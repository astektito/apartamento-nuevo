"use client";

import { useState, useEffect, useRef } from "react";

/* =========================================================
   ✏️  PERSONALIZA AQUÍ (cambia estos textos y ya está)
   ========================================================= */
const CONFIG = {
  paraQuien: "Para Eve",
  titulo: "¡Felicidades Eve por tu nuevo apartamento!",
  mensaje:
    "Que este nuevo hogar se llene de risas, buenos momentos y muchos recuerdos bonitos. Te lo mereces todo. 💛",
  firma: "Con mucho cariño",

  // 🎵 Música: pon el archivo en public/malibu.mp3 (ver instrucciones del chat)
  musica: "/malibu.mp3",

  // 🖼️ Fotos: pon las imágenes en public/fotos/ y escribe aquí sus nombres.
  //    Ejemplo: fotos: ["foto1.jpg", "foto2.jpg", "foto3.jpg"]
  fotos: ["677b828e-0bb0-41eb-b0b1-527d1f0c04a7.png"],

  // 🎁 Cuponera: imagen de portada (en public/fotos/) y los cupones a reclamar.
  cuponeraPortada: "cuponera.png",
  cupones: [
    { emoji: "🎬", titulo: "Ir al cine" },
    { emoji: "🍣", titulo: "Ir por sushi" },
    { emoji: "🍢", titulo: "Ir a Malchingi" },
    { emoji: "👗", titulo: "Un vestido amarillo nuevo" },
    { emoji: "✨", titulo: "Cumplir un deseo" },
    { emoji: "🌆", titulo: "Una tarde en el centro" },
  ],
};
/* ========================================================= */

// Clave donde se guardan los cupones ya reclamados (persisten al recargar)
const CUPONES_STORAGE_KEY = "cupones-reclamados";

/* Parámetros de la lluvia de pétalos/flores del fondo */
const PETALOS_CANTIDAD = 22; // número de flores que caen
const PETALOS_DELAY_MAX = 8; // retardo máximo de inicio (s)
const PETALOS_DURACION_MIN = 7; // duración mínima de caída (s)
const PETALOS_DURACION_EXTRA = 8; // duración extra aleatoria (s)
const PETALOS_TAMANO_MIN = 14; // tamaño mínimo (px)
const PETALOS_TAMANO_EXTRA = 18; // tamaño extra aleatorio (px)

/* Estallido de corazoncitos al tocar el corazón secreto 💛 */
const ESTALLIDO_CANTIDAD = 14; // corazoncitos que salen disparados
const ESTALLIDO_EMOJIS = ["💛", "💖", "✨", "🧡", "💫"];
const ESTALLIDO_DURACION_MS = 900; // cuánto tarda en desaparecer y salir el botón

/* Hada que cruza al reclamar un cupón */
const HADA_DURACION_MS = 3200; // cuánto se ve el hada antes de irse
const ORDINALES = [
  "primer",
  "segundo",
  "tercer",
  "cuarto",
  "quinto",
  "sexto",
  "séptimo",
  "octavo",
  "noveno",
  "décimo",
];

export default function Home() {
  const [abierto, setAbierto] = useState(false);
  const [sonando, setSonando] = useState(false);
  const [petalos, setPetalos] = useState([]);
  const [cuponeraAbierta, setCuponeraAbierta] = useState(false);
  // El botón de la cuponera está oculto hasta tocar el corazón secreto 💛
  const [regaloRevelado, setRegaloRevelado] = useState(false);
  // Corazoncitos que estallan al tocar el corazón secreto
  const [estallido, setEstallido] = useState([]);
  const [reclamados, setReclamados] = useState([]);
  // Hada que cruza la pantalla al reclamar/soltar un cupón
  const [hada, setHada] = useState(null);
  const hadaTimeout = useRef(null);
  const audioRef = useRef(null);

  // Cargar los cupones ya reclamados. Primero se pintan al instante los que
  // haya en localStorage (respuesta inmediata), y en seguida se pide al
  // servidor el estado real y compartido entre todos los dispositivos.
  useEffect(() => {
    try {
      const guardado = localStorage.getItem(CUPONES_STORAGE_KEY);
      if (guardado) setReclamados(JSON.parse(guardado));
    } catch {
      // Si localStorage no está disponible, simplemente empieza vacío
    }

    let vigente = true;
    fetch("/api/cupones")
      .then((r) => (r.ok ? r.json() : null))
      .then((datos) => {
        if (!vigente || !datos || !Array.isArray(datos.reclamados)) return;
        setReclamados(datos.reclamados);
        try {
          localStorage.setItem(
            CUPONES_STORAGE_KEY,
            JSON.stringify(datos.reclamados)
          );
        } catch {}
      })
      .catch(() => {
        // Sin conexión con el servidor: seguimos con lo de localStorage
      });

    return () => {
      vigente = false;
    };
  }, []);

  // Muestra al hada cruzando la pantalla con un mensaje. La dirección alterna
  // en cada reclamo (ida →, vuelta ←) para dar variedad.
  const volarHada = (mensaje, direccion) => {
    if (hadaTimeout.current) clearTimeout(hadaTimeout.current);
    // La key fuerza a React a reiniciar la animación si se reclama seguido.
    setHada((prev) => ({ mensaje, direccion, key: (prev?.key ?? 0) + 1 }));
    hadaTimeout.current = setTimeout(() => setHada(null), HADA_DURACION_MS);
  };

  const reclamarCupon = (indice) => {
    if (reclamados.includes(indice)) return;

    // Actualización optimista: se marca al instante para que se sienta ágil.
    const actualizado = [...reclamados, indice];
    setReclamados(actualizado);
    try {
      localStorage.setItem(CUPONES_STORAGE_KEY, JSON.stringify(actualizado));
    } catch {
      // Ignorar si no se puede guardar
    }

    // El hada cruza anunciando el logro
    const cuantos = actualizado.length;
    const ordinal = ORDINALES[cuantos - 1] ?? `${cuantos}º`;
    const mensaje =
      cuantos === CONFIG.cupones.length
        ? "¡Reclamaste todos tus cupones! 🎉"
        : `¡Reclamaste tu ${ordinal} cupón! ✨`;
    volarHada(mensaje, cuantos % 2 === 1 ? "ida" : "vuelta");

    // Guardar en el servidor para que se comparta entre dispositivos.
    fetch("/api/cupones", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ indice }),
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((datos) => {
        if (!datos || !Array.isArray(datos.reclamados)) return;
        setReclamados(datos.reclamados);
        try {
          localStorage.setItem(
            CUPONES_STORAGE_KEY,
            JSON.stringify(datos.reclamados)
          );
        } catch {}
      })
      .catch(() => {
        // Sin conexión: queda guardado en localStorage y se sincroniza luego
      });
  };

  // Toca el corazón secreto: estalla en corazoncitos y luego aparece el botón
  const revelarRegalo = () => {
    if (regaloRevelado) return;
    const chispas = Array.from({ length: ESTALLIDO_CANTIDAD }, (_, i) => {
      const angulo = (360 / ESTALLIDO_CANTIDAD) * i + Math.random() * 20;
      const distancia = 70 + Math.random() * 60; // px que recorre
      const rad = (angulo * Math.PI) / 180;
      return {
        id: i,
        emoji:
          ESTALLIDO_EMOJIS[Math.floor(Math.random() * ESTALLIDO_EMOJIS.length)],
        dx: Math.cos(rad) * distancia,
        dy: Math.sin(rad) * distancia,
        delay: Math.random() * 120, // ms
        size: 16 + Math.random() * 16,
      };
    });
    setEstallido(chispas);
    setRegaloRevelado(true);
    // Limpia los corazoncitos cuando termina la animación
    setTimeout(() => setEstallido([]), ESTALLIDO_DURACION_MS);
  };

  // Generar los pétalos que caen (solo en cliente para evitar desajustes)
  useEffect(() => {
    const nuevos = Array.from({ length: PETALOS_CANTIDAD }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * PETALOS_DELAY_MAX,
      duration: PETALOS_DURACION_MIN + Math.random() * PETALOS_DURACION_EXTRA,
      size: PETALOS_TAMANO_MIN + Math.random() * PETALOS_TAMANO_EXTRA,
      tipo: Math.random() > 0.5 ? "girasol" : "tulipan",
    }));
    setPetalos(nuevos);
  }, []);

  // Al desmontar, cancela el temporizador pendiente del hada
  useEffect(() => {
    return () => {
      if (hadaTimeout.current) clearTimeout(hadaTimeout.current);
    };
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
      <audio ref={audioRef} src={CONFIG.musica} loop preload="none" />

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
              fontSize: `${p.size + 8}px`,
            }}
          >
            {p.tipo === "girasol" ? "🌻" : <TulipanMini size={p.size + 6} />}
          </span>
        ))}
      </div>

      {!abierto ? (
        /* ---- Portada: toca para abrir ---- */
        <button className="sobre" onClick={abrir}>
          <div className="sobre-emoji">💌</div>
          <h1 className="sobre-titulo">Una sorpresa para ti</h1>
          <p className="sobre-sub">
            {CONFIG.paraQuien}
            <span className="tulipan-inline">
              <TulipanMini size={20} />
            </span>
          </p>
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
            {CONFIG.firma}{" "}
            <span className="corazon-envoltura">
              <button
                type="button"
                className={`corazon corazon-secreto${
                  regaloRevelado ? " corazon-usado" : ""
                }`}
                onClick={revelarRegalo}
                aria-label={
                  regaloRevelado
                    ? "Corazón"
                    : "Toca el corazón, hay una sorpresa"
                }
              >
                💛
              </button>

              {/* Estallido de corazoncitos al tocar el corazón */}
              {estallido.map((c) => (
                <span
                  key={c.id}
                  className="chispa"
                  aria-hidden="true"
                  style={{
                    "--dx": `${c.dx}px`,
                    "--dy": `${c.dy}px`,
                    fontSize: `${c.size}px`,
                    animationDelay: `${c.delay}ms`,
                  }}
                >
                  {c.emoji}
                </span>
              ))}
            </span>
          </p>

          {/* Botón secreto: aparece solo al tocar el corazón 💛 */}
          {regaloRevelado && (
            <button
              className="btn-cuponera btn-cuponera-sorpresa"
              onClick={() => setCuponeraAbierta(true)}
            >
              🎁 Abrir tu cuponera
            </button>
          )}
        </section>
      )}

      {/* ---- Modal de la cuponera ---- */}
      {cuponeraAbierta && (
        <div
          className="cuponera-fondo"
          onClick={() => setCuponeraAbierta(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Cuponera de regalos"
        >
          <div className="cuponera" onClick={(e) => e.stopPropagation()}>
            <button
              className="cuponera-cerrar"
              onClick={() => setCuponeraAbierta(false)}
              aria-label="Cerrar cuponera"
            >
              ✕
            </button>

            <img
              src={`/fotos/${CONFIG.cuponeraPortada}`}
              alt="Cuponera"
              className="cuponera-portada"
              loading="lazy"
            />

            <h2 className="cuponera-titulo">Tu cuponera 💛</h2>
            <p className="cuponera-sub">
              Reclama cada cupón cuando quieras. Puedo cumplirlos todos. ✨
            </p>

            <div className="cupones">
              {CONFIG.cupones.map((c, i) => {
                const reclamado = reclamados.includes(i);
                return (
                  <div
                    key={i}
                    className={`cupon ${reclamado ? "cupon-usado" : ""}`}
                  >
                    <span className="cupon-emoji" aria-hidden="true">
                      {c.emoji}
                    </span>
                    <span className="cupon-titulo">{c.titulo}</span>
                    <button
                      className="cupon-btn"
                      onClick={() => reclamarCupon(i)}
                      disabled={reclamado}
                    >
                      {reclamado ? "Reclamado ✓" : "Reclamar"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Hada que cruza la pantalla al reclamar un cupón */}
      {hada && (
        <div
          key={hada.key}
          className={`hada-vuelo hada-${hada.direccion}`}
          role="status"
          aria-live="polite"
        >
          <span className="hada-emoji" aria-hidden="true">
            🧚‍♀️
          </span>
          <span className="hada-estela" aria-hidden="true">
            ✨💫⭐️
          </span>
          <span className="hada-mensaje">{hada.mensaje}</span>
        </div>
      )}

      {/* Botón de música */}
      {abierto && (
        <button
          className="btn-musica"
          onClick={toggleMusica}
          title="Música"
          aria-label={sonando ? "Silenciar música" : "Activar música"}
        >
          {sonando ? "🔊" : "🔇"}
        </button>
      )}
    </main>
  );
}
