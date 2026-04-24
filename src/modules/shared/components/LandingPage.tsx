import Image from "next/image";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-sky-100 p-6 flex items-center justify-center">
      <div className="w-full max-w-6xl rounded-[2rem] bg-white/95 shadow-[0_35px_120px_-50px_rgba(15,23,42,0.45)] backdrop-blur-xl overflow-hidden border border-slate-200">
        <div className="grid gap-8 lg:grid-cols-[1.25fr_0.95fr] p-8 lg:p-12 items-center">
          <div className="space-y-6">
            <span className="inline-flex items-center rounded-full bg-sky-100 px-4 py-2 text-sm font-semibold text-sky-700">
              Rastreos rápidos y claros
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 leading-tight">
              Sigue tu envío en segundos
            </h1>
            <p className="max-w-xl text-slate-600 text-lg leading-8">
              Accede al rastreo sin necesidad de iniciar sesión o entra al panel privado para administrar órdenes, vehículos y conductores.
            </p>
            <div className="grid gap-4 sm:grid-cols-2 sm:items-center">
              <Link
                href="/seguimiento"
                className="inline-flex justify-center rounded-full  bg-blue-600 px-8 py-3 text-base font-semibold text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-700 transition"
              >
                Rastrear Paquete
              </Link>
              <Link
                href="/login"
                className="inline-flex justify-center rounded-full border border-slate-300 bg-white px-8 py-3 text-base font-semibold text-slate-900 hover:bg-slate-50 transition"
              >
                Iniciar Sesión
              </Link>
            </div>
          </div>

          <div className="relative rounded-[2rem] bg-slate-900/5 p-6 sm:p-8">
            <div className="absolute -top-6 right-6 hidden sm:block rounded-full bg-sky-500/10 p-4">
              <div className="h-14 w-14 rounded-full bg-sky-500/20" />
            </div>
            <Image
              src="/globe.svg"
              alt="Ilustración de seguimiento de envíos"
              width={520}
              height={520}
              className="mx-auto max-h-[420px] object-contain"
            />
            <div className="mt-6 rounded-3xl bg-white p-5 shadow-sm border border-slate-200">
              <p className="text-sm font-semibold text-slate-700">Tu envío, siempre visible</p>
              <p className="mt-2 text-sm text-slate-500">
                Introduce tu número de orden y consulta su estado en tiempo real desde la página de seguimiento.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
