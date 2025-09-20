export default function FaqItem({ id, question, answer, isOpen, onToggle }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white">
      <button
        type="button"
        onClick={() => onToggle(id)}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
        aria-expanded={isOpen}
      >
        <span className="text-base font-semibold text-night">{question}</span>
        <span className="text-2xl text-brand-600">{isOpen ? '−' : '+'}</span>
      </button>
      {isOpen ? <div className="px-5 pb-5 text-sm text-slate-600">{answer}</div> : null}
    </div>
  );
}
