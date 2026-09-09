/**
 * Single source of truth for the downloadable resume PDFs.
 *
 * Every surface that offers a resume (hero dropdowns, footer, career timeline,
 * command palette, interactive terminal, terminal-theme hero and Sparky) reads
 * from this list, so adding or retiring a variant is a one-line change here.
 *
 * Files live in public/resume/.
 */

export interface ResumeVariant {
  /** stable id, used for React keys and command-palette ids */
  id: string
  /** menu label */
  label: string
  /** one-line hint shown under the label */
  description: string
  /** page count badge */
  pages: 1 | 2
  /** filename inside public/resume/ */
  file: string
  /** the default / most general resume */
  primary?: boolean
}

export const RESUMES: ResumeVariant[] = [
  {
    id: 'master',
    label: 'Master Resume',
    description: 'Full profile across AI, ML, data and full-stack',
    pages: 2,
    file: 'Phaneendra_Gavara_Master_Resume.pdf',
    primary: true,
  },
  {
    id: 'ai-ml',
    label: 'AI / ML Engineer',
    description: 'Agentic AI, RAG/LLM evaluation, applied ML',
    pages: 2,
    file: 'Phaneendra_Gavara_AI_ML_Engineer_Resume.pdf',
  },
  {
    id: 'ai-llm',
    label: 'AI / LLM Engineer',
    description: 'Production agentic systems, RAG pipelines, evals',
    pages: 2,
    file: 'Phaneendra_Gavara_AI_LLM_Engineer_Resume.pdf',
  },
  {
    id: 'data-scientist',
    label: 'Data Scientist',
    description: 'Statistical modeling, forecasting, applied ML',
    pages: 2,
    file: 'Phaneendra_Gavara_Data_Scientist_Resume.pdf',
  },
  {
    id: 'ai-llm-1p',
    label: 'AI / LLM Engineer',
    description: 'Condensed one-page version',
    pages: 1,
    file: 'Phaneendra_Gavara_AI_LLM_Engineer_1Page_Resume.pdf',
  },
  {
    id: 'general-1p',
    label: 'General',
    description: 'One-page all-rounder: ML, full-stack and cloud',
    pages: 1,
    file: 'Phaneendra_Gavara_General_1Page_Resume.pdf',
  },
]

/** public URL for a resume variant */
export const resumeUrl = (r: ResumeVariant) => `/resume/${r.file}`

/** the primary (default) resume, used where only one link fits */
export const PRIMARY_RESUME = RESUMES.find(r => r.primary) ?? RESUMES[0]
