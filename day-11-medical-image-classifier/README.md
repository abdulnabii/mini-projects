# MedVision.AI — Medical Image Classifier & GradCAM Heatmap Visualizer

MedVision.AI is a browser-native AI medical diagnostic education tool that runs privacy-first client-side inference on Chest X-Rays and Skin Lesions, generating interactive **GradCAM (Gradient-Weighted Class Activation Mapping)** heatmaps over HTML5 canvas elements to visualize neural network attention.

## Key Features
- **Mandatory Clinical Disclaimer Modal**: Full-screen confirmation that the tool is strictly for educational & research demonstration.
- **Dual Neural Classifier Modes**:
  - **Chest X-Ray (DenseNet-121 CheXNet)**: Pneumonia vs. Normal lungs.
  - **Dermatology (EfficientNet-B0 DermNet)**: Malignant Melanoma vs. Benign Nevus.
- **GradCAM Colormap Overlay (Jet / Viridis)**: Visualizes exact spatial convolution feature gradients with opacity blending controls.
- **AI Educational Radiological Teaching Notes**: Gemini 1.5 Flash generates educational annotations explaining anatomical regions highlighted by GradCAM.
- **Model Specifications & Metrics**: Displays dataset sizes (Kaggle 5,856 X-Rays & ISIC 2020 33,126 Lesions), AUC-ROC ratings, and model cards.

## Tech Stack
- Next.js 16 (App Router)
- TypeScript
- HTML5 Canvas API (Colormap Compositing)
- Tailwind CSS & Lucide Icons
- Google Gemini API (`@google/generative-ai`)
- Vercel Production
