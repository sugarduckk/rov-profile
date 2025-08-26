import { useState, useCallback } from 'react';
import styled from 'styled-components';
import { theme, media } from '../theme';
import Button from '../components/Button';

const Wrapper = styled.div`
  width: 100vw;
  min-height: 100vh;
  padding: ${theme.spacing[4]};
  background-color: ${theme.colors.background};
  box-sizing: border-box;
  
  ${media.sm} {
    padding: ${theme.spacing[6]};
  }
  
  ${media.md} {
    padding: ${theme.spacing[8]};
  }
`;

const Container = styled.div`
  width: 100%;
  max-width: none;
  margin: 0;
  padding: 0;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: ${theme.spacing[6]};
  
  ${media.sm} {
    margin-bottom: ${theme.spacing[8]};
  }
  
  ${media.md} {
    margin-bottom: ${theme.spacing[12]};
  }
`;

const Title = styled.h1`
  font-size: ${theme.typography.fontSize['3xl']};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.gray[800]};
  margin-bottom: ${theme.spacing[2]};
  line-height: ${theme.typography.lineHeight.tight};
  
  ${media.sm} {
    font-size: ${theme.typography.fontSize['4xl']};
  }
  
  ${media.md} {
    font-size: ${theme.typography.fontSize['5xl']};
  }
`;

const Subtitle = styled.p`
  font-size: ${theme.typography.fontSize.base};
  color: ${theme.colors.gray[500]};
  margin: 0;
  line-height: ${theme.typography.lineHeight.relaxed};
  
  ${media.sm} {
    font-size: ${theme.typography.fontSize.lg};
  }
`;

const UploadArea = styled.div<{ $isDragOver: boolean; $hasImage: boolean; }>`
  border: 3px dashed ${({ $isDragOver, $hasImage }) =>
    $hasImage ? theme.colors.primary[500] : $isDragOver ? theme.colors.primary[600] : theme.colors.gray[300]};
  border-radius: ${theme.borderRadius['2xl']};
  padding: ${theme.spacing[8]} ${theme.spacing[4]};
  text-align: center;
  background-color: ${({ $isDragOver, $hasImage }) =>
    $hasImage ? theme.colors.primary[50] : $isDragOver ? theme.colors.primary[50] : theme.colors.surface};
  cursor: pointer;
  transition: all ${theme.animation.duration.normal} ${theme.animation.easing.ease};
  margin-bottom: ${theme.spacing[8]};
  min-height: ${theme.touchTarget.comfortable};
  
  &:hover {
    border-color: ${theme.colors.primary[500]};
    background-color: ${theme.colors.gray[50]};
  }
  
  &:active {
    transform: scale(0.99);
  }
  
  ${media.sm} {
    padding: ${theme.spacing[12]} ${theme.spacing[8]};
  }
`;

const UploadIcon = styled.div`
  font-size: ${theme.typography.fontSize['5xl']};
  color: ${theme.colors.gray[400]};
  margin-bottom: ${theme.spacing[4]};
  
  ${media.sm} {
    font-size: 5rem;
  }
`;

const UploadText = styled.p`
  font-size: ${theme.typography.fontSize.base};
  color: ${theme.colors.gray[600]};
  margin-bottom: ${theme.spacing[2]};
  font-weight: ${theme.typography.fontWeight.semibold};
  
  ${media.sm} {
    font-size: ${theme.typography.fontSize.xl};
  }
`;

const UploadSubtext = styled.p`
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.gray[500]};
  margin: 0;
  
  ${media.sm} {
    font-size: ${theme.typography.fontSize.base};
  }
`;

const HiddenInput = styled.input`
  display: none;
`;

const PreviewContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: ${theme.spacing[8]};
`;

const PreviewImageContainer = styled.div`
  background: ${theme.colors.surface};
  border-radius: ${theme.borderRadius['2xl']};
  padding: ${theme.spacing[6]};
  box-shadow: ${theme.boxShadow.xl};
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 600px;
  
  ${media.sm} {
    padding: ${theme.spacing[8]};
    max-width: 700px;
  }
  
  ${media.md} {
    max-width: 800px;
  }
`;

const PreviewImage = styled.img`
  width: 100%;
  max-width: 500px;
  max-height: 400px;
  border-radius: ${theme.borderRadius.xl};
  box-shadow: ${theme.boxShadow.lg};
  object-fit: contain;
  margin-bottom: ${theme.spacing[6]};
  
  ${media.sm} {
    max-height: 500px;
    max-width: 600px;
  }
  
  ${media.md} {
    max-height: 600px;
    max-width: 700px;
  }
`;

const ImageTitle = styled.h3`
  color: ${theme.colors.gray[800]};
  font-size: ${theme.typography.fontSize.xl};
  font-weight: ${theme.typography.fontWeight.semibold};
  margin: 0 0 ${theme.spacing[2]} 0;
  text-align: center;
  
  ${media.sm} {
    font-size: ${theme.typography.fontSize['2xl']};
  }
`;

const ImageSubtext = styled.p`
  color: ${theme.colors.gray[500]};
  font-size: ${theme.typography.fontSize.base};
  margin: 0 0 ${theme.spacing[4]} 0;
  text-align: center;
`;

const RemoveButton = styled.button`
  margin-top: ${theme.spacing[4]};
  padding: ${theme.spacing[2]} ${theme.spacing[4]};
  background-color: ${theme.colors.error[500]};
  color: white;
  border: none;
  border-radius: ${theme.borderRadius.lg};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all ${theme.animation.duration.normal} ${theme.animation.easing.ease};
  min-height: ${theme.touchTarget.min};
  
  &:hover {
    background-color: ${theme.colors.error[600]};
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const Footer = styled.div`
  display: flex;
  justify-content: center;
  gap: ${theme.spacing[4]};
  margin-top: ${theme.spacing[8]};
  
  ${media.sm} {
    margin-top: ${theme.spacing[10]};
    flex-direction: row;
    gap: ${theme.spacing[4]};
  }
  
  ${media.md} {
    margin-top: ${theme.spacing[12]};
  }
  
  /* Mobile: stack buttons vertically */
  flex-direction: column;
  align-items: center;
  gap: ${theme.spacing[3]};
`;



interface UploadProfileImageProps {
  profileImageUrl: { dataUrl: string; path: string; } | null;
  setProfileImageUrl: (url: { dataUrl: string; path: string; } | null) => void;
  onNext: () => void;
  onBack: () => void;
}

const UploadProfileImage = ({ profileImageUrl, setProfileImageUrl, onNext, onBack }: UploadProfileImageProps) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileChange = useCallback((file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        if (dataUrl) {
          setProfileImageUrl({
            dataUrl: dataUrl,
            path: file.name
          });
        }
      };
      reader.readAsDataURL(file);
    }
  }, [setProfileImageUrl]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileChange(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileChange(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleChooseDifferentImage = () => {
    // Clear current image and open file browser
    setProfileImageUrl(null);
    // Trigger file input click
    document.getElementById('file-input')?.click();
  };

  const hasImage = profileImageUrl !== null;

  return (
    <Wrapper>
      <Container>
        <Header>
          <Title>Upload Your Profile Image</Title>
          <Subtitle>Choose a high-quality image that represents you best</Subtitle>
        </Header>

        {!hasImage ? (
          <UploadArea
            $isDragOver={isDragOver}
            $hasImage={hasImage}
            onClick={() => document.getElementById('file-input')?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <UploadIcon>📷</UploadIcon>
            <UploadText>
              {isDragOver ? 'Drop your image here!' : 'Click to upload or drag and drop'}
            </UploadText>
            <UploadSubtext>PNG, JPG, JPEG up to 10MB</UploadSubtext>
          </UploadArea>
        ) : (
          <PreviewContainer>
            <PreviewImageContainer>
              <ImageTitle>Your Profile Image</ImageTitle>
              <ImageSubtext>Looking great! Ready to crop and position your image.</ImageSubtext>
              {profileImageUrl && (
                <PreviewImage src={profileImageUrl.dataUrl} alt="Profile preview" />
              )}
              <RemoveButton onClick={handleChooseDifferentImage}>
                🗑️ Choose Different Image
              </RemoveButton>
            </PreviewImageContainer>
          </PreviewContainer>
        )}

        <HiddenInput
          id="file-input"
          type="file"
          accept="image/*"
          onChange={handleFileInput}
        />

        <Footer>
          <Button
            variant="secondary"
            size="lg"
            fullWidth
            onClick={onBack}
          >
            ← Back to Templates
          </Button>
          <Button
            variant="primary"
            size="lg"
            fullWidth
            disabled={!hasImage}
            onClick={hasImage ? onNext : undefined}
          >
            {hasImage ? 'Continue to Cropping' : 'Upload an Image'}
          </Button>
        </Footer>
      </Container>
    </Wrapper>
  );
};

export default UploadProfileImage;
