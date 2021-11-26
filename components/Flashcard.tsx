import Image from "next/image";
import { Flashcard } from ".prisma/client";
import React, { useState } from "react";
import { Box, Stack, Typography } from "@mui/material";
import styled from "styled-components";

const Container = styled(Stack)`
  display: flex;
  align-items: center;
`;

const Flipcard = styled(Box)`
  width: 243px;
  height: 137px;
  perspective: 1000px;
`;

const FlipcardInner = styled(Box)`
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.8s;
  transform-style: preserve-3d;
  ${Flipcard}:hover & {
    transform: rotateY(-180deg);
  }
`;

const Card = styled(Box)`
  display: flex;
  width: fit-content;
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
`;

const Front = styled(Card)``;

const Back = styled(Card)`
  transform: rotateY(-180deg);
`;

const FlashcardComponent = ({ flashcard }: { flashcard: Flashcard }) => {
  return (
    <Container>
      <Typography fontSize={24}>{flashcard.title}</Typography>
      <Flipcard>
        <FlipcardInner>
          <Front border={1}>
            <Image
              src={flashcard.frontImageUrl}
              alt={flashcard.title}
              width={243}
              height={137}
            />
          </Front>
          <Back border={1}>
            <Image
              src={flashcard.backImageUrl}
              alt={flashcard.title}
              width={243}
              height={137}
            />
          </Back>
        </FlipcardInner>
      </Flipcard>
    </Container>
  );
};

export default FlashcardComponent;
