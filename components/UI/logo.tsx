export function Logo() {
  return (
    <div className="flex items-center gap-3">
      <svg
        width="42"
        height="42"
        viewBox="0 0 64 64"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="shrink-0 rounded-2xl"
      >
        <defs>
          <linearGradient id="bg" x1="8" y1="8" x2="56" y2="56">
            <stop offset="0%" stopColor="#ec4899" />
            <stop offset="50%" stopColor="#d946ef" />
            <stop offset="100%" stopColor="#38bdf8" />
          </linearGradient>
          <linearGradient id="horn" x1="28" y1="4" x2="36" y2="22">
            <stop offset="0%" stopColor="#fde68a" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
          <linearGradient id="mane" x1="18" y1="20" x2="46" y2="44">
            <stop offset="0%" stopColor="#f9a8d4" />
            <stop offset="50%" stopColor="#f0abfc" />
            <stop offset="100%" stopColor="#93c5fd" />
          </linearGradient>
        </defs>

        <rect x="2" y="2" width="60" height="60" rx="18" fill="url(#bg)" />

        <path
          d="M34 8L39 22L31 20L34 8Z"
          fill="url(#horn)"
          stroke="#451a03"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        <path
          d="M23 22C19 22 15 26 15 31C15 35 17 38 20 40C21 45 25 49 31 49C38 49 44 44 46 37C49 36 51 33 51 29C51 24 47 20 42 20C39 17 35 16 31 16C27 16 24 18 23 22Z"
          fill="url(#mane)"
          opacity="0.95"
        />

        <path
          d="M21 25C24 18 31 16 38 18C44 20 48 25 48 32C48 41 41 48 31 48C24 48 18 43 17 36C16 30 18 27 21 25Z"
          fill="white"
        />

        <path
          d="M22 27C25 23 29 22 34 22H42C45 22 48 24 49 27C50 30 49 34 46 36L42 39C40 40 38 41 35 41H31C27 41 24 40 22 37C19 34 19 30 22 27Z"
          fill="white"
        />

        <path
          d="M42 39C41 44 37 48 31 48C25 48 20 45 18 40C21 42 25 43 30 43H35C38 43 40 42 42 39Z"
          fill="#e2e8f0"
        />

        <path
          d="M41 24C43 25 45 27 46 29C44 29 42 28 40 27L41 24Z"
          fill="#fbcfe8"
        />

        <circle cx="32" cy="31" r="2" fill="#0f172a" />

        <path
          d="M38 35C36 36 34 36.5 31.5 36.5C29 36.5 27 36 25 35"
          stroke="#0f172a"
          strokeWidth="1.8"
          strokeLinecap="round"
        />

        <path
          d="M45 31C47 31 49 32.5 49 35C49 37.5 47 39 44.5 39"
          stroke="white"
          strokeWidth="2.2"
          strokeLinecap="round"
        />

        <path
          d="M20 26C18 28 17 30 17 33C15.5 31.5 15 29 15.5 26.5C16 24 17.5 22 20 21"
          fill="#f5d0fe"
          opacity="0.9"
        />

        <path
          d="M30 18C27 18 24 19 22 21C22 18 24 15 28 14C31 13 35 14 37 17C35 16.3 33 16 30 18Z"
          fill="#ffffff"
          opacity="0.95"
        />
      </svg>

      <span className="bg-gradient-to-r from-fuchsia-300 to-sky-300 bg-clip-text text-lg font-semibold text-transparent">
        CompCF
      </span>
    </div>
  )
}