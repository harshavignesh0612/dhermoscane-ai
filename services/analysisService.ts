import { AnalysisResult, RiskLevel, Classification } from '../types';

export const analyzeImage = async (imageFile: File): Promise<AnalysisResult> => {
  return new Promise((resolve) => {
    // Simulate network delay and processing time
    setTimeout(() => {
      // Mock random result generation for prototype
      // In a real app, this would send the image to a backend/Gemini API
      const randomVal = Math.random();
      
      let result: AnalysisResult;

      if (randomVal > 0.7) {
        result = {
          riskLevel: RiskLevel.LOW,
          classification: Classification.BENIGN,
          confidence: 94,
          findings: [
            "Symmetrical structure detected.",
            "Uniform pigmentation.",
            "Smooth borders."
          ],
          recommendation: "Routine check-up advised. Monitor for changes."
        };
      } else if (randomVal > 0.4) {
        result = {
          riskLevel: RiskLevel.MODERATE,
          classification: Classification.INDETERMINATE,
          confidence: 78,
          findings: [
            "Slight asymmetry observed.",
            "Minor color variation detected.",
            "Border irregularity found."
          ],
          recommendation: "Monitor closely. Consult a dermatologist if changes occur."
        };
      } else {
        result = {
          riskLevel: RiskLevel.HIGH,
          classification: Classification.MALIGNANT,
          confidence: 88,
          findings: [
            "Significant asymmetry detected.",
            "Multiple colors present (variegation).",
            "Irregular borders detected."
          ],
          recommendation: "Consult a dermatologist immediately for further examination."
        };
      }

      resolve(result);
    }, 3000); // 3 seconds scanning simulation
  });
};