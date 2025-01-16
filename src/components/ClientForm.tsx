import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"

export type Client = {
  id: string
  name: string
  session: string
  cost: number
  isPromo: boolean
  timestamp: number
}

type Props = {
  onAddClient: (client: Client) => void
}

export function ClientForm({ onAddClient }: Props) {
  const [name, setName] = useState("")
  const [session, setSession] = useState("")
  const [isPromo, setIsPromo] = useState(false)
  const { toast } = useToast()

  const calculateCost = (session: string, isPromo: boolean) => {
    switch (session) {
      case "30min":
        return isPromo ? 10 : 15
      case "1hour":
        return isPromo ? 20 : 25
      default:
        return 0
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name || !session) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all fields"
      })
      return
    }

    const newClient: Client = {
      id: crypto.randomUUID(),
      name,
      session,
      cost: calculateCost(session, isPromo),
      isPromo,
      timestamp: Date.now()
    }

    onAddClient(newClient)
    setName("")
    setSession("")
    setIsPromo(false)
    
    toast({
      title: "Success",
      description: "Client added successfully"
    })
  }

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Client Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter client name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="session">Session Time</Label>
          <Select value={session} onValueChange={setSession}>
            <SelectTrigger>
              <SelectValue placeholder="Select session time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30min">30 Minutes - 15 DH</SelectItem>
              <SelectItem value="1hour">1 Hour - 25 DH</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="promo"
            checked={isPromo}
            onCheckedChange={(checked) => setIsPromo(checked as boolean)}
          />
          <Label htmlFor="promo">New Client (Promo)</Label>
        </div>

        <Button type="submit" className="w-full">
          Add Client
        </Button>
      </form>
    </Card>
  )
}