import {
  Image,
  fetchURL,
  cannyEdgeDetector,
  close,
  RoiMapManager,
  RoiKind,
} from 'image-js';

/**
 * Detects the large left-side rectangular panel in a game UI screenshot
 * using an edge-detection-based approach.
 *
 * @param imageDataUrl - The data URL of the image to process.
 * @returns A promise that resolves to the rectangle { x, y, width, height } or null if not found.
 */
export async function detectLeftPanelRect(
  imageDataUrl: string
): Promise<{ x: number; y: number; width: number; height: number } | null> {
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
  const cropWidth = Math.round(workingImage.width * 0.4);
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
  const edgeData = (edges as any).data as Uint8Array;
  let edgeCount = 0;
  let minEdge = 255, maxEdge = 0;

  for (let i = 0; i < edgeData.length; i++) {
    if (edgeData[i] > 0) {
      edgeCount++;
      minEdge = Math.min(minEdge, edgeData[i]);
      maxEdge = Math.max(maxEdge, edgeData[i]);
    }
  }

  const edgePercentage = (edgeCount / edgeData.length) * 100;
  console.log(`🔍 Edge detection: ${edgeCount} pixels (${edgePercentage.toFixed(2)}%) detected`);
  console.log(`⚙️ Using optimized parameters: low=${0.05}, high=${0.07}, sigma=${0.1}`);

  if (edgeCount > 0) {
    console.log(`💡 Edge intensities: ${minEdge}-${maxEdge} (${minEdge < 50 ? 'faint but detectable edges' : 'strong edges'})`);
  }

  if (edgeCount === 0) {
    console.log('❌ NO EDGES DETECTED! Suggestions:');
    console.log('  - Try even lower thresholds (0.01, 0.05)');
    console.log('  - Check image quality and panel visibility');
    console.log('  - Verify panel exists in left 40% of image');
    return null;
  }

  if (edgeCount > 0 && maxEdge < 100) {
    console.log('✅ Faint edges detected successfully with optimized parameters');
  }

  // 4. ★ Morphological Closing to Fill the Shape
  // We use a large kernel to connect the detected edges and fill the panel's
  // outline, turning it into a solid white shape.
  const kernelSize = 21; // A large kernel is crucial for connecting the vertical edges
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

  for (const roi of rois) {
    // Basic properties of the ROI
    const { width, height, origin } = roi;
    const area = roi.surface; // Use .surface for the actual pixel count

    // ★ Apply a series of strict filters to disqualify invalid shapes
    // Filter 1: Area. Must be a significant size.
    if (area < cropped.width * cropped.height * 0.2) continue;

    // Filter 2: Aspect Ratio. The panel must be taller than it is wide.
    if (height / width < 1.5) continue;

    // Filter 3: Position. It must be located at the very left of the cropped image.
    if (origin.column > 15) continue;

    // Filter 4: Rectangularity. The ROI's area should be close to its bounding box area.
    const rectangularity = area / (width * height);
    if (rectangularity < 0.85) continue;

    // The largest ROI that passes all filters is our candidate.
    if (!bestPanel || area > bestPanel.surface) {
      bestPanel = roi;
    }
  }

  if (!bestPanel) {
    console.log('❌ No ROI passed all the filters.');
    return null;
  }

  // 7. Scale the coordinates of the found panel back to the original image dimensions
  const scaleX = originalImage.width / workingImage.width;
  const scaleY = originalImage.height / workingImage.height;

  const finalRect = {
    x: Math.round(bestPanel.origin.column * scaleX),
    y: Math.round(bestPanel.origin.row * scaleY),
    width: Math.round(bestPanel.width * scaleX),
    height: Math.round(bestPanel.height * scaleY),
  };

  console.log('✅ Successfully detected panel:', finalRect);
  return finalRect;
}