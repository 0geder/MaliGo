export type GlossaryCategory =
  | "Savings"
  | "Budgeting"
  | "Banking"
  | "Debt"
  | "Investing"
  | "General"

export type GlossaryTerm = {
  id: string
  term: string
  category: GlossaryCategory
  shortDefinition: string
  fullExplanation: string
  whyItMatters: string
  maliTip: string
}

export const glossaryTerms: GlossaryTerm[] = [
  {
    id: "budget",
    term: "Budget",
    category: "Budgeting",
    shortDefinition: "A plan for how you will use your money.",
    fullExplanation:
      "A budget is a simple plan that shows how much money you earn, how much you spend, and how much you want to save. It helps you control your money instead of wondering where it went.",
    whyItMatters:
      "Without a budget, it is easy to overspend and struggle before the end of the month.",
    maliTip:
      "Start small: list income, transport, groceries, airtime, and savings. Even a basic budget is better than none.",
  },
  {
    id: "savings",
    term: "Savings",
    category: "Savings",
    shortDefinition: "Money you keep aside for future use.",
    fullExplanation:
      "Savings is money you do not spend now so that you can use it later for emergencies, school needs, business goals, or important purchases.",
    whyItMatters:
      "Savings gives you security and reduces stress when unexpected costs happen.",
    maliTip:
      "Saving R5 or R10 regularly builds the habit. Consistency matters more than starting big.",
  },
  {
    id: "interest",
    term: "Interest",
    category: "Banking",
    shortDefinition: "Extra money earned or paid over time.",
    fullExplanation:
      "Interest is the extra amount added to money. If you save in the right account, you may earn interest. If you borrow money, you usually pay interest.",
    whyItMatters:
      "Understanding interest helps you grow savings wisely and avoid expensive debt.",
    maliTip:
      "Good interest can grow your savings. Bad interest on debt can make what you owe much bigger.",
  },
  {
    id: "debt",
    term: "Debt",
    category: "Debt",
    shortDefinition: "Money you owe to someone else.",
    fullExplanation:
      "Debt happens when you borrow money and must pay it back later, often with interest. Examples include loans, credit cards, store accounts, or money borrowed from others.",
    whyItMatters:
      "Debt can help in some situations, but too much debt can trap you financially.",
    maliTip:
      "Before borrowing, ask: Do I really need this, and can I afford the repayments?",
  },
  {
    id: "emergency-fund",
    term: "Emergency Fund",
    category: "Savings",
    shortDefinition: "Money saved for unexpected problems.",
    fullExplanation:
      "An emergency fund is money set aside for urgent situations like medical costs, transport issues, job loss, or family emergencies.",
    whyItMatters:
      "It helps you avoid borrowing money every time a problem appears.",
    maliTip:
      "Build it slowly. Even a small emergency fund is better than having nothing.",
  },
  {
    id: "needs-vs-wants",
    term: "Needs vs Wants",
    category: "Budgeting",
    shortDefinition: "Needs are essential; wants are nice to have.",
    fullExplanation:
      "Needs are things you must pay for, such as rent, transport, food, and electricity. Wants are optional things like entertainment, takeaways, and extra shopping.",
    whyItMatters:
      "Knowing the difference helps you make better spending decisions.",
    maliTip:
      "When money is tight, cover needs first. Then decide what wants you can still afford.",
  },
  {
    id: "credit-score",
    term: "Credit Score",
    category: "Debt",
    shortDefinition: "A number that reflects how you handle borrowed money.",
    fullExplanation:
      "A credit score helps lenders judge whether you are likely to repay debt on time. It is influenced by your payment history and how much debt you already have.",
    whyItMatters:
      "A better credit score can improve your chances of getting approved for credit.",
    maliTip:
      "Paying on time and not overusing debt usually helps your credit profile.",
  },
  {
    id: "atm",
    term: "ATM",
    category: "Banking",
    shortDefinition: "A machine used for banking transactions.",
    fullExplanation:
      "An ATM lets you withdraw cash, check balances, and sometimes deposit money without going into a bank branch.",
    whyItMatters:
      "It gives convenient access to your money, but fees may apply depending on the bank and ATM used.",
    maliTip:
      "Watch out for bank charges. Small fees can add up over time.",
  },
  {
    id: "investment",
    term: "Investment",
    category: "Investing",
    shortDefinition: "Using money today with the goal of growing it over time.",
    fullExplanation:
      "An investment is when you put money into something with the hope that it increases in value in the future. Examples include shares, unit trusts, or businesses.",
    whyItMatters:
      "Investing can help build long-term wealth, but it also involves risk.",
    maliTip:
      "Saving is usually step one. Investing often comes after you’ve built some financial stability.",
  },
  {
    id: "income",
    term: "Income",
    category: "General",
    shortDefinition: "Money you receive.",
    fullExplanation:
      "Income is money that comes in, such as salary, wages, business profits, side hustles, or gifts.",
    whyItMatters:
      "You need to understand your income before you can budget, save, or invest properly.",
    maliTip:
      "Track all your income sources, even small ones. Small side income can make a big difference over time.",
  },
  {
    id: "expense",
    term: "Expense",
    category: "General",
    shortDefinition: "Money you spend.",
    fullExplanation:
      "An expense is any cost you pay for, such as groceries, transport, rent, airtime, or entertainment.",
    whyItMatters:
      "If you don’t know your expenses, it becomes difficult to manage your money.",
    maliTip:
      "Tracking expenses is one of the fastest ways to improve financial awareness.",
  },
  {
    id: "loan",
    term: "Loan",
    category: "Debt",
    shortDefinition: "Money borrowed that must be repaid later.",
    fullExplanation:
      "A loan is money received from a bank, lender, or person with an agreement to pay it back, usually with interest, over time.",
    whyItMatters:
      "Loans can help when used carefully, but they can also create long-term pressure if repayments are too high.",
    maliTip:
      "Never focus only on the amount borrowed. Always look at the total repayment cost.",
  },
]