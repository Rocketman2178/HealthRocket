import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const SUPPORT_EMAIL = Deno.env.get('SUPPORT_EMAIL')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

interface SupportMessage {
  messageId: string
  userId: string
  userName: string
  userEmail: string
  message: string
  createdAt: string
}

serve(async (req) => {
  try {
    // Verify request method
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Get message data from request
    const message: SupportMessage = await req.json()

    // Validate required data
    if (!message.userEmail || !message.message || !message.userName) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Initialize Supabase client
    const supabase = createClient(
      SUPABASE_URL!,
      SUPABASE_SERVICE_ROLE_KEY!
    )

    // Send email using Resend
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Health Rocket Support <support@healthrocket.app>',
        to: SUPPORT_EMAIL,
        subject: `Support Request from ${message.userName}`,
        html: `
          <h2>Support Request</h2>
          <p><strong>From:</strong> ${message.userName} (${message.userEmail})</p>
          <p><strong>Message ID:</strong> ${message.messageId}</p>
          <p><strong>Sent:</strong> ${new Date(message.createdAt).toLocaleString()}</p>
          <p><strong>Message:</strong></p>
          <p>${message.message}</p>
        `
      })
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.message || 'Failed to send email')
    }

    // Update support message with email status
    const { error: updateError } = await supabase
      .from('support_messages')
      .update({
        email_sent: true,
        email_sent_at: new Date().toISOString(),
        email_id: data.id
      })
      .eq('id', message.messageId)

    if (updateError) {
      console.error('Error updating support message:', updateError)
    }

    return new Response(JSON.stringify({ success: true, emailId: data.id }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
})