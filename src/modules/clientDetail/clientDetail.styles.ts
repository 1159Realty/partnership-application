"use client";
import styled from "@emotion/styled";

// Client Card
export const ClientDetailWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export const LinkedPropertyWrapper = styled.div`
  padding: 32px 16px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;

  @media screen and (min-width: 768px) {
    padding: 32px;
  }
`;
