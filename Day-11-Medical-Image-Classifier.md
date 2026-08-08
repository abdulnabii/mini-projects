# Day 11 — Medical Image Classifier

| Field | Details |
|---|---|
| **Day** | 11 |
| **Category** | Healthcare AI / Computer Vision |
| **Difficulty** | Advanced |
| **Estimated Build Time** | 9–12 hours |

---

## 📌 Project Overview

The Medical Image Classifier is a browser-native AI diagnostic education tool that runs entirely on the client side using TensorFlow.js — no medical images are ever sent to a server, ensuring complete patient data privacy. Users upload a chest X-ray or skin lesion image and a pre-trained convolutional neural network classifies it in under 2 seconds directly in the browser. Two model modes are available: a pneumonia classifier (Pneumonia vs. Normal chest X-ray, trained on the Kaggle Chest X-Ray dataset) and a dermatology classifier (Malignant vs. Benign skin lesions, trained on the ISIC 2020 dataset).

What makes this project exceptional in Abdul Nabi's portfolio is the GradCAM (Gradient-weighted Class Activation Mapping) heatmap overlay. After classification, the app renders a color heatmap directly on top of the uploaded image, visualizing exactly which regions of the image the neural network attended to when making its decision. Areas shown in red were most influential; blue areas were least relevant. This explainability feature transforms the tool from a black box into an educational instrument that teaches medical professionals and students about AI vision in radiology.

The app is built with Next.js 14 using client-side rendering exclusively for the inference components. Models are served via Hugging Face Hub in TensorFlow.js format and lazily loaded into the browser on first use. A prominent, mandatory clinical disclaimer system ensures the tool is never mistaken for a clinical diagnostic device — it is an educational demonstration only. This project directly reflects Abdul Nabi's commitment to responsible, explainable AI in healthcare.

---

## 🎯 Core Features

| Feature | Description |
|---|---|
| **Chest X-Ray Classifier** | Binary classification: Pneumonia vs. Normal with confidence score |
| **Skin Lesion Classifier** | Binary classification: Malignant vs. Benign with confidence score |
| **GradCAM Heatmap Overlay** | Color activation map overlay showing which image regions drove the prediction |
| **Confidence Score Display** | Softmax probability bars for each class with uncertainty flagging |
| **Model Selection Toggle** | Switch between X-ray (CheXNet-style) and Dermatology (EfficientNet) models |
| **Drag-and-Drop Upload** | Drag-and-drop image upload with DICOM and JPEG/PNG support |
| **Class Activation Map Legend** | Color scale legend explaining heatmap intensity gradient |
| **Educational Annotations** | Clickable regions on the heatmap explain what anatomical features the AI detected |
| **Model Card Display** | Shows model architecture, training dataset, accuracy, AUC-ROC, and known limitations |
| **Mandatory Disclaimer System** | Full-screen disclaimer modal that must be acknowledged before any inference |

---

## 🛠️ Tech Stack

- **Frontend:** Next.js 14, TypeScript, Tailwind CSS
- **ML Inference:** TensorFlow.js (`@tensorflow/tfjs`, `@tensorflow/tfjs-backend-webgl`)
- **Model Hosting:** Hugging Face Hub (TensorFlow.js format, JSON + binary weights)
- **Image Processing:** `@tensorflow/tfjs` image tensors + HTML Canvas API
- **GradCAM:** Custom implementation using `tf.GradientTape` equivalent in TF.js
- **DICOM Support:** `cornerstone-wado-image-loader` + `dicomParser` npm packages
- **Canvas Rendering:** HTML5 Canvas API (heatmap overlay blending)
- **Color Mapping:** Custom viridis/jet colormap implementation
- **Model Training:** Python TensorFlow/Keras (separate training notebook)
- **Deployment:** Vercel (static + edge — no server-side inference)

---

## 🔧 Key Functions

### `loadModel(modelType: 'xray' | 'dermatology'): Promise<tf.LayersModel>`
Lazily loads the TensorFlow.js model from Hugging Face Hub on first inference request. Caches the loaded model in module scope to avoid redundant network requests. For X-ray: loads a MobileNetV2-based binary classifier fine-tuned on 5,856 chest X-rays. For dermatology: loads an EfficientNetB0-based classifier fine-tuned on 33,126 ISIC skin lesion images. Returns the `tf.LayersModel` instance with intermediate layer access enabled.

### `preprocessImage(imageElement: HTMLImageElement, modelType: ModelType): tf.Tensor4D`
Converts the raw image element to a normalized 4D tensor matching each model's expected input shape. For X-ray: resizes to 224×224, converts to grayscale (single channel), normalizes to [0,1]. For dermatology: resizes to 224×224, keeps RGB (3 channels), applies ImageNet mean subtraction. Returns a batched `tf.Tensor4D` with shape `[1, 224, 224, channels]`.

### `runInference(tensor: tf.Tensor4D, model: tf.LayersModel): Promise<ClassificationResult>`
Runs the forward pass through the model and extracts the softmax output probabilities. Interprets results into a `ClassificationResult` with `predictedClass`, `confidence` (top probability), `probabilities` (all class probabilities), `inferenceTimeMs`, and `uncertaintyFlag` (true if top probability < 0.70, triggering a "Model is uncertain" UI warning).

### `computeGradCAM(tensor: tf.Tensor4D, model: tf.LayersModel, targetLayerName: string): Promise<Float32Array>`
Implements GradCAM in TensorFlow.js using the `tf.grads` function. Creates an inner model that outputs the target convolutional layer activations and the final classification scores. Computes the gradient of the predicted class score with respect to the last conv layer feature maps. Averages gradients across spatial dimensions (global average pooling), weights feature maps by their importance, applies ReLU, and resizes to the original image dimensions. Returns a flattened `Float32Array` of normalized activation values (0–1) for heatmap rendering.

### `renderHeatmapOverlay(canvas: HTMLCanvasElement, originalImage: ImageData, activations: Float32Array, alpha: number): void`
Applies a jet colormap to the GradCAM activation array, converting scalar values to RGBA color pixels (blue → green → red intensity scale). Composites the colormap overlay onto the original image using alpha blending on the HTML5 Canvas context. The `alpha` parameter (0–1) controls overlay transparency. Draws the final composite back to the display canvas. Also draws a color scale legend bar in the corner.

---

## 📁 File Structure

```
medical-image-classifier/
├── app/
│   ├── page.tsx                    # Landing + model selection
│   ├── classify/page.tsx           # Main inference interface
│   ├── about/page.tsx              # Model cards + methodology
│   └── api/                        # Minimal — no server-side inference
│       └── log/route.ts            # Optional: anonymized usage logging
├── components/
│   ├── upload/
│   │   ├── ImageDropzone.tsx       # Drag-and-drop uploader
│   │   ├── DicomLoader.tsx         # DICOM file handler
│   │   └── ImagePreview.tsx        # Raw image display
│   ├── inference/
│   │   ├── ClassifierEngine.tsx    # TF.js model loading + inference
│   │   ├── ResultPanel.tsx         # Classification output display
│   │   ├── ConfidenceBar.tsx       # Probability visualization
│   │   └── UncertaintyAlert.tsx    # Low-confidence warning
│   ├── gradcam/
│   │   ├── GradCAMRenderer.tsx     # Canvas overlay compositor
│   │   ├── HeatmapLegend.tsx       # Color scale legend
│   │   └── AnnotationLayer.tsx     # Clickable anatomical regions
│   ├── model/
│   │   ├── ModelCard.tsx           # Model architecture + metrics
│   │   └── ModelToggle.tsx         # X-ray vs Dermatology switch
│   ├── disclaimer/
│   │   └── DisclaimerModal.tsx     # Mandatory full-screen disclaimer
│   └── ui/
├── lib/
│   ├── models/
│   │   ├── loader.ts               # Lazy model loading + caching
│   │   ├── xrayPreprocess.ts       # X-ray tensor preprocessing
│   │   └── dermPreprocess.ts       # Dermatology preprocessing
│   ├── gradcam/
│   │   ├── compute.ts              # GradCAM computation
│   │   └── colormap.ts             # Jet/Viridis colormap
│   └── dicom/
│       └── parser.ts               # DICOM file → ImageData
├── training/                       # Python training notebooks
│   ├── train_xray_model.ipynb
│   ├── train_derm_model.ipynb
│   └── convert_to_tfjs.py          # Keras → TF.js conversion
├── public/
│   └── sample-images/              # Demo X-ray and lesion samples
├── types/medical.ts
└── package.json
```

---

## 💡 AI Prompt Used

```
(Note: This project uses a pre-trained CNN, not a generative AI prompt. The "prompt" 
here is the model training configuration and the educational annotation system prompt.)

SYSTEM (Educational Annotation Generator — GPT-4o-mini):
You are a radiology and dermatology education assistant. Given a GradCAM heatmap result 
and classification for a medical image, generate a brief educational annotation explaining 
what the highlighted region likely represents anatomically. This is for medical students 
and AI researchers — not for patient diagnosis.

Always include: (1) anatomical region highlighted, (2) why this region is relevant to 
the classification, (3) limitations of AI attention in this context.
Max 80 words per annotation.

USER:
Image type: Chest X-ray
Classification: Pneumonia (confidence: 91.3%)
GradCAM highlighted region: Lower-right lung quadrant, near the diaphragm
```

---

## 📤 Expected Output (Result)

**Inference Result (JSON):**
```json
{
  "modelType": "xray",
  "predictedClass": "Pneumonia",
  "confidence": 0.913,
  "probabilities": {
    "Pneumonia": 0.913,
    "Normal": 0.087
  },
  "uncertaintyFlag": false,
  "inferenceTimeMs": 847,
  "gradcamTargetLayer": "block_16_depthwise",
  "disclaimer": "Educational tool only. Not for clinical use."
}
```

**Educational Annotation (JSON):**
```json
{
  "region": "Right lower lobe",
  "annotation": "The model focused on the right lower lobe near the costophrenic angle — a common site for consolidation in bacterial pneumonia. The increased opacity here suggests fluid or inflammatory infiltrate. Note that GradCAM highlights model attention, not a diagnosis; similar patterns can appear in pleural effusion or atelectasis.",
  "relevance": "High — lower lobe consolidation is the most common radiographic finding in community-acquired pneumonia",
  "limitation": "GradCAM cannot distinguish between consolidation types; always requires radiologist confirmation"
}
```

**UI Display:**
```
⚕️  EDUCATIONAL TOOL ONLY — NOT FOR CLINICAL DIAGNOSIS

📁  chest_xray_patient_001.jpg  |  Uploaded  ✅

🧠  Running inference on WebGL backend...  [████████████] 847ms

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔴  PNEUMONIA DETECTED
    Confidence: 91.3%
    
    Pneumonia  ████████████████████████  91.3%
    Normal     ███░░░░░░░░░░░░░░░░░░░░░   8.7%
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    
🌡️  GradCAM Heatmap: Model attended to right lower lobe
💡  Educational Note: Lower lobe consolidation is the most 
    common radiographic finding in pneumonia. [Learn more]

⚠️  Low confidence predictions (< 70%) are flagged automatically.
    This result should ONLY be used for educational purposes.
```

---

## 🚀 Stretch Goals

- [ ] Add multi-class classification (14-class CheXNet: atelectasis, cardiomegaly, effusion, etc.)
- [ ] Implement LIME (Local Interpretable Model-agnostic Explanations) as alternative to GradCAM
- [ ] Add a side-by-side comparison mode (two X-rays from the same patient at different times)
- [ ] Build a quiz mode: show medical students an X-ray and let them classify before seeing AI result
- [ ] Add retinal scan classification (diabetic retinopathy severity grading)
- [ ] Implement model uncertainty quantification using Monte Carlo Dropout
- [ ] Create a clinical workflow integration mockup with FHIR-compatible output format
