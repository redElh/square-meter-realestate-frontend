// Debug endpoint to see what data is being received
module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { formData, emailType } = req.body;
    
    const response = {
      success: true,
      debug: {
        receivedEmailType: emailType,
        hasFormData: !!formData,
        formDataKeys: formData ? Object.keys(formData) : [],
        hasCvBase64: !!formData?.cvBase64,
        cvBase64Length: formData?.cvBase64?.length || 0,
        cvBase64Sample: formData?.cvBase64 ? formData.cvBase64.substring(0, 50) + '...' : 'none',
        cvFilename: formData?.cvFilename,
        cvMimetype: formData?.cvMimetype,
        requestBodySize: JSON.stringify(req.body).length
      }
    };
    
    console.log('🔍 DEBUG ENDPOINT RESPONSE:', JSON.stringify(response, null, 2));
    
    res.status(200).json(response);
  } catch (error) {
    console.error('Debug endpoint error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
