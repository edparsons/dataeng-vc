import { Database } from '@/src/types_db';
import { z } from 'zod';

export const FirmSchema = z.object({
  firmName: z.string().describe(JSON.stringify({ label: "Firm Name", description: "Name of your firm" })).optional(),
  yourName: z.string().describe(JSON.stringify({ label: "Your Name", description: "Your name" })).optional(),
  yourEmail: z.string().email().describe(JSON.stringify({ label: "Your Email", description: "Your email" })).optional(),
  aum: z.enum(['< $100M', '$100M - $500M', '$500M - 1B', '> $1B']).describe(JSON.stringify({ label: "AUM", description: "What is the AUM of your firm?" })),
  firmSize: z.enum(['<= 10', '11-20', '21-50', '50+']).describe(JSON.stringify({ label: "Firm Size", description: "What is the size of your firm?" })),
  strikeZone: z.array(z.enum(['Pre-seed', 'Seed', 'Series A', 'Series B', 'Series C', 'Series D+'])).describe(JSON.stringify({ label: "Strike Zone", description: "What stages does your firm invest in?" })),
  investmentGeos: z.array(z.enum(['NA', 'Europe', 'LatAm', 'MEA', 'APAC'])).describe(JSON.stringify({ label: "Investment Geos", description: "In which geographies does your firm invest?" })),
  technologyTeamSize: z.object({
    productProfessionals: z.number().min(0).max(15).describe(JSON.stringify({ label: "Product Professionals", description: "Number of product professionals #FTE in your firm" })),
    dataProfessionals: z.number().min(0).max(15).describe(JSON.stringify({ label: "Data Professionals", description: "Number of data professionals #FTE in your firm" })),
    engineeringProfessionals: z.number().min(0).max(15).describe(JSON.stringify({ label: "Engineering Professionals", description: "Number of engineering professionals #FTE  in your firm" }))
  }).describe(JSON.stringify({ label: "Technology Team Size", description: "Size of the technology team in your firm" })),
  dataUsage: z.object({
    sourcing: z.enum(['We don’t use data for sourcing', 'Data used for context and / or to aid investor evaluation', 'Data used programmatically']).describe(JSON.stringify({ label: "Sourcing", description: "How does your firm use data for sourcing?" })),
    picking: z.enum(['We don’t use data for picking', 'Data used for context and / or to aid investor evaluation', 'Data used programmatically']).describe(JSON.stringify({ label: "Picking", description: "How does your firm use data for picking investments?" })),
    winning: z.enum(['We don’t use data for winning', 'Data used for context and / or to aid investor evaluation', 'Data used programmatically']).describe(JSON.stringify({ label: "Winning", description: "How does your firm use data for winning deals?" })),
    supportingPortcos: z.enum(['We don’t use data for supporting Portcos', 'Data used for context and / or to aid investor evaluation', 'Data used programmatically']).describe(JSON.stringify({ label: "Supporting Portcos", description: "How does your firm use data for supporting portfolio companies?" })),
    lpRelations: z.enum(['We don’t use data for LP Relations', 'Data used for context and / or to aid investor evaluation', 'Data used programmatically']).describe(JSON.stringify({ label: "LP Relations", description: "How does your firm use data for LP relations?" })),
    other: z.string().describe(JSON.stringify({ label: "Data Usage - Other", description: "Other uses of data in your firm" })).optional()
  }).describe(JSON.stringify({ label: "Data Usage", description: "How does your firm use data?" })),
  programmaticInvestment: z.enum(['yes', 'no']).describe(JSON.stringify({ label: "Programmatic Investment", description: "Has the firm made a programmatically sourced investment?" })),
  programmaticDealFlowPercentage: z.number().min(0).max(100).describe(JSON.stringify({ label: "Programmatic Deal Flow Percentage", description: "What percentage of your deal flow is programmatically sourced?" }))
});
export const getToolsAndVendorsSchema = (tools: Database['public']['Tables']['tools']['Row'][]) => z.object({
  toolVendor: z.string().describe(JSON.stringify({ label: "Tool Vendor", description: "Name of the tool or vendor", suggestions: tools.map(tool => tool.name) })),
  primaryDomain: z.enum(['Traditional Data', 'Alternative Data', 'Research', 'Deal CRM', 'Talent / Network CRM', 'Matchmaking Tools', 'Portfolio Management', 'News Resources', 'Scouting Sources']).describe(JSON.stringify({ label: "Primary Domain", description: "Primary domain of the tool or vendor" })),
  secondaryDomains: z.array(z.enum(['Traditional Data', 'Alternative Data', 'Research', 'Deal CRM', 'Talent / Network CRM', 'Matchmaking Tools', 'Portfolio Management', 'News Resources', 'Scouting Sources'])).describe(JSON.stringify({ label: "Secondary Domains", description: "Secondary domains of the tool or vendor, if any" })).optional(),
  nps: z.number().min(1).max(10).describe(JSON.stringify({ label: "NPS", description: "Net Promoter Score (NPS) of the tool or vendor" })),
  primaryUseCase: z.enum(['Sourcing', 'Picking', 'Winning', 'Portfolio Support', 'LP Relations']).describe(JSON.stringify({ label: "Primary Use Case", description: "Primary use case of the tool or vendor" })),
  accessPatterns: z.array(z.enum(['Console', 'API', 'Cloud delivery'])).describe(JSON.stringify({ label: "Access Patterns", description: "Access patterns for the tool or vendor" })),
  pricingStructure: z.object({
    platformFee: z.number().min(0).max(100).describe(JSON.stringify({ label: "Platform Fee", description: "Platform fee for the tool or vendor" })).optional(),
    seats: z.number().min(0).max(100).describe(JSON.stringify({ label: "Seats", description: "Number of seats/licenses for the tool or vendor" })).optional(),
    consumption: z.number().min(0).max(100).describe(JSON.stringify({ label: "Consumption", description: "Consumption-based pricing for the tool or vendor" })).optional(),
    totalSpend: z.number().describe(JSON.stringify({ label: "Total Spend", description: "Total spend on the tool or vendor" })).optional()
  }).describe(JSON.stringify({ label: "Pricing Structure", description: "Pricing structure for the tool or vendor" })),
  statusWithVendor: z.enum(['Churned', 'Evaluated but did not purchase', 'Current Customer']).describe(JSON.stringify({ label: "Status With Vendor", description: "Current status with the vendor" })).optional(),
  comments: z.string().describe(JSON.stringify({ label: "Comments", description: "Additional comments about the tool or vendor" })).optional(),
});
