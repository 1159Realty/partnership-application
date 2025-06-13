"use client";

import { COLORS } from "@/utils/colors";
import styled from "@emotion/styled";
import { Box } from "@mui/material";

export const PropertyCardWrapper = styled.div`
  width: 100%;
`;

export const PropertyCardDetailWrapper = styled.div`
  display: flex;
  flex-direction: column;
  column-gap: 2px;
  margin-top: 16px;
`;

export const PropertyImageWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 312px;
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;

  @media screen and (min-width: 1074px) {
    height: 312px;
  }

  @media screen and (min-width: 970px) and (max-width: 1073px) {
    height: 244px;
  }

  @media screen and (min-width: 870px) and (max-width: 969px) {
    height: 244px;
  }

  @media screen and (min-width: 769px) and (max-width: 869px) {
    height: 244px;
  }

  @media screen and (min-width: 720px) and (max-width: 768px) {
    height: 389px;
  }

  @media screen and (min-width: 620px) and (max-width: 719px) {
    height: 331px;
  }

  @media screen and (min-width: 520px) and (max-width: 619px) {
    height: 274px;
  }

  @media screen and (min-width: 421px) and (max-width: 519px) {
    height: 212px;
  }
`;

export const PropertyImageDetailWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 16px;
  pointer-events: none;
`;

// Create Item Card
export const CreateItemWrapper = styled.div`
  min-height: 387px;
  width: 100%;
  border-radius: 20px;
  padding-top: 120px;
  padding-right: 60px;
  padding-bottom: 120px;
  padding-left: 60px;
  background-color: ${COLORS.gray100};
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  row-gap: 22px;
  text-align: center;
`;

// NoItemCard
export const NoItemWrapper = styled.div`
  min-height: 200px;
  width: 100%;
  border-radius: 20px;
  padding-top: 120px;
  padding-right: 60px;
  padding-bottom: 120px;
  padding-left: 60px;
  background-color: ${COLORS.gray100};
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  row-gap: 22px;
`;

//Stat
export const StatCardWrapper = styled(Box)`
  height: 129px;
  width: 100%;
  background-color: ${COLORS.gray50};
  border-radius: 11px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 16px;
  word-wrap: break-word;

  @media screen and (max-width: 768px) {
    height: 110px;
  }
`;

//DocumentCard
export const DocumentCardWrapper = styled(Box)`
  width: 100%;
  background-color: ${COLORS.gray50};
  border-radius: 11px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 16px;
  word-wrap: break-word;
  cursor: pointer;

  section {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100%;
    max-width: 200px;

    @media screen and (min-width: 421px) and (max-width: 475px) {
      max-width: 170px;
    }
  }
`;

// Description Card
export const DescriptionCardWrapper = styled.div`
  width: 100%;
  background-color: ${COLORS.gray50};
  border-radius: 11px;
  padding: 8px;
`;
export const DescriptionCardContentWrapper = styled.div`
  width: 100%;
  background-color: ${COLORS.whiteNormal};
  border-radius: 14px;
  padding: 16px;
`;
export const DescriptionCardContentText = styled.div`
  width: 100%;
  min-height: 60px;
  /* text-align: center; */
`;
