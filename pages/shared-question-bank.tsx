import React from 'react'
import { useRouter } from 'next/router'
import { Button } from '@/components/ui/button'
import { Share2, Eye, BookOpen, ChevronRight } from 'lucide-react'
// ...other necessary imports...

export default function SharedQuestionBank() {
  const router = useRouter()
  
  const sharedBank = {
    name: 'USMLE Step 1: Pathology',
    description: 'A comprehensive question bank covering pathology concepts for USMLE Step 1, including general pathology, systemic pathology, and disease mechanisms.',
    questions: [
      {
        id: 1,
        question: "A 45-year-old male presents with progressive weakness and numbness in his extremities. Biopsy of peripheral nerve shows segmental demyelination. Which of the following is the most likely diagnosis?",
        choices: [
          "Guillain-Barré syndrome",
          "Multiple sclerosis",
          "Amyotrophic lateral sclerosis",
          "Myasthenia gravis",
          "Duchenne muscular dystrophy"
        ],
        correctAnswer: 0,
      },
      {
        id: 2,
        question: "Which of the following best describes the pathogenesis of type 1 diabetes mellitus?",
        choices: [
          "Insulin resistance in peripheral tissues",
          "Autoimmune destruction of beta cells",
          "Decreased incretin effect",
          "Amyloid deposition in pancreas",
          "Defect in insulin receptor signaling"
        ],
        correctAnswer: 1,
      },
      {
        id: 3,
        question: "A tissue sample shows increased collagen deposition and fibroblast proliferation. This process most likely represents:",
        choices: [
          "Metaplasia",
          "Dysplasia",
          "Hypertrophy",
          "Repair",
          "Neoplasia"
        ],
        correctAnswer: 3,
      },
      {
        id: 4,
        question: "What is the predominant cell type involved in chronic inflammation?",
        choices: [
          "Neutrophils",
          "Macrophages",
          "Basophils",
          "Eosinophils",
          "Plasma cells"
        ],
        correctAnswer: 1,
      }
    ],
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-16 w-16 bg-primary/10 rounded-lg flex items-center justify-center">
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{sharedBank.name}</h1>
              <p className="text-gray-600">Shared by John Doe</p>
            </div>
          </div>
          <p className="text-gray-700">{sharedBank.description}</p>
          <div className="flex gap-4 mt-4 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              1.2k previews
            </span>
            <span className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              {sharedBank.questions.length} questions
            </span>
          </div>
        </div>

        {/* Questions Preview */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Preview Question</h2>
          <div>
            {sharedBank.questions.slice(0, 1).map((q) => (
              <div key={q.id} className="border border-gray-100 rounded-lg p-4 hover:border-primary/20 transition-colors">
                <h3 className="font-medium text-gray-900">{q.question}</h3>
                <ul className="mt-3 space-y-2">
                  {q.choices.map((choice, index) => (
                    <li key={index} className="flex items-center gap-2 text-gray-600">
                      <span className="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center text-sm">
                        {String.fromCharCode(65 + index)}
                      </span>
                      {choice}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="text-gray-500 text-sm mt-4">
            + {sharedBank.questions.length - 1} more questions available
          </p>
        </div>

        {/* CTA Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <h2 className="text-xl font-semibold mb-2">Like what you see?</h2>
          <p className="text-gray-600 mb-6">Add this question bank to your account to start practicing</p>
          <div className="flex gap-4 justify-center">
            <Button
              variant="default"
              className="flex items-center gap-2"
              onClick={() => router.push('/sign-up')}
            >
              Add to My Question Banks
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => {/* Handle share */}}
            >
              Share <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}