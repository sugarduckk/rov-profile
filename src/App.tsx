import { useState } from 'react';
import styled from 'styled-components';
import './App.css'
import Step from './type/Step.type';
import TemplateSelection from './Steps/TemplateSelection';
import Template from './type/Template.type';
import UploadProfileImage from './Steps/UploadProfileImage';
import ProfileCropping from './Steps/ProfileCropping';
import MappingFinalImage from './Steps/MappingFinalImage';

const AppWrapper = styled.div`
  width: 100vw;
  min-height: 100vh;
  overflow-x: hidden;
`;

function App() {
  const [step, setStep] = useState<Step>(Step.SELECT_TEMPLATE);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<{
    dataUrl: string;
    path: string;
  } | null>(null);
  const [croppedImage, setCroppedImage] = useState<Blob | null>(null);

  return (
    <AppWrapper>
      {step === Step.SELECT_TEMPLATE && (
        <TemplateSelection
          selectedTemplate={selectedTemplate}
          setSelectedTemplate={setSelectedTemplate}
          onNext={() => setStep(Step.UPLOAD_PROFILE_IMAGE)}
        />
      )}
      {step === Step.UPLOAD_PROFILE_IMAGE && (
        <UploadProfileImage
          profileImageUrl={profileImageUrl}
          setProfileImageUrl={setProfileImageUrl}
          onNext={() => setStep(Step.PROFILE_CROPPING)}
          onBack={() => setStep(Step.SELECT_TEMPLATE)}
        />
      )}
      {step === Step.PROFILE_CROPPING && (
        <ProfileCropping
          profileImageUrl={profileImageUrl}
          setCroppedImage={setCroppedImage}
          onNext={() => setStep(Step.MAPPING_FINAL_IMAGE)}
          onBack={() => setStep(Step.UPLOAD_PROFILE_IMAGE)}
        />
      )}
      {step === Step.MAPPING_FINAL_IMAGE && (
        <MappingFinalImage
          selectedTemplate={selectedTemplate}
          profileImageUrl={profileImageUrl}
          croppedImage={croppedImage}
          onBack={() => setStep(Step.PROFILE_CROPPING)}
        />
      )}
    </AppWrapper>
  )
}

export default App
