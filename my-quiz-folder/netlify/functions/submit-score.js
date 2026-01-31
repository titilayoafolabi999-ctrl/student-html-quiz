/**
 * Real-time Assessment Backend
 * Handles: 
 * 1. Score submission to Google Sheets
 * 2. Admin reset validation
 */

exports.handler = async (event) => {
  // CORS & Method Check
  if (event.httpMethod !== 'POST') {
    return { 
      statusCode: 405, 
      body: JSON.stringify({ error: 'Method Not Allowed' }) 
    };
  }

  try {
    const body = JSON.parse(event.body);

    // --- ACTION 1: ADMIN RESET VALIDATION ---
    if (body.action === 'validate-reset') {
      const isCorrect = body.code === process.env.RESET_CODE;
      return { 
        statusCode: isCorrect ? 200 : 401, 
        body: JSON.stringify({ success: isCorrect }) 
      };
    }

    // --- ACTION 2: REAL-TIME SCORE SUBMISSION ---
    // This sends data to your Google Apps Script Web App
    const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL;
    
    if (!GOOGLE_SCRIPT_URL) {
      console.error("Missing GOOGLE_SCRIPT_URL environment variable");
      return { statusCode: 500, body: "Server Configuration Error" };
    }

    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        timestamp: new Date().toISOString(),
        studentName: body.studentName,
        level: body.level,
        score: body.score,
        total: body.total,
        percentage: ((body.score / body.total) * 100).toFixed(2) + '%'
      })
    });

    if (!response.ok) throw new Error('Google Sheets Sync Failed');

    return { 
      statusCode: 200, 
      body: JSON.stringify({ 
        status: "Success", 
        message: "Real-time sync complete" 
      }) 
    };

  } catch (error) {
    console.error("Backend Error:", error);
    return { 
      statusCode: 500, 
      body: JSON.stringify({ error: error.message }) 
    };
  }
};