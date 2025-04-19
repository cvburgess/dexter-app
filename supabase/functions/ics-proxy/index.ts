// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};

// Function to check if the URL ends with .ics
function isIcsFile(url: string): boolean {
  try {
    return url.toLowerCase().endsWith(".ics");
  } catch (_e) {
    return false;
  }
}

// Main handler function using Deno.serve
Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  // Only support GET requests
  if (req.method !== "GET") {
    return new Response(
      JSON.stringify({ error: "Only GET requests are supported" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 405,
      },
    );
  }

  try {
    // Get the URL from query params
    const url = new URL(req.url).searchParams.get("url");

    // Validate that we have a URL
    if (!url) {
      return new Response(
        JSON.stringify({ error: "URL parameter is required" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        },
      );
    }

    // Check if the URL is an .ics file
    if (!isIcsFile(url)) {
      return new Response(
        JSON.stringify({ error: "Only .ics file URLs are allowed" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 403,
        },
      );
    }

    // Prepare headers to forward to the target URL
    const headers = new Headers();

    // Forward relevant headers from the original request
    req.headers.forEach((value, key) => {
      // Skip some headers that should be set by the fetch call itself
      if (
        !["host", "connection", "content-length"].includes(key.toLowerCase())
      ) {
        headers.set(key, value);
      }
    });

    // Make the GET request to the target URL
    const response = await fetch(url, { headers });

    // Prepare response headers, including CORS headers
    const responseHeaders = new Headers(corsHeaders);

    // Forward relevant response headers from the proxied response
    response.headers.forEach((value, key) => {
      responseHeaders.set(key, value);
    });

    // Set proper content type for .ics files if not already set
    if (!responseHeaders.has("Content-Type")) {
      responseHeaders.set("Content-Type", "text/calendar");
    }

    // Return the proxied response with status and headers
    return new Response(response.body, {
      headers: responseHeaders,
      status: response.status,
      statusText: response.statusText,
    });
  } catch (error) {
    // Handle any errors that occurred during the proxy request
    const errorMessage = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
