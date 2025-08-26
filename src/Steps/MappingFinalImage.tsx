import { useRef, useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';
import Template from '../type/Template.type';
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

const ContentArea = styled.div`
  background: ${theme.colors.surface};
  border-radius: ${theme.borderRadius['2xl']};
  padding: ${theme.spacing[6]};
  box-shadow: ${theme.boxShadow.xl};
  
  ${media.sm} {
    padding: ${theme.spacing[8]};
  }
  
  ${media.md} {
    padding: ${theme.spacing[12]};
  }
`;

const MappingArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${theme.spacing[6]};
  
  ${media.sm} {
    gap: ${theme.spacing[8]};
  }
`;

const CanvasContainer = styled.div`
  position: relative;
  border: 2px solid ${theme.colors.gray[200]};
  border-radius: ${theme.borderRadius.xl};
  overflow: hidden;
  background: ${theme.colors.gray[50]};
  touch-action: none; /* Prevent scrolling when interacting with canvas */
`;

const ControlPanel = styled.div`
  width: 100%;
  max-width: 800px;
  background: ${theme.colors.gray[50]};
  border-radius: ${theme.borderRadius.xl};
  padding: ${theme.spacing[4]};
  
  ${media.sm} {
    padding: ${theme.spacing[6]};
  }
`;

const ControlGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${theme.spacing[6]};
  
  ${media.sm} {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const ControlsHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${theme.spacing[4]};
  margin-bottom: ${theme.spacing[6]};
`;

const ControlTitle = styled.h3`
  margin: 0;
  color: ${theme.colors.gray[700]};
  font-size: ${theme.typography.fontSize.lg};
  font-weight: ${theme.typography.fontWeight.semibold};
  text-align: center;
`;

const ToggleButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  padding: ${theme.spacing[2]} ${theme.spacing[4]};
  background-color: ${theme.colors.gray[100]};
  border: 1px solid ${theme.colors.gray[200]};
  border-radius: ${theme.borderRadius.lg};
  color: ${theme.colors.gray[700]};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all ${theme.animation.duration.normal} ${theme.animation.easing.ease};
  min-height: ${theme.touchTarget.min};
  
  &:hover {
    background-color: ${theme.colors.gray[200]};
    border-color: ${theme.colors.gray[300]};
  }
  
  &:active {
    transform: scale(0.98);
  }
  
  ${media.sm} {
    font-size: ${theme.typography.fontSize.base};
  }
`;

const ToggleIcon = styled.span<{ $isOpen: boolean; }>`
  transition: transform ${theme.animation.duration.normal} ${theme.animation.easing.ease};
  transform: ${({ $isOpen }) => $isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};
  font-size: ${theme.typography.fontSize.sm};
`;

const SliderLabel = styled.div`
  font-size: ${theme.typography.fontSize.xs};
  color: ${theme.colors.gray[500]};
  margin-bottom: ${theme.spacing[1]};
  
  ${media.sm} {
    font-size: ${theme.typography.fontSize.sm};
  }
`;

const ControlGroup = styled.div`
  margin-bottom: ${theme.spacing[6]};
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const ControlLabel = styled.label`
  display: block;
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.gray[700]};
  margin-bottom: ${theme.spacing[2]};
  font-size: ${theme.typography.fontSize.sm};
  
  ${media.sm} {
    font-size: ${theme.typography.fontSize.base};
  }
`;

const ControlRow = styled.div`
  display: flex;
  gap: ${theme.spacing[4]};
  align-items: center;
`;

const SliderContainer = styled.div`
  flex: 1;
`;

const Slider = styled.input`
  width: 100%;
  height: 8px;
  border-radius: 4px;
  background: ${theme.colors.gray[200]};
  outline: none;
  -webkit-appearance: none;
  touch-action: none; /* Prevent page scrolling when dragging */
  
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: ${theme.colors.primary[500]};
    cursor: pointer;
    border: 3px solid white;
    box-shadow: ${theme.boxShadow.md};
    transition: all ${theme.animation.duration.fast} ${theme.animation.easing.ease};
    
    &:hover {
      transform: scale(1.1);
      box-shadow: ${theme.boxShadow.lg};
    }
    
    &:active {
      transform: scale(1.2);
    }
  }
  
  &::-moz-range-thumb {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: ${theme.colors.primary[500]};
    cursor: pointer;
    border: 3px solid white;
    box-shadow: ${theme.boxShadow.md};
  }
  
  ${media.sm} {
    &::-webkit-slider-thumb {
      width: 20px;
      height: 20px;
    }
    
    &::-moz-range-thumb {
      width: 20px;
      height: 20px;
    }
  }
`;

const ValueDisplay = styled.span`
  font-size: ${theme.typography.fontSize.xs};
  color: ${theme.colors.gray[500]};
  min-width: 45px;
  text-align: right;
  font-weight: ${theme.typography.fontWeight.medium};
  
  ${media.sm} {
    font-size: ${theme.typography.fontSize.sm};
    min-width: 40px;
  }
`;

const PlaceholderIcon = styled.div`
  font-size: ${theme.typography.fontSize['5xl']};
  margin-bottom: ${theme.spacing[6]};
  color: ${theme.colors.primary[500]};
  text-align: center;
  
  ${media.sm} {
    font-size: 5rem;
    margin-bottom: ${theme.spacing[8]};
  }
`;

const PlaceholderText = styled.h3`
  color: ${theme.colors.gray[800]};
  margin: 0 0 ${theme.spacing[4]} 0;
  font-size: ${theme.typography.fontSize.xl};
  font-weight: ${theme.typography.fontWeight.semibold};
  text-align: center;
  
  ${media.sm} {
    font-size: ${theme.typography.fontSize['2xl']};
  }
`;

const PlaceholderSubtext = styled.p`
  color: ${theme.colors.gray[500]};
  margin: 0;
  font-size: ${theme.typography.fontSize.base};
  line-height: ${theme.typography.lineHeight.relaxed};
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
  
  ${media.sm} {
    font-size: ${theme.typography.fontSize.lg};
  }
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



interface MappingFinalImageProps {
  selectedTemplate: Template | null; // Template type
  profileImageUrl: { dataUrl: string; path: string; } | null;
  croppedImage: Blob | null;
  onBack: () => void;
  onReset: () => void;
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

const MappingFinalImage = ({ selectedTemplate, croppedImage, onBack, onReset }: MappingFinalImageProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const templateImageRef = useRef<HTMLImageElement>(null);
  const croppedImageRef = useRef<HTMLImageElement>(null);

  const [templateLoaded, setTemplateLoaded] = useState(false);
  const [croppedImageLoaded, setCroppedImageLoaded] = useState(false);
  const [croppedImageUrl, setCroppedImageUrl] = useState<string>('');
  const [showControls, setShowControls] = useState(false);

  // Initialize mapping points from template or use defaults
  const getInitialMappingPoints = (): MappingPoints => {
    if (selectedTemplate?.mapping) {
      return {
        topLeft: selectedTemplate.mapping.topLeft,
        topRight: selectedTemplate.mapping.topRight,
        bottomLeft: selectedTemplate.mapping.bottomLeft,
        bottomRight: selectedTemplate.mapping.bottomRight
      };
    }

    // Fallback to default values if no template mapping
    return {
      topLeft: { x: 20, y: 20 },
      topRight: { x: 80, y: 20 },
      bottomLeft: { x: 20, y: 80 },
      bottomRight: { x: 80, y: 80 }
    };
  };

  const [mappingPoints, setMappingPoints] = useState<MappingPoints>(getInitialMappingPoints());

  const [canvasSize, setCanvasSize] = useState({ width: 400, height: 600 });

  // Convert cropped image blob to URL
  useEffect(() => {
    if (croppedImage) {
      const url = URL.createObjectURL(croppedImage);
      setCroppedImageUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [croppedImage]);

  // Update mapping points when template changes
  useEffect(() => {
    if (selectedTemplate?.mapping) {
      setMappingPoints({
        topLeft: selectedTemplate.mapping.topLeft,
        topRight: selectedTemplate.mapping.topRight,
        bottomLeft: selectedTemplate.mapping.bottomLeft,
        bottomRight: selectedTemplate.mapping.bottomRight
      });
    }
  }, [selectedTemplate]);

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

    // Draw the cropped image with mesh-based perspective transformation
    // This creates a smooth, natural warping without visible gaps

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Set composite operation to help blend overlapping areas
    ctx.globalCompositeOperation = 'source-over';

    const TL = points.topLeft;
    const TR = points.topRight;
    const BL = points.bottomLeft;
    const BR = points.bottomRight;

    // Bilinear interpolation from unit square (s,t) to destination quad
    const interpolateQuad = (s: number, t: number) => {
      const x = (1 - s) * (1 - t) * TL.x + s * (1 - t) * TR.x + (1 - s) * t * BL.x + s * t * BR.x;
      const y = (1 - s) * (1 - t) * TL.y + s * (1 - t) * TR.y + (1 - s) * t * BL.y + s * t * BR.y;
      return { x, y };
    };

    // Calculate affine transform matrix for triangle mapping
    const calculateTriangleTransform = (
      src: { x: number; y: number; }[],
      dst: { x: number; y: number; }[]
    ) => {
      const [s0, s1, s2] = src;
      const [d0, d1, d2] = dst;

      const denom = s0.x * (s1.y - s2.y) + s1.x * (s2.y - s0.y) + s2.x * (s0.y - s1.y);
      if (Math.abs(denom) < 1e-10) return null; // Degenerate triangle

      const a = (d0.x * (s1.y - s2.y) + d1.x * (s2.y - s0.y) + d2.x * (s0.y - s1.y)) / denom;
      const b = (d0.y * (s1.y - s2.y) + d1.y * (s2.y - s0.y) + d2.y * (s0.y - s1.y)) / denom;
      const c = (d0.x * (s2.x - s1.x) + d1.x * (s0.x - s2.x) + d2.x * (s1.x - s0.x)) / denom;
      const d = (d0.y * (s2.x - s1.x) + d1.y * (s0.x - s2.x) + d2.y * (s1.x - s0.x)) / denom;
      const e = (d0.x * (s1.x * s2.y - s2.x * s1.y) + d1.x * (s2.x * s0.y - s0.x * s2.y) + d2.x * (s0.x * s1.y - s1.x * s0.y)) / denom;
      const f = (d0.y * (s1.x * s2.y - s2.x * s1.y) + d1.y * (s2.x * s0.y - s0.x * s2.y) + d2.y * (s0.x * s1.y - s1.x * s0.y)) / denom;

      return { a, b, c, d, e, f };
    };

    const imgWidth = croppedImg.naturalWidth || croppedImg.width;
    const imgHeight = croppedImg.naturalHeight || croppedImg.height;

    // Use smaller subdivision with significant overlap for gap-free rendering
    const SUBDIVISIONS = 24;
    const OVERLAP_PERCENT = 0.02; // 2% overlap in UV space

    // Draw overlapping quads to completely eliminate gaps
    for (let row = 0; row < SUBDIVISIONS; row++) {
      for (let col = 0; col < SUBDIVISIONS; col++) {
        const s0 = col / SUBDIVISIONS;
        const s1 = (col + 1) / SUBDIVISIONS;
        const t0 = row / SUBDIVISIONS;
        const t1 = (row + 1) / SUBDIVISIONS;

        // Add significant overlap to ensure no gaps
        const s0Expanded = Math.max(0, s0 - OVERLAP_PERCENT);
        const s1Expanded = Math.min(1, s1 + OVERLAP_PERCENT);
        const t0Expanded = Math.max(0, t0 - OVERLAP_PERCENT);
        const t1Expanded = Math.min(1, t1 + OVERLAP_PERCENT);

        // Source rectangle in image coordinates
        const srcX = s0Expanded * imgWidth;
        const srcY = t0Expanded * imgHeight;
        const srcW = (s1Expanded - s0Expanded) * imgWidth;
        const srcH = (t1Expanded - t0Expanded) * imgHeight;

        // Destination quad corners
        const dstTL = interpolateQuad(s0Expanded, t0Expanded);
        const dstTR = interpolateQuad(s1Expanded, t0Expanded);
        const dstBL = interpolateQuad(s0Expanded, t1Expanded);
        const dstBR = interpolateQuad(s1Expanded, t1Expanded);

        // Draw the quad using two triangles with proper perspective
        // Triangle 1: TL -> TR -> BR
        const srcTri1 = [
          { x: srcX, y: srcY },
          { x: srcX + srcW, y: srcY },
          { x: srcX + srcW, y: srcY + srcH }
        ];
        const dstTri1 = [dstTL, dstTR, dstBR];

        const transform1 = calculateTriangleTransform(srcTri1, dstTri1);
        if (transform1) {
          ctx.save();

          // Create expanded clipping path to eliminate gaps
          const expansion = 2;
          ctx.beginPath();
          ctx.moveTo(dstTri1[0].x - expansion, dstTri1[0].y - expansion);
          ctx.lineTo(dstTri1[1].x + expansion, dstTri1[1].y - expansion);
          ctx.lineTo(dstTri1[2].x + expansion, dstTri1[2].y + expansion);
          ctx.closePath();
          ctx.clip();

          ctx.setTransform(transform1.a, transform1.b, transform1.c, transform1.d, transform1.e, transform1.f);
          ctx.drawImage(croppedImg, 0, 0);
          ctx.restore();
        }

        // Triangle 2: TL -> BR -> BL
        const srcTri2 = [
          { x: srcX, y: srcY },
          { x: srcX + srcW, y: srcY + srcH },
          { x: srcX, y: srcY + srcH }
        ];
        const dstTri2 = [dstTL, dstBR, dstBL];

        const transform2 = calculateTriangleTransform(srcTri2, dstTri2);
        if (transform2) {
          ctx.save();

          // Create expanded clipping path to eliminate gaps
          const expansion = 2;
          ctx.beginPath();
          ctx.moveTo(dstTri2[0].x - expansion, dstTri2[0].y - expansion);
          ctx.lineTo(dstTri2[1].x + expansion, dstTri2[1].y + expansion);
          ctx.lineTo(dstTri2[2].x - expansion, dstTri2[2].y + expansion);
          ctx.closePath();
          ctx.clip();

          ctx.setTransform(transform2.a, transform2.b, transform2.c, transform2.d, transform2.e, transform2.f);
          ctx.drawImage(croppedImg, 0, 0);
          ctx.restore();
        }
      }
    }

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

  const downloadFinalImage = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Create a download link
    const link = document.createElement('a');
    link.download = `profile-mapping-${selectedTemplate?.name || 'template'}-${Date.now()}.png`;

    // Convert canvas to blob and create download URL
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
      }
    }, 'image/png', 1.0);
  }, [selectedTemplate?.name]);

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
            <Button variant="secondary" size="lg" fullWidth onClick={onBack}>
              ← Back to Cropping
            </Button>
            <Button variant="outline" size="lg" fullWidth onClick={onReset}>
              🔄 Start Over
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
              <ControlsHeader>
                <ControlTitle>Fine-tune Position</ControlTitle>
                <ToggleButton onClick={() => setShowControls(!showControls)}>
                  <span>{showControls ? 'Hide' : 'Show'} Mapping Controls</span>
                  <ToggleIcon $isOpen={showControls}>▼</ToggleIcon>
                </ToggleButton>
              </ControlsHeader>

              {showControls && (
                <ControlGrid>
                  <ControlGroup>
                    <ControlLabel>Top Left Corner</ControlLabel>
                    <ControlRow>
                      <SliderContainer>
                        <SliderLabel>X Position</SliderLabel>
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
                        <SliderLabel>Y Position</SliderLabel>
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
                        <SliderLabel>X Position</SliderLabel>
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
                        <SliderLabel>Y Position</SliderLabel>
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
                        <SliderLabel>X Position</SliderLabel>
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
                        <SliderLabel>Y Position</SliderLabel>
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
                        <SliderLabel>X Position</SliderLabel>
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
                        <SliderLabel>Y Position</SliderLabel>
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
                </ControlGrid>
              )}
            </ControlPanel>
          </MappingArea>
        </ContentArea>

        <Footer>
          <Button variant="primary" size="lg" fullWidth onClick={downloadFinalImage}>
            📥 Download Final Image
          </Button>
          <Button variant="secondary" size="lg" fullWidth onClick={onBack}>
            ← Back to Cropping
          </Button>
          <Button variant="outline" size="lg" fullWidth onClick={onReset}>
            🔄 Start Over
          </Button>
        </Footer>
      </Container>
    </Wrapper>
  );
};

export default MappingFinalImage;
