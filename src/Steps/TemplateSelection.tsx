import styled, { css } from 'styled-components';
import template1 from '../assets/templates/1.png';
import Template from '../type/Template.type';

const LayoutTemplates: Template[] = [
  {
    name: 'Template 1',
    image: template1,
  },
  {
    name: 'Template 2',
    image: template1,
  },
  {
    name: 'Template 3',
    image: template1,
  }
]

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  
  @media (max-width: 640px) {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
  }
  
  @media (max-width: 320px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`

const GridItem = styled.div<{ $selected: boolean }>`
  width: 100%;
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
  aspect-ratio: 4/3;
  
  ${({ $selected }) => $selected && css`
    transform: scale(1.05);
  `}
  
  &:hover {
    transform: scale(1.02);
  }
  
  @media (max-width: 480px) {
    aspect-ratio: 16/10;
    
    ${({ $selected }) => $selected && css`
      transform: scale(1.02);
    `}
    
    &:hover {
      transform: scale(1.01);
    }
  }
`

const Image = styled.img<{ $selected: boolean }>`
  width: 100%;
  height: 100%;
  object-fit: contain;
  border: 3px solid transparent;
  border-radius: 12px;
  transition: all 0.3s ease;
  
  ${({ $selected }) => $selected && css`
    border-color: #3b82f6;
    box-shadow: 0 0 20px rgba(59, 130, 246, 0.5), 0 8px 25px rgba(0, 0, 0, 0.3);
  `}
  
  &:hover {
    border-color: #93c5fd;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  }
`

const CheckMark = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  width: 32px;
  height: 32px;
  background-color: #3b82f6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 18px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  z-index: 1;
`

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
`

const NextButton = styled.button<{ $disabled: boolean }>`
  padding: 1rem 2rem;
  background-color: ${({ $disabled }) => $disabled ? '#94a3b8' : '#3b82f6'};
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: ${({ $disabled }) => $disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  min-width: 200px;
  
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
  }
  
  ${({ $disabled }) => !$disabled && css`
    &:hover {
      background-color: #2563eb;
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
    }
    
    @media (max-width: 480px) {
      &:hover {
        transform: translateY(-1px);
      }
    }
  `}
`

interface TemplateSelectionProps {
  selectedTemplate: Template | null;
  setSelectedTemplate: (template: Template) => void;
  onNext: () => void;
}

const TemplateSelection = ({ selectedTemplate, setSelectedTemplate, onNext }: TemplateSelectionProps) => {
  const hasSelection = selectedTemplate !== null;

  return (
    <Wrapper>
      <Container>
        <Header>
          <Title>Choose Your Template</Title>
          <Subtitle>Select a template design for your profile mockup</Subtitle>
        </Header>

        <Grid>
          {LayoutTemplates.map((template) => {
            const isSelected = selectedTemplate?.name === template.name;
            return (
              <GridItem key={template.name} onClick={() => setSelectedTemplate(template)} $selected={isSelected}>
                <Image src={template.image} alt={template.name} $selected={isSelected} />
                {isSelected && <CheckMark>✓</CheckMark>}
              </GridItem>
            );
          })}
        </Grid>

        <Footer>
          <NextButton
            $disabled={!hasSelection}
            onClick={hasSelection ? onNext : undefined}
          >
            {hasSelection ? 'Continue to Upload' : 'Select a Template'}
          </NextButton>
        </Footer>
      </Container>
    </Wrapper>
  );
}

export default TemplateSelection;