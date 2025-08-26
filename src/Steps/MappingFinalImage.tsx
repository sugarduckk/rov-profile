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
  text-align: center;
  
  @media (max-width: 768px) {
    padding: 2rem;
  }
  
  @media (max-width: 480px) {
    padding: 1.5rem;
  }
`;

const PlaceholderIcon = styled.div`
  font-size: 5rem;
  margin-bottom: 2rem;
  color: #3b82f6;
  
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

const MappingFinalImage = ({ selectedTemplate, profileImageUrl, croppedImage, onBack }: MappingFinalImageProps) => {
  return (
    <Wrapper>
      <Container>
        <Header>
          <Title>Final Image Mapping</Title>
          <Subtitle>Map your cropped profile image onto the selected template</Subtitle>
        </Header>

        <ContentArea>
          <PlaceholderIcon>🎨</PlaceholderIcon>
          <PlaceholderText>Final Mapping Step</PlaceholderText>
          <PlaceholderSubtext>
            This is where we'll combine your selected template with your cropped profile image.
            The mapping functionality will be implemented to create the final profile mockup.
          </PlaceholderSubtext>

          {selectedTemplate && (
            <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#f0f9ff', borderRadius: '8px' }}>
              <p style={{ margin: 0, color: '#1e40af', fontWeight: '500' }}>
                ✅ Template: {selectedTemplate.name}
              </p>
            </div>
          )}

          {profileImageUrl && (
            <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#f0fdf4', borderRadius: '8px' }}>
              <p style={{ margin: 0, color: '#15803d', fontWeight: '500' }}>
                ✅ Profile Image: Ready for mapping
              </p>
            </div>
          )}

          {croppedImage && (
            <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#fef3c7', borderRadius: '8px' }}>
              <p style={{ margin: 0, color: '#92400e', fontWeight: '500' }}>
                ✅ Cropped Image: Ready for mapping
              </p>
            </div>
          )}
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
