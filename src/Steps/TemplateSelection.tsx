import styled, { css } from 'styled-components';
import template1 from '../assets/templates/1.png';
import { media, theme } from '../theme';
import Template from '../type/Template.type';

const LayoutTemplates: Template[] = [
  {
    name: 'Template 1',
    image: template1,
    mapping: {
      topLeft: { x: 13, y: 11 },
      topRight: { x: 26, y: 23 },
      bottomLeft: { x: 12, y: 85 },
      bottomRight: { x: 26, y: 79 }
    }
  },
  {
    name: 'Template 2',
    image: template1,
    mapping: {
      topLeft: { x: 13, y: 11 },
      topRight: { x: 26, y: 23 },
      bottomLeft: { x: 12, y: 85 },
      bottomRight: { x: 26, y: 79 }
    }
  },
  {
    name: 'Template 3',
    image: template1,
    mapping: {
      topLeft: { x: 13, y: 11 },
      topRight: { x: 26, y: 23 },
      bottomLeft: { x: 12, y: 85 },
      bottomRight: { x: 26, y: 79 }
    }
  }
];

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${theme.spacing[4]};
  
  ${media.sm} {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: ${theme.spacing[5]};
  }
  
  ${media.md} {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: ${theme.spacing[6]};
  }
`;

const GridItem = styled.div<{ $selected: boolean; }>`
  width: 100%;
  position: relative;
  cursor: pointer;
  transition: all ${theme.animation.duration.normal} ${theme.animation.easing.ease};
  aspect-ratio: 4/3;
  border-radius: ${theme.borderRadius['2xl']};
  overflow: hidden;
  box-shadow: 0 2px 8px -2px rgba(0, 0, 0, 0.08), 0 4px 16px -4px rgba(0, 0, 0, 0.04);
  
  /* Mobile-first: smaller transforms for touch */
  ${({ $selected }) => $selected && css`
    transform: scale(1.02);
    z-index: 1;
    box-shadow: 
      0 0 0 3px ${theme.colors.primary[500]},
      0 0 0 6px ${theme.colors.primary[100]},
      0 8px 32px -4px ${theme.colors.primary[500]}25,
      0 16px 48px -8px ${theme.colors.primary[500]}15,
      0 4px 20px -2px rgba(0, 0, 0, 0.12);
  `}
  
  &:hover {
    transform: scale(1.01);
    box-shadow: 
      0 4px 16px -2px rgba(0, 0, 0, 0.12),
      0 8px 24px -4px rgba(0, 0, 0, 0.08),
      0 2px 8px -2px ${theme.colors.primary[300]}20;
  }
  
  &:active {
    transform: scale(0.98);
    box-shadow: 0 1px 4px -1px rgba(0, 0, 0, 0.1), 0 2px 8px -2px rgba(0, 0, 0, 0.06);
  }
  
  ${media.sm} {
    ${({ $selected }) => $selected && css`
      transform: scale(1.05);
      box-shadow: 
        0 0 0 4px ${theme.colors.primary[500]},
        0 0 0 8px ${theme.colors.primary[100]},
        0 12px 40px -6px ${theme.colors.primary[500]}30,
        0 20px 56px -12px ${theme.colors.primary[500]}18,
        0 6px 24px -3px rgba(0, 0, 0, 0.15);
    `}
    
    &:hover {
      transform: scale(1.02);
      box-shadow: 
        0 6px 20px -3px rgba(0, 0, 0, 0.15),
        0 10px 32px -6px rgba(0, 0, 0, 0.1),
        0 3px 12px -2px ${theme.colors.primary[300]}25;
    }
  }
  
  ${media.md} {
    aspect-ratio: 4/3;
  }
`;

const Image = styled.img<{ $selected: boolean; }>`
  width: 100%;
  height: 100%;
  object-fit: contain;
  border: none;
  border-radius: ${theme.borderRadius.xl};
  transition: all ${theme.animation.duration.normal} ${theme.animation.easing.ease};
  display: block;
`;

const CheckMark = styled.div`
  position: absolute;
  top: ${theme.spacing[2]};
  right: ${theme.spacing[2]};
  width: 36px;
  height: 36px;
  background-color: ${theme.colors.primary[500]};
  border-radius: ${theme.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: ${theme.typography.fontWeight.bold};
  font-size: ${theme.typography.fontSize.lg};
  box-shadow: ${theme.boxShadow.lg};
  z-index: 2;
  border: 2px solid white;
  
  ${media.sm} {
    width: 32px;
    height: 32px;
    font-size: ${theme.typography.fontSize.base};
  }
`;

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





interface TemplateSelectionProps {
  selectedTemplate: Template | null;
  setSelectedTemplate: (template: Template) => void;
  onNext: () => void;
}

const TemplateSelection = ({ selectedTemplate, setSelectedTemplate, onNext }: TemplateSelectionProps) => {
  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template);
    // Auto-advance to next step after a short delay for visual feedback
    setTimeout(() => {
      onNext();
    }, 300);
  };

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
              <GridItem key={template.name} onClick={() => handleTemplateSelect(template)} $selected={isSelected}>
                <Image src={template.image} alt={template.name} $selected={isSelected} />
                {isSelected && <CheckMark>✓</CheckMark>}
              </GridItem>
            );
          })}
        </Grid>
      </Container>
    </Wrapper>
  );
};

export default TemplateSelection;