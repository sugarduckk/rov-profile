import {
  Image,
  fetchURL,
  cannyEdgeDetector,
  close,
  RoiMapManager,
  RoiKind,
  Roi,
} from 'image-js';

const targetRatio = 0.628;
const minAspectRatio = targetRatio * 0.98;
const maxAspectRatio = targetRatio * 1.02;

/**
 * Detects the large left-side rectangular panel in a game UI screenshot
 * using an edge-detection-based approach.
 *
 * @param imageDataUrl - The data URL of the image to process.
 * @returns A promise that resolves to the rectangle { x, y, width, height } or null if not found.
 */
export async function detectLeftPanelRect(
  imageDataUrl: string
): Promise<{ x: number; y: number; width: number; height: number; } | null> {
  // 1. Load the image from the data URL
  let originalImage: Image;
  try {
    originalImage = await fetchURL(imageDataUrl);
  } catch (error) {
    console.error('❌ Failed to load image:', error);
    return null;
  }

  // 2. Pre-process: Resize for performance and crop to the area of interest
  // We focus on the left 40% of the image, where the panel is located.
  const workingImage = originalImage.resize({ width: 1000 }); // Resize for consistent processing
  const cropWidth = Math.round(workingImage.width * 0.35);
  const cropped = workingImage.crop({ origin: { column: 0, row: 0 }, width: cropWidth, height: workingImage.height });

  // 3. ★ Core Logic: Edge Detection with Optimized Parameters
  // Instead of thresholding, we find the panel's borders. This is more robust
  // against translucency and internal text/icons.
  const grey = cropped.grey();

  const edges = cannyEdgeDetector(grey, {
    lowThreshold: 0.05,  // User-optimized value for detecting faint panel edges
    highThreshold: 0.07, // User-optimized value - very sensitive
    gaussianBlurOptions: { sigma: 0.1 }, // Minimal smoothing to preserve edge details
  });

  // Check how many edges were detected and their intensity
  const width = edges.width;
  const height = edges.height;
  let edgeCount = 0;

  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      const bit = edges.getBit(i, j);
      if (bit > 0) {
        edgeCount++;
      }
    }
  }

  if (edgeCount === 0) {
    console.log('❌ No edges detected');
    return null;  // No edges detected
  }

  // 4. ★ Morphological Closing to Fill the Shape
  // We use a large kernel to connect the detected edges and fill the panel's
  // outline, turning it into a solid white shape.
  const kernelSize = 9; // A large kernel is crucial for connecting the vertical edges
  const kernel = Array(kernelSize).fill(Array(kernelSize).fill(1));
  const closedMask = close(edges, { kernel, iterations: 2 });

  // 5. Find all potential shapes (Regions of Interest) from the mask
  const roiMapManager = RoiMapManager.fromMask(closedMask);
  const rois = roiMapManager.getRois({ kind: RoiKind.WHITE });

  if (rois.length === 0) {
    console.log('No ROIs found after processing.');
    return null;
  }

  // 6. Filter and Score the ROIs to find the correct panel
  let bestPanel = null;
  const candidates: Roi[] = [];

  for (const roi of rois) {
    // Basic properties of the ROI
    const { width, height, origin } = roi;
    const area = width * height; // Use .surface for the actual pixel count

    // Filter 1: Position. It must be located at the very left of the cropped image.
    if (origin.column > cropped.width * 0.5) {
      continue;
    }

    // Filter 2: Area. Must be a significant size.
    if (area >= cropped.width * cropped.height * 0.4) {
      // If the area is large enough, we add it to the candidates.
      candidates.push(roi);
    }
    else {
      continue;
    }

    // Filter 3: Aspect Ratio. The panel must be taller than it is wide.
    const aspectRatio = width / height;
    if (aspectRatio < minAspectRatio || aspectRatio > maxAspectRatio) {
      continue;
    }

    // The largest ROI that passes all filters is our candidate.
    if (!bestPanel || area > bestPanel.surface) {
      bestPanel = roi;
    }
  }

  if (!bestPanel) {
    console.log('❌ No ROI passed all the filters.');
    if (candidates.length > 0) {
      let bestCandidate = null;
      let bestCandidateArea = 0;
      // Finding the largest candidate
      for (const candidate of candidates) {
        if (candidate.width * candidate.height > bestCandidateArea || bestCandidate === null) {
          bestCandidate = candidate;
          bestCandidateArea = candidate.width * candidate.height;
        }
      }
      const origin = bestCandidate!.origin;
      const height = bestCandidate!.height;
      const width = height * targetRatio;

      const scaleX = originalImage.width / workingImage.width;
      const scaleY = originalImage.height / workingImage.height;

      const finalRect = {
        x: Math.round(origin.column * scaleX) * 100 / originalImage.width,
        y: Math.round(origin.row * scaleY) * 100 / originalImage.height,
        width: Math.round(width * scaleX) * 100 / originalImage.width,
        height: Math.round(height * scaleY) * 100 / originalImage.height,
      };

      console.log('✅ Successfully detected candidate panel:', finalRect);
      return finalRect;
    }
    return null;
  }

  // 7. Scale the coordinates of the found panel back to the original image dimensions
  const scaleX = originalImage.width / workingImage.width;
  const scaleY = originalImage.height / workingImage.height;

  const finalRect = {
    x: Math.round(bestPanel.origin.column * scaleX) * 100 / originalImage.width,
    y: Math.round(bestPanel.origin.row * scaleY) * 100 / originalImage.height,
    width: Math.round(bestPanel.width * scaleX) * 100 / originalImage.width,
    height: Math.round(bestPanel.height * scaleY) * 100 / originalImage.height,
  };

  console.log('✅ Successfully detected panel:', finalRect);
  return finalRect;
}