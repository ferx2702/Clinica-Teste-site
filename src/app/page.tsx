import { structuredData } from "@/lib/seo";
import {
  ArrowUpRight,
  ArrowRight,
  Check,
  MessageCircle,
  CalendarDays,
  CalendarClock,
  CalendarX2,
  MessagesSquare,
  HeartHandshake,
  Clock3,
  Layers3,
  Sparkles,
  MoveUpRight,
  ShieldCheck,
  Play,
} from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ChatDemo } from "@/components/chat-demo";
import { LeadForm } from "@/components/lead-form";
import { site } from "@/lib/site";
const solutions = [
  {
    icon: MessageCircle,
    title: "Atendimento que acolhe desde o primeiro “olá”.",
    text: "Um primeiro contato organizado, com linguagem alinhada à sua clínica e encaminhamento para uma pessoa quando necessário.",
    className: "solution-featured",
    tag: "Atendimento automatizado",
  },
  {
    icon: CalendarDays,
    title: "Apoio aos agendamentos",
    text: "Colete preferências e organize pedidos de consulta para a equipe confirmar os horários.",
  },
  {
    icon: CalendarClock,
    title: "Reagendar sem recomeçar",
    text: "Facilite a coleta de novas preferências e encaminhe as solicitações de mudança.",
  },
  {
    icon: CalendarX2,
    title: "Cancelamentos organizados",
    text: "Receba pedidos de cancelamento com clareza e direcione a informação à equipe.",
  },
  {
    icon: MessagesSquare,
    title: "Dúvidas administrativas",
    text: "Oriente sobre horários, localização e preparo administrativo com respostas aprovadas pela clínica.",
  },
];
export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData()).replace(/</g, "\u003c"),
        }}
      />
      <Header />
      <main id="conteudo">
        <section className="hero container">
          <div className="hero-copy">
            <div className="location-pill">
              <span aria-hidden="true" /> IA para clínicas. Cuidado com as
              pessoas.
            </div>
            <h1>
              Sua clínica cuida.
              <br />A rotina fica
              <br />
              mais leve.
            </h1>
            <p className="hero-description">
              Automações personalizadas com IA para organizar o atendimento e
              tirar o trabalho repetitivo do caminho da sua equipe.
            </p>
            <div className="hero-actions">
              <a className="button" href={site.links.demo}>
                Conhecer as soluções{" "}
                <ArrowUpRight size={18} aria-hidden="true" />
              </a>
              <a className="text-link" href={site.links.preview}>
                Ver na prática{" "}
                <span className="play-icon" aria-hidden="true">
                  <Play size={10} fill="currentColor" />
                </span>
              </a>
            </div>
            <p className="hero-footnote">
              <span className="tiny-line" /> Pensada para a sua clínica, não o
              contrário.
            </p>
          </div>
          <ChatDemo />
        </section>
        <div className="audience-strip">
          <div className="container">
            <p>
              Mais cuidado na ponta.
              <br />
              <strong>Mais fluidez nos bastidores.</strong>
            </p>
            <span>Clínicas odontológicas</span>
            <span>Consultórios de nutrição</span>
            <span>Equipes que precisam de tempo</span>
          </div>
        </div>
        <section
          className="section container problems"
          aria-labelledby="problems-title"
        >
          <div>
            <span className="section-label">A rotina pode ser diferente</span>
            <h2 id="problems-title">
              O dia é cheio.
              <br />
              Sua equipe não precisa
              <br />
              carregar tudo.
            </h2>
          </div>
          <div className="problem-list">
            {[
              {
                icon: MessagesSquare,
                title: "Mensagens que não param de chegar",
                text: "Entre responder dúvidas e acolher quem está na recepção, a atenção fica dividida.",
              },
              {
                icon: Clock3,
                title: "O mesmo trabalho, muitas vezes",
                text: "Confirmar informações, organizar pedidos e responder às mesmas perguntas toma tempo.",
              },
              {
                icon: Layers3,
                title: "Informações espalhadas pelo caminho",
                text: "Conversas sem um fluxo claro tornam o acompanhamento mais difícil.",
              },
            ].map((p) => (
              <div className="problem" key={p.title}>
                <p.icon size={23} aria-hidden="true" />
                <div>
                  <h3>{p.title}</h3>
                  <p>{p.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
        <section className="solutions-section section" id="solucoes">
          <div className="container">
            <div className="section-heading">
              <div>
                <span className="section-label">
                  Tecnologia com uma função clara
                </span>
                <h2>
                  Menos repetição.
                  <br />
                  Mais atenção ao que importa.
                </h2>
              </div>
              <p>
                Construímos fluxos ao redor da sua operação. Você define o que
                faz sentido automatizar e onde o atendimento humano entra.
              </p>
            </div>
            <div className="solutions-grid">
              {solutions.map((s) => (
                <article
                  className={`solution-card ${s.className ?? ""}`}
                  key={s.title}
                >
                  <span className="solution-icon">
                    <s.icon size={24} aria-hidden="true" />
                  </span>
                  {s.tag && <span className="card-tag">{s.tag}</span>}
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                  {s.className && (
                    <div className="handoff-visual">
                      <span>Paciente</span>
                      <ArrowRight size={16} aria-hidden="true" />
                      <span>IA + sua equipe</span>
                      <HeartHandshake size={25} aria-hidden="true" />
                    </div>
                  )}
                </article>
              ))}
            </div>
            <p className="section-note">
              <ShieldCheck size={17} aria-hidden="true" /> Escopo, integrações e
              disponibilidade são definidos em cada projeto. A IA não substitui
              orientação clínica.
            </p>
          </div>
        </section>
        <section className="section container process" id="como-funciona">
          <div className="section-heading">
            <div>
              <span className="section-label">
                Simples para começar. Personalizado para funcionar.
              </span>
              <h2>
                Primeiro, a sua rotina.
                <br />
                Depois, a tecnologia.
              </h2>
            </div>
            <a className="text-link" href={site.links.demo}>
              Vamos entender sua clínica{" "}
              <ArrowUpRight size={17} aria-hidden="true" />
            </a>
          </div>
          <ol className="process-grid">
            {[
              {
                title: "Uma conversa de verdade",
                text: "Entendemos a operação, os desafios da equipe e os pontos em que a automação pode ajudar.",
              },
              {
                title: "Um fluxo com a sua cara",
                text: "Desenhamos as conversas, definimos limites e validamos as informações com você.",
              },
              {
                title: "Implantação acompanhada",
                text: "Configuramos o escopo combinado, testamos os cenários e orientamos a equipe.",
              },
              {
                title: "Ajustes com a prática",
                text: "Acompanhamos o uso inicial e refinamos o fluxo a partir das necessidades observadas.",
              },
            ].map((s, i) => (
              <li key={s.title}>
                <span className="step-number">0{i + 1}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </li>
            ))}
          </ol>
        </section>
        <section className="specialties-section section" id="para-quem">
          <div className="container specialties-layout">
            <div className="specialties-intro">
              <span className="section-label">
                Perto da realidade de quem atende
              </span>
              <h2>
                Cada especialidade
                <br />
                tem sua rotina.
                <br />A gente respeita.
              </h2>
              <p>
                Começamos em {site.region}, ao lado de clínicas pequenas e
                médias que querem crescer sem tornar a operação mais pesada.
              </p>
              <div className="region-stamp">
                <span aria-hidden="true">↗</span> Tecnologia com contexto local.
              </div>
            </div>
            <div className="specialty-cards">
              <article>
                <span className="specialty-symbol" aria-hidden="true">
                  ✳
                </span>
                <h3>Odontologia</h3>
                <p>
                  Da primeira dúvida ao pedido de avaliação, um atendimento
                  administrativo mais organizado para sua clínica.
                </p>
                <ul>
                  <li>
                    <Check size={16} aria-hidden="true" /> Pedidos de
                    agendamento bem direcionados
                  </li>
                  <li>
                    <Check size={16} aria-hidden="true" /> Informações da
                    clínica sempre à mão
                  </li>
                </ul>
              </article>
              <article>
                <span className="specialty-symbol" aria-hidden="true">
                  ❋
                </span>
                <h3>Nutrição</h3>
                <p>
                  Mais espaço para acompanhar pessoas, com apoio nas conversas e
                  solicitações do seu consultório.
                </p>
                <ul>
                  <li>
                    <Check size={16} aria-hidden="true" /> Organização do
                    primeiro contato
                  </li>
                  <li>
                    <Check size={16} aria-hidden="true" /> Orientações
                    administrativas aprovadas
                  </li>
                </ul>
              </article>
            </div>
          </div>
        </section>
        <section className="section container contact-section" id="contato">
          <div className="contact-copy">
            <span className="contact-spark">
              <Sparkles size={28} aria-hidden="true" />
            </span>
            <span className="section-label">
              O próximo passo pode ser mais leve
            </span>
            <h2>
              Vamos abrir espaço
              <br />
              para o que só a sua
              <br />
              equipe pode fazer?
            </h2>
            <p>
              Conte como funciona sua clínica. Vamos explorar onde a IA pode
              ajudar, com um projeto que respeite sua realidade.
            </p>
            <div className="contact-promise">
              <MoveUpRight size={20} aria-hidden="true" />
              <span>
                Uma conversa para entender.
                <br />
                <strong>Sem fórmulas prontas.</strong>
              </span>
            </div>
          </div>
          <LeadForm />
        </section>
      </main>
      <Footer />
    </>
  );
}
