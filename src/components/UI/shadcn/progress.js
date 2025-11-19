import styled from "styled-components";

const Track = styled.div`
  width: 100%;
  height: ${(p) => (p.$thickness ? `${p.$thickness}px` : "10px")};
  border-radius: 9999px;
  background: ${(p) => p.$trackColor || "hsl(var(--muted))"};
  overflow: hidden;
  transition: background-color 0.3s ease;
`;

const Fill = styled.div`
  height: 100%;
  width: ${(p) => Math.max(0, Math.min(100, p.$value))}%;
  background: ${(p) => p.$color || "hsl(221 83% 53%)"};
  transition: width 200ms ease, background-color 0.3s ease;
`;

const Label = styled.div`
  min-width: 48px;
  text-align: right;
  color: hsl(var(--foreground));
  font-weight: 500;
  transition: color 0.3s ease;
`;

export function Progress({ 
  value = 0, 
  color, // If not provided, uses CSS variable
  trackColor, // If not provided, uses CSS variable
  thickness = 13, 
  format 
}) {
  const display = typeof format === "function" ? format(value) : `${value}%`;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <Track $trackColor={trackColor} $thickness={thickness}>
        <Fill $color={color} $value={value} />
      </Track>
      <Label>{display}</Label>
    </div>
  );
}


