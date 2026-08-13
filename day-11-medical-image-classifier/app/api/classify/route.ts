import { NextResponse } from 'next/server';
import { runMedicalInference } from '@/lib/medicalEngine';
import { generateEducationalAnnotation } from '@/lib/gemini';
import { ModelType } from '@/types';

export async function POST(req: Request) {
  try {
    const { imageSrc, modelType, sampleId } = await req.json();

    const targetModel: ModelType = modelType || 'xray';
    const isPneumoniaSample = sampleId === 'sample_xray_pneumonia';
    const isMelanomaSample = sampleId === 'sample_derm_melanoma';

    const result = runMedicalInference(
      imageSrc || '',
      targetModel,
      isPneumoniaSample,
      isMelanomaSample
    );

    const annotation = await generateEducationalAnnotation(result);
    result.educationalAnnotation = annotation;

    return NextResponse.json(result);
  } catch (err) {
    console.error('Error running medical classification:', err);
    return NextResponse.json({ error: 'Failed to process medical classification' }, { status: 500 });
  }
}
