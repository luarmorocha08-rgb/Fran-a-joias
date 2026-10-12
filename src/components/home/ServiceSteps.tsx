import { CalendarHeart } from "lucide-react";
import { Reveal } from "../motion/Reveal";
import { TextReveal } from "../motion/TextReveal";
import { WhatsAppLink } from "../ContactLinks";
import { btn } from "../ui/styles";
import { MESSAGES } from "@/lib/whatsapp";

const STEPS = [
  { n: "01", title: "Escolha seu modelo", text: "Explore nossa coleção e encontre a aliança ideal." },
  { n: "02", title: "Converse conosco", text: "Entre em contato diretamente pelo WhatsApp para esclarecer suas dúvidas." },
  { n: "03", title: "Personalize sua escolha", text: "Consulte as possibilidades de modelos, tamanhos e acabamentos disponíveis." },
];

export function ServiceSteps() {
  return (
    <section id="atendimento" aria-labelledby="atendimento-titulo" className="relative overflow-hidden bg-noir-2 py-24 md:py-36">
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
      <div className="container-luxe">
        <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow">Atendimento personalizado</p>
          <TextReveal
            text="Uma escolha especial merece atenção exclusiva."
            className="mt-6 font-serif text-[clamp(2.2rem,4.8vw,4rem)] font-light leading-[1.1]"
          />
        </div>

        <Reveal as="div" stagger={0.18} className="mt-16 grid gap-px bg-gold/15 md:grid-cols-3">
          {STEPS.map((s) => (
            <article key={s.n} className="sweep group bg-noir-2 p-8 transition-colors duration-700 hover:bg-noir md:p-12">
              <p className="font-display text-5xl text-gold-metal md:text-6xl">{s.n}</p>
              <span aria-hidden="true" className="mt-8 block h-px w-12 bg-gold transition-all duration-700 group-hover:w-24" />
              <h3 className="mt-8 font-serif text-2xl text-ivory md:text-3xl">{s.title}</h3>
              <p className="mt-4 text-sm leading-relaxed text-ivory/60">{s.text}</p>
            </article>
          ))}
        </Reveal>

        <Reveal className="mt-14 flex justify-center">
          <WhatsAppLink source="schedule" message={MESSAGES.schedule} className={btn.gold}>
            <CalendarHeart className="h-4 w-4" strokeWidth={1.4} /> Agendar Atendimento
          </WhatsAppLink>
        </Reveal>
      </div>
    </section>
  );
}
