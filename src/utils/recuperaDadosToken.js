export function parseJwt(token) {
  try {
    const base64Payload = token.split('.')[1];
    const payload = atob(base64Payload); // decodifica Base64

    return JSON.parse(payload); // converte para objeto
    
  } catch (e) {
    return null;
  }
}
