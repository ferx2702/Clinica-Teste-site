import {
  ArrowLeft,
  MoreVertical,
  Phone,
  CheckCheck,
  Sparkles,
  CalendarCheck2,
} from "lucide-react";
export function ChatDemo() {
  return (
    <figure
      className="demo-scene"
      id="demonstracao"
      aria-label="Exemplo fictício de atendimento no WhatsApp"
    >
      <div className="scene-orbit" aria-hidden="true" />
      <div className="chat-window">
        <div className="chat-header">
          <ArrowLeft size={18} aria-hidden="true" />
          <div className="clinic-avatar" aria-hidden="true">
            C
          </div>
          <div className="chat-identity">
            <strong>Clínica Exemplo</strong>
            <span>Atendimento com IA</span>
          </div>
          <Phone size={17} aria-hidden="true" />
          <MoreVertical size={18} aria-hidden="true" />
        </div>
        <div className="chat-body">
          <span className="chat-day">Conversa ilustrativa</span>
          <div className="bubble incoming">
            Olá! Gostaria de agendar uma avaliação odontológica.
            <small>09:41</small>
          </div>
          <div className="bubble outgoing">
            Olá, Ana! Posso te ajudar com isso. Você prefere o período da manhã
            ou da tarde?
            <small>
              09:41 <CheckCheck size={14} aria-hidden="true" />
            </small>
          </div>
          <div className="bubble incoming short">
            À tarde, por favor!<small>09:42</small>
          </div>
          <div className="bubble outgoing">
            Perfeito! Vou encaminhar sua preferência à equipe para confirmar os
            horários disponíveis.
            <small>
              09:42 <CheckCheck size={14} aria-hidden="true" />
            </small>
          </div>
          <div className="chat-handoff">
            <CalendarCheck2 size={17} aria-hidden="true" />
            <span>Preferência organizada para a equipe</span>
          </div>
        </div>
        <div className="chat-footer">
          <span aria-hidden="true">✧</span> IA no primeiro contato. Pessoas no
          cuidado.
        </div>
      </div>
      <div className="scene-note">
        <span className="note-icon">
          <Sparkles size={17} aria-hidden="true" />
        </span>
        <div>
          <strong>Mais espaço para cuidar.</strong>
          <span>Menos tarefas repetitivas.</span>
        </div>
      </div>
      <figcaption>
        Exemplo fictício. Fluxos e integrações definidos em cada projeto.
      </figcaption>
    </figure>
  );
}
