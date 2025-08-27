import { useCallback, useEffect, useRef, useState } from 'react';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import styled from 'styled-components';
import { detectLeftPanelRect } from '../utils/detectLeftPanelRect';
import { theme, media } from '../theme';
import Button from '../components/Button';

// Styled Components
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

const CropContainer = styled.div`
  background: ${theme.colors.surface};
  border-radius: ${theme.borderRadius['2xl']};
  padding: 0;
  box-shadow: ${theme.boxShadow.xl};
  margin-bottom: ${theme.spacing[8]};
  
  ${media.sm} {
    padding: ${theme.spacing[6]};
  }
  
  ${media.md} {
    padding: ${theme.spacing[8]};
  }
`;

const CropArea = styled.div`
  display: flex;
  justify-content: center;
  
  .ReactCrop {
    max-width: 100%;
    max-height: 400px;
    
    ${media.sm} {
      max-height: 500px;
    }
    
    ${media.md} {
      max-height: 600px;
    }
  }
  
  .ReactCrop__image {
    max-width: 100%;
    max-height: 400px;
    object-fit: contain;
    border-radius: ${theme.borderRadius.lg};
    
    ${media.sm} {
      max-height: 500px;
    }
    
    ${media.md} {
      max-height: 600px;
    }
  }
  
  /* Improve crop handle visibility on mobile */
  .ReactCrop__crop-selection {
    border: 2px solid ${theme.colors.primary[500]};
  }
  
  .ReactCrop__drag-handle {
    background-color: ${theme.colors.primary[500]};
    border: 2px solid white;
    width: 20px;
    height: 20px;
    
    ${media.sm} {
      width: 16px;
      height: 16px;
    }
  }
`;





const PreviewSection = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
`;

const PreviewBox = styled.div`
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.gray[200]};
  border-radius: ${theme.borderRadius.xl};
  padding: ${theme.spacing[6]};
  text-align: center;
  max-width: 600px;
  width: 100%;
  
  ${media.sm} {
    max-width: 500px;
    padding: ${theme.spacing[6]};
  }
  
  ${media.md} {
    max-width: 600px;
    padding: ${theme.spacing[8]};
  }
`;

const PreviewTitle = styled.h3`
  color: ${theme.colors.gray[700]};
  margin: 0 0 ${theme.spacing[6]} 0;
  font-size: ${theme.typography.fontSize.xl};
  font-weight: ${theme.typography.fontWeight.semibold};
`;

const PreviewCanvas = styled.canvas`
  max-width: 100%;
  border: 1px solid ${theme.colors.gray[200]};
  border-radius: ${theme.borderRadius.lg};
  touch-action: none; /* Prevent scrolling when touching canvas */
`;

const Footer = styled.div`
  display: flex;
  justify-content: center;
  gap: ${theme.spacing[4]};
  margin-top: ${theme.spacing[8]};
  
  /* Mobile: stack buttons vertically */
  flex-direction: column;
  align-items: center;
  gap: ${theme.spacing[3]};
  
  ${media.sm} {
    margin-top: ${theme.spacing[10]};
    flex-direction: row;
    gap: ${theme.spacing[4]};
  }
  
  ${media.md} {
    margin-top: ${theme.spacing[12]};
  }
`;



// Types
interface ProfileCroppingProps {
  profileImageUrl: { dataUrl: string; path: string; } | null;
  setCroppedImage: (blob: Blob | null) => void;
  onNext: () => void;
  onBack: () => void;
}

// Utility functions

async function canvasPreview(
  image: HTMLImageElement,
  canvas: HTMLCanvasElement,
  crop: PixelCrop,
) {
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('No 2d context');
  }

  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  const pixelRatio = window.devicePixelRatio;

  canvas.width = Math.floor(crop.width * scaleX * pixelRatio);
  canvas.height = Math.floor(crop.height * scaleY * pixelRatio);

  ctx.scale(pixelRatio, pixelRatio);
  ctx.imageSmoothingQuality = 'high';

  const cropX = crop.x * scaleX;
  const cropY = crop.y * scaleY;

  ctx.drawImage(
    image,
    cropX,
    cropY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    crop.width * scaleX,
    crop.height * scaleY,
  );
}

const ProfileCropping = ({ profileImageUrl, setCroppedImage, onNext, onBack }: ProfileCroppingProps) => {
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [aspect] = useState<number>(2.72 / 4.33); // Fixed aspect ratio 2.72:4.33

  const imgRef = useRef<HTMLImageElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  // Update preview canvas when crop changes
  useEffect(() => {
    if (
      completedCrop?.width &&
      completedCrop?.height &&
      imgRef.current &&
      previewCanvasRef.current
    ) {
      canvasPreview(imgRef.current, previewCanvasRef.current, completedCrop);
    }
  }, [completedCrop]);

  const onImageLoad = () => {
    // Automatically apply auto-detection when image loads
    handleAutoDetect();
  };

  const handleNext = useCallback(async () => {
    // Auto-save crop when proceeding to next step
    if (
      completedCrop?.width &&
      completedCrop?.height &&
      imgRef.current &&
      previewCanvasRef.current
    ) {
      const canvas = previewCanvasRef.current;
      canvas.toBlob((blob) => {
        if (blob) {
          setCroppedImage(blob);
        }
      }, 'image/jpeg', 0.95);
    }
    onNext();
  }, [completedCrop, setCroppedImage, onNext]);

  const handleAutoDetect = async () => {
    const rect = await detectLeftPanelRect(profileImageUrl?.dataUrl || '');
    console.log(rect);
    const newCrop = {
      x: rect?.x || 8,
      y: rect?.y || 11.7,
      width: rect?.width || 22,
      height: rect?.height || 70,
      unit: '%',
    } as Crop;

    setCrop(newCrop);

    // Convert percentage crop to pixel crop for completedCrop
    if (imgRef.current) {
      const image = imgRef.current;
      const pixelCrop: PixelCrop = {
        x: (newCrop.x * image.width) / 100,
        y: (newCrop.y * image.height) / 100,
        width: (newCrop.width * image.width) / 100,
        height: (newCrop.height * image.height) / 100,
        unit: 'px',
      };
      setCompletedCrop(pixelCrop);
    }
  };

  if (!profileImageUrl) {
    return (
      <Wrapper>
        <Container>
          <Header>
            <Title>Profile Cropping</Title>
            <Subtitle>No image available for cropping</Subtitle>
          </Header>
        </Container>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <Container>
        <Header>
          <Title>Crop Your Profile Image</Title>
          <Subtitle>Adjust the crop area to focus on the important parts of your image</Subtitle>
        </Header>



        <CropContainer>
          <CropArea>
            {profileImageUrl && (
              <ReactCrop
                crop={crop}
                onChange={(_, percentCrop) => setCrop(percentCrop)}
                onComplete={setCompletedCrop}
                aspect={aspect}
                keepSelection
              >
                <img
                  ref={imgRef}
                  alt="Crop me"
                  src={profileImageUrl.dataUrl}
                  onLoad={onImageLoad}
                />
              </ReactCrop>
            )}
          </CropArea>
        </CropContainer>

        <PreviewSection>
          <PreviewBox>
            <PreviewTitle>Cropped Preview</PreviewTitle>
            <PreviewCanvas
              ref={previewCanvasRef}
              style={{
                border: '1px solid black',
                objectFit: 'contain',
                width: '100%',
                maxHeight: '350px',
              }}
            />
          </PreviewBox>
        </PreviewSection>

        <Footer>
          <Button variant="secondary" size="lg" fullWidth onClick={onBack}>
            ← Back to Upload
          </Button>
          <Button variant="primary" size="lg" fullWidth onClick={handleNext}>
            Continue to Final Mapping
          </Button>
        </Footer>
      </Container>
    </Wrapper>
  );
};

export default ProfileCropping;
