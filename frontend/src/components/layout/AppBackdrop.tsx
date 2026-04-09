type AppBackdropProps = {
  photoUrl?: string;
  photoOpacity?: number;
};

export default function AppBackdrop({
  photoUrl,
  photoOpacity = 0.46,
}: AppBackdropProps) {
  return (
    <>
      {photoUrl && (
        <div
          className="absolute inset-y-0 left-0 w-full sm:w-[60%] lg:w-[42%]"
          style={{
            backgroundImage: `linear-gradient(90deg, rgba(255,253,248,0.16) 0%, rgba(255,253,248,0.6) 68%, rgba(255,253,248,0.9) 100%), url('${photoUrl}')`,
            backgroundPosition: "center left",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            opacity: photoOpacity,
          }}
        />
      )}
      <div className="absolute inset-0 soft-grid opacity-35" />
      <div className="absolute left-[8%] top-20 h-56 w-56 rounded-full bg-emerald-300/25 blur-3xl" />
      <div className="absolute right-[10%] top-10 h-64 w-64 rounded-full bg-sky-300/25 blur-3xl" />
    </>
  );
}
