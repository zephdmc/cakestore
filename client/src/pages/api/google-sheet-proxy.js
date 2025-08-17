export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const {
    fullName,
    phone,
    email,
    skinType,
    skinConcerns,
    otherConcern,
    routineDescription,
    contactMethod,
    consent,
  } = req.body;

  const sheetScriptURL = 'https://script.google.com/macros/s/AKfycbw692QxPLyirY9i1vOgyU7NitKJMOfbr1dMvzhFqszFmqZyHd_ywRMiYtvA3l-StpvF/exec';

  try {
    const response = await fetch(sheetScriptURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fullName,
        phone,
        email,
        skinType,
        skinConcerns: Array.isArray(skinConcerns) ? skinConcerns.join(', ') : '',
        otherConcern,
        routineDescription,
        contactMethod,
        consent,
      }),
    });

    const result = await response.json();

    return res.status(200).json({ success: true, result });
  } catch (error) {
    console.error('Proxy Error:', error);
    return res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
}
