import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ExtractedFinancialData {
  monthlyIncome?: number;
  creditScore?: number;
  employmentStatus?: string;
  employmentLength?: number;
  bankAccountBalance?: number;
  monthlyExpenses?: number;
  gigIncome?: number;
  businessRevenue?: number;
  platforms?: string[];
  paymentHistory?: {
    rentOnTimeRate?: number;
    utilityOnTimeRate?: number;
  };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { file, fileName, documentType } = await req.json();
    
    console.log(`Processing document: ${fileName}, type: ${documentType}`);

    // Remove base64 prefix if present
    const base64Data = file.replace(/^data:[^;]+;base64,/, '');
    
    // Convert base64 to binary
    const binaryData = Deno.core.encode(atob(base64Data));

    // Use OpenAI to analyze the document
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Prepare the analysis prompt based on document type
    const analysisPrompt = getAnalysisPrompt(documentType);

    // Call OpenAI API to extract text and analyze
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a financial document analyzer. Extract structured data from documents and return it as JSON.'
          },
          {
            role: 'user',
            content: analysisPrompt
          }
        ],
        response_format: { type: "json_object" }
      }),
    });

    if (!openAIResponse.ok) {
      const error = await openAIResponse.text();
      console.error('OpenAI API error:', error);
      throw new Error('Failed to analyze document with AI');
    }

    const aiResult = await openAIResponse.json();
    const extractedText = aiResult.choices[0].message.content;
    
    console.log('AI extracted data:', extractedText);

    // Parse the extracted JSON
    const extractedData: ExtractedFinancialData = JSON.parse(extractedText);

    return new Response(
      JSON.stringify({ 
        success: true, 
        extractedData,
        message: 'Document processed successfully'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error processing document:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});

function getAnalysisPrompt(documentType: string): string {
  const prompts: Record<string, string> = {
    'financial_info': `
      Analyze this financial document (bank statement, pay stub, or tax return) and extract:
      - Monthly income (gross amount)
      - Current bank balance
      - Monthly expenses (if available)
      - Employment status (employed, self-employed, etc.)
      - Employment length in months (if available)
      
      Return as JSON with keys: monthlyIncome, bankAccountBalance, monthlyExpenses, employmentStatus, employmentLength
      If a field is not found, omit it from the response.
    `,
    'credit_banking': `
      Analyze this credit report or banking document and extract:
      - Credit score (FICO score if available)
      - Bank account balance
      - Any credit-related information
      
      Return as JSON with keys: creditScore, bankAccountBalance
      If a field is not found, omit it from the response.
    `,
    'gig_income': `
      Analyze this gig work earnings report or platform statement and extract:
      - Monthly income from gig work
      - Platform name(s) (e.g., Uber, DoorDash, Upwork)
      - Average rating or performance metrics
      - Years or months active on platform
      
      Return as JSON with keys: gigIncome, platforms (array), averageRating, yearsActive
      If a field is not found, omit it from the response.
    `,
    'business_revenue': `
      Analyze this business financial document (P&L, invoice, revenue report) and extract:
      - Monthly business revenue
      - Business type or industry
      - Years in business (if available)
      
      Return as JSON with keys: businessRevenue, businessType, yearsInBusiness
      If a field is not found, omit it from the response.
    `,
    'payment_history': `
      Analyze this payment history document (rent receipt, utility bill) and extract:
      - Monthly rent or utility amount
      - Payment on-time rate (percentage)
      - Years at current address (if rent document)
      
      Return as JSON with keys: monthlyAmount, onTimeRate, yearsAtAddress
      If a field is not found, omit it from the response.
    `
  };

  return prompts[documentType] || prompts['financial_info'];
}
