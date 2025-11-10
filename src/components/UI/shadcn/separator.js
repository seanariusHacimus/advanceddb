import styled from 'styled-components';

export const Separator = styled.div`
  flex-shrink: 0;
  background: hsl(var(--border));
  transition: background-color 0.3s ease;
  
  ${props => props.orientation === 'vertical' ? `
    width: 1px;
    height: ${props.length || 'auto'};
    align-self: stretch;
  ` : `
    height: 1px;
    width: ${props.length || '100%'};
  `}
  
  ${props => props.decorative && `
    pointer-events: none;
  `}
`;

Separator.defaultProps = {
  orientation: 'horizontal',
  decorative: true,
};

