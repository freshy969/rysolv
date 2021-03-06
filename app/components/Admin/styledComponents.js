import React from 'react';
import styled from 'styled-components';

import { BaseLink, PrimaryButton } from '../base_ui';

export const AdminHeaderWrapper = styled.div`
  display: flex;
  flex-direction: row;
  height: 3rem;
  margin-top: 2rem;
  width: 100%;
`;

export const AdminSubHeaderContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 1rem;
`;

export const BaseInputContainer = styled.div`
  align-self: center;
`;

export const HeaderTab = styled(({ isActive, ...restProps }) => {
  const borderColor = isActive ? '#01579b' : 'grey';
  return <div color={borderColor} width="100%" {...restProps} />;
})`
  border-bottom: ${({ isActive }) =>
    isActive ? '0.5rem solid #01579b' : '0.5rem solid grey'};
  display: flex;
  flex-direction: row;
  width: 15rem;
  &:hover {
    border-bottom: 0.5rem solid #01579b;
  }
  &.card {
    padding: 1rem;
  }
`;

export const HeaderTitle = styled(({ isActive, ...restProps }) => (
  <BaseLink {...restProps} />
))`
  color: ${({ isActive }) => (isActive ? '#01579b' : 'grey')};
  font-size: 2.2rem;
  font-weight: 400;
  line-height: 26px;
  margin: 0;
  text-align: center;
  text-decoration: none;
  width: 100%;
`;

export const StyledPrimaryButton = styled(PrimaryButton)`
  margin: 1rem 0;
`;
