import React, { useState } from 'react';
import styled from 'styled-components';
import {
  Image,
  fetchURL,
  cannyEdgeDetector,
  close,
  RoiMapManager,
  RoiKind,
  Mask,
} from 'image-js';

const DebugWrapper = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

const DebugTitle = styled.h3`
  color: #1e293b;
  margin-bottom: 1.5rem;
  font-size: 1.25rem;
  font-weight: 600;
`;

const StepGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StepCard = styled.div`
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
`;

const StepTitle = styled.h4`
  color: #374151;
  margin: 0 0 0.75rem 0;
  font-size: 0.9rem;
  font-weight: 600;
`;

const StepImage = styled.img`
  max-width: 100%;
  height: auto;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  margin-bottom: 0.5rem;
`;



const StepInfo = styled.div`
  font-size: 0.8rem;
  color: #6b7280;
  text-align: left;
`;

const ParametersSection = styled.div`
  background: #f8fafc;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1.5rem;
`;

const ParameterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const ParameterControl = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const ParameterLabel = styled.label`
  font-size: 0.85rem;
  font-weight: 500;
  color: #374151;
`;

const ParameterInput = styled.input`
  padding: 0.4rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 0.85rem;
`;

const ProcessButton = styled.button`
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  cursor: pointer;
  
  &:hover {
    background: #2563eb;
  }
  
  &:disabled {
    background: #94a3b8;
    cursor: not-allowed;
  }
`;

const PresetButton = styled.button`
  padding: 0.4rem 0.8rem;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
  
  &:hover {
    background: #059669;
  }
`;

const PresetSection = styled.div`
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
`;

const PresetLabel = styled.div`
  font-size: 0.9rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
`;

const ResultsSection = styled.div`
  background: #f0fdf4;
  border: 1px solid #22c55e;
  border-radius: 8px;
  padding: 1rem;
  margin-top: 1rem;
`;

interface ProcessingStep {
  name: string;
  dataUrl?: string;
  canvas?: HTMLCanvasElement;
  info: string[];
}

interface DetectionParameters {
  cropPercent: number;
  // Contrast Enhancement
  enhanceContrast: boolean;
  contrastMethod: 'histogram' | 'clahe' | 'stretch' | 'gamma';
  contrastStrength: number;
  gammaValue: number;
  // Edge Detection
  lowThreshold: number;
  highThreshold: number;
  gaussianSigma: number;
  kernelSize: number;
  iterations: number;
  minAreaPercent: number;
  minAspectRatio: number;
  maxColumnOffset: number;
  minRectangularity: number;
}

interface ImageProcessingDebuggerProps {
  imageDataUrl: string;
  onResultChange?: (result: { x: number; y: number; width: number; height: number } | null) => void;
}

const ImageProcessingDebugger: React.FC<ImageProcessingDebuggerProps> = ({
  imageDataUrl,
  onResultChange
}) => {
  const [processing, setProcessing] = useState(false);
  const [steps, setSteps] = useState<ProcessingStep[]>([]);
  const [finalResult, setFinalResult] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const [parameters, setParameters] = useState<DetectionParameters>({
    cropPercent: 40,
    // Contrast Enhancement - Disabled by default
    enhanceContrast: false,
    contrastMethod: 'stretch',
    contrastStrength: 2.0,
    gammaValue: 0.7,
    // Edge Detection - Optimized values from user testing
    lowThreshold: 0.05,
    highThreshold: 0.07,
    gaussianSigma: 0.1,
    kernelSize: 21,
    iterations: 2,
    minAreaPercent: 20,
    minAspectRatio: 1.5,
    maxColumnOffset: 15,
    minRectangularity: 0.85
  });




  // Real contrast enhancement for the debugger
  const enhanceImageContrast = (image: Image, method: string, strength: number, gamma: number): Image => {
    try {
      const rawData = (image as any).data as Uint8Array;
      if (!rawData) return image;

      const enhanced = new Uint8Array(rawData.length);
      const channels = (image as any).channels || 1;

      if (method === 'stretch') {
        // Contrast stretching
        let min = 255, max = 0;
        for (let i = 0; i < rawData.length; i += channels) {
          const value = rawData[i];
          min = Math.min(min, value);
          max = Math.max(max, value);
        }

        const range = max - min;
        if (range > 0) {
          for (let i = 0; i < rawData.length; i += channels) {
            const stretched = ((rawData[i] - min) / range) * 255;
            const amplified = Math.min(255, Math.max(0, stretched * strength));
            enhanced[i] = Math.round(amplified);

            // Copy other channels if they exist
            for (let c = 1; c < channels; c++) {
              enhanced[i + c] = rawData[i + c];
            }
          }
        } else {
          enhanced.set(rawData);
        }
      } else if (method === 'gamma') {
        // Gamma correction
        const gammaCorrection = 1.0 / gamma;
        for (let i = 0; i < rawData.length; i += channels) {
          const normalized = rawData[i] / 255.0;
          const corrected = Math.pow(normalized, gammaCorrection);
          enhanced[i] = Math.round(corrected * 255);

          // Copy other channels
          for (let c = 1; c < channels; c++) {
            enhanced[i + c] = rawData[i + c];
          }
        }
      } else {
        // Histogram equalization (simplified)
        const histogram = new Array(256).fill(0);
        for (let i = 0; i < rawData.length; i += channels) {
          histogram[rawData[i]]++;
        }

        // Calculate CDF
        const cdf = new Array(256);
        cdf[0] = histogram[0];
        for (let i = 1; i < 256; i++) {
          cdf[i] = cdf[i - 1] + histogram[i];
        }

        // Normalize
        const totalPixels = image.width * image.height;
        for (let i = 0; i < rawData.length; i += channels) {
          enhanced[i] = Math.round((cdf[rawData[i]] / totalPixels) * 255);

          // Copy other channels
          for (let c = 1; c < channels; c++) {
            enhanced[i + c] = rawData[i + c];
          }
        }
      }

      // Create new image with enhanced data
      // This is a simplified approach - we'll modify the data in place
      (image as any).data = enhanced;
      return image;
    } catch (error) {
      console.error('Enhancement failed:', error);
      return image;
    }
  };

  const createEdgeOverlay = (baseImage: Image, edgeData: Uint8Array): string => {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;

      canvas.width = baseImage.width;
      canvas.height = baseImage.height;

      // Create image data directly from base image and edge data
      const imageData = ctx.createImageData(baseImage.width, baseImage.height);
      const data = imageData.data;

      // Get base image data
      const baseData = (baseImage as any).data as Uint8Array;
      const channels = (baseImage as any).channels || 1;

      // Combine base image with edge overlay
      for (let i = 0; i < baseImage.width * baseImage.height; i++) {
        const pixelIndex = i * 4;
        const baseIndex = i * channels;

        if (edgeData[i] > 0) {
          // Edge pixel - make it bright red
          data[pixelIndex] = 255;     // R
          data[pixelIndex + 1] = 0;   // G
          data[pixelIndex + 2] = 0;   // B
          data[pixelIndex + 3] = 255; // A
        } else {
          // Regular pixel from base image
          if (channels === 1) {
            // Grayscale
            const value = baseData[baseIndex] || 0;
            data[pixelIndex] = value;
            data[pixelIndex + 1] = value;
            data[pixelIndex + 2] = value;
            data[pixelIndex + 3] = 255;
          } else {
            // RGB
            data[pixelIndex] = baseData[baseIndex] || 0;         // R
            data[pixelIndex + 1] = baseData[baseIndex + 1] || 0; // G
            data[pixelIndex + 2] = baseData[baseIndex + 2] || 0; // B
            data[pixelIndex + 3] = 255; // A
          }
        }
      }

      ctx.putImageData(imageData, 0, 0);
      return canvas.toDataURL();
    } catch (error) {
      console.error('Edge overlay creation failed:', error);
      return imageToDataUrl(baseImage); // Fallback to original
    }
  };

  const createROIOverlay = (baseImage: Image, rois: any[], selectedROI?: any): string => {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;

      canvas.width = baseImage.width;
      canvas.height = baseImage.height;

      // First, draw the base image
      const imageData = ctx.createImageData(baseImage.width, baseImage.height);
      const data = imageData.data;

      // Get base image data
      const baseData = (baseImage as any).data as Uint8Array;
      const channels = (baseImage as any).channels || 1;

      // Copy base image data
      for (let i = 0; i < baseImage.width * baseImage.height; i++) {
        const pixelIndex = i * 4;
        const baseIndex = i * channels;

        if (channels === 1) {
          // Grayscale
          const value = baseData[baseIndex] || 0;
          data[pixelIndex] = value;     // R
          data[pixelIndex + 1] = value; // G
          data[pixelIndex + 2] = value; // B
          data[pixelIndex + 3] = 255;   // A
        } else {
          // RGB
          data[pixelIndex] = baseData[baseIndex] || 0;         // R
          data[pixelIndex + 1] = baseData[baseIndex + 1] || 0; // G
          data[pixelIndex + 2] = baseData[baseIndex + 2] || 0; // B
          data[pixelIndex + 3] = 255; // A
        }
      }

      ctx.putImageData(imageData, 0, 0);

      // Now draw ROI bounding boxes
      rois.forEach((roi, index) => {
        const { width, height, origin } = roi;
        const area = roi.surface;
        const aspectRatio = height / width;
        const isSelected = selectedROI && roi === selectedROI;

        // Set different colors for selected vs unselected ROIs
        if (isSelected) {
          ctx.strokeStyle = '#22c55e'; // Green for selected
          ctx.lineWidth = 3;
        } else {
          ctx.strokeStyle = '#ef4444'; // Red for unselected
          ctx.lineWidth = 2;
        }

        // Draw bounding rectangle
        ctx.strokeRect(origin.column, origin.row, width, height);

        // Draw ROI label with detailed info
        ctx.font = '11px Arial';
        const titleLabel = isSelected ? `✅ Panel ${index + 1}` : `ROI ${index + 1}`;
        const sizeLabel = `${width}×${height}`;
        const areaLabel = `Area: ${area}`;
        const aspectLabel = `AR: ${aspectRatio.toFixed(2)}`;

        // Calculate text positions
        const textX = origin.column + 2;
        const titleY = origin.row - 5;
        const sizeY = origin.row - 18;
        const detailsY = origin.row - 31;

        // Draw title label background and text
        const titleMetrics = ctx.measureText(titleLabel);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.fillRect(textX - 1, titleY - 12, Math.max(titleMetrics.width + 2, 80), 14);

        ctx.fillStyle = isSelected ? '#22c55e' : '#ef4444';
        ctx.font = 'bold 11px Arial';
        ctx.fillText(titleLabel, textX, titleY);

        // Draw size info
        ctx.font = '10px Arial';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.fillRect(textX - 1, sizeY - 11, Math.max(ctx.measureText(sizeLabel).width + 2, 80), 12);

        ctx.fillStyle = '#374151';
        ctx.fillText(sizeLabel, textX, sizeY);

        // Draw additional details if there's space
        if (origin.row > 35) {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
          const detailsWidth = Math.max(ctx.measureText(areaLabel).width, ctx.measureText(aspectLabel).width) + 2;
          ctx.fillRect(textX - 1, detailsY - 11, Math.max(detailsWidth, 80), 24);

          ctx.fillStyle = '#6b7280';
          ctx.fillText(areaLabel, textX, detailsY);
          ctx.fillText(aspectLabel, textX, detailsY + 12);
        }
      });

      return canvas.toDataURL();
    } catch (error) {
      console.error('ROI overlay creation failed:', error);
      return imageToDataUrl(baseImage); // Fallback to original
    }
  };

  const imageToDataUrl = (image: Image | Mask): string => {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;

      canvas.width = image.width;
      canvas.height = image.height;

      const imageData = ctx.createImageData(image.width, image.height);
      const data = imageData.data;

      // Access the raw data safely
      const rawData = (image as any).data as Uint8Array;
      if (!rawData) {
        throw new Error('No image data available');
      }

      // Convert image-js data to ImageData format
      for (let i = 0; i < image.width * image.height; i++) {
        const pixelIndex = i * 4;

        if ((image as any).channels === 1 || image instanceof Mask) {
          // Grayscale or binary mask
          const value = rawData[i] || 0;
          data[pixelIndex] = value;     // R
          data[pixelIndex + 1] = value; // G
          data[pixelIndex + 2] = value; // B
          data[pixelIndex + 3] = 255;   // A
        } else {
          // RGB
          const channels = (image as any).channels || 3;
          data[pixelIndex] = rawData[i * channels] || 0;         // R
          data[pixelIndex + 1] = rawData[i * channels + 1] || 0; // G
          data[pixelIndex + 2] = rawData[i * channels + 2] || 0; // B
          data[pixelIndex + 3] = 255;   // A
        }
      }

      ctx.putImageData(imageData, 0, 0);
      return canvas.toDataURL();
    } catch (error) {
      console.error('Error converting image to data URL:', error);
      // Fallback: create a placeholder image
      const canvas = document.createElement('canvas');
      canvas.width = 200;
      canvas.height = 100;
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = '#f3f4f6';
      ctx.fillRect(0, 0, 200, 100);
      ctx.fillStyle = '#6b7280';
      ctx.font = '14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Processing Error', 100, 50);
      return canvas.toDataURL();
    }
  };



  const processImage = async () => {
    if (!imageDataUrl) return;

    setProcessing(true);
    setSteps([]);
    setFinalResult(null);

    try {
      const newSteps: ProcessingStep[] = [];

      // Step 1: Load original image
      const originalImage = await fetchURL(imageDataUrl);
      newSteps.push({
        name: "Original Image",
        dataUrl: imageDataUrl,
        info: [`Dimensions: ${originalImage.width}×${originalImage.height}`, `Channels: ${originalImage.channels}`]
      });

      // Step 2: Resize and crop
      const workingImage = originalImage.resize({ width: 1000 });
      const cropWidth = Math.round(workingImage.width * (parameters.cropPercent / 100));
      const cropped = workingImage.crop({
        origin: { column: 0, row: 0 },
        width: cropWidth,
        height: workingImage.height
      });

      newSteps.push({
        name: "Resized & Cropped",
        dataUrl: imageToDataUrl(cropped),
        info: [
          `Resized: ${workingImage.width}×${workingImage.height}`,
          `Cropped: ${cropped.width}×${cropped.height}`,
          `Crop: Left ${parameters.cropPercent}% (${cropWidth} pixels wide)`,
          `📐 Working dimensions: ${cropped.width}×${cropped.height} pixels`
        ]
      });

      // Step 3: Grayscale
      const grey = cropped.grey();
      newSteps.push({
        name: "Grayscale",
        dataUrl: imageToDataUrl(grey),
        info: [`Converted to grayscale`, `Single channel processing`]
      });

      // Step 4: Contrast Enhancement (optional - usually disabled)
      let processedGrey = grey;
      if (parameters.enhanceContrast) {
        try {
          // Create a copy to avoid modifying the original
          const greyData = (grey as any).data as Uint8Array;
          const greyCopy = Object.create(Object.getPrototypeOf(grey));
          Object.assign(greyCopy, grey);
          (greyCopy as any).data = new Uint8Array(greyData);

          // Apply real contrast enhancement
          processedGrey = enhanceImageContrast(
            greyCopy,
            parameters.contrastMethod,
            parameters.contrastStrength,
            parameters.gammaValue
          );

          // Calculate contrast statistics
          const originalData = (grey as any).data as Uint8Array;
          const enhancedData = (processedGrey as any).data as Uint8Array;

          let origMin = 255, origMax = 0, enhMin = 255, enhMax = 0;
          for (let i = 0; i < originalData.length; i++) {
            origMin = Math.min(origMin, originalData[i]);
            origMax = Math.max(origMax, originalData[i]);
            enhMin = Math.min(enhMin, enhancedData[i]);
            enhMax = Math.max(enhMax, enhancedData[i]);
          }

          newSteps.push({
            name: "Contrast Enhanced (Optional)",
            dataUrl: imageToDataUrl(processedGrey),
            info: [
              `✅ Enhancement applied successfully`,
              `Method: ${parameters.contrastMethod}`,
              parameters.contrastMethod === 'stretch' ? `Strength: ${parameters.contrastStrength}` :
                parameters.contrastMethod === 'gamma' ? `Gamma: ${parameters.gammaValue}` :
                  'Histogram Equalization',
              `Original range: ${origMin}-${origMax} (${origMax - origMin})`,
              `Enhanced range: ${enhMin}-${enhMax} (${enhMax - enhMin})`,
              `Note: Usually not needed with optimized thresholds`
            ]
          });
        } catch (error) {
          console.error('Contrast enhancement failed:', error);
          processedGrey = grey;
          newSteps.push({
            name: "Contrast Enhancement Failed",
            dataUrl: imageToDataUrl(grey),
            info: [
              `❌ Enhancement failed: ${error}`,
              `Using original grayscale image`,
              `Optimized thresholds should work without enhancement`
            ]
          });
        }
      }

      // Step 4 or 5: Edge detection with optimized parameters
      const edges = cannyEdgeDetector(processedGrey, {
        lowThreshold: parameters.lowThreshold,
        highThreshold: parameters.highThreshold,
        gaussianBlurOptions: { sigma: parameters.gaussianSigma },
      });

      // Check if edges were detected and enhance visibility
      const edgeData = (edges as any).data as Uint8Array;
      let edgeCount = 0;
      let minEdge = 255, maxEdge = 0;

      // First pass: count and find min/max edge values
      for (let i = 0; i < edgeData.length; i++) {
        if (edgeData[i] > 0) {
          edgeCount++;
          minEdge = Math.min(minEdge, edgeData[i]);
          maxEdge = Math.max(maxEdge, edgeData[i]);
        }
      }

      // Enhance edge visibility by setting all edge pixels to maximum brightness
      const enhancedEdgeData = new Uint8Array(edgeData.length);
      for (let i = 0; i < edgeData.length; i++) {
        enhancedEdgeData[i] = edgeData[i] > 0 ? 255 : 0; // Make edges bright white
      }

      // Create enhanced edge image for visualization
      const enhancedEdges = Object.create(Object.getPrototypeOf(edges));
      Object.assign(enhancedEdges, edges);
      (enhancedEdges as any).data = enhancedEdgeData;

      const edgePercentage = (edgeCount / edgeData.length) * 100;

      newSteps.push({
        name: `Edge Detection (Optimized) ${edgeCount === 0 ? '⚠️' : '✅'}`,
        dataUrl: imageToDataUrl(enhancedEdges), // Use enhanced edges for better visibility
        info: [
          `Edge pixels found: ${edgeCount} (${edgePercentage.toFixed(2)}%)`,
          edgeCount > 0 ? `Original edge intensity: ${minEdge}-${maxEdge} (enhanced to 255 for visibility)` : '',
          `🎯 Optimized thresholds: Low=${parameters.lowThreshold}, High=${parameters.highThreshold}`,
          `Gaussian σ: ${parameters.gaussianSigma} (minimal smoothing)`,
          `Applied to: ${parameters.enhanceContrast ? 'Contrast-enhanced' : 'Original'} grayscale`,
          edgeCount === 0 ? `❌ NO EDGES - Try "Ultra Sensitive" preset or lower values` :
            edgePercentage < 0.1 ? `⚠️ Few edges - try "Ultra Sensitive" preset` :
              edgePercentage > 10 ? `⚠️ Too many edges - try "Conservative" preset` :
                `✅ Excellent edge detection with optimized parameters`
        ].filter(info => info !== '') // Remove empty strings
      });

      // Step 5.5: Edge Overlay (show edges on original image for context)
      if (edgeCount > 0) {
        const edgeOverlay = createEdgeOverlay(cropped, enhancedEdgeData);
        newSteps.push({
          name: "🔴 Edge Overlay (Context)",
          dataUrl: edgeOverlay,
          info: [
            `✅ Detected edges overlaid on original cropped image`,
            `🔴 Red pixels = detected panel edges (${edgeCount} total)`,
            `Original edge values were ${minEdge}-${maxEdge} (too faint to see)`,
            `Enhanced to 255 (bright white) and overlaid as red for visibility`,
            `Use this to verify edge detection accuracy and coverage`
          ]
        });
      }

      // Step 6: Morphological closing (use original edges, not enhanced)
      const kernel = Array(parameters.kernelSize).fill(Array(parameters.kernelSize).fill(1));
      const closedMask = close(edges, { kernel, iterations: parameters.iterations });

      newSteps.push({
        name: "Morphological Closing",
        dataUrl: imageToDataUrl(closedMask),
        info: [
          `Kernel size: ${parameters.kernelSize}×${parameters.kernelSize}`,
          `Iterations: ${parameters.iterations}`,
          `Purpose: Connect edges and fill shapes`,
          `Applied to original edge data (not visualization-enhanced)`
        ]
      });

      // Step 7: Find ROIs
      const roiMapManager = RoiMapManager.fromMask(closedMask);
      const rois = roiMapManager.getRois({ kind: RoiKind.WHITE });

      newSteps.push({
        name: "Region Detection",
        dataUrl: rois.length > 0 ? createROIOverlay(cropped, rois) : imageToDataUrl(cropped),
        info: [
          `Found ${rois.length} regions of interest`,
          rois.length === 0 ? `❌ No regions detected - check morphological closing` :
            `🔍 All detected regions shown with red bounding boxes`,
          `Next: Apply filters to find valid panels`
        ]
      });

      // Step 8: Filter and analyze ROIs
      let bestPanel = null;
      const filteredInfo: string[] = [`Applying ${rois.length} ROI filters:`];
      const passedROIs: any[] = [];
      const failedROIs: any[] = [];

      for (let i = 0; i < rois.length; i++) {
        const roi = rois[i];
        const { width, height, origin } = roi;
        const area = roi.surface;
        const minArea = cropped.width * cropped.height * (parameters.minAreaPercent / 100);
        const aspectRatio = height / width;
        const rectangularity = area / (width * height);

        let passed = true;
        const checks: string[] = [];

        if (area < minArea) {
          checks.push(`❌ Area: ${area} < ${minArea.toFixed(0)}`);
          passed = false;
        } else {
          checks.push(`✅ Area: ${area} >= ${minArea.toFixed(0)}`);
        }

        if (aspectRatio < parameters.minAspectRatio) {
          checks.push(`❌ Aspect: ${aspectRatio.toFixed(2)} < ${parameters.minAspectRatio}`);
          passed = false;
        } else {
          checks.push(`✅ Aspect: ${aspectRatio.toFixed(2)} >= ${parameters.minAspectRatio}`);
        }

        if (origin.column > parameters.maxColumnOffset) {
          checks.push(`❌ Position: ${origin.column} > ${parameters.maxColumnOffset}`);
          passed = false;
        } else {
          checks.push(`✅ Position: ${origin.column} <= ${parameters.maxColumnOffset}`);
        }

        if (rectangularity < parameters.minRectangularity) {
          checks.push(`❌ Rectangularity: ${rectangularity.toFixed(2)} < ${parameters.minRectangularity}`);
          passed = false;
        } else {
          checks.push(`✅ Rectangularity: ${rectangularity.toFixed(2)} >= ${parameters.minRectangularity}`);
        }

        filteredInfo.push(`ROI ${i + 1} at (${origin.column},${origin.row}) [${width}×${height}]: ${passed ? '✅ PASSED' : '❌ FAILED'}`);
        filteredInfo.push(`  📏 Dimensions: ${width}×${height} pixels`);
        filteredInfo.push(...checks.map(check => `  ${check}`));

        if (passed) {
          passedROIs.push(roi);
          if (!bestPanel || area > bestPanel.surface) {
            bestPanel = roi;
          }
        } else {
          failedROIs.push(roi);
        }
      }

      // Add filtering visualization step
      if (rois.length > 0) {
        newSteps.push({
          name: "ROI Filtering Analysis",
          dataUrl: createROIOverlay(cropped, rois, bestPanel),
          info: [
            `📊 Total ROIs analyzed: ${rois.length}`,
            `✅ Passed filters: ${passedROIs.length}`,
            `❌ Failed filters: ${failedROIs.length}`,
            bestPanel ? `🏆 Best ROI selected (largest area among passed)` : `⚠️ No ROI met all criteria`,
            `🟢 Green = Selected panel | 🔴 Red = Other regions`
          ]
        });
      }

      if (bestPanel) {
        // Scale back to original coordinates
        const scaleX = originalImage.width / workingImage.width;
        const scaleY = originalImage.height / workingImage.height;

        const result = {
          x: Math.round(bestPanel.origin.column * scaleX),
          y: Math.round(bestPanel.origin.row * scaleY),
          width: Math.round(bestPanel.width * scaleX),
          height: Math.round(bestPanel.height * scaleY),
        };

        setFinalResult(result);
        onResultChange?.(result);

        filteredInfo.push(`🎯 Selected panel scaled to original: ${result.x},${result.y} ${result.width}×${result.height}`);
      } else {
        filteredInfo.push(`❌ No ROI passed all filters`);
        onResultChange?.(null);
      }

      newSteps.push({
        name: bestPanel ? "✅ Panel Detection Success" : "❌ Panel Detection Failed",
        dataUrl: bestPanel ? createROIOverlay(cropped, rois, bestPanel) :
          rois.length > 0 ? createROIOverlay(cropped, rois) : imageToDataUrl(cropped),
        info: [
          ...filteredInfo,
          bestPanel ? `✅ Panel successfully detected and highlighted in green` : `❌ No valid panel found`,
          bestPanel ? `🎯 Green bounding box shows the final detected panel` :
            rois.length > 0 ? `🔍 All detected regions failed the filtering criteria` : `⚠️ No regions detected from morphological closing`,
          bestPanel ? `📏 Panel details shown in overlay: size, area, aspect ratio` :
            `💡 Try adjusting morphology kernel size or detection thresholds`
        ]
      });

      setSteps(newSteps);
    } catch (error) {
      console.error('Processing failed:', error);
    } finally {
      setProcessing(false);
    }
  };

  const updateParameter = <K extends keyof DetectionParameters>(
    key: K,
    value: DetectionParameters[K]
  ) => {
    setParameters(prev => ({ ...prev, [key]: value }));
  };

  // Preset configurations for common scenarios
  const applyPreset = (preset: string) => {
    switch (preset) {
      case 'optimized':
        // Use the user-tested optimal values
        setParameters(prev => ({
          ...prev,
          enhanceContrast: false,
          lowThreshold: 0.05,
          highThreshold: 0.07,
          gaussianSigma: 0.1,
        }));
        break;
      case 'ultra-sensitive':
        setParameters(prev => ({
          ...prev,
          enhanceContrast: false,
          lowThreshold: 0.01,
          highThreshold: 0.05,
          gaussianSigma: 0.1,
        }));
        break;
      case 'moderate':
        setParameters(prev => ({
          ...prev,
          enhanceContrast: false,
          lowThreshold: 0.1,
          highThreshold: 0.3,
          gaussianSigma: 0.5,
        }));
        break;
      case 'conservative':
        setParameters(prev => ({
          ...prev,
          enhanceContrast: false,
          lowThreshold: 1,
          highThreshold: 5,
          gaussianSigma: 1.0,
        }));
        break;
    }
  };

  return (
    <DebugWrapper>
      <DebugTitle>🔍 Image Processing Algorithm Debugger</DebugTitle>

      <ParametersSection>
        <h4 style={{ margin: '0 0 1rem 0', color: '#374151' }}>Algorithm Parameters</h4>
        <ParameterGrid>
          <ParameterControl>
            <ParameterLabel>Crop Percentage (%)</ParameterLabel>
            <ParameterInput
              type="number"
              value={parameters.cropPercent}
              onChange={(e) => updateParameter('cropPercent', Number(e.target.value))}
              min="10"
              max="100"
            />
          </ParameterControl>

          {/* Contrast Enhancement Section - Collapsed by default */}
          <ParameterControl style={{ gridColumn: 'span 2' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <input
                type="checkbox"
                checked={parameters.enhanceContrast}
                onChange={(e) => updateParameter('enhanceContrast', e.target.checked)}
                id="enhance-contrast"
              />
              <ParameterLabel htmlFor="enhance-contrast" style={{ margin: 0 }}>
                🔆 Enable Contrast Enhancement (Optional)
              </ParameterLabel>
            </div>
            <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
              Not needed with optimized thresholds - leave unchecked
            </div>
          </ParameterControl>

          {parameters.enhanceContrast && (
            <>
              <ParameterControl>
                <ParameterLabel>Contrast Method</ParameterLabel>
                <select
                  value={parameters.contrastMethod}
                  onChange={(e) => updateParameter('contrastMethod', e.target.value as any)}
                  style={{
                    padding: '0.4rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    fontSize: '0.85rem'
                  }}
                >
                  <option value="histogram">Histogram Equalization</option>
                  <option value="stretch">Contrast Stretching</option>
                  <option value="gamma">Gamma Correction</option>
                </select>
              </ParameterControl>

              {parameters.contrastMethod === 'stretch' && (
                <ParameterControl>
                  <ParameterLabel>Contrast Strength</ParameterLabel>
                  <ParameterInput
                    type="number"
                    step="0.1"
                    value={parameters.contrastStrength}
                    onChange={(e) => updateParameter('contrastStrength', Number(e.target.value))}
                    min="0.5"
                    max="3.0"
                  />
                </ParameterControl>
              )}

              {parameters.contrastMethod === 'gamma' && (
                <ParameterControl>
                  <ParameterLabel>Gamma Value</ParameterLabel>
                  <ParameterInput
                    type="number"
                    step="0.1"
                    value={parameters.gammaValue}
                    onChange={(e) => updateParameter('gammaValue', Number(e.target.value))}
                    min="0.1"
                    max="3.0"
                  />
                </ParameterControl>
              )}
            </>
          )}

          {/* Edge Detection Section */}
          <ParameterControl>
            <ParameterLabel>Canny Low Threshold</ParameterLabel>
            <ParameterInput
              type="number"
              step="0.01"
              value={parameters.lowThreshold}
              onChange={(e) => updateParameter('lowThreshold', Number(e.target.value))}
              min="0.01"
              max="10"
            />
          </ParameterControl>
          <ParameterControl>
            <ParameterLabel>Canny High Threshold</ParameterLabel>
            <ParameterInput
              type="number"
              step="0.01"
              value={parameters.highThreshold}
              onChange={(e) => updateParameter('highThreshold', Number(e.target.value))}
              min="0.01"
              max="20"
            />
          </ParameterControl>
          <ParameterControl>
            <ParameterLabel>Gaussian Sigma</ParameterLabel>
            <ParameterInput
              type="number"
              step="0.1"
              value={parameters.gaussianSigma}
              onChange={(e) => updateParameter('gaussianSigma', Number(e.target.value))}
              min="0.1"
              max="3.0"
            />
          </ParameterControl>
          <ParameterControl>
            <ParameterLabel>Morphology Kernel Size</ParameterLabel>
            <ParameterInput
              type="number"
              value={parameters.kernelSize}
              onChange={(e) => updateParameter('kernelSize', Number(e.target.value))}
              min="3"
              max="51"
              step="2"
            />
          </ParameterControl>
          <ParameterControl>
            <ParameterLabel>Morphology Iterations</ParameterLabel>
            <ParameterInput
              type="number"
              value={parameters.iterations}
              onChange={(e) => updateParameter('iterations', Number(e.target.value))}
              min="1"
              max="5"
            />
          </ParameterControl>
          <ParameterControl>
            <ParameterLabel>Min Area (%)</ParameterLabel>
            <ParameterInput
              type="number"
              value={parameters.minAreaPercent}
              onChange={(e) => updateParameter('minAreaPercent', Number(e.target.value))}
              min="1"
              max="50"
            />
          </ParameterControl>
          <ParameterControl>
            <ParameterLabel>Min Aspect Ratio</ParameterLabel>
            <ParameterInput
              type="number"
              step="0.1"
              value={parameters.minAspectRatio}
              onChange={(e) => updateParameter('minAspectRatio', Number(e.target.value))}
              min="0.5"
              max="5.0"
            />
          </ParameterControl>
        </ParameterGrid>

        <PresetSection>
          <PresetLabel>🎛️ Quick Presets (Optimized Values):</PresetLabel>
          <PresetButton onClick={() => applyPreset('optimized')}>
            ✅ Optimized (0.05, 0.07, 0.1) - Recommended
          </PresetButton>
          <PresetButton onClick={() => applyPreset('ultra-sensitive')}>
            🔍 Ultra Sensitive (0.01, 0.05, 0.1)
          </PresetButton>
          <PresetButton onClick={() => applyPreset('moderate')}>
            📊 Moderate (0.1, 0.3, 0.5)
          </PresetButton>
          <PresetButton onClick={() => applyPreset('conservative')}>
            📈 Conservative (1, 5, 1.0)
          </PresetButton>
        </PresetSection>

        <div style={{ marginTop: '1rem' }}>
          <ProcessButton onClick={processImage} disabled={processing || !imageDataUrl}>
            {processing ? 'Processing...' : 'Run Algorithm'}
          </ProcessButton>
        </div>
      </ParametersSection>

      {steps.length > 0 && (
        <StepGrid>
          {steps.map((step, index) => (
            <StepCard key={index}>
              <StepTitle>{step.name}</StepTitle>
              {step.dataUrl && (
                <StepImage src={step.dataUrl} alt={step.name} />
              )}
              <StepInfo>
                {step.info.map((info, i) => (
                  <div key={i}>{info}</div>
                ))}
              </StepInfo>
            </StepCard>
          ))}
        </StepGrid>
      )}

      {finalResult && (
        <ResultsSection>
          <h4 style={{ margin: '0 0 0.5rem 0', color: '#166534' }}>✅ Detection Result</h4>
          <div style={{ fontSize: '0.9rem', color: '#166534' }}>
            <div><strong>Position:</strong> ({finalResult.x}, {finalResult.y})</div>
            <div><strong>Size:</strong> {finalResult.width} × {finalResult.height}</div>
            <div><strong>Percentage (approx):</strong> x: {((finalResult.x / 1000) * 100).toFixed(1)}%, y: {((finalResult.y / 1000) * 100).toFixed(1)}%, w: {((finalResult.width / 1000) * 100).toFixed(1)}%, h: {((finalResult.height / 1000) * 100).toFixed(1)}%</div>
          </div>
        </ResultsSection>
      )}
    </DebugWrapper>
  );
};

export default ImageProcessingDebugger;
