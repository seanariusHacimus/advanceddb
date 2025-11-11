import styled from 'styled-components';

// Row component - Flexbox container with gutter support
export const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-left: ${props => props.gutter ? `-${props.gutter[0] / 2}px` : '0'};
  margin-right: ${props => props.gutter ? `-${props.gutter[0] / 2}px` : '0'};
  margin-top: ${props => props.gutter && props.gutter[1] ? `-${props.gutter[1] / 2}px` : '0'};
  margin-bottom: ${props => props.gutter && props.gutter[1] ? `${props.gutter[1] / 2}px` : '0'};
  row-gap: ${props => props.gutter && props.gutter[1] ? `${props.gutter[1]}px` : '0'};
  width: 100%;
  box-sizing: border-box;
  
  ${props => props.justify && `justify-content: ${props.justify};`}
  ${props => props.align && `align-items: ${props.align};`}
`;

// Col component - Flex item with span support (24-column grid system)
export const Col = styled.div`
  box-sizing: border-box;
  min-width: 0;
  flex: ${props => {
    if (props.flex) return props.flex;
    if (props.span) return `0 0 ${(props.span / 24) * 100}%`;
    return '1';
  }};
  max-width: ${props => props.span ? `${(props.span / 24) * 100}%` : '100%'};
  padding-left: ${props => props.gutter ? `${props.gutter[0] / 2}px` : props.$parentGutter ? `${props.$parentGutter[0] / 2}px` : '0'};
  padding-right: ${props => props.gutter ? `${props.gutter[0] / 2}px` : props.$parentGutter ? `${props.$parentGutter[0] / 2}px` : '0'};
  
  ${props => props.offset && `margin-left: ${(props.offset / 24) * 100}%;`}
  ${props => props.push && `left: ${(props.push / 24) * 100}%;`}
  ${props => props.pull && `right: ${(props.pull / 24) * 100}%;`}
  
  /* Responsive breakpoints */
  @media (max-width: 576px) {
    ${props => props.xs && `
      flex: 0 0 ${(props.xs / 24) * 100}%;
      max-width: ${(props.xs / 24) * 100}%;
    `}
  }
  
  @media (min-width: 576px) {
    ${props => props.sm && `
      flex: 0 0 ${(props.sm / 24) * 100}%;
      max-width: ${(props.sm / 24) * 100}%;
    `}
  }
  
  @media (min-width: 768px) {
    ${props => props.md && `
      flex: 0 0 ${(props.md / 24) * 100}%;
      max-width: ${(props.md / 24) * 100}%;
    `}
  }
  
  @media (min-width: 992px) {
    ${props => props.lg && `
      flex: 0 0 ${(props.lg / 24) * 100}%;
      max-width: ${(props.lg / 24) * 100}%;
    `}
  }
  
  @media (min-width: 1200px) {
    ${props => props.xl && `
      flex: 0 0 ${(props.xl / 24) * 100}%;
      max-width: ${(props.xl / 24) * 100}%;
    `}
  }
  
  @media (min-width: 1600px) {
    ${props => props.xxl && `
      flex: 0 0 ${(props.xxl / 24) * 100}%;
      max-width: ${(props.xxl / 24) * 100}%;
    `}
  }
`;

// Wrapper component to pass gutter to children
export function RowWithGutter({ children, gutter = [0, 0], ...props }) {
  return (
    <Row gutter={gutter} {...props}>
      {children}
    </Row>
  );
}

export default { Row, Col, RowWithGutter };

