import { useRef, useEffect, useState, useCallback } from 'react';
import styled, { css } from 'styled-components';
import Template from '../type/Template.type';

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
`;

const Container = styled.div`
  width: 100%;
  max-width: none;
  margin: 0;
  padding: 0;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
  
  @media (max-width: 768px) {
    margin-bottom: 2rem;
  }
  
  @media (max-width: 480px) {
    margin-bottom: 1.5rem;
  }
`;

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
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: #64748b;
  margin: 0;
  
  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

const ContentArea = styled.div`
  background: white;
  border-radius: 16px;
  padding: 3rem;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 768px) {
    padding: 2rem;
  }
  
  @media (max-width: 480px) {
    padding: 1.5rem;
  }
`;

const MappingArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
`;

const CanvasContainer = styled.div`
  position: relative;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  background: #f8fafc;
`;

const ControlPanel = styled.div`
  width: 100%;
  max-width: 800px;
  background: #f8fafc;
  border-radius: 12px;
  padding: 1.5rem;
`;

const ControlGroup = styled.div`
  margin-bottom: 1.5rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const ControlLabel = styled.label`
  display: block;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
`;

const ControlRow = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const SliderContainer = styled.div`
  flex: 1;
`;

const Slider = styled.input`
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: #e2e8f0;
  outline: none;
  -webkit-appearance: none;
  
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #3b82f6;
    cursor: pointer;
    border: 2px solid white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
  
  &::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #3b82f6;
    cursor: pointer;
    border: 2px solid white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
`;

const ValueDisplay = styled.span`
  font-size: 0.8rem;
  color: #6b7280;
  min-width: 40px;
  text-align: right;
`;

const PlaceholderIcon = styled.div`
  font-size: 5rem;
  margin-bottom: 2rem;
  color: #3b82f6;
  text-align: center;
  
  @media (max-width: 480px) {
    font-size: 4rem;
    margin-bottom: 1.5rem;
  }
`;

const PlaceholderText = styled.h3`
  color: #1e293b;
  margin: 0 0 1rem 0;
  font-size: 1.5rem;
  font-weight: 600;
  text-align: center;
  
  @media (max-width: 480px) {
    font-size: 1.25rem;
  }
`;

const PlaceholderSubtext = styled.p`
  color: #64748b;
  margin: 0;
  font-size: 1rem;
  line-height: 1.6;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
  
  @media (max-width: 480px) {
    font-size: 0.95rem;
  }
`;

const Footer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 3rem;
  
  @media (max-width: 768px) {
    margin-top: 2.5rem;
  }
  
  @media (max-width: 480px) {
    margin-top: 2rem;
  }
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary'; }>`
  padding: 1rem 2rem;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  min-width: 180px;
  
  ${({ $variant = 'primary' }) => {
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
`;

interface MappingFinalImageProps {
  selectedTemplate: Template | null; // Template type
  profileImageUrl: { dataUrl: string; path: string; } | null;
  croppedImage: Blob | null;
  onBack: () => void;
}

interface Point {
  x: number;
  y: number;
}

interface MappingPoints {
  topLeft: Point;
  topRight: Point;
  bottomLeft: Point;
  bottomRight: Point;
}

const MappingFinalImage = ({ selectedTemplate, croppedImage, onBack }: MappingFinalImageProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const templateImageRef = useRef<HTMLImageElement>(null);
  const croppedImageRef = useRef<HTMLImageElement>(null);

  const [templateLoaded, setTemplateLoaded] = useState(false);
  const [croppedImageLoaded, setCroppedImageLoaded] = useState(false);
  const [croppedImageUrl, setCroppedImageUrl] = useState<string>('');

  // Default mapping points (as percentages of canvas size)
  const [mappingPoints, setMappingPoints] = useState<MappingPoints>({
    topLeft: { x: 20, y: 20 },
    topRight: { x: 80, y: 20 },
    bottomLeft: { x: 20, y: 80 },
    bottomRight: { x: 80, y: 80 }
  });

  const [canvasSize, setCanvasSize] = useState({ width: 400, height: 600 });

  // Convert cropped image blob to URL
  useEffect(() => {
    if (croppedImage) {
      const url = URL.createObjectURL(croppedImage);
      setCroppedImageUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [croppedImage]);

  // Perspective transformation function
  const drawPerspectiveImage = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const templateImg = templateImageRef.current;
    const croppedImg = croppedImageRef.current;

    if (!canvas || !ctx || !templateImg || !croppedImg || !templateLoaded || !croppedImageLoaded) {
      return;
    }

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Convert percentage points to pixel coordinates
    const points = {
      topLeft: { x: (mappingPoints.topLeft.x / 100) * canvas.width, y: (mappingPoints.topLeft.y / 100) * canvas.height },
      topRight: { x: (mappingPoints.topRight.x / 100) * canvas.width, y: (mappingPoints.topRight.y / 100) * canvas.height },
      bottomLeft: { x: (mappingPoints.bottomLeft.x / 100) * canvas.width, y: (mappingPoints.bottomLeft.y / 100) * canvas.height },
      bottomRight: { x: (mappingPoints.bottomRight.x / 100) * canvas.width, y: (mappingPoints.bottomRight.y / 100) * canvas.height }
    };

    // Draw the cropped image with perspective transformation
    ctx.save();

    // Create a path for the perspective quad
    ctx.beginPath();
    ctx.moveTo(points.topLeft.x, points.topLeft.y);
    ctx.lineTo(points.topRight.x, points.topRight.y);
    ctx.lineTo(points.bottomRight.x, points.bottomRight.y);
    ctx.lineTo(points.bottomLeft.x, points.bottomLeft.y);
    ctx.closePath();
    ctx.clip();

    // For now, we'll use a simple transform approximation
    // This is a simplified perspective transform - for more accurate results,
    // you'd need to implement a full perspective transformation matrix
    const scaleX = (points.topRight.x - points.topLeft.x) / croppedImg.width;
    const scaleY = (points.bottomLeft.y - points.topLeft.y) / croppedImg.height;

    ctx.setTransform(
      scaleX, 0, 0, scaleY,
      points.topLeft.x, points.topLeft.y
    );

    ctx.drawImage(croppedImg, 0, 0);

    ctx.restore();

    // Draw template at exact canvas size (1:1 ratio)
    ctx.drawImage(templateImg, 0, 0, canvas.width, canvas.height);

    // Draw corner points for visualization
    ctx.fillStyle = '#3b82f6';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;

    Object.values(points).forEach(point => {
      ctx.beginPath();
      ctx.arc(point.x, point.y, 6, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
    });

  }, [mappingPoints, templateLoaded, croppedImageLoaded]);

  // Redraw when canvas size changes to keep aspect correct
  useEffect(() => {
    drawPerspectiveImage();
  }, [canvasSize, drawPerspectiveImage]);

  // Redraw when mapping points change
  useEffect(() => {
    drawPerspectiveImage();
  }, [drawPerspectiveImage]);

  const updatePoint = (corner: keyof MappingPoints, axis: 'x' | 'y', value: number) => {
    setMappingPoints(prev => ({
      ...prev,
      [corner]: {
        ...prev[corner],
        [axis]: value
      }
    }));
  };

  if (!selectedTemplate || !croppedImage) {
    return (
      <Wrapper>
        <Container>
          <Header>
            <Title>Final Image Mapping</Title>
            <Subtitle>Map your cropped profile image onto the selected template</Subtitle>
          </Header>

          <ContentArea>
            <PlaceholderIcon>🎨</PlaceholderIcon>
            <PlaceholderText>Missing Required Data</PlaceholderText>
            <PlaceholderSubtext>
              Please ensure you have both a selected template and a cropped image before proceeding to mapping.
            </PlaceholderSubtext>
          </ContentArea>

          <Footer>
            <Button $variant="secondary" onClick={onBack}>
              ← Back to Cropping
            </Button>
          </Footer>
        </Container>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <Container>
        <Header>
          <Title>Final Image Mapping</Title>
          <Subtitle>Adjust the perspective mapping of your cropped image onto the template</Subtitle>
        </Header>

        <ContentArea>
          <MappingArea>
            <CanvasContainer>
              <canvas
                ref={canvasRef}
                width={canvasSize.width}
                height={canvasSize.height}
                style={{ display: 'block', maxWidth: '100%', height: 'auto' }}
              />

              {/* Hidden images for loading */}
              <img
                ref={templateImageRef}
                src={selectedTemplate.image}
                style={{ display: 'none' }}
                onLoad={(e) => {
                  setTemplateLoaded(true);
                  // Set canvas size to match template's exact natural dimensions
                  const img = e.target as HTMLImageElement;
                  setCanvasSize({
                    width: img.naturalWidth,
                    height: img.naturalHeight
                  });
                }}
                alt="Template"
              />

              {croppedImageUrl && (
                <img
                  ref={croppedImageRef}
                  src={croppedImageUrl}
                  style={{ display: 'none' }}
                  onLoad={() => setCroppedImageLoaded(true)}
                  alt="Cropped"
                />
              )}
            </CanvasContainer>

            <ControlPanel>
              <h3 style={{ margin: '0 0 1.5rem 0', color: '#374151', fontSize: '1.1rem', textAlign: 'center' }}>Mapping Controls</h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                <ControlGroup>
                  <ControlLabel>Top Left Corner</ControlLabel>
                  <ControlRow>
                    <SliderContainer>
                      <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.25rem' }}>X Position</div>
                      <Slider
                        type="range"
                        min="0"
                        max="100"
                        value={mappingPoints.topLeft.x}
                        onChange={(e) => updatePoint('topLeft', 'x', Number(e.target.value))}
                      />
                    </SliderContainer>
                    <ValueDisplay>{mappingPoints.topLeft.x}%</ValueDisplay>
                  </ControlRow>
                  <ControlRow style={{ marginTop: '0.5rem' }}>
                    <SliderContainer>
                      <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.25rem' }}>Y Position</div>
                      <Slider
                        type="range"
                        min="0"
                        max="100"
                        value={mappingPoints.topLeft.y}
                        onChange={(e) => updatePoint('topLeft', 'y', Number(e.target.value))}
                      />
                    </SliderContainer>
                    <ValueDisplay>{mappingPoints.topLeft.y}%</ValueDisplay>
                  </ControlRow>
                </ControlGroup>

                <ControlGroup>
                  <ControlLabel>Top Right Corner</ControlLabel>
                  <ControlRow>
                    <SliderContainer>
                      <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.25rem' }}>X Position</div>
                      <Slider
                        type="range"
                        min="0"
                        max="100"
                        value={mappingPoints.topRight.x}
                        onChange={(e) => updatePoint('topRight', 'x', Number(e.target.value))}
                      />
                    </SliderContainer>
                    <ValueDisplay>{mappingPoints.topRight.x}%</ValueDisplay>
                  </ControlRow>
                  <ControlRow style={{ marginTop: '0.5rem' }}>
                    <SliderContainer>
                      <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.25rem' }}>Y Position</div>
                      <Slider
                        type="range"
                        min="0"
                        max="100"
                        value={mappingPoints.topRight.y}
                        onChange={(e) => updatePoint('topRight', 'y', Number(e.target.value))}
                      />
                    </SliderContainer>
                    <ValueDisplay>{mappingPoints.topRight.y}%</ValueDisplay>
                  </ControlRow>
                </ControlGroup>

                <ControlGroup>
                  <ControlLabel>Bottom Left Corner</ControlLabel>
                  <ControlRow>
                    <SliderContainer>
                      <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.25rem' }}>X Position</div>
                      <Slider
                        type="range"
                        min="0"
                        max="100"
                        value={mappingPoints.bottomLeft.x}
                        onChange={(e) => updatePoint('bottomLeft', 'x', Number(e.target.value))}
                      />
                    </SliderContainer>
                    <ValueDisplay>{mappingPoints.bottomLeft.x}%</ValueDisplay>
                  </ControlRow>
                  <ControlRow style={{ marginTop: '0.5rem' }}>
                    <SliderContainer>
                      <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.25rem' }}>Y Position</div>
                      <Slider
                        type="range"
                        min="0"
                        max="100"
                        value={mappingPoints.bottomLeft.y}
                        onChange={(e) => updatePoint('bottomLeft', 'y', Number(e.target.value))}
                      />
                    </SliderContainer>
                    <ValueDisplay>{mappingPoints.bottomLeft.y}%</ValueDisplay>
                  </ControlRow>
                </ControlGroup>

                <ControlGroup>
                  <ControlLabel>Bottom Right Corner</ControlLabel>
                  <ControlRow>
                    <SliderContainer>
                      <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.25rem' }}>X Position</div>
                      <Slider
                        type="range"
                        min="0"
                        max="100"
                        value={mappingPoints.bottomRight.x}
                        onChange={(e) => updatePoint('bottomRight', 'x', Number(e.target.value))}
                      />
                    </SliderContainer>
                    <ValueDisplay>{mappingPoints.bottomRight.x}%</ValueDisplay>
                  </ControlRow>
                  <ControlRow style={{ marginTop: '0.5rem' }}>
                    <SliderContainer>
                      <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.25rem' }}>Y Position</div>
                      <Slider
                        type="range"
                        min="0"
                        max="100"
                        value={mappingPoints.bottomRight.y}
                        onChange={(e) => updatePoint('bottomRight', 'y', Number(e.target.value))}
                      />
                    </SliderContainer>
                    <ValueDisplay>{mappingPoints.bottomRight.y}%</ValueDisplay>
                  </ControlRow>
                </ControlGroup>
              </div>
            </ControlPanel>
          </MappingArea>
        </ContentArea>

        <Footer>
          <Button $variant="secondary" onClick={onBack}>
            ← Back to Cropping
          </Button>
        </Footer>
      </Container>
    </Wrapper>
  );
};

export default MappingFinalImage;
