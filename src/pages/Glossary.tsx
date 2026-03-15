import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import TopNav from "@/components/TopNav"

import { glossaryTerms, type GlossaryCategory } from "@/data/glossaryTerms"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

const categories: Array<GlossaryCategory | "All"> = [
  "All",
  "Savings",
  "Budgeting",
  "Banking",
  "Debt",
  "Investing",
  "General",
]

function getCategoryBadgeClass(category: GlossaryCategory) {
  switch (category) {
    case "Savings":
      return "bg-maligo-green text-white"
    case "Budgeting":
      return "bg-maligo-orange text-white"
    case "Banking":
      return "bg-blue-600 text-white"
    case "Debt":
      return "bg-red-500 text-white"
    case "Investing":
      return "bg-purple-600 text-white"
    default:
      return "bg-gray-600 text-white"
  }
}

export default function Glossary() {
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<GlossaryCategory | "All">("All")
  const [selectedTermId, setSelectedTermId] = useState<string | null>(glossaryTerms[0]?.id ?? null)

  const filteredTerms = useMemo(() => {
    const query = search.trim().toLowerCase()

    return glossaryTerms.filter((item) => {
      const matchesCategory = selectedCategory === "All" || item.category === selectedCategory
      const matchesSearch =
        !query ||
        item.term.toLowerCase().includes(query) ||
        item.shortDefinition.toLowerCase().includes(query) ||
        item.fullExplanation.toLowerCase().includes(query)

      return matchesCategory && matchesSearch
    })
  }, [search, selectedCategory])

  const selectedTerm =
    filteredTerms.find((item) => item.id === selectedTermId) ??
    filteredTerms[0] ??
    null

  return (
    <div className="min-h-screen bg-gradient-to-br from-maligo-cream via-white to-maligo-green-light/10">
      <TopNav />

      <div className="mx-auto max-w-7xl px-4 py-6">
        {/* Header */}
        <div className="mb-6 overflow-hidden rounded-2xl border border-maligo-green/20 bg-white/80 shadow-sm backdrop-blur">
          <div className="grid gap-6 p-6 md:grid-cols-2 md:items-center">
            <div>
              <Badge className="mb-3 bg-maligo-green text-white">Financial Literacy</Badge>
              <h1 className="text-3xl font-bold text-maligo-green">Mali Money Dictionary</h1>
              <p className="mt-2 text-sm text-gray-600">
                Learn financial words in simple language. This glossary helps users understand
                savings, budgeting, debt, banking, and investing in a way that feels approachable.
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <Button asChild variant="secondary">
                  <Link to="/dashboard">Back to Dashboard</Link>
                </Button>
                <Button asChild variant="secondary">
                  <Link to="/chat">Talk to Mali</Link>
                </Button>
              </div>
            </div>

            <div className="rounded-2xl bg-maligo-green/10 p-5">
              <div className="text-sm text-gray-600 mb-2">How this helps</div>
              <div className="grid grid-cols-1 gap-3">
                <div className="rounded-xl bg-white p-4 shadow-sm">
                  <div className="font-semibold text-maligo-green">Build confidence</div>
                  <div className="text-xs text-gray-600 mt-1">
                    Users learn common money terms without needing finance experience.
                  </div>
                </div>
                <div className="rounded-xl bg-white p-4 shadow-sm">
                  <div className="font-semibold text-maligo-green">Supports the app journey</div>
                  <div className="text-xs text-gray-600 mt-1">
                    Terms connect naturally to goals, missions, budgeting, and the chatbot.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left panel */}
          <Card className="border-maligo-green/20 bg-white/80 shadow-sm lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-maligo-green">Browse Terms</CardTitle>
              <CardDescription>Search and filter by topic</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Search a term..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    type="button"
                    size="sm"
                    variant={selectedCategory === category ? "default" : "outline"}
                    className={selectedCategory === category ? "bg-maligo-green hover:bg-maligo-green-dark" : ""}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>

              <div className="max-h-[500px] space-y-2 overflow-y-auto pr-1">
                {filteredTerms.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-gray-300 p-4 text-sm text-gray-500">
                    No terms found for that search.
                  </div>
                ) : (
                  filteredTerms.map((item) => {
                    const isSelected = selectedTerm?.id === item.id

                    return (
                      <button
                        key={item.id}
                        onClick={() => setSelectedTermId(item.id)}
                        className={`w-full rounded-xl border p-3 text-left transition ${
                          isSelected
                            ? "border-maligo-green bg-maligo-green/10"
                            : "border-gray-200 bg-white hover:bg-maligo-cream/50"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="font-medium text-gray-900">{item.term}</div>
                            <div className="mt-1 text-xs text-gray-600">{item.shortDefinition}</div>
                          </div>
                          <Badge className={getCategoryBadgeClass(item.category)}>{item.category}</Badge>
                        </div>
                      </button>
                    )
                  })
                )}
              </div>
            </CardContent>
          </Card>

          {/* Right panel */}
          <Card className="border-maligo-green/20 bg-white/80 shadow-sm lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-maligo-green">
                {selectedTerm ? selectedTerm.term : "Select a term"}
              </CardTitle>
              <CardDescription>
                {selectedTerm ? selectedTerm.shortDefinition : "Choose a term to see its explanation"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedTerm ? (
                <>
                  <div className="flex flex-wrap gap-2">
                    <Badge className={getCategoryBadgeClass(selectedTerm.category)}>
                      {selectedTerm.category}
                    </Badge>
                    <Badge variant="outline">Financial Literacy</Badge>
                  </div>

                  <div className="rounded-xl border border-gray-200 bg-white p-4">
                    <h3 className="font-semibold text-maligo-green">What it means</h3>
                    <p className="mt-2 text-sm text-gray-700 leading-6">
                      {selectedTerm.fullExplanation}
                    </p>
                  </div>

                  <div className="rounded-xl border border-gray-200 bg-white p-4">
                    <h3 className="font-semibold text-maligo-green">Why it matters</h3>
                    <p className="mt-2 text-sm text-gray-700 leading-6">
                      {selectedTerm.whyItMatters}
                    </p>
                  </div>

                  <div className="rounded-xl border border-maligo-green/20 bg-maligo-green/5 p-4">
                    <h3 className="font-semibold text-maligo-green">Mali Tip</h3>
                    <p className="mt-2 text-sm text-gray-700 leading-6">
                      {selectedTerm.maliTip}
                    </p>
                  </div>
                </>
              ) : (
                <div className="rounded-xl border border-dashed border-gray-300 p-6 text-sm text-gray-500">
                  Select a term from the left to view the explanation.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="py-8 text-center text-xs text-gray-500">
          MVP note: glossary content is static demo content for now. Later this can be expanded with quizzes,
          localization, voice support, and chatbot recommendations.
        </div>
      </div>
    </div>
  )
}