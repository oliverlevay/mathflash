import styled from 'styled-components';
import { Paper, Stack, TextField, Typography } from '@mui/material';
import React, { useCallback, useState } from 'react';
import ImageSelector from './ImageSelector';
import { Box } from '@mui/system';
import { getFileFromSrc } from '../src/getFileFromSrc';
import { uploadFiles } from '../src/uploadFiles';
import { LoadingButton } from '@mui/lab';
import { useRouter } from 'next/dist/client/router';
import FlashcardComponent from './Flashcard';
import Link from 'next/link';
import { useUser } from '@auth0/nextjs-auth0';
import { CreateFlashcardInput } from 'lib/types';
import { TABLET_MQ } from 'lib/mediaQueries';

const StyledPaper = styled(Paper)``;

const StyledStack = styled(Stack)`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StyledBox = styled(Stack)`
  padding: 2rem;
  margin-bottom: 2rem;
  width: 100%;
`;

const CardCreator = styled(Box)`
  width: 100%;
  display: flex;
  flex-direction: column;
  ${TABLET_MQ} {
    flex-direction: row;
  }
`;

const ImageSelectorContainer = styled(Box)`
  margin-bottom: 2rem;
  ${TABLET_MQ} {
    margin: 0 1rem;
  }
`;

const Preview = styled(Stack)`
  align-items: center;
`;

export default function CreateFlashcard() {
  const [frontImage, setFrontImage] = useState<string>('');
  const [backImage, setBackImage] = useState<string>('');
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);

  const disabled = !frontImage || !backImage || !title;

  const router = useRouter();

  const { user } = useUser();

  const uploadImage = useCallback(async () => {
    if (!disabled) {
      setLoading(true);
      const frontImageFile = await getFileFromSrc(frontImage, title);
      const backImageFile = await getFileFromSrc(backImage, title);
      const { imageUrls } = await uploadFiles([frontImageFile, backImageFile]);
      const data: CreateFlashcardInput = {
        title,
        frontImageUrl: imageUrls[0],
        backImageUrl: imageUrls[1],
      };
      await fetch('/api/flashcard/create', {
        body: JSON.stringify(data),
        method: 'post',
      });
      router.push('/');
    }
  }, [disabled, frontImage, title, backImage, router]);

  return (
    <StyledPaper>
      <StyledStack>
        <StyledBox sx={{ borderBottom: 1 }}>
          <Typography fontSize={50} variant="h2">
            Flashcard
          </Typography>
        </StyledBox>
        <StyledBox spacing={2}>
          <TextField
            label="Title"
            inputProps={{ maxLength: 20 }}
            variant="standard"
            fullWidth
            value={title}
            onChange={(evt) => setTitle(evt.target.value)}
          />
          <CardCreator>
            <ImageSelectorContainer>
              <Typography variant="h3">Front</Typography>
              <ImageSelector image={frontImage} setImage={setFrontImage} />
            </ImageSelectorContainer>
            <ImageSelectorContainer>
              <Typography variant="h3">Back</Typography>
              <ImageSelector image={backImage} setImage={setBackImage} />
            </ImageSelectorContainer>
          </CardCreator>
          <Preview>
            {!disabled && (
              <FlashcardComponent
                flashcard={{
                  deleted: false,
                  id: 1,
                  title,
                  frontImageUrl: frontImage,
                  backImageUrl: backImage,
                  authorId: 2,
                  createdAt: new Date(),
                  updatedAt: new Date(),
                  author: {
                    deleted: false,
                    id: 2,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    name: user?.name || 'Karl Kalas',
                    email: user?.email || 'karl.kalas@regnbagen.se',
                  },
                }}
              />
            )}
            <Stack flexDirection="row">
              <Link href="/" passHref>
                <LoadingButton
                  loading={loading}
                  variant="contained"
                  style={{ margin: '2rem 0.5rem', marginBottom: 0 }}
                  color="error"
                  fullWidth
                >
                  Cancel
                </LoadingButton>
              </Link>
              <LoadingButton
                loading={loading}
                variant="contained"
                style={{ margin: '2rem 0.5rem', marginBottom: 0 }}
                onClick={uploadImage}
                disabled={disabled}
                fullWidth
              >
                Save
              </LoadingButton>
            </Stack>
          </Preview>
        </StyledBox>
      </StyledStack>
    </StyledPaper>
  );
}
