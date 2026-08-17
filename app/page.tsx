import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
      <span className="font-mono text-xs uppercase tracking-widest text-ink-muted">
        Currículos com ajuda de IA, controlados por você
      </span>
      <h1 className="max-w-xl font-display text-4xl text-ink sm:text-5xl">
        Gerador Inteligente de Currículos
      </h1>
      <p className="max-w-md text-ink-muted">
        Preencha seus dados, deixe a IA ajudar a lapidar o texto e baixe um
        PDF A4 pronto para enviar — sem inventar nada que você não fez.
      </p>
      <Link
        href="/create"
        className="mt-2 inline-flex items-center gap-2 rounded-md bg-ink px-6 py-3 text-sm font-medium text-white transition-colors duration-150 hover:bg-ink/90"
      >
        Criar currículo
        <ArrowRight className="h-4 w-4" />
      </Link>
    </main>
  );
}
