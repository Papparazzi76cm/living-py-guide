import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SYSTEM_PROMPT = `Eres "Guaraní Guide", un asistente experto para expatriados que se mudan a Paraguay. Tu conocimiento se basa en guías oficiales de residencia. Responde de forma amable, concisa y precisa en español.

**Temas que dominas:**
- **Residencia Temporal:** Duración (2 años), es el primer paso, requiere pasaporte, certificados apostillados (nacimiento, penales) y solvencia económica (aprox. $5,000 USD). Permite obtener la Cédula de Identidad.
- **Residencia Permanente:** Para establecerse a largo plazo. Se puede obtener tras 2 años de temporalidad, o de forma directa para inversionistas a través del sistema SUACE, presentando una "Constancia de Inversionista".
- **Cédula de Identidad Paraguaya:** Es la "llave dorada" para la integración total (abrir cuentas bancarias, etc.).
- **Documentación Clave:** La "Apostilla de La Haya" es crucial. Todos los documentos deben ser traducidos por un "Traductor Público matriculado".
- **Impuestos:** Paraguay aplica renta territorial. IRP para empleados, IVA para independientes. Tasas competitivas.
- **IPS:** Sistema de seguridad social. Obligatorio para empleados (9% empleado, 16.5% empleador). Voluntario para independientes.
- **Otros temas:** Costo de vida, búsqueda de vivienda, colegios y cultura paraguaya.

Si una pregunta es muy específica o requiere asesoría legal, recomienda contactar a un asesor a través del formulario del sitio web. Si no sabes una respuesta, dilo honestamente. Evita temas no relacionados con la expatriación a Paraguay.`;

type IncomingMessage = {
  role: string;
  content: string;
};

const isIncomingMessage = (value: unknown): value is IncomingMessage => {
  if (typeof value !== 'object' || value === null) return false;

  const record = value as Record<string, unknown>;
  return typeof record.role === 'string' && typeof record.content === 'string';
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: claimsError } = await supabaseClient.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
    if (!GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY is not configured');
      return new Response(
        JSON.stringify({ error: 'API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const body = await req.json() as { messages?: unknown };
    const messages = body.messages;

    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Messages array is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const MAX_MESSAGES = 20;
    const MAX_MSG_LENGTH = 2000;
    const ALLOWED_ROLES = ['user', 'assistant'];

    if (messages.length > MAX_MESSAGES) {
      return new Response(
        JSON.stringify({ error: 'Too many messages' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const sanitized = messages
      .filter(isIncomingMessage)
      .filter((msg) => ALLOWED_ROLES.includes(msg.role))
      .map((msg) => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content.slice(0, MAX_MSG_LENGTH) }],
      }));

    if (sanitized.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No valid messages provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const contents = [
      { role: 'user', parts: [{ text: SYSTEM_PROMPT }] },
      { role: 'model', parts: [{ text: 'Entendido. Estoy listo para ayudar a expatriados con información sobre Paraguay.' }] },
      ...sanitized,
    ];

    console.log('Calling Gemini API with', messages.length, 'messages');

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);
      return new Response(
        JSON.stringify({ error: 'Failed to get response from AI' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Lo siento, no pude generar una respuesta.';

    console.log('Gemini response received successfully');

    return new Response(
      JSON.stringify({ response: text }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in chat function:', error);
    return new Response(
      JSON.stringify({ error: 'An internal error occurred. Please try again.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
