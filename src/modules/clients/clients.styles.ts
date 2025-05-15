"use client";
import styled from "@emotion/styled";

export const ClientsWrapper = styled.div`
  padding: 32px 16px;

  @media screen and (min-width: 769px) {
    padding: 48px 24px;
  }
`;

export const ImagesFlexContainer = styled.div`
  display: flex;
  flex-direction: row;
  column-gap: 20px;
  row-gap: 25px;
  width: 100%;
  flex-wrap: wrap;

  @media screen and (min-width: 1074px) {
    column-gap: 25px;
  }
`;
