import { motion } from 'framer-motion';
import { FileText, Briefcase, SlidersHorizontal, PlusCircle } from 'lucide-react';

// --- Reusable Components ---
const Section = ({ title, icon: Icon, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.1 }}
    className="bg-[var(--color-surface)]/30 border border-gray-800"
  >
    <div className="flex items-center gap-3 p-3 border-b border-gray-800 bg-black/30">
      <Icon size={16} className="text-[var(--color-yellow)]" />
      <h3 className="text-sm font-bold text-white tracking-widest">{title}</h3>
    </div>
    <div className="p-4 space-y-4">{children}</div>
  </motion.div>
);

const FeatureCard = ({ title, description, control }) => (
  <div className="p-3 bg-black/40 border border-gray-700/80 rounded-lg flex items-center justify-between hover:border-[var(--color-blue)] transition-colors">
    <div>
      <h4 className="font-bold text-gray-200">{title}</h4>
      <p className="text-xs text-gray-500 font-mono mt-1">{description}</p>
    </div>
    <div className="flex-shrink-0 ml-4">{control}</div>
  </div>
);

export default function ProTools() {
  return (
    <motion.div
      key="pro-tools"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-8"
    >
      <h2 className="text-2xl font-black text-[var(--color-yellow)] tracking-tighter">
        PROFESSIONAL & POWER USER TOOLS
      </h2>

      {/* --- Tax & Accounting --- */}
      <Section title="TAX & ACCOUNTING" icon={FileText}>
        <FeatureCard
          title="Tax Tagging"
          description="Mark transactions as Business, Medical, or Charity for easy export."
          control={
            <button className="text-xs bg-[var(--color-blue)] hover:bg-[var(--color-blue)]/80 text-white font-bold py-2 px-3 rounded-md">
              MANAGE TAGS
            </button>
          }
        />
        <FeatureCard
          title="Mileage Tracker"
          description="GPS-based logging for business trips with rate calculations."
          control={
            <button className="text-xs bg-transparent border border-gray-600 hover:border-[var(--color-blue)] text-gray-300 font-bold py-2 px-3 rounded-md">
              VIEW LOGS
            </button>
          }
        />
        <FeatureCard
          title="1099/BAS Preparation"
          description="Auto-generate quarterly summaries for freelancer tax forms."
          control={
            <button className="text-xs bg-[var(--color-yellow)] hover:bg-[var(--color-yellow)]/80 text-black font-bold py-2 px-3 rounded-md">
              GENERATE
            </button>
          }
        />
        <FeatureCard
          title="Advanced CSV/Excel Export"
          description="Full data dump with custom date ranges and field selection."
          control={
            <div className="flex items-center gap-2">
              <input
                type="date"
                className="bg-black border border-gray-600 text-xs p-1.5 rounded-md text-gray-400"
              />
              <span className="text-gray-600">-</span>
              <input
                type="date"
                className="bg-black border border-gray-600 text-xs p-1.5 rounded-md text-gray-400"
              />
              <button className="text-xs bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-3 rounded-md ml-2">
                EXPORT
              </button>
            </div>
          }
        />
        <FeatureCard
          title="QuickBooks/Xero Sync"
          description="Two-way integration with professional accounting software."
          control={
            <div className="flex gap-2">
              <button className="text-xs bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-3 rounded-md">
                CONNECT XERO
              </button>
              <button className="text-xs bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-3 rounded-md">
                CONNECT QUICKBOOKS
              </button>
            </div>
          }
        />
      </Section>

      {/* --- Business & Freelancer Tools --- */}
      <Section title="BUSINESS & FREELANCER TOOLS" icon={Briefcase}>
        <FeatureCard
          title="Client/Project Tagging"
          description="Track income/expenses per client for profitability analysis."
          control={
            <button className="text-xs bg-transparent border border-gray-600 hover:border-[var(--color-blue)] text-gray-300 font-bold py-2 px-3 rounded-md">
              VIEW DASHBOARD
            </button>
          }
        />
        <FeatureCard
          title="Invoice Tracking"
          description="Mark expected income, get alerts, and track overdue invoices."
          control={
            <button className="text-xs bg-transparent border border-gray-600 hover:border-[var(--color-blue)] text-gray-300 font-bold py-2 px-3 rounded-md">
              MANAGE INVOICES
            </button>
          }
        />
        <FeatureCard
          title="Estimated Tax Calculator"
          description="Quarterly tax projections based on income with payment reminders."
          control={
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Income €$"
                className="bg-black border border-gray-600 text-xs p-1.5 rounded-md w-28 text-gray-400"
              />
              <button className="text-xs bg-[var(--color-blue)] hover:bg-[var(--color-blue)]/80 text-white font-bold py-2 px-3 rounded-md">
                CALCULATE
              </button>
            </div>
          }
        />
        <FeatureCard
          title="Profit & Loss Statements"
          description="Auto-generated P&L reports with Year-over-Year comparisons."
          control={
            <button className="text-xs bg-transparent border border-gray-600 hover:border-[var(--color-blue)] text-gray-300 font-bold py-2 px-3 rounded-md">
              VIEW REPORTS
            </button>
          }
        />
      </Section>

      {/* --- Advanced Customization --- */}
      <Section title="ADVANCED CUSTOMIZATION" icon={SlidersHorizontal}>
        <FeatureCard
          title="Custom Categories & Subcategories"
          description="Unlimited nesting (e.g., Food → Restaurants → Italian)."
          control={
            <button className="text-xs bg-transparent border border-gray-600 hover:border-[var(--color-blue)] text-gray-300 font-bold py-2 px-3 rounded-md flex items-center gap-2">
              <PlusCircle size={14} /> CREATE CATEGORY
            </button>
          }
        />
        <FeatureCard
          title="Custom Tags"
          description="Add unlimited tags per transaction (e.g., Reimbursable)."
          control={
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="New Tag..."
                className="bg-black border border-gray-600 text-xs p-1.5 rounded-md w-32 text-gray-400"
              />
              <button className="text-xs bg-[var(--color-blue)] hover:bg-[var(--color-blue)]/80 text-white font-bold py-2 px-3 rounded-md">
                ADD TAG
              </button>
            </div>
          }
        />
        <FeatureCard
          title="Advanced Filtering"
          description="Boolean logic queries ('Food > $50 AND Travel')."
          control={
            <button className="text-xs bg-transparent border border-gray-600 hover:border-[var(--color-blue)] text-gray-300 font-bold py-2 px-3 rounded-md">
              OPEN FILTER BUILDER
            </button>
          }
        />
        <FeatureCard
          title="Saved Views / Presets"
          description="Save complex filter combinations for quick access."
          control={
            <select className="bg-black border border-gray-700 text-xs p-2 text-white outline-none focus:border-[var(--color-blue)] w-48">
              <option>Monthly Tax Review</option>
              <option>Q3 Client Expenses</option>
              <option>Reimbursable Travel</option>
            </select>
          }
        />
      </Section>
    </motion.div>
  );
}
