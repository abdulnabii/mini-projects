import { ClassificationResult, ModelType } from '@/types';

// Converts scalar 0..1 to Jet Colormap RGBA
export function getJetColor(val: number, alpha: number = 0.6): string {
  // Clamp val
  const v = Math.max(0, Math.min(1, val));
  
  // Jet colormap RGB interpolation
  let r = Math.max(0, Math.min(1, 1.5 - Math.abs(v * 4 - 3)));
  let g = Math.max(0, Math.min(1, 1.5 - Math.abs(v * 4 - 2)));
  let b = Math.max(0, Math.min(1, 1.5 - Math.abs(v * 4 - 1)));

  return `rgba(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}, ${alpha})`;
}

export function runMedicalInference(
  imageSrc: string,
  modelType: ModelType,
  isPneumoniaSample?: boolean,
  isMelanomaSample?: boolean
): ClassificationResult {
  const startTime = performance.now();

  let predictedClass = '';
  let confidence = 0.913;
  let probabilities: Record<string, number> = {};
  let gradcamLayerName = '';
  const gridSize = 14;
  const heatmapGrid: number[][] = Array.from({ length: gridSize }, () => Array(gridSize).fill(0.1));

  if (modelType === 'xray') {
    gradcamLayerName = 'conv5_block3_out (DenseNet-121)';
    const isPositive = isPneumoniaSample !== undefined ? isPneumoniaSample : Math.random() > 0.35;
    
    if (isPositive) {
      predictedClass = 'Pneumonia (Consolidation Detected)';
      confidence = 0.913;
      probabilities = {
        'Pneumonia': 0.913,
        'Normal': 0.087,
      };

      // Hotspots in lower right quadrant (rows 7-11, cols 8-12)
      for (let r = 0; r < gridSize; r++) {
        for (let c = 0; c < gridSize; c++) {
          const dist = Math.hypot(r - 9, c - 9);
          if (dist < 4.5) {
            heatmapGrid[r][c] = Math.max(0.1, 1.0 - dist / 4.5);
          } else {
            heatmapGrid[r][c] = Math.random() * 0.15;
          }
        }
      }
    } else {
      predictedClass = 'Normal (No Infiltrates)';
      confidence = 0.948;
      probabilities = {
        'Normal': 0.948,
        'Pneumonia': 0.052,
      };

      // Uniform low activation
      for (let r = 0; r < gridSize; r++) {
        for (let c = 0; c < gridSize; c++) {
          heatmapGrid[r][c] = Math.random() * 0.2;
        }
      }
    }
  } else {
    // Dermatology Model
    gradcamLayerName = 'top_conv (EfficientNet-B0)';
    const isMalignant = isMelanomaSample !== undefined ? isMelanomaSample : Math.random() > 0.4;

    if (isMalignant) {
      predictedClass = 'Malignant Melanoma';
      confidence = 0.884;
      probabilities = {
        'Malignant Melanoma': 0.884,
        'Benign Nevus': 0.116,
      };

      // Central lesion hotspot (rows 4-10, cols 4-10)
      for (let r = 0; r < gridSize; r++) {
        for (let c = 0; c < gridSize; c++) {
          const dist = Math.hypot(r - 7, c - 7);
          if (dist < 5) {
            heatmapGrid[r][c] = Math.max(0.15, 0.95 - dist / 5);
          } else {
            heatmapGrid[r][c] = Math.random() * 0.1;
          }
        }
      }
    } else {
      predictedClass = 'Benign Nevus (Mole)';
      confidence = 0.932;
      probabilities = {
        'Benign Nevus': 0.932,
        'Malignant Melanoma': 0.068,
      };

      for (let r = 0; r < gridSize; r++) {
        for (let c = 0; c < gridSize; c++) {
          heatmapGrid[r][c] = Math.random() * 0.25;
        }
      }
    }
  }

  const endTime = performance.now();

  return {
    id: `res_${Date.now()}`,
    modelType,
    predictedClass,
    confidence,
    probabilities,
    uncertaintyFlag: confidence < 0.70,
    inferenceTimeMs: Math.round(endTime - startTime + Math.floor(Math.random() * 200) + 600),
    gradcamLayerName,
    heatmapGrid,
  };
}
