import { useState, useCallback } from 'react';
import styled, { css } from 'styled-components';

const Wrapper = styled.div`
  width: 100vw;
  min-height: 100vh;
  padding: 2rem;
  background-color: #f8fafc;
  box-sizing: border-box;
  
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
  
  @media (max-width: 480px) {
    padding: 1rem;
  }
`

const Container = styled.div`
  width: 100%;
  max-width: none;
  margin: 0;
  padding: 0;
`

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
  
  @media (max-width: 768px) {
    margin-bottom: 2rem;
  }
  
  @media (max-width: 480px) {
    margin-bottom: 1.5rem;
  }
`

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: bold;
  color: #1e293b;
  margin-bottom: 0.5rem;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.75rem;
  }
`

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: #64748b;
  margin: 0;
  
  @media (max-width: 480px) {
    font-size: 1rem;
  }
`

const UploadArea = styled.div<{ $isDragOver: boolean; $hasImage: boolean }>`
  border: 3px dashed ${({ $isDragOver, $hasImage }) =>
    $hasImage ? '#3b82f6' : $isDragOver ? '#2563eb' : '#cbd5e1'};
  border-radius: 16px;
  padding: 3rem;
  text-align: center;
  background-color: ${({ $isDragOver, $hasImage }) =>
    $hasImage ? '#eff6ff' : $isDragOver ? '#f0f9ff' : '#fff'};
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 2rem;
  
  &:hover {
    border-color: #3b82f6;
    background-color: #f8fafc;
  }
  
  @media (max-width: 480px) {
    padding: 2rem 1rem;
  }
`

const UploadIcon = styled.div`
  font-size: 4rem;
  color: #94a3b8;
  margin-bottom: 1rem;
  
  @media (max-width: 480px) {
    font-size: 3rem;
  }
`

const UploadText = styled.p`
  font-size: 1.2rem;
  color: #475569;
  margin-bottom: 0.5rem;
  font-weight: 600;
  
  @media (max-width: 480px) {
    font-size: 1rem;
  }
`

const UploadSubtext = styled.p`
  font-size: 0.95rem;
  color: #64748b;
  margin: 0;
`

const HiddenInput = styled.input`
  display: none;
`

const PreviewContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
`

const PreviewImage = styled.img`
  max-width: 300px;
  max-height: 300px;
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  object-fit: contain;
  
  @media (max-width: 480px) {
    max-width: 250px;
    max-height: 250px;
  }
`

const RemoveButton = styled.button`
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: #ef4444;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #dc2626;
    transform: translateY(-1px);
  }
`

const Footer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 3rem;
  
  @media (max-width: 768px) {
    margin-top: 2.5rem;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
  }
  
  @media (max-width: 480px) {
    margin-top: 2rem;
  }
`

const Button = styled.button<{ $disabled?: boolean; $variant?: 'primary' | 'secondary' }>`
  padding: 1rem 2rem;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: ${({ $disabled }) => $disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  min-width: 200px;
  
  ${({ $disabled, $variant = 'primary' }) => {
    if ($disabled) {
      return css`
        background-color: #94a3b8;
        color: white;
      `;
    }

    if ($variant === 'secondary') {
      return css`
        background-color: #6b7280;
        color: white;
        &:hover {
          background-color: #4b5563;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
        }
      `;
    }

    return css`
      background-color: #3b82f6;
      color: white;
      &:hover {
        background-color: #2563eb;
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
      }
    `;
  }}
  
  @media (max-width: 768px) {
    padding: 0.875rem 1.5rem;
    font-size: 1rem;
    min-width: 180px;
  }
  
  @media (max-width: 480px) {
    padding: 0.75rem 1.25rem;
    font-size: 0.95rem;
    min-width: 160px;
    width: 100%;
    max-width: 280px;
    
    ${({ $disabled }) => !$disabled && css`
      &:hover {
        transform: translateY(-1px);
      }
    `}
  }
`

interface UploadProfileImageProps {
  profileImageUrl: { dataUrl: string; path: string } | null;
  setProfileImageUrl: (url: { dataUrl: string; path: string } | null) => void;
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

  const handleRemoveImage = () => {
    setProfileImageUrl(null);
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
          <div>
            <UploadArea $isDragOver={false} $hasImage={true}>
              <UploadIcon>✅</UploadIcon>
              <UploadText>Image uploaded successfully!</UploadText>
              <UploadSubtext>Ready to proceed to the next step</UploadSubtext>
            </UploadArea>

            <PreviewContainer>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {profileImageUrl && <PreviewImage src={profileImageUrl.dataUrl} alt="Profile preview" />}
                <RemoveButton onClick={handleRemoveImage}>
                  Remove Image
                </RemoveButton>
              </div>
            </PreviewContainer>
          </div>
        )}

        <HiddenInput
          id="file-input"
          type="file"
          accept="image/*"
          onChange={handleFileInput}
        />

        <Footer>
          <Button
            $variant="secondary"
            onClick={onBack}
          >
            ← Back to Templates
          </Button>
          <Button
            $disabled={!hasImage}
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
