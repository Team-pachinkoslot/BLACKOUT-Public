
import AccessGate from "./AccessGate";

export default function GridLabLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AccessGate>
      {children}
    </AccessGate>
  );
}
