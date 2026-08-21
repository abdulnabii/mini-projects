import { SampleMedicalImage } from '@/types';

export const SAMPLE_MEDICAL_IMAGES: SampleMedicalImage[] = [
  {
    id: 'sample_xray_pneumonia',
    title: 'Chest X-Ray: Lobar Pneumonia',
    modelType: 'xray',
    groundTruth: 'Lobar Pneumonia (Alveolar Infiltrate)',
    description: 'PA chest radiography demonstrating focal consolidation with air bronchograms in the lower right pulmonary field.',
    imageUrl: 'xray-pneumonia-sample',
    keyFindings: 'Right lower lobe airspace consolidation, blunting of costophrenic sulcus.',
  },
  {
    id: 'sample_xray_normal',
    title: 'Chest X-Ray: Normal Healthy Thorax',
    modelType: 'xray',
    groundTruth: 'Normal (Clear Pulmonary Fields)',
    description: 'Standard upright PA view showing clear bilateral lung parenchyma, sharp costophrenic angles, and normal cardiothoracic ratio.',
    imageUrl: 'xray-normal-sample',
    keyFindings: 'Bilateral clear lung fields, normal mediastinum, no effusions.',
  },
  {
    id: 'sample_derm_melanoma',
    title: 'Dermatology: Malignant Melanoma',
    modelType: 'dermatology',
    groundTruth: 'Malignant Cutaneous Melanoma',
    description: 'Polarized dermatoscopic view showing marked border asymmetry, multi-chromatic pigment distribution, and peripheral radial streaming.',
    imageUrl: 'derm-melanoma-sample',
    keyFindings: 'Asymmetric border, atypical pigment network, regression structures.',
  },
  {
    id: 'sample_derm_benign',
    title: 'Dermatology: Benign Melanocytic Nevus',
    modelType: 'dermatology',
    groundTruth: 'Benign Melanocytic Nevus',
    description: 'Symmetric, well-circumscribed macular lesion with uniform pigmentation network pattern.',
    imageUrl: 'derm-benign-sample',
    keyFindings: 'Homogeneous pigment network, regular border, no ulceration.',
  },
];
