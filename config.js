
const sharedConfig = {
    API: {
      URL: 'http://192.168.175.152:5000',
      ALLOWED_ORIGINS: [
        'http://192.168.175.152:19006',
        'exp://192.168.175.152:19000',
        'http://localhost:19006'
      ],
    
    }
  };
  
  export const API_URL = sharedConfig.API.URL;
  export const ALLOWED_ORIGINS = sharedConfig.API.ALLOWED_ORIGINS;