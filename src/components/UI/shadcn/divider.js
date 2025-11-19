import styled from 'styled-components';

export const Divider = styled.div`
  width: ${props => props.$vertical ? '1px' : '100%'};
  height: ${props => props.$vertical ? 'auto' : '1px'};
  background: hsl(var(--border));
  margin: ${props => {
    if (props.$vertical) return '0 16px';
    return props.$margin || '16px 0';
  }};
  ${props => props.$vertical && 'align-self: stretch;'}
  transition: background-color 0.3s ease;
`;

export default Divider;

