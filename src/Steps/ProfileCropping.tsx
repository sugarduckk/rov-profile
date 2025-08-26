import { useCallback, useEffect, useRef, useState } from 'react';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import styled, { css } from 'styled-components';
import { detectLeftPanelRect } from '../utils/detectLeftPanelRect';
import ImageProcessingDebugger from '../components/ImageProcessingDebugger';

// Styled Components
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

const CropContainer = styled.div`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
  
  @media (max-width: 480px) {
    padding: 1rem;
  }
`

const CropArea = styled.div`
  display: flex;
  justify-content: center;
  
  .ReactCrop {
    max-width: 100%;
    max-height: 500px;
  }
  
  .ReactCrop__image {
    max-width: 100%;
    max-height: 500px;
    object-fit: contain;
  }
`



const AutoDetectSection = styled.div`
  background: #fef3c7;
  border: 1px solid #f59e0b;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  text-align: center;
`

const AutoDetectTitle = styled.h3`
  color: #92400e;
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  font-weight: 600;
`

const AutoDetectText = styled.p`
  color: #a16207;
  margin: 0 0 1rem 0;
  font-size: 0.95rem;
`

const AutoDetectButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: #f59e0b;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-right: 1rem;
  
  &:hover {
    background-color: #d97706;
    transform: translateY(-1px);
  }
  
  &:disabled {
    background-color: #fbbf24;
    cursor: not-allowed;
    transform: none;
  }
`

const DebugToggleButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: #6b7280;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #4b5563;
    transform: translateY(-1px);
  }
`

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
`

const PreviewSection = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
`

const PreviewBox = styled.div`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  max-width: 600px;
  width: 100%;
  
  @media (max-width: 768px) {
    max-width: 500px;
    padding: 1.5rem;
  }
  
  @media (max-width: 480px) {
    max-width: none;
    padding: 1.25rem;
  }
`

const PreviewTitle = styled.h3`
  color: #374151;
  margin: 0 0 1.5rem 0;
  font-size: 1.25rem;
  font-weight: 600;
`

const PreviewCanvas = styled.canvas`
  max-width: 100%;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
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
`

const Button = styled.button<{ $variant?: 'primary' | 'secondary'; $disabled?: boolean }>`
  padding: 1rem 2rem;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: ${({ $disabled }) => $disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  min-width: 180px;
  
  ${({ $variant = 'primary', $disabled }) => {
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
    min-width: 160px;
  }
  
  @media (max-width: 480px) {
    width: 100%;
    max-width: 280px;
    &:hover {
      transform: translateY(-1px);
    }
  }
`

// Types
interface ProfileCroppingProps {
  profileImageUrl: { dataUrl: string; path: string } | null;
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
  const [showDebugger, setShowDebugger] = useState<boolean>(false);

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
    // Use the same default position as the fallback in auto-detect
    setCrop({
      x: 8,
      y: 11.7,
      width: 22,
      height: 77,
      unit: '%',
    });
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
    setCrop({
      x: rect?.x || 8,
      y: rect?.y || 11.7,
      width: rect?.width || 22,
      height: rect?.height || 70,
      unit: '%',
    })
  };

  const handleDebuggerResult = (result: { x: number; y: number; width: number; height: number } | null) => {
    if (result && profileImageUrl) {
      // Convert pixel coordinates to percentage for ReactCrop
      const img = imgRef.current;
      if (img) {
        const percentageCrop = {
          x: (result.x / img.naturalWidth) * 100,
          y: (result.y / img.naturalHeight) * 100,
          width: (result.width / img.naturalWidth) * 100,
          height: (result.height / img.naturalHeight) * 100,
          unit: '%' as const,
        };
        setCrop(percentageCrop);
        console.log('Applied debugger result:', percentageCrop);
      }
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

        <AutoDetectSection>
          <AutoDetectTitle>🤖 Smart Auto-Detection</AutoDetectTitle>
          <AutoDetectText>
            Use AI-powered edge detection to automatically find the optimal crop area
          </AutoDetectText>
          <ButtonGroup>
            <AutoDetectButton onClick={handleAutoDetect}>
              Auto-Detect Crop Area
            </AutoDetectButton>
            <DebugToggleButton onClick={() => setShowDebugger(!showDebugger)}>
              {showDebugger ? '🔍 Hide Debugger' : '🛠️ Show Algorithm Debugger'}
            </DebugToggleButton>
          </ButtonGroup>
        </AutoDetectSection>

        {showDebugger && profileImageUrl && (
          <ImageProcessingDebugger
            imageDataUrl={profileImageUrl.dataUrl}
            onResultChange={handleDebuggerResult}
          />
        )}

        <CropContainer>
          <CropArea>
            {profileImageUrl && (
              <ReactCrop
                crop={crop}
                onChange={(_, percentCrop) => setCrop(percentCrop)}
                onComplete={(c) => setCompletedCrop(c)}
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
          <Button $variant="secondary" onClick={onBack}>
            ← Back to Upload
          </Button>
          <Button onClick={handleNext}>
            Continue to Final Mapping
          </Button>
        </Footer>
      </Container>
    </Wrapper>
  );
};

export default ProfileCropping;
