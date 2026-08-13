import { SampleMedicalImage } from '@/types';

export const SAMPLE_MEDICAL_IMAGES: SampleMedicalImage[] = [
  {
    id: 'sample_xray_pneumonia',
    title: 'Chest X-Ray: Pneumonia Positive',
    modelType: 'xray',
    groundTruth: 'Pneumonia (Consolidation Right Lower Lobe)',
    description: 'Anterior-Posterior (AP) chest radiography demonstrating focal consolidation in the lower right pulmonary field.',
    imageUrl: 'xray-pneumonia-sample',
  },
  {
    id: 'sample_xray_normal',
    title: 'Chest X-Ray: Normal Healthy Lungs',
    modelType: 'xray',
    groundTruth: 'Normal (Clear Pulmonary Fields)',
    description: 'Standard upright PA view showing clear lung parenchyma, sharp costophrenic angles, and normal cardiac silhouette.',
    imageUrl: 'xray-normal-sample',
  },
  {
    id: 'sample_derm_melanoma',
    title: 'Dermatology: Malignant Melanoma',
    modelType: 'dermatology',
    groundTruth: 'Malignant Melanoma (ISIC 2020)',
    description: 'Dermatoscopic view showing irregular asymmetric borders, color variation, and diameter > 6mm.',
    imageUrl: 'derm-melanoma-sample',
  },
  {
    id: 'sample_derm_benign',
    title: 'Dermatology: Benign Melanocytic Nevus',
    modelType: 'dermatology',
    groundTruth: 'Benign Nevus (Common Mole)',
    description: 'Symmetric, well-circumscribed brown macular lesion with uniform pigmentation pattern.',
    imageUrl: 'derm-benign-sample',
  },
];
