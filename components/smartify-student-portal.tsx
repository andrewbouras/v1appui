'use client'

import * as React from 'react'
import { Upload, Search, X, Menu, Download, MoreVertical, User, ChevronDown, Settings, Plus, ChevronLeft, ChevronRight, Flag, HelpCircle, Home, BookOpen, Info, AlertTriangle, BarChart, Calendar, Zap, Check, Copy, Minus, Share } from 'lucide-react'
import { subDays, format, eachDayOfInterval, startOfWeek, addWeeks, getMonth, getYear } from 'date-fns'
import { useTheme } from "next-themes"
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useToast } from '@/components/ui/use-toast'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import Link from 'next/link'

// Mock data for questions
const questions = [
  {
    id: 1,
    question: "A 28-year-old woman presents with recurring episodes of severe abdominal pain, peripheral neuropathy, and dark reddish urine. Her sister has similar symptoms and their mother died at a young age from liver cancer. Laboratory analysis shows elevated urinary porphobilinogen. Which of the following enzyme deficiencies is most likely responsible for this condition?",
    choices: [
      "δ-aminolevulinate synthase",
      "Porphobilinogen deaminase",
      "Uroporphyrinogen decarboxylase",
      "Coproporphyrinogen oxidase",
      "Protoporphyrinogen oxidase"
    ],
    correctAnswer: 1,
    explanation: "This patient presents with classic symptoms of acute intermittent porphyria (AIP), which is characterized by:\n\n1. Acute attacks of abdominal pain\n2. Neurological symptoms (peripheral neuropathy)\n3. Dark/reddish urine due to porphobilin\n4. Family history (autosomal dominant inheritance)\n5. Elevated urinary porphobilinogen\n\nAIP is caused by a deficiency in porphobilinogen deaminase (PBGD), also known as hydroxymethylbilane synthase. This enzyme deficiency leads to:\n\n- Accumulation of upstream metabolites (ALA and porphobilinogen)\n- Neurological symptoms due to neurotoxic effects of these metabolites\n- Characteristic dark urine during attacks\n\nDifferential considerations:\n- δ-aminolevulinate synthase deficiency causes sideroblastic anemia\n- Uroporphyrinogen decarboxylase deficiency causes porphyria cutanea tarda\n- Coproporphyrinogen oxidase deficiency causes hereditary coproporphyria\n- Protoporphyrinogen oxidase deficiency causes variegate porphyria",
    subject: "Biochemistry/Genetics",
    difficulty: "Hard",
  },
  {
    id: 2,
    question: "Which planet is known as the Red Planet?",
    choices: ["Venus", "Mars", "Jupiter", "Saturn", "Mercury"],
    correctAnswer: 1,
    explanation: "Mars is often called the Red Planet due to its reddish appearance in the night sky, caused by iron oxide (rust) on its surface.",
    subject: "Astronomy",
    difficulty: "Easy",
  },
  {
    id: 3,
    question: "What is the chemical symbol for gold?",
    choices: ["Go", "Gd", "Au", "Ag", "Fe"],
    correctAnswer: 2,
    explanation: "The chemical symbol for gold is Au, derived from its Latin name 'aurum'.",
    subject: "Chemistry",
    difficulty: "Medium",
  },
  ...Array.from({ length: 17 }, (_, i) => ({
    id: i + 4,
    question: `Sample Question ${i + 4}`,
    choices: ["Option A", "Option B", "Option C", "Option D", "Option E"],
    correctAnswer: Math.floor(Math.random() * 5),
    explanation: `This is the explanation for Sample Question ${i + 4}.`,
    subject: "Various",
    difficulty: ["Easy", "Medium", "Hard"][Math.floor(Math.random() * 3)],
  })),
]

// Modify the generateMockData function to be deterministic
const generateMockData = () => {
  const end = new Date()
  const start = subDays(end, 364)
  const dates = eachDayOfInterval({ start, end })
  
  // Use a simple deterministic pattern instead of random numbers
  return dates.map((date, index) => ({
    date: format(date, 'yyyy-MM-dd'),
    count: Math.abs(Math.sin(index / 7) * 15) // Creates a wave pattern between 0-15
  }))
}

const getColor = (count) => {
  const colorScale = [
    'bg-emerald-100', 'bg-emerald-200', 'bg-emerald-300', 'bg-emerald-400',
    'bg-emerald-500', 'bg-emerald-600', 'bg-emerald-700', 'bg-emerald-800',
  ]
  if (count === 0) return 'bg-gray-100'
  return colorScale[Math.min(Math.floor(count / 3), colorScale.length - 1)]
}

// Update the StatItem component for a more impressive look
const StatItem = ({ icon, value, label }) => (
  <div className="flex flex-col space-y-2 p-4 bg-primary/5 rounded-lg border border-primary/10 hover:bg-primary/10 transition-colors">
    <div className="flex items-center space-x-2">
      <div className="p-2 bg-primary/10 rounded-full">{icon}</div>
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
    </div>
    <div className="text-3xl font-bold text-primary">{value}</div>
  </div>
)

// Add ActivityHeatmap component
const ActivityHeatmap = ({ mockData }) => {
  const weeks = React.useMemo(() => {
    const start = startOfWeek(new Date(), { weekStartsOn: 1 })
    const end = addWeeks(start, 52)
    return eachDayOfInterval({ start, end }).reduce((acc, date) => {
      const week = getYear(date) * 100 + getMonth(date)
      if (!acc[week]) acc[week] = []
      acc[week].push(date)
      return acc
    }, {})
  }, [])

  return (
    <div className="grid grid-cols-53 gap-1">
      {Object.values(weeks).map((week, i) => (
        <div key={i} className="flex flex-col space-y-1">
          {week.map((date, j) => {
            const dayData = mockData.find(d => d.date === format(date, 'yyyy-MM-dd'))
            return (
              <div key={j} className={`w-4 h-4 ${getColor(dayData ? dayData.count : 0)}`} />
            )
          })}
        </div>
      ))}
    </div>
  )
}

// Add this utility function at the top level
const formatNumber = (num: number) => Number(num.toFixed(1)).toString()

// Add these new interfaces after the existing imports
interface ShareItem {
  id: number;
  name: string;
  type: 'class' | 'lecture' | 'questionBank';
}

// Add these new components before the SmartifyStudentPortal component
const AccessLevelInfo = () => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Info className="h-4 w-4 inline-block ml-2 text-muted-foreground" />
        </TooltipTrigger>
        <TooltipContent className="w-80">
          <div className="space-y-2">
            <p><strong>Viewer:</strong> Can only view and read content, but cannot make any changes</p>
            <p><strong>Editor:</strong> Can view content, add/edit questions, and modify lecture materials</p>
            <p><strong>Admin:</strong> Full access - can edit content, manage permissions, and share with others</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

// Add this new component before SmartifyStudentPortal
const StatsOverview = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Study Progress</CardTitle>
            <CardDescription>Last 30 days performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-48 flex items-center justify-center text-muted-foreground">
              Progress Chart Placeholder
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Question Analysis</CardTitle>
            <CardDescription>Performance by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-48 flex items-center justify-center text-muted-foreground">
              Analysis Chart Placeholder
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Study Time</CardTitle>
            <CardDescription>Hours spent learning</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-48 flex items-center justify-center text-muted-foreground">
              Time Chart Placeholder
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Add the filter options
const filterOptions = [
  { value: "all", label: "All Questions" },
  { value: "flagged", label: "Flagged Questions" },
  { value: "answered", label: "Answered Questions" },
  { value: "unanswered", label: "Unanswered Questions" },
]

export function SmartifyStudentPortal() {
  
  const [classes, setClasses] = React.useState([
    { id: 1, name: 'Anatomy', lectures: [
      { id: 1, name: 'Introduction to Algebra' },
      { id: 2, name: 'Linear Equations' },
      { id: 3, name: 'Quadratic Equations' }
    ]},
    { id: 2, name: 'Hematology', lectures: [
      { id: 4, name: 'Cell Structure' },
      { id: 5, name: 'Photosynthesis' },
      { id: 6, name: 'Evolution' }
    ]},
    { id: 3, name: 'Neurology', lectures: [
      { id: 7, name: 'Midbrain' },
      { id: 8, name: 'Pons' },
      { id: 9, name: 'Medulla' }
    ]}
  ])

  const [uploadedPdfs, setUploadedPdfs] = React.useState([])
  const [publicQuestionBanks, setPublicQuestionBanks] = React.useState([
    { 
      id: 1, 
      name: 'USMLE Step 1 Comprehensive', 
      description: 'Complete question bank covering foundational sciences, organ systems, and pathology concepts tested on USMLE Step 1.', 
      category: 'USMLE Step 1',
      examType: 'USMLE',
      creator: 'Dr. Sarah Chen, MD',
      totalQuestions: 2500,
      difficulty: 'Hard',
      lastUpdated: '2023-12-15',
      exampleQuestions: [
        {
          question: "A 45-year-old patient presents with café-au-lait spots and multiple neurofibromas. Which gene mutation is most likely responsible?",
          answer: "NF1 gene mutation (Neurofibromatosis Type 1)"
        },
        {
          question: "What is the primary mechanism of action of beta-lactam antibiotics?",
          answer: "Inhibition of bacterial cell wall synthesis by binding to penicillin-binding proteins (PBPs)"
        }
      ]
    },
    { 
      id: 2, 
      name: 'USMLE Step 2 Comprehensive', 
      description: 'Clinical knowledge question bank focusing on diagnosis, patient management, and clinical decision-making for Step 2 CK preparation.', 
      category: 'USMLE Step 2',
      examType: 'USMLE',
      creator: 'Prof. James Miller, MD, PhD',
      totalQuestions: 3000,
      difficulty: 'Hard',
      lastUpdated: '2023-11-30',
      exampleQuestions: [
        {
          question: "A 56-year-old man presents with sudden onset chest pain radiating to the left arm. What is the most appropriate initial diagnostic test?",
          answer: "12-lead ECG"
        },
        {
          question: "A 23-year-old female presents with fever, butterfly rash, and joint pain. Which autoantibody test is most specific for diagnosis?",
          answer: "Anti-dsDNA antibodies"
        }
      ]
    },
    { 
      id: 3, 
      name: 'Bugs & Drugs', 
      description: 'Comprehensive review of medical microbiology and antimicrobial therapeutics, covering bacterial, viral, fungal pathogens and their treatments.', 
      category: 'Microbiology/Pharmacology',
      examType: 'Medical School',
      creator: 'Dr. Robert Kumar, MD',
      totalQuestions: 1500,
      difficulty: 'Medium',
      lastUpdated: '2023-12-01',
      exampleQuestions: [
        {
          question: "Which antibiotic is the drug of choice for treating methicillin-resistant Staphylococcus aureus (MRSA)?",
          answer: "Vancomycin"
        },
        {
          question: "What is the mechanism of action of azithromycin?",
          answer: "Inhibition of bacterial protein synthesis by binding to the 50S ribosomal subunit"
        }
      ]
    },
    { 
      id: 4, 
      name: 'High Yield Cardiology', 
      description: 'Focused cardiovascular system review covering cardiac physiology, pathology, pharmacology, and clinical presentations.', 
      category: 'Cardiology',
      examType: 'Medical School',
      creator: 'Dr. Emily Rodriguez, MD, FACC',
      totalQuestions: 800,
      difficulty: 'Hard',
      lastUpdated: '2023-12-10',
      exampleQuestions: [
        {
          question: "Which ECG finding is most specific for acute anterior wall MI?",
          answer: "ST-segment elevation in V1-V4"
        },
        {
          question: "What is the most common cause of dilated cardiomyopathy?",
          answer: "Idiopathic (although ischemic heart disease is the most common identifiable cause)"
        }
      ]
    },
    { 
      id: 5, 
      name: 'Heme/Lymph', 
      description: 'Comprehensive coverage of hematology and lymphoid systems, including anemias, leukemias, lymphomas, and coagulation disorders.', 
      category: 'Hematology',
      examType: 'Medical School',
      creator: 'Dr. Michael Chang, MD, PhD',
      totalQuestions: 600,
      difficulty: 'Medium',
      lastUpdated: '2023-11-15',
      exampleQuestions: [
        {
          question: "What is the most common chromosomal abnormality in chronic myeloid leukemia (CML)?",
          answer: "Philadelphia chromosome - t(9;22)"
        },
        {
          question: "Which iron study is most useful in diagnosing iron deficiency anemia?",
          answer: "Serum ferritin"
        }
      ]
    },
    { 
      id: 6, 
      name: 'Biochemistry & Genetics', 
      description: 'In-depth review of medical biochemistry and genetics, focusing on metabolic pathways, inherited disorders, and molecular medicine.', 
      category: 'Biochemistry/Genetics',
      examType: 'Medical School',
      creator: 'Dr. Lisa Wong, MD, PhD',
      totalQuestions: 1200,
      difficulty: 'Hard',
      lastUpdated: '2023-12-05',
      exampleQuestions: [
        {
          question: "Which enzyme deficiency results in Tay-Sachs disease?",
          answer: "Hexosaminidase A"
        },
        {
          question: "What is the rate-limiting enzyme in cholesterol synthesis?",
          answer: "HMG-CoA reductase"
        }
      ]
    }
  ])

  const [searchTerm, setSearchTerm] = React.useState('')
  const [activeClass, setActiveClass] = React.useState(null)
  const [uploadProgress, setUploadProgress] = React.useState(0)
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false)
  const { toast } = useToast()

  const [isUploadModalOpen, setIsUploadModalOpen] = React.useState(false)
  const [selectedClass, setSelectedClass] = React.useState('')
  const [newClassName, setNewClassName] = React.useState('')
  const [lectureName, setLectureName] = React.useState('')
  const [isNewClass, setIsNewClass] = React.useState(false)

  const [isQuestionBankView, setIsQuestionBankView] = React.useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0)
  const [selectedAnswer, setSelectedAnswer] = React.useState(null)
  const [flaggedQuestions, setFlaggedQuestions] = React.useState([])
  const [menuOpen, setMenuOpen] = React.useState(false)
  const [answeredQuestions, setAnsweredQuestions] = React.useState([])
  const [filter, setFilter] = React.useState("all")
  const { setTheme } = useTheme()

  const [downloadedQuestionBanks, setDownloadedQuestionBanks] = React.useState([])
  // New state for delete confirmation
  const [deleteConfirmation, setDeleteConfirmation] = React.useState(null)
  // New state for question bank details modal
  const [selectedQuestionBank, setSelectedQuestionBank] = React.useState(null)
  const [isQuestionBankModalOpen, setIsQuestionBankModalOpen] = React.useState(false)
  // Add new account info state
  const [accountInfo, setAccountInfo] = React.useState({
    institution: '',
    areaOfEducation: '',
    phone: '',
    nameUsername: '',
    mainGoal: ''
  })
  // Add new state for difficulty modal
  const [isDifficultyModalOpen, setIsDifficultyModalOpen] = React.useState(false)
  const [difficulty, setDifficulty] = React.useState('medium')
  const [numberOfQuestions, setNumberOfQuestions] = React.useState('10')
  // Add new state for user credits and upgrade modal
  const [userCredits, setUserCredits] = React.useState(100)
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = React.useState(false)
  // Add statistics states
  const [mockData, setMockData] = React.useState([])
  
  // Initialize mock data after mount
  React.useEffect(() => {
    setMockData(generateMockData())
  }, [])

  // Update stats calculations to handle empty initial state
  const totalQuestions = React.useMemo(() => 
    mockData.reduce((sum, day) => sum + day.count, 0),
    [mockData]
  )
  
  const daysLearned = React.useMemo(() => 
    mockData.filter(day => day.count > 0).length,
    [mockData]
  )

  const dailyAverage = React.useMemo(() => 
    mockData.length ? formatNumber(totalQuestions / mockData.length) : '0.0',
    [totalQuestions, mockData]
  )

  const { longestStreak, currentStreak } = React.useMemo(() => {
    if (!mockData.length) return { longestStreak: 0, currentStreak: 0 }
    
    const streaks = mockData.reduce((acc, day, index) => {
      if (day.count > 0) {
        if (index > 0 && mockData[index - 1].count > 0) {
          acc[acc.length - 1]++
        } else {
          acc.push(1)
        }
      }
      return acc
    }, [])

    return {
      longestStreak: Math.max(...streaks, 0),
      currentStreak: mockData[mockData.length - 1].count > 0 ? streaks[streaks.length - 1] : 0
    }
  }, [mockData])

  const [displayedAverage, setDisplayedAverage] = React.useState('0.0')
  
  React.useEffect(() => {
    const average = totalQuestions / mockData.length
    setDisplayedAverage(formatNumber(average))
  }, [totalQuestions, mockData.length])

  const filteredQuestions = React.useMemo(() => {
    return questions.filter((q) => {
      if (filter === "all") return true
      if (filter === "flagged") return flaggedQuestions.includes(q.id)
      if (filter === "answered") return answeredQuestions.includes(q.id)
      if (filter === "unanswered") return !answeredQuestions.includes(q.id)
      return q.difficulty.toLowerCase() === filter.toLowerCase()
    })
  }, [filter, flaggedQuestions, answeredQuestions])

  const currentQuestion = filteredQuestions[currentQuestionIndex] || null

  const filteredQuestionBanks = publicQuestionBanks.filter(bank =>
    bank.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bank.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bank.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const files = Array.from(e.dataTransfer.files)
    console.log('Dropped files:', files)
    simulateFileUpload()
  }

  const simulateFileUpload = () => {
    setUploadProgress(0)
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsUploadModalOpen(true)
          return 100
        }
        return prev + 10
      })
    }, 500)
  }

  // Add these new state variables after other state declarations
  const [isShareModalOpen, setIsShareModalOpen] = React.useState(false)
  const [shareItem, setShareItem] = React.useState<ShareItem | null>(null)
  const [selectedAccess, setSelectedAccess] = React.useState('viewer')

  // Update the existing handleClassAction function
  const handleClassAction = (action, classId) => {
    if (action === 'share') {
      const classItem = classes.find(c => c.id === classId)
      if (classItem) {
        setShareItem({
          id: classItem.id,
          name: classItem.name,
          type: 'class'
        })
        setIsShareModalOpen(true)
      }
    } else if (action === 'delete') {
      setDeleteConfirmation({ type: 'class', id: classId })
    }
  }

  // Update the existing handleLectureAction function
  const handleLectureAction = (action, classId, lectureId) => {
    if (action === 'share') {
      const classItem = classes.find(c => c.id === classId)
      const lecture = classItem?.lectures.find(l => l.id === lectureId)
      if (lecture) {
        setShareItem({
          id: lecture.id,
          name: lecture.name,
          type: 'lecture'
        })
        setIsShareModalOpen(true)
      }
    } else if (action === 'delete') {
      setDeleteConfirmation({ type: 'lecture', id: lectureId })
    }
  }

  // Update the existing handleQuestionBankAction function
  const handleQuestionBankAction = (action, bankId) => {
    if (action === 'share') {
      const bank = publicQuestionBanks.find(b => b.id === bankId)
      if (bank) {
        setShareItem({
          id: bank.id,
          name: bank.name,
          type: 'questionBank'
        })
        setIsShareModalOpen(true)
      }
    } else if (action === 'delete') {
      setDeleteConfirmation({ type: 'questionBank', id: bankId })
    }
  }


  // Add this function to handle the generate link action
  const handleGenerateLink = () => {
    toast({
      title: "Link Generated",
      description: `Share link generated for ${shareItem?.name}`,
    })
    setIsShareModalOpen(false)
    setSelectedAccess('viewer') // Reset access level
  }

  const handleConfirmDelete = () => {
    if (deleteConfirmation) {
      if (deleteConfirmation.type === 'class') {
        setClasses(classes.filter(c => c.id !== deleteConfirmation.id))
        toast({
          title: "Class Deleted",
          description: `Class ${deleteConfirmation.id} has been deleted.`,
        })
      } else if (deleteConfirmation.type === 'lecture') {
        setClasses(classes.map(c => ({
          ...c,
          lectures: c.lectures.filter(l => l.id !== deleteConfirmation.id)
        })))
        toast({
          title: "Lecture Deleted",
          description: `Lecture ${deleteConfirmation.id} has been deleted.`,  // Fixed syntax error here
        })
      } else if (deleteConfirmation.type === 'questionBank') {
        setDownloadedQuestionBanks(downloadedQuestionBanks.filter(id => id !== deleteConfirmation.id))
        toast({
          title: "Question Bank Deleted",
          description: `Question Bank ${deleteConfirmation.id} has been removed from your downloads.`,
        })
      }
      setDeleteConfirmation(null)
    }
  }

  const handleUploadSubmit = () => {
    let updatedClasses = [...classes]
    let classId
    let className

    if (isNewClass) {
      classId = classes.length + 1
      className = newClassName
      updatedClasses.push({ id: classId, name: className, lectures: [] })
    } else {
      const selectedClassObj = classes.find(c => c.id.toString() === selectedClass)
      if (!selectedClassObj) return
      classId = selectedClassObj.id
      className = selectedClassObj.name
    }

    const newLecture = {
      id: Math.max(...classes.flatMap(c => c.lectures.map(l => l.id))) + 1,
      name: lectureName
    }

    updatedClasses = updatedClasses.map(c =>
      c.id === classId ? { ...c, lectures: [...c.lectures, newLecture] } : c
    )
    setClasses(updatedClasses)
    setIsUploadModalOpen(false)
    setIsDifficultyModalOpen(true) // Open the new difficulty modal

    // Reset fields
    setSelectedClass('')
    setNewClassName('')
    setLectureName('')
    setIsNewClass(false)
  }

  // Add new handler for difficulty submission
  const handleDifficultySubmit = () => {
    setIsDifficultyModalOpen(false)
    toast({
      title: "Lecture Added",
      description: `"${lectureName}" has been added to ${isNewClass ? newClassName : classes.find(c => c.id.toString() === selectedClass)?.name}. Difficulty: ${difficulty}, Questions: ${numberOfQuestions}`,
    })

    // Reset all states
    setDifficulty('medium')
    setNumberOfQuestions('10')
  }

  const handleQuestionBankClick = () => {
    setIsQuestionBankView(true)
    setIsSidebarOpen(false)
  }

  const checkCredits = () => {
    if (userCredits <= 0) {
      setIsUpgradeModalOpen(true)
      return false
    }
    return true
  }

  const handleAnswerSelect = (index) => {
    if (!checkCredits()) return

    setSelectedAnswer(index)
    if (currentQuestion && !answeredQuestions.includes(currentQuestion.id)) {
      setAnsweredQuestions([...answeredQuestions, currentQuestion.id])
      setUserCredits(prevCredits => prevCredits - 1)
    }
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedAnswer(null)
      setStruckThroughChoices([]) // Reset struck-through choices
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
      setSelectedAnswer(null)
      setStruckThroughChoices([]) // Reset struck-through choices
    }
  }

  const toggleFlag = () => {
    if (currentQuestion) {
      setFlaggedQuestions((prev) =>
        prev.includes(currentQuestion.id)
          ? prev.filter((id) => id !== currentQuestion.id)
          : [...prev, currentQuestion.id]
      )
    }
  }

  const handleHomeClick = () => {
    setIsQuestionBankView(false)
    setIsSidebarOpen(false)
  }

  const handleDownloadQuestionBank = (bankId) => {
    if (!downloadedQuestionBanks.includes(bankId)) {
      setDownloadedQuestionBanks([...downloadedQuestionBanks, bankId])
      toast({
        title: "Question Bank Downloaded",
        description: `Question Bank ${bankId} has been added to your sidebar.`,
      })
    } else {
      toast({
        title: "Question Bank Already Downloaded",
        description: `Question Bank ${bankId} is already in your sidebar.`,
      })
    }
  }

  const handleViewQuestionBankDetails = (bankId) => {
    setSelectedQuestionBank(bankId)
    setIsQuestionBankModalOpen(true)
  }

  const handleUpgrade = () => {
    setUserCredits(1000)
    setIsUpgradeModalOpen(false)
    toast({
      title: "Account Upgraded",
      description: "You now have unlimited questions!",
    })
  }

  // Add new state for statistics sidebar
  const [isStatsSidebarOpen, setIsStatsSidebarOpen] = React.useState(false)

  // Add these new state variables near your other React.useState declarations
  const [questionsStats, setQuestionsStats] = React.useState({
    generated: 1250,  // Example starting values
    answered: 842,
    correct: 687,
    incorrect: 155,
  })

  // Add this new state near other useState declarations
  const [isAlertModalOpen, setIsAlertModalOpen] = React.useState(false)

  // Add these new state variables after other state declarations
  const [isInviteModalOpen, setIsInviteModalOpen] = React.useState(false)
  const [inviteLinkCopied, setInviteLinkCopied] = React.useState(false)

  // Add this new function after other function declarations
  const handleCopyInviteLink = async () => {
    const inviteLink = "https://smartify.edu/join/invite-" + Math.random().toString(36).substring(7)
    try {
      await navigator.clipboard.writeText(inviteLink)
      setInviteLinkCopied(true)
      toast({
        title: "Invite Link Copied!",
        description: "Share this link with your friends to invite them to Smartify.",
      })
      setTimeout(() => setInviteLinkCopied(false), 2000)
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try again or manually copy the link.",
        variant: "destructive",
      })
    }
  }

  // Add this new state with your other state declarations
  const [viewedQuestions, setViewedQuestions] = React.useState([])

  // Update the question selection handler to track viewed questions
  const handleQuestionSelect = (index) => {
    setCurrentQuestionIndex(index)
    setSelectedAnswer(null)
    if (currentQuestion && !viewedQuestions.includes(currentQuestion.id)) {
      setViewedQuestions(prev => [...prev, currentQuestion.id])
    }
  }

  // Add new state to track struck-through choices
  const [struckThroughChoices, setStruckThroughChoices] = React.useState([])

  // Add handler to toggle strikethrough on right-click
  const handleStrikeThrough = (e, index) => {
    e.preventDefault()
    if (selectedAnswer !== null) return // Prevent changes after answering
    setStruckThroughChoices(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

  React.useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
        handleNextQuestion();
      } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
        handlePreviousQuestion();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleNextQuestion, handlePreviousQuestion]);

  const handleSharedQuestionBankView = (bankId, sharedBy) => {
    router.push(`/shared-question-bank?bankId=${bankId}&sharedBy=${sharedBy}`)
  }

  return (
    <TooltipProvider>
      <div className={cn(
        "grid h-screen bg-background transition-all duration-300 ease-in-out",
        isSidebarOpen ? "grid-cols-[256px,1fr]" : "grid-cols-[0px,1fr]"
      )}>
        {/* Replace the fixed sidebar with this */}
        <div className={cn(
          "overflow-hidden border-r bg-background transition-all duration-300",
          isSidebarOpen ? "w-64" : "w-0"
        )}>
          <div className="w-64 p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Classes</h2>
              <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <ScrollArea className="h-[calc(100vh-400px)]"> {/* Changed from -280px to -400px */}
              {classes.map((classItem) => (
                <Collapsible key={classItem.id} className="mb-2">
                  <div className="flex items-center justify-between w-full p-2 hover:bg-accent rounded-md">
                    <CollapsibleTrigger className="flex items-center text-left">
                      <ChevronDown className="h-4 w-4 transition-transform duration-200 ease-in-out group-data-[state=open]:rotate-180 mr-2" />
                      <span>{classItem.name}</span>
                    </CollapsibleTrigger>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onSelect={() => handleClassAction('share', classItem.id)}>Share</DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => handleClassAction('delete', classItem.id)}>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <CollapsibleContent className="pl-6 mt-1">
                    {classItem.lectures.map((lecture) => (
                      <div key={lecture.id} className="flex items-center justify-between p-2 hover:bg-accent rounded-md">
                        <span>{lecture.name}</span>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onSelect={() => handleLectureAction('share', classItem.id, lecture.id)}>Share</DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => handleLectureAction('delete', classItem.id, lecture.id)}>Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        </div>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              ))}
              {downloadedQuestionBanks.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-semibold mb-2">Downloaded Question Banks</h3>
                  {downloadedQuestionBanks.map((bankId) => {
                    const bank = publicQuestionBanks.find(b => b.id === bankId)
                    if (!bank) return null
                    return (
                      <div key={bank.id} className="flex items-center justify-between p-2 hover:bg-accent rounded-md">
                        <span className="flex items-center">
                          <BookOpen className="h-4 w-4 mr-2" />
                          {bank.name}
                        </span>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onSelect={() => handleQuestionBankAction('share', bank.id)}>Share</DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => handleQuestionBankAction('delete', bank.id)}>Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    )
                  })}
                </div>
              )}
            </ScrollArea>
            <Button className="w-full mt-4" variant="outline" onClick={handleQuestionBankClick}>
              Question Bank
            </Button>

            <Button 
              className="w-full mt-4" 
              variant="outline" 
              onClick={() => handleSharedQuestionBankView(sharedQuestionBank.id, sharedQuestionBank.creator)}
            >
              <Share className="mr-2 h-4 w-4" />
              Question Bank Shared View
            </Button>

            <Button 
              className="w-full mt-4" 
              variant="outline" 
              onClick={() => setIsInviteModalOpen(true)}
            >
              <User className="mr-2 h-4 w-4" />
              Share App
            </Button>

            <Button 
              className="w-full mt-4" 
              variant="outline" 
              onClick={() => setIsUpgradeModalOpen(true)}
            >
              <Zap className="mr-2 h-4 w-4" />
              Upgrade
            </Button>

            <Button className="w-full mt-4" variant="outline" onClick={() => setIsAlertModalOpen(true)}>
              <AlertTriangle className="mr-2 h-4 w-4" />
              Alert
            </Button>

            <Button className="w-full mt-4" variant="outline" onClick={handleHomeClick}>
              <Home className="mr-2 h-4 w-4" />
              Home
            </Button>
          </div>
        </div>

        <div className="flex-1 flex">
          {isQuestionBankView && (
            <aside className="w-20 border-r bg-muted/50">
              <ScrollArea className="h-[calc(100vh-4rem)]">
                <div className="p-4">
                  {filteredQuestions.map((q, index) => (
                    <Button
                      key={q.id}
                      variant={index === currentQuestionIndex ? "secondary" : "ghost"}
                      className={cn(
                        "mb-2 h-12 w-12 rounded-full p-0 relative transition-all duration-200",
                        // Base styles - always transparent background
                        "bg-transparent hover:bg-transparent",
                        // Border styles based on state
                        "border-2",
                        // Current question styles - add subtle ring
                        index === currentQuestionIndex && 
                          "ring-2 ring-primary/20 ring-offset-2",
                        // Answered question - black border
                        answeredQuestions.includes(q.id) && 
                          "border-foreground",
                        // Viewed but not answered - gray border
                        !answeredQuestions.includes(q.id) && viewedQuestions.includes(q.id) && 
                          "border-muted-foreground",
                        // Unviewed - white/subtle border
                        !answeredQuestions.includes(q.id) && !viewedQuestions.includes(q.id) && 
                          "border-border",
                      )}
                      onClick={() => handleQuestionSelect(index)}
                    >
                      {index + 1}
                      {flaggedQuestions.includes(q.id) && (
                        <Flag className="absolute -top-1 -right-1 h-4 w-4 text-zinc-400 dark:text-zinc-500" />
                      )}
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            </aside>
          )}
          <div className="flex-1 flex flex-col">
            <header className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center">
                <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                  <Menu className="h-6 w-6" />
                </Button>
                <div 
                  className="cursor-pointer" 
                  onClick={handleHomeClick}
                >
                  <span className="text-2xl font-bold text-primary">Smartify</span>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Input
                  type="search"
                  placeholder={isQuestionBankView ? "Search questions..." : "Search question banks..."}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64"
                />
                {isQuestionBankView && (
                  <Select
                    value={filter}
                    onValueChange={(value) => setFilter(value)}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter questions..." />
                    </SelectTrigger>
                    <SelectContent className="bg-background border">
                      {filterOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Settings className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Settings</p>
                        </TooltipContent>
                      </Tooltip>
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>Settings</SheetTitle>
                      <SheetDescription>
                        Adjust your app settings here.
                      </SheetDescription>
                    </SheetHeader>
                    <div className="py-4">
                      <h3 className="mb-2 text-sm font-medium">Theme</h3>
                      <Select onValueChange={(value) => setTheme(value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select theme" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">Light</SelectItem>
                          <SelectItem value="dark">Dark</SelectItem>
                          <SelectItem value="system">System</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button asChild>
                      <Link href="/shared-class">
                        1
                      </Link>
                    </Button>
                    <Button asChild>
                      <Link href="/shared-lecture">
                        2
                      </Link>
                    </Button>
                  </SheetContent>
                </Sheet>
              </div>
            </header>
            <main className="flex-1 overflow-y-auto px-8 py-6"> {/* Changed from p-6 to px-8 py-6 */}
              {isQuestionBankView ? (
                <div className="space-y-8">
                  <section>
                    {currentQuestion ? (
                      <Card className="w-full"> {/* Changed from max-w-3xl mx-auto */}
                        <CardHeader>
                          <CardTitle className="text-xl font-bold">Question {currentQuestionIndex + 1}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          <p className="text-base whitespace-pre-line"> {/* Changed: removed max-w-[90ch], added whitespace-pre-line */}
                            {currentQuestion.question}
                          </p>
                          
                          <div className="space-y-3">
                            {currentQuestion.choices.map((choice, index) => {
                              const isSelected = selectedAnswer === index;
                              const isCorrect = index === currentQuestion.correctAnswer;
                              const isStruckThrough = struckThroughChoices.includes(index);
                              
                              let buttonStyle = "p-4 rounded-lg transition-colors cursor-pointer ";
                              
                              if (selectedAnswer !== null) {
                                if (isCorrect) {
                                  buttonStyle += "bg-green-100 hover:bg-green-200";
                                } else if (isSelected) {
                                  buttonStyle += "bg-red-100 hover:bg-red-200";
                                } else {
                                  buttonStyle += "bg-gray-100 hover:bg-gray-200";
                                }
                              } else {
                                buttonStyle += "bg-gray-100 hover:bg-gray-200";
                              }

                              if (isStruckThrough) {
                                buttonStyle += " line-through opacity-50";
                              }

                              return (
                                <div
                                  key={index}
                                  className={buttonStyle}
                                  onClick={() => handleAnswerSelect(index)}
                                  onContextMenu={(e) => handleStrikeThrough(e, index)}
                                >
                                  {choice}
                                </div>
                              );
                            })}
                          </div>
                        </CardContent>
                        
                        {selectedAnswer !== null && (
                          <CardFooter className="flex flex-col items-start border-t p-6 mt-6">
                            <h3 className="font-bold text-lg mb-2">Explanation</h3>
                            <p className="text-gray-700 whitespace-pre-line"> {/* Changed: removed max-w-[90ch], added whitespace-pre-line */}
                              {currentQuestion.explanation}
                            </p>
                          </CardFooter>
                        )}
                      </Card>
                    ) : (
                      <Card className="p-6">
                        <p>No questions available for the current filter.</p>
                      </Card>
                    )}
                  </section>
                </div>
              ) : (
                <div className="space-y-8">
                  <section>
                    <h2 className="text-2xl font-semibold mb-4">Upload Lecture PDF</h2>
                    <Card>
                      <CardContent className="p-6">
                        <div
                          className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:bg-accent hover:border-primary transition-colors"
                          onDragOver={handleDragOver}
                          onDrop={handleDrop}
                          onClick={() => document.getElementById('file-upload')?.click()}
                        >
                          <input
                            id="file-upload"
                            type="file"
                            className="hidden"
                            accept=".pdf"
                            onChange={(e) => {
                              if (e.target.files) {
                                console.log('Selected file:', e.target.files[0])
                                simulateFileUpload()
                              }
                            }}
                          />
                          <Upload className="mx-auto h-12 w-12 text-gray-400" />
                          <p className="mt-2 text-sm text-gray-600">Click to upload or drag and drop</p>
                          <p className="mt-1 text-xs text-gray-500">PDF files only, up to 10MB</p>
                          <p className="mt-1 text-xs text-blue-500">Uploading a PDF will create a new lecture</p>
                        </div>
                        {uploadProgress > 0 && (
                          <div className="mt-4">
                            <Progress value={uploadProgress} className="w-full" />
                            <p className="mt-2 text-sm text-gray-600">{uploadProgress === 100 ? 'Upload complete!' : `Uploading... ${uploadProgress}%`}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </section>
                  <section>
                    <Tabs defaultValue="questionBanks" className="space-y-6">
                      <div className="flex items-center justify-between">
                        <TabsList className="inline-flex h-auto p-1 bg-muted/50 rounded-xl">
                          <TabsTrigger 
                            value="questionBanks" 
                            className="inline-flex items-center justify-center px-6 py-3 rounded-lg text-sm font-medium transition-all data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                          >
                            <BookOpen className="mr-2 h-4 w-4" />
                            Question Banks
                          </TabsTrigger>
                          <TabsTrigger 
                            value="statistics" 
                            className="inline-flex items-center justify-center px-6 py-3 rounded-lg text-sm font-medium transition-all data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                          >
                            <BarChart className="mr-2 h-4 w-4" />
                            Statistics
                          </TabsTrigger>
                        </TabsList>
                      </div>
                      
                      <TabsContent 
                        value="questionBanks" 
                        className="space-y-4 transition-all transform data-[state=active]:translate-y-0 data-[state=inactive]:translate-y-4"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {filteredQuestionBanks.map((bank) => (
                            <Card key={bank.id} className="overflow-hidden transition-shadow hover:shadow-lg">
                              <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                  {bank.name}
                                  <span className={`text-xs font-normal px-2 py-1 rounded-full ${
                                    bank.category === 'math' ? 'bg-blue-100 text-blue-800' :
                                    bank.category === 'biology' ? 'bg-green-100 text-green-800' :
                                    'bg-yellow-100 text-yellow-800'
                                  }`}>
                                    {bank.category}
                                  </span>
                                </CardTitle>
                                <CardDescription>{bank.description}</CardDescription>
                              </CardHeader>
                              <CardFooter className="flex justify-between">
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button 
                                      onClick={() => handleDownloadQuestionBank(bank.id)}
                                      variant={downloadedQuestionBanks.includes(bank.id) ? "secondary" : "default"}
                                    >
                                      <Download className="mr-2 h-4 w-4" />
                                      {downloadedQuestionBanks.includes(bank.id) ? "Downloaded" : "Download"}
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>{downloadedQuestionBanks.includes(bank.id) ? "Question bank already downloaded" : "Download this question bank"}</p>
                                  </TooltipContent>
                                </Tooltip>
                                <Button variant="outline" onClick={() => handleViewQuestionBankDetails(bank.id)}>
                                  <Info className="mr-2 h-4 w-4" />
                                  View Details
                                </Button>
                              </CardFooter>
                            </Card>
                          ))}
                        </div>
                      </TabsContent>
                      
                      <TabsContent 
                        value="statistics" 
                        className="space-y-4 transition-all transform data-[state=active]:translate-y-0 data-[state=inactive]:translate-y-4"
                      >
                        <StatsOverview />
                      </TabsContent>
                    </Tabs>
                  </section>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
      {/* ...existing dialogs and other components... */}
      <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Lecture</DialogTitle>
            <DialogDescription>
              Choose a class for your new lecture or create a new class.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="class-select" className="col-span-4">
                Select Class
              </Label>
              <Select
                value={selectedClass}
                onValueChange={(value) => {
                  setSelectedClass(value)
                  setIsNewClass(value === 'new')
                }}
              >
                <SelectTrigger className="col-span-4">
                  <SelectValue placeholder="Select a class" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((classItem) => (
                    <SelectItem key={classItem.id} value={classItem.id.toString()}>
                      {classItem.name}
                    </SelectItem>
                  ))}
                  <SelectItem value="new">
                    <span className="flex items-center">
                      <Plus className="mr-2 h-4 w-4" />
                      Create New Class
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            {isNewClass && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="new-class-name" className="col-span-4">
                  New Class Name
                </Label>
                <Input
                  id="new-class-name"
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  className="col-span-4"
                />
              </div>
            )}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="lecture-name" className="col-span-4">
                Lecture Name
              </Label>
              <Input
                id="lecture-name"
                value={lectureName}
                onChange={(e) => setLectureName(e.target.value)}
                className="col-span-4"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleUploadSubmit}>
              Add Lecture
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Sheet>
        <SheetTrigger asChild>
          <Button className="fixed bottom-4 right-4" size="icon" variant="secondary">
            <HelpCircle className="h-5 w-5" />
            <span className="sr-only">Help &amp; Support</span>
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Help &amp; Support</SheetTitle>
            <SheetDescription>Get assistance with using the Smartify Student Portal.</SheetDescription>
          </SheetHeader>
          <Tabs defaultValue="faq" className="mt-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="faq">FAQ</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
            </TabsList>
            <TabsContent value="faq">
              <div className="mt-4 space-y-4">
                <div>
                  <h3 className="font-semibold">How do I upload a lecture PDF?</h3>
                  <p className="text-sm text-muted-foreground">Click on the upload area or drag and drop a PDF file to upload a new lecture.</p>
                </div>
                <div>
                  <h3 className="font-semibold">How do I access the Question Bank?</h3>
                  <p className="text-sm text-muted-foreground">Click on the "Question Bank" button in the sidebar to access practice questions.</p>
                </div>
                <div>
                  <h3 className="font-semibold">Can I change the theme of the application?</h3>
                  <p className="text-sm text-muted-foreground">Yes, you can change the theme by clicking the settings icon in the top right corner.</p>
                </div>
                <div>
                  <h3 className="font-semibold">How can I eliminate answer choices?</h3>
                  <p className="text-sm text-muted-foreground">Right-click on any answer choice to strike it through. This can help you eliminate options while working through a question.</p>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="contact">
              <div className="mt-4 space-y-4">
                <Input placeholder="Your email" />
                <Textarea placeholder="Describe your issue or question" />
                <Button className="w-full">Send Message</Button>
              </div>
            </TabsContent>
          </Tabs>
        </SheetContent>
      </Sheet>
      <Dialog open={deleteConfirmation !== null} onOpenChange={() => setDeleteConfirmation(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this {deleteConfirmation?.type}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmation(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={isQuestionBankModalOpen} onOpenChange={setIsQuestionBankModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Question Bank Details</DialogTitle>
          </DialogHeader>
          {selectedQuestionBank !== null && (
            <div className="mt-4">
              {(() => {
                const bank = publicQuestionBanks.find(b => b.id === selectedQuestionBank)
                if (!bank) return <p>Question bank not found.</p>
                return (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold">{bank.name}</h3>
                      <p className="text-sm text-muted-foreground">{bank.description}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium">Creator</p>
                        <p className="text-sm text-muted-foreground">{bank.creator}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Category</p>
                        <p className="text-sm text-muted-foreground">{bank.category}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Exam Type</p>
                        <p className="text-sm text-muted-foreground">{bank.examType}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Total Questions</p>
                        <p className="text-sm text-muted-foreground">{bank.totalQuestions}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Difficulty</p>
                        <p className="text-sm text-muted-foreground">{bank.difficulty}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Last Updated</p>
                        <p className="text-sm text-muted-foreground">{bank.lastUpdated}</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-md font-semibold mb-2">Example Questions</h4>
                      {bank.exampleQuestions.map((q, index) => (
                        <div key={index} className="mb-2 p-2 bg-muted rounded-md">
                          <p className="text-sm font-medium">Q: {q.question}</p>
                          <p className="text-sm text-muted-foreground">A: {q.answer}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })()}
            </div>
          )}
          <DialogFooter className="flex space-x-2">
            <Button 
              variant="outline" 
              onClick={() => handleQuestionBankAction('share', selectedQuestionBank)}
            >
              <Share className="mr-2 h-4 w-4" />
              Share
            </Button>
            <Button onClick={() => setIsQuestionBankModalOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={isDifficultyModalOpen} onOpenChange={setIsDifficultyModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Set Lecture Difficulty</DialogTitle>
            <DialogDescription>
              Choose the difficulty level and number of questions for your new lecture.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="difficulty" className="col-span-4">
                Difficulty Level
              </Label>
              <RadioGroup
                id="difficulty"
                value={difficulty}
                onValueChange={setDifficulty}
                className="col-span-4 flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="easy" id="easy" />
                  <Label htmlFor="easy">Easy</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="medium" id="medium" />
                  <Label htmlFor="medium">Medium</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="hard" id="hard" />
                  <Label htmlFor="hard">Hard</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="questions" className="col-span-4">
                Number of Questions
              </Label>
              <Select
                value={numberOfQuestions}
                onValueChange={setNumberOfQuestions}
              >
                <SelectTrigger id="questions" className="col-span-4">
                  <SelectValue placeholder="Select number of questions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="15">15</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleDifficultySubmit}>
              Create Lecture
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={isUpgradeModalOpen} onOpenChange={setIsUpgradeModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Choose Your MCQ Generation Plan</DialogTitle>
            <DialogDescription>
              Unlock the power of unlimited question generation
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col md:flex-row gap-4 mt-4">
            {/* Free Plan Card */}
            <Card className="flex-1">
              <CardHeader>
                <CardTitle className="text-center text-xl font-bold">Free Plan</CardTitle>
                <CardDescription className="text-center">Get started with basic features</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline justify-center mt-4">
                  <span className="text-4xl font-extrabold">$0</span>
                  <span className="text-gray-500 ml-1">/month</span>
                </div>
                <ul className="mt-6 space-y-2">
                  <li className="flex items-center">
                    <Minus className="h-4 w-4 text-gray-500" />
                    <span className="ml-2">Limited classes and lectures</span>
                  </li>
                  <li className="flex items-center">
                    <Minus className="h-4 w-4 text-gray-500" />
                    <span className="ml-2">Basic MCQ generation</span>
                  </li>
                  <li className="flex items-center">
                    <Minus className="h-4 w-4 text-gray-500" />
                    <span className="ml-2">Limited repeats</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button disabled variant="outline" className="w-full">Current Plan</Button>
              </CardFooter>
            </Card>
            {/* Premium Plan Card */}
            <Card className="flex-1 border border-primary">
              <CardHeader>
                <CardTitle className="text-center text-xl font-bold">Premium Plan</CardTitle>
                <CardDescription className="text-center">Unlock unlimited potential</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline justify-center mt-4">
                  <span className="text-4xl font-extrabold">$30</span>
                  <span className="text-gray-500 ml-1">/month</span>
                </div>
                <ul className="mt-6 space-y-2">
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="ml-2">Unlimited notes and chapters</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="ml-2">Unlimited MCQ generation</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="ml-2">Unlimited repeats</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="ml-2">Advanced features and priority support</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <a 
                    href="https://checkout.stripe.com/c/pay/cs_test_a1a7wocDcONRWDAqOSj3uGsOcQdFa7tEOz36vTTH0DdNgA1uLKAbSxkt21#fidkdWxOYHwnPyd1blpxYHZxWjA0VXV%2FfGdMUTxwaXdcYHdjb0BkZE8wRlBRPWAzNG9yVW9qdFxjUEM1PTF8MnZrYmJTS2JSR19kZklhV1E1f21RdVF%2FQFJPTzx8a081aTJQc2QwSmFDcVNfNTVSQXcyMkZtMScpJ2hsYXYnP34nYnBsYSc%2FJ2c0M2M8Mjc3KDw0YzEoMTAwMCg8MjdgKGZkZjYxPGQ9PTVjZzdmNzU8ZicpJ2hwbGEnPyc1Yz00NWczMigzNT0yKDEzMzcoPDBhMCg1YWE2Zj0xMWQ0NmA0MGcyYGAnKSd2bGEnPydjZDUzNzxhNihkNjY9KDE0MzEoPDQzMChjPGRnPDxmZ2Y1PGFnMzExZzwneCknZ2BxZHYnP15YKSdpZHxqcHFRfHVgJz8ndmxrYmlgWmxxYGgnKSd3YGNgd3dgd0p3bGJsayc%2FJ21xcXU%2FKippamZkaW1qdnE%2FNjU1NSd4JSUl" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    Join Premium for $30/month
                  </a>
                </Button>
              </CardFooter>
            </Card>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUpgradeModalOpen(false)}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={isAlertModalOpen} onOpenChange={setIsAlertModalOpen}>
        <DialogContent className="sm:max-w-[425px] text-center">
          <DialogHeader>
            <DialogTitle className="text-2xl">Congratulations, Power User! 🎉</DialogTitle>
            <DialogDescription className="text-lg mt-4">
              It looks like you're getting great value from Smartify. To show our appreciation, enjoy a special discount on your monthly subscription!
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center">
            <Button onClick={() => setIsAlertModalOpen(false)}>
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Add this new Dialog before the closing TooltipProvider tag */}
      <Dialog open={isShareModalOpen} onOpenChange={setIsShareModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Share {shareItem?.name}</DialogTitle>
            <DialogDescription>
              Choose who can access this content and what they can do with it
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label className="flex items-center">
                Access Level
                <AccessLevelInfo />
              </Label>
              <RadioGroup
                value={selectedAccess}
                onValueChange={setSelectedAccess}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="viewer" id="viewer" />
                  <Label htmlFor="viewer">Viewer</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="editor" id="editor" />
                  <Label htmlFor="editor">Editor</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="admin" id="admin" />
                  <Label htmlFor="admin">Admin</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleGenerateLink}>Generate Link</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={isInviteModalOpen} onOpenChange={setIsInviteModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Invite Friends to Smartify</DialogTitle>
            <DialogDescription>
              Share Smartify with your friends and study together!
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                <code className="text-sm">smartify.edu/join/invite-xxx</code>
                <Button
                  size="sm"
                  variant="ghost"
                  className="px-3"
                  onClick={handleCopyInviteLink}
                >
                  {inviteLinkCopied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Benefits for invited friends:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Full access to question banks</li>
                  <li>• Personalized study recommendations</li>
                  <li>• Collaborative study groups</li>
                  <li>• Progress tracking and analytics</li>
                </ul>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsInviteModalOpen(false)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  )
}

export default SmartifyStudentPortal