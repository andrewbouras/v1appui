'use client'

import * as React from 'react'
import { Upload, Search, X, Menu, Download, MoreVertical, User, ChevronDown, Settings, Plus, ChevronLeft, ChevronRight, Flag, HelpCircle, Home, BookOpen, Info, AlertTriangle, BarChart, Calendar, Zap } from 'lucide-react'
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

// Mock data for questions
const questions = [
  {
    id: 1,
    question: "What is the capital of France?",
    choices: ["London", "Berlin", "Paris", "Madrid", "Rome"],
    correctAnswer: 2,
    explanation: "Paris is the capital and most populous city of France.",
    subject: "Geography",
    difficulty: "Easy",
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

export function SmartifyStudentPortal() {
  const [classes, setClasses] = React.useState([
    { id: 1, name: 'Math 101', lectures: [
      { id: 1, name: 'Introduction to Algebra' },
      { id: 2, name: 'Linear Equations' },
      { id: 3, name: 'Quadratic Equations' }
    ]},
    { id: 2, name: 'Biology 201', lectures: [
      { id: 4, name: 'Cell Structure' },
      { id: 5, name: 'Photosynthesis' },
      { id: 6, name: 'Evolution' }
    ]},
    { id: 3, name: 'History 301', lectures: [
      { id: 7, name: 'Ancient Civilizations' },
      { id: 8, name: 'Middle Ages' },
      { id: 9, name: 'Modern History' }
    ]}
  ])

  const [uploadedPdfs, setUploadedPdfs] = React.useState([])
  const [publicQuestionBanks, setPublicQuestionBanks] = React.useState([
    { 
      id: 1, 
      name: 'Math Practice Questions', 
      description: 'A comprehensive collection of practice questions covering various mathematical topics, from basic algebra to advanced calculus.', 
      category: 'math',
      examType: 'General Math',
      creator: 'Dr. Emily Mathison',
      totalQuestions: 500,
      difficulty: 'Mixed',
      lastUpdated: '2023-05-15',
      exampleQuestions: [
        {
          question: "What is the derivative of x^2?",
          answer: "2x"
        },
        {
          question: "Solve for x: 2x + 5 = 13",
          answer: "x = 4"
        }
      ]
    },
    { 
      id: 2, 
      name: 'Biology Flashcards', 
      description: 'An extensive set of flashcards covering key Biology concepts, perfect for quick revision and memorization of important terms and processes.', 
      category: 'biology',
      examType: 'AP Biology',
      creator: 'Prof. Sarah Green',
      totalQuestions: 300,
      difficulty: 'Medium',
      lastUpdated: '2023-06-01',
      exampleQuestions: [
        {
          question: "What is the powerhouse of the cell?",
          answer: "Mitochondria"
        },
        {
          question: "Define photosynthesis",
          answer: "The process by which plants use sunlight, water and carbon dioxide to produce oxygen and energy in the form of sugar"
        }
      ]
    },
    { 
      id: 3, 
      name: 'History Timeline', 
      description: 'An interactive timeline of major historical events, designed to help students visualize and remember key moments in world history.', 
      category: 'history',
      examType: 'World History',
      creator: 'Dr. Michael Historian',
      totalQuestions: 200,
      difficulty: 'Hard',
      lastUpdated: '2023-04-20',
      exampleQuestions: [
        {
          question: "In which year did World War II end?",
          answer: "1945"
        },
        {
          question: "Who was the first President of the United States?",
          answer: "George Washington"
        }
      ]
    },
    { 
      id: 4, 
      name: 'Algebra Mastery', 
      description: 'Advanced algebra problems and solutions, designed to challenge students and prepare them for higher-level mathematics courses.', 
      category: 'math',
      examType: 'SAT Math',
      creator: 'Prof. Alan Algebra',
      totalQuestions: 400,
      difficulty: 'Hard',
      lastUpdated: '2023-05-30',
      exampleQuestions: [
        {
          question: "Solve the system of equations: 2x + y = 5, 3x - 2y = 4",
          answer: "x = 2, y = 1"
        },
        {
          question: "Factor the expression: x^2 - 5x + 6",
          answer: "(x - 2)(x - 3)"
        }
      ]
    },
    { 
      id: 5, 
      name: 'Genetics Quiz', 
      description: 'A comprehensive quiz covering various aspects of genetics, from basic concepts to advanced topics in molecular genetics.', 
      category: 'biology',
      examType: 'MCAT Biology',
      creator: 'Dr. Gene Splitter',
      totalQuestions: 250,
      difficulty: 'Medium',
      lastUpdated: '2023-06-10',
      exampleQuestions: [
        {
          question: "What is the probability of two heterozygous parents (Aa) having a homozygous recessive child (aa)?",
          answer: "25% or 1/4"
        },
        {
          question: "What is the function of mRNA in protein synthesis?",
          answer: "mRNA carries the genetic information from DNA to the ribosomes for protein synthesis"
        }
      ]
    },
    { 
      id: 6, 
      name: 'World War II Facts', 
      description: 'A comprehensive guide to World War II events, covering major battles, key figures, and the global impact of the war.', 
      category: 'history',
      examType: 'AP European History',
      creator: 'Prof. Victoria Victory',
      totalQuestions: 350,
      difficulty: 'Medium',
      lastUpdated: '2023-05-25',
      exampleQuestions: [
        {
          question: "Who were the main Axis powers in World War II?",
          answer: "Germany, Italy, and Japan"
        },
        {
          question: "What was the code name for the Allied invasion of Normandy in 1944?",
          answer: "Operation Overlord (or D-Day)"
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
          description: `Lecture ${deleteConfirmation.id} has been deleted.`,
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
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
      setSelectedAnswer(null)
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
  
  return (
    <TooltipProvider>
      <div className="flex h-screen bg-background">
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
                        "mb-2 h-12 w-12 rounded-full p-0 relative",
                        answeredQuestions.includes(q.id) ? "bg-muted text-muted-foreground" : "bg-background text-foreground"
                      )}
                      onClick={() => {
                        setCurrentQuestionIndex(index)
                        setSelectedAnswer(null)
                      }}
                    >
                      {index + 1}
                      {flaggedQuestions.includes(q.id) && (
                        <Flag className="absolute -top-1 -right-1 h-4 w-4 text-red-500" />
                      )}
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            </aside>
          )}
          <div className="flex-1 flex flex-col">
            <header className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                  <Menu className="h-6 w-6" />
                </Button>
                <div className={`transition-opacity duration-200 ${isSidebarOpen ? 'opacity-0' : 'opacity-100'}`}>
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
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline">
                        {filter === "all" ? "All Questions" :
                          filter === "flagged" ? "Flagged Questions" :
                          filter === "answered" ? "Answered Questions" :
                          filter === "unanswered" ? "Unanswered Questions" :
                          `${filter.charAt(0).toUpperCase() + filter.slice(1)} Difficulty`}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onSelect={() => setFilter("all")}>All Questions</DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => setFilter("flagged")}>Flagged Questions</DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => setFilter("answered")}>Answered Questions</DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => setFilter("unanswered")}>Unanswered Questions</DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => setFilter("easy")}>Easy Difficulty</DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => setFilter("medium")}>Medium Difficulty</DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => setFilter("hard")}>Hard Difficulty</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
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
                  </SheetContent>
                </Sheet>
              </div>
            </header>
            <main className="flex-1 overflow-y-auto p-6">
              {isQuestionBankView ? (
                <div className="space-y-8">
                  <section>
                    <h2 className="text-2xl font-semibold mb-4">Question Bank</h2>
                    {currentQuestion ? (
                      <Card className="p-6">
                        <div className="mb-6">
                          <h3 className="text-xl font-semibold mb-2">Question {currentQuestionIndex + 1}</h3>
                          <p className="text-lg mb-4">{currentQuestion.question}</p>
                          <div className="space-y-4">
                            {currentQuestion.choices.map((choice, index) => (
                              <Button
                                key={index}
                                className={cn(
                                  "h-auto w-full justify-start p-4 text-left",
                                  selectedAnswer === index && "ring-2 ring-primary"
                                )}
                                variant={
                                  selectedAnswer !== null
                                    ? index === currentQuestion.correctAnswer
                                      ? "default"
                                      : selectedAnswer === index
                                      ? "destructive"
                                      : "outline"
                                    : "outline"
                                }
                                onClick={() => handleAnswerSelect(index)}
                                disabled={selectedAnswer !== null}
                              >
                                <span className="mr-2">{String.fromCharCode(65 + index)}.</span> {choice}
                              </Button>
                            ))}
                          </div>
                        </div>
                        {selectedAnswer !== null && (
                          <div
                            className={cn(
                              "mt-6 rounded-lg p-4",
                              selectedAnswer === currentQuestion.correctAnswer
                                ? "bg-green-100 dark:bg-green-900"
                                : "bg-red-100 dark:bg-red-900"
                            )}
                          >
                            <h4 className="mb-2 font-semibold">
                              {selectedAnswer === currentQuestion.correctAnswer ? "Correct!" : "Incorrect"}
                            </h4>
                            <p>{currentQuestion.explanation}</p>
                          </div>
                        )}
                        <div className="mt-6 flex items-center justify-between">
                          <Button onClick={handlePreviousQuestion} disabled={currentQuestionIndex === 0}>
                            <ChevronLeft className="mr-2 h-4 w-4" /> Previous
                          </Button>
                          <Button variant="outline" onClick={toggleFlag}>
                            <Flag className="mr-2 h-4 w-4" />
                            {flaggedQuestions.includes(currentQuestion.id) ? "Flagged" : "Flag"}
                          </Button>
                          <Button
                            onClick={handleNextQuestion}
                            disabled={
                              currentQuestionIndex === filteredQuestions.length - 1 || selectedAnswer === null
                            }
                          >
                            Next <ChevronRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
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
                    <h2 className="text-2xl font-semibold mb-4">Question Banks</h2>
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
                  </section>
                </div>
              )}
            </main>
          </div>
        </div>
        {/* Add Statistics Sidebar */}
        <div 
          className={`fixed inset-y-0 right-0 z-50 w-80 bg-background border-l transform transition-transform duration-300 ease-in-out ${
            isStatsSidebarOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="h-full flex flex-col">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Your Progress</h2>
                <Button variant="ghost" size="icon" onClick={() => setIsStatsSidebarOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              <div className="p-4 space-y-4">
                <StatItem 
                  icon={<Zap className="h-4 w-4" />} 
                  value={questionsStats.generated} 
                  label="Questions Generated" 
                />
                <StatItem 
                  icon={<BookOpen className="h-4 w-4" />} 
                  value={questionsStats.answered} 
                  label="Questions Completed" 
                />
                <StatItem 
                  icon={<BarChart className="h-4 w-4" />} 
                  value={questionsStats.correct} 
                  label="Correct Answers" 
                />
                <StatItem 
                  icon={<Flag className="h-4 w-4" />} 
                  value={questionsStats.incorrect} 
                  label="Areas for Growth" 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Modify the existing sidebar content to add Statistics button */}
        <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-background border-r transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="p-4">
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
              onClick={() => setIsStatsSidebarOpen(true)}
            >
              <BarChart className="mr-2 h-4 w-4" />
              Statistics
            </Button>

            <Button className="w-full mt-4" variant="outline">
              Shared
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
      </div>
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
          <DialogFooter>
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
            <DialogTitle>Upgrade Your Account</DialogTitle>
            <DialogDescription>
              You've reached the maximum number of questions for your current plan. Upgrade now for unlimited access!
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center p-4">
            <AlertTriangle className="h-12 w-12 text-yellow-500" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUpgradeModalOpen(false)}>Cancel</Button>
            <Button onClick={handleUpgrade}>Upgrade Now</Button>
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
    </TooltipProvider>
  )
}

export default SmartifyStudentPortal