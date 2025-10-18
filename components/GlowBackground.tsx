export default function GlowBackground(){
  return (
    <div aria-hidden className="fixed inset-0 -z-10">
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full blur-3xl opacity-30" style={{background:"radial-gradient(closest-side,#80a8ff,transparent)"}} />
      <div className="absolute -bottom-24 -right-24 w-[34rem] h-[34rem] rounded-full blur-3xl opacity-20" style={{background:"radial-gradient(closest-side,#b5d0ff,transparent)"}} />
    </div>
  )
}
