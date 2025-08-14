import { Card } from "@/components/ui/card";

export default function Documentation() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <main className="container mx-auto max-w-4xl py-12 px-4 sm:px-6 lg:px-8">
        <div className="space-y-12">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              📚 Project SOAP Documentation
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              A comprehensive guide to using the AI-powered medical documentation and review system
            </p>
          </div>

          {/* Overview */}
          <Card>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Overview</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Project SOAP helps medical students and professionals generate, edit, and receive feedback on SOAP notes. 
              The system supports multiple grading rubrics including PDQI-9 and SOAP (NO KILLER ITEMS) standards.
            </p>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h3 className="font-medium text-blue-900 dark:text-blue-200 mb-2">Key Features</h3>
              <ul className="text-blue-800 dark:text-blue-300 space-y-1 text-sm">
                <li>• AI-generated SOAP notes from patient encounter transcripts</li>
                <li>• Multiple grading rubrics (PDQI-9, SOAP rubric)</li>
                <li>• Rubric-specific custom grading prompts</li>
                <li>• Detailed feedback with scoring and improvement suggestions</li>
                <li>• Dark/light mode support</li>
              </ul>
            </div>
          </Card>

          {/* Step-by-step workflow */}
          <Card>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">How to Use</h2>
            
            <div className="space-y-6">
              {/* Step 1 */}
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  1. Generate Initial SOAP Note
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-3">
                  Start by pasting a patient encounter transcript on the home page. The AI will automatically generate a baseline SOAP note.
                </p>
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded text-sm">
                  <strong>Expected format:</strong> Alternating dialogue between user (patient) and assistant (clinician) turns.
                </div>
              </div>

              {/* Step 2 */}
              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  2. Edit and Refine
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-3">
                  Use the &quot;Edit & Review&quot; option to modify the SOAP note. Your edits will be compared against the AI baseline during grading.
                </p>
              </div>

              {/* Step 3 */}
              <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  3. Choose Grading Rubric
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-3">
                  Select your preferred grading rubric from the dropdown menu:
                </p>
                <ul className="text-gray-600 dark:text-gray-400 space-y-2 text-sm ml-4">
                  <li><strong>PDQI-9:</strong> Traditional 9-dimension quality rubric (5-point scale)</li>
                  <li><strong>SOAP (NO KILLER ITEMS):</strong> Section-based rubric focused on S/O/A/P quality (6-point scale)</li>
                </ul>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded text-sm mt-3">
                  <strong>Note:</strong> Your rubric choice is saved per encounter. You can switch rubrics and maintain separate custom prompts for each.
                </div>
              </div>

              {/* Step 4 */}
              <div className="border-l-4 border-orange-500 pl-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  4. Submit for Review
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-3">
                  Click &quot;Submit for Review&quot; to receive AI-powered feedback based on your selected rubric.
                </p>
              </div>
            </div>
          </Card>

          {/* Grading Rubrics */}
          <Card>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Grading Rubrics</h2>
            
            <div className="space-y-6">
              {/* PDQI-9 */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">PDQI-9 Rubric</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-3">
                  A comprehensive 9-dimension quality assessment rubric using a 5-point Likert scale with emphasis on clinical appropriateness.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Content Quality</h4>
                    <ul className="text-gray-600 dark:text-gray-400 space-y-1">
                      <li>• Accurate</li>
                      <li>• Useful</li>
                      <li>• Thorough</li>
                      <li>• Up-to-date</li>
                    </ul>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Presentation</h4>
                    <ul className="text-gray-600 dark:text-gray-400 space-y-1">
                      <li>• Organized</li>
                      <li>• Comprehensible</li>
                      <li>• Succinct</li>
                    </ul>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Integration</h4>
                    <ul className="text-gray-600 dark:text-gray-400 space-y-1">
                      <li>• Synthesized</li>
                      <li>• Consistent</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* SOAP Rubric */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">SOAP Rubric (NO KILLER ITEMS)</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-3">
                  A section-specific rubric evaluating each SOAP component using a 6-point scale with emphasis on osteopathic principles.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Subjective & Objective</h4>
                    <ul className="text-gray-600 dark:text-gray-400 space-y-1">
                      <li>• History completeness and accuracy</li>
                      <li>• Physical exam thoroughness</li>
                      <li>• Palpatory and OMM findings</li>
                      <li>• Appropriate diagnostic workup</li>
                    </ul>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Assessment & Plan</h4>
                    <ul className="text-gray-600 dark:text-gray-400 space-y-1">
                      <li>• Differential diagnosis quality</li>
                      <li>• Clinical reasoning and rationale</li>
                      <li>• Treatment appropriateness</li>
                      <li>• Osteopathic principles integration</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Custom Grading Prompts */}
          <Card>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Custom Grading Prompts</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              You can customize the grading criteria for each rubric by editing the grading prompt. This allows you to:
            </p>
            <ul className="text-gray-600 dark:text-gray-400 space-y-2 mb-4">
              <li>• Emphasize specific clinical areas or specialties</li>
              <li>• Add institution-specific requirements</li>
              <li>• Modify scoring criteria for different learning objectives</li>
              <li>• Maintain separate customizations for PDQI-9 vs SOAP rubrics</li>
            </ul>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h3 className="font-medium text-blue-900 dark:text-blue-200 mb-2">How it Works</h3>
              <ol className="text-blue-800 dark:text-blue-300 space-y-1 text-sm">
                <li>1. Select your rubric (PDQI-9 or SOAP)</li>
                                 <li>2. Click &quot;Edit grading prompt&quot; to modify the instructions</li>
                <li>3. Save your changes (limited to 12,000 characters)</li>
                <li>4. Your custom prompt applies only to that rubric for this encounter</li>
                <li>5. Reset to default anytime or create different prompts per rubric</li>
              </ol>
            </div>
          </Card>

          {/* Feedback and Results */}
          <Card>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Understanding Your Results</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Score Interpretation</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">PDQI-9 Scale (1-5)</h4>
                    <ul className="text-gray-600 dark:text-gray-400 space-y-1">
                      <li>• 5: Excellent, clinically appropriate</li>
                      <li>• 4: Good, mostly appropriate</li>
                      <li>• 3: Adequate, some concerns</li>
                      <li>• 2: Poor, inappropriate</li>
                      <li>• 1: Dangerous, contraindicated</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">SOAP Scale (1-6)</h4>
                    <ul className="text-gray-600 dark:text-gray-400 space-y-1">
                      <li>• 5-6: Above average, comprehensive</li>
                      <li>• 3-4: Average, sufficient</li>
                      <li>• 1-2: Below average, needs improvement</li>
                      <li>• 1: Missing or severely inadequate</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Delta Scores</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-2">
                  Delta scores show the difference between your edited note and the AI baseline:
                </p>
                <div className="flex flex-wrap gap-4 text-sm">
                  <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 px-2 py-1 rounded">
                    +2 or higher: Significant improvement
                  </span>
                  <span className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded">
                    0 to +1: Minor improvement or no change
                  </span>
                  <span className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 px-2 py-1 rounded">
                    Negative: Regression from baseline
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Technical Details */}
          <Card>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Technical Information</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">AI Model</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Reviews are powered by OpenAI GPT-4o with structured JSON output validation to ensure consistent, reliable feedback.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Data Storage</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  All encounters are stored in memory during your session. Custom prompts are saved per encounter and per rubric.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Supported Formats</h3>
                <ul className="text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• Input: Patient encounter transcripts (user/assistant dialogue)</li>
                  <li>• Output: Markdown-formatted SOAP notes</li>
                  <li>• Review: JSON-structured feedback with schema validation</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Tips and Best Practices */}
          <Card>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Tips for Best Results</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Input Quality</h3>
                <ul className="text-gray-600 dark:text-gray-400 space-y-2 text-sm">
                  <li>• Include complete patient encounters with all relevant history</li>
                  <li>• Ensure clear dialogue structure (user/assistant alternation)</li>
                  <li>• Include physical exam findings and diagnostic results</li>
                  <li>• Capture patient concerns and questions</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Editing Strategy</h3>
                <ul className="text-gray-600 dark:text-gray-400 space-y-2 text-sm">
                  <li>• Focus on clinical accuracy and appropriateness</li>
                  <li>• Add missing differential diagnoses</li>
                  <li>• Improve organization and flow</li>
                  <li>• Include relevant osteopathic findings (for SOAP rubric)</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
} 