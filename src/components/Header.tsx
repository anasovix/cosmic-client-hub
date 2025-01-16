import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useNavigate } from "react-router-dom"

export function Header() {
  const navigate = useNavigate()
  
  return (
    <header className="w-full py-6 px-4 flex flex-col items-center gap-6">
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight neon-text animate-glow">
        GAMING NIGHT CLUB
      </h1>
      
      <Tabs defaultValue="dashboard" className="w-full max-w-md" onValueChange={(value) => navigate(`/${value}`)}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
      </Tabs>
    </header>
  )
}