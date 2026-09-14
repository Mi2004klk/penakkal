export default function GeometricPattern({ 
  className = "opacity-5", 
  opacity 
}: { 
  className?: string;
  opacity?: number;
}) {
  return (
    <div 
      className={`absolute inset-0 pointer-events-none z-0 ${className}`}
      aria-hidden="true"
      role="presentation"
      style={{
        ...(opacity !== undefined ? { opacity } : {}),
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L33.206 26.794L60 30L33.206 33.206L30 60L26.794 33.206L0 30L26.794 26.794L30 0Z' fill='%231f7a50' fill-rule='evenodd'/%3E%3C/svg%3E")`,
        backgroundSize: '120px 120px'
      }}
    ></div>
  );
}
