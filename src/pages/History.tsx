import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/components/ui/use-toast"
import { ChevronDown, ChevronUp } from "lucide-react"
import type { Client } from "@/components/ClientForm"

interface DayHistory {
  date: string;
  clients: Client[];
  totalRevenue: number;
}

export default function History() {
  const [weekHistory, setWeekHistory] = useState<DayHistory[]>([])
  const [expandedDays, setExpandedDays] = useState<string[]>([])
  const { toast } = useToast()

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem("history") || "[]") as Client[]
    
    // Group clients by day
    const groupedByDay = savedHistory.reduce((acc: { [key: string]: Client[] }, client) => {
      const date = new Date(client.timestamp).toLocaleDateString()
      if (!acc[date]) {
        acc[date] = []
      }
      acc[date].push(client)
      return acc
    }, {})

    // Convert to array and calculate totals
    const historyArray = Object.entries(groupedByDay).map(([date, clients]) => ({
      date,
      clients,
      totalRevenue: clients.reduce((sum, client) => sum + client.cost, 0)
    }))

    // Sort by date (most recent first)
    historyArray.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )

    setWeekHistory(historyArray)
  }, [])

  const clearHistory = () => {
    localStorage.setItem("history", "[]")
    setWeekHistory([])
    setExpandedDays([])
    toast({
      title: "Success",
      description: "History cleared successfully"
    })
  }

  const toggleDayDetails = (date: string) => {
    setExpandedDays(prev => 
      prev.includes(date)
        ? prev.filter(d => d !== date)
        : [...prev, date]
    )
  }

  const totalRevenue = weekHistory.reduce((sum, day) => sum + day.totalRevenue, 0)

  return (
    <div className="container max-w-4xl mx-auto p-4">
      <Card className="p-4 md:p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h2 className="text-xl font-semibold">Weekly History</h2>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4 w-full md:w-auto">
            <span className="text-sm whitespace-nowrap">
              Total Revenue: <span className="font-bold text-primary">{totalRevenue} DH</span>
            </span>
            <Button variant="destructive" size="sm" onClick={clearHistory} className="w-full md:w-auto">
              Clear History
            </Button>
          </div>
        </div>

        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-4">
            {weekHistory.map((day) => (
              <Card key={day.date} className="p-3 md:p-4">
                <div 
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => toggleDayDetails(day.date)}
                >
                  <div>
                    <h3 className="font-medium">{day.date}</h3>
                    <p className="text-sm text-muted-foreground">
                      Clients: {day.clients.length} | Revenue: {day.totalRevenue} DH
                    </p>
                  </div>
                  <Button variant="ghost" size="icon" className="shrink-0">
                    {expandedDays.includes(day.date) ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                {expandedDays.includes(day.date) && (
                  <div className="mt-4 space-y-3 animate-accordion-down">
                    {day.clients.map((client) => (
                      <Card key={client.id} className="p-3">
                        <div className="flex flex-col md:flex-row justify-between md:items-center gap-2">
                          <div>
                            <p className="font-medium">{client.name}</p>
                            <p className="text-sm text-muted-foreground">
                              Post {client.postNumber} - {client.session === "30min" ? "30 Minutes" : client.session === "1hour" ? "1 Hour" : `${client.fifaMatches} FIFA Matches`} - {client.cost} DH
                              {client.isPromo && " (Promo)"}
                            </p>
                          </div>
                          <p className="text-sm text-muted-foreground shrink-0">
                            {new Date(client.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </Card>
            ))}
          </div>
        </ScrollArea>
      </Card>
    </div>
  )
}