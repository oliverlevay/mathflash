import styled from 'styled-components';
import { Container, Stack, Typography } from '@mui/material';
import CreateFlashcard from 'components/CreateFlashcard';
import React, { useEffect } from 'react';
import Head from 'next/head';
import { useUser } from '@auth0/nextjs-auth0';
import { goToLogin } from 'lib/authUtils';

const StyledContainer = styled(Container)`
  padding: 3rem;
`;

export default function Create() {
  const { user, error } = useUser();
  useEffect(() => {
    if (error) {
      goToLogin();
    }
  }, [error]);
  return (
    <StyledContainer maxWidth="sm">
      <Head>
        <title>Create flashcard</title>
      </Head>
      <Stack spacing={2}>
        <Typography variant="h2">Create a flashcard</Typography>
        <CreateFlashcard />
      </Stack>
    </StyledContainer>
  );
}
