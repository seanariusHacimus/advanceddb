import styled from 'styled-components';
import { colors } from '../constants';

export const Title = styled.h2`
  margin: ${props => props.margin || 'auto'};
  color: ${props => props.color || colors.title};
  font-family: 'Montserrat', sans-serif;
  font-weight: 500;
  font-size: 22px;
  line-height: 27px;
`;

export const TitleH1 = styled.h1`
  margin: ${props => props.margin || '0'};
  color: ${props => props.color || colors.title};
  font-family: 'Montserrat', sans-serif;
  font-weight: 600;
  font-size: 25px;
  line-height: 30px;
`;

export const TitleH3 = styled.h3`
  margin: ${props => props.margin || '0'};
  color: ${props => props.color || colors.text};
  font-weight: 400;
  font-size: 17px;
  line-height: 21px;
  ${props => props.bold ? '500' : '400'}
`;

export const Text = styled.p`
  margin: ${props => props.margin || '0'};
  color: ${props => props.color || colors.text};
  font-weight: 400;
  font-size: 14px;
  line-height: 1.5;
`;
