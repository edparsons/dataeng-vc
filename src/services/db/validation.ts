
import { z } from 'zod'

export const createOrganizationSchema = z.object({
  domain: z.string(),
})

export const savePublicKeySchema = z.object({
  orgId: z.string(),
  publicKey: z.string(),
})

export const setPrivacyTypeSchema = z.object({
  orgId: z.string(),
  privacyType: z.string(),
})

export const toolTypes = [
  { value: "LP Tools (For LPs)", label: "LP Tools (For LPs)" },
  { value: "Traditional Data", label: "Traditional Data" },
  { value: "Portfolio Management", label: "Portfolio Management" },
  { value: "Research", label: "Research" },
  { value: "Scouting Sources", label: "Scouting Sources" },
  { value: "News Resources", label: "News Resources" },
  { value: "Network/CRM (People)", label: "Network/CRM (People)" },
  { value: "Liquidity Instruments", label: "Liquidity Instruments" },
  { value: "Workflow", label: "Workflow" },
  { value: "Matchmaking Tools", label: "Matchmaking Tools" },
  { value: "Infrastructure", label: "Infrastructure" },
  { value: "Alternative Data", label: "Alternative Data" },
  { value: "Dealflow/CRM (Startups)", label: "Dealflow/CRM (Startups)" },
  { value: "LP Tools (For GPs)", label: "LP Tools (For GPs)" },
]

export const upsertToolSchema = z.object({
  name: z.string(),
  website: z.string(),
  description: z.string(),
  type: z.string(),
  published_pricing: z.string(),
  api: z.boolean(),
})

export const submitReviewSchema = z.object({
  payload: z.string(),
  signature: z.string(),
})

export const contractTypes = [
  {
    value: "per month per user",
    label: "Per Month Per User",
  },
  {
    value: "per month",
    label: "Per Month",
  },
  {
    value: "annual per user",
    label: "Annual Per User",
  },
  {
    value: "annual",
    label: "Annual",
  },
]

export const submitReviewPayloadSchema = z.object({
  terms: z.string(),
  price: z.coerce.number(),
  duration: z.coerce.number(),
  start_date: z.coerce.date(),
  type: z.enum(contractTypes.map(x => x.value) as [string, ...string[]]),
  tool_id: z.string(),
  organization_hash: z.string(),
})
