export default function Disclaimer({ variant = 'full' }: { variant?: 'full' | 'compact' }) {
  if (variant === 'compact') {
    return (
      <p className="text-white/30 text-xs">
        Fair Play is not a law firm, agent, or financial advisor. Information provided is for educational purposes only and does not constitute legal, financial, or professional advice. Always consult qualified professionals before signing contracts.
      </p>
    )
  }

  return (
    <div className="border-t border-white/10 pt-8 mt-12">
      <div className="max-w-2xl mx-auto text-center">
        <p className="text-white/40 text-sm mb-3">
          <span className="font-medium text-white/50">Important Disclaimer</span>
        </p>
        <p className="text-white/30 text-xs leading-relaxed">
          Fair Play is an educational platform and is <span className="text-white/50">not a law firm, sports agent, or financial advisor</span>.
          We do not provide legal advice, represent athletes in negotiations, or act as agents under the Sports Agent Responsibility
          and Trust Act (SPARTA) or state Uniform Athlete Agent Acts. The information and analysis provided are for
          educational and informational purposes only. Always consult with a qualified attorney, licensed agent, or
          financial professional before making decisions about NIL contracts or agreements.
        </p>
      </div>
    </div>
  )
}
