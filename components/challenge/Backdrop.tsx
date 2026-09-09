/**
 * Layered backdrop for the challenge environment.
 *
 * Three cheap layers stacked to give the page depth without images:
 * a soft colour mesh, a fine engineering grid, and a film grain that stops
 * the flat black looking like an unstyled page. All are pointer-events-none
 * and render behind everything.
 */
export default function Backdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* base */}
      <div className="absolute inset-0 bg-[#07080a]" />

      {/* colour mesh */}
      <div
        className="absolute inset-0"
        style={{
          background: [
            'radial-gradient(60rem 40rem at 50% -10%, rgba(52,211,153,0.16), transparent 60%)',
            'radial-gradient(40rem 30rem at 90% 10%, rgba(45,212,191,0.10), transparent 60%)',
            'radial-gradient(45rem 35rem at 5% 40%, rgba(59,130,246,0.08), transparent 60%)',
          ].join(','),
        }}
      />

      {/* engineering grid */}
      <div
        className="absolute inset-0 opacity-[0.55]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px),' +
            'linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          maskImage: 'radial-gradient(80rem 60rem at 50% 0%, #000 40%, transparent 85%)',
          WebkitMaskImage: 'radial-gradient(80rem 60rem at 50% 0%, #000 40%, transparent 85%)',
        }}
      />

      {/* film grain */}
      <svg className="absolute inset-0 h-full w-full opacity-[0.16] mix-blend-overlay">
        <filter id="challenge-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#challenge-grain)" />
      </svg>

      {/* vignette */}
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(90rem 70rem at 50% 30%, transparent 40%, rgba(0,0,0,0.65) 100%)' }}
      />
    </div>
  )
}
