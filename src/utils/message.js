// Wrapper for Ant Design message to use shadcn toast instead
// This allows gradual migration without breaking existing code

let toastInstance = null;

export function setToastInstance(toast) {
  toastInstance = toast;
}

export const message = {
  success: (config) => {
    const content = typeof config === 'string' ? config : config.content;
    const duration = typeof config === 'object' ? config.duration : 3;
    
    if (toastInstance) {
      toastInstance.success({
        title: 'Success',
        description: content,
        duration: duration * 1000,
      });
    } else {
      console.log('[Success]:', content);
    }
  },
  
  error: (config) => {
    const content = typeof config === 'string' ? config : config.content;
    const duration = typeof config === 'object' ? config.duration : 3;
    
    if (toastInstance) {
      toastInstance.error({
        title: 'Error',
        description: content,
        duration: duration * 1000,
      });
    } else {
      console.error('[Error]:', content);
    }
  },
  
  warning: (config) => {
    const content = typeof config === 'string' ? config : config.content;
    const duration = typeof config === 'object' ? config.duration : 3;
    
    if (toastInstance) {
      toastInstance.warning({
        title: 'Warning',
        description: content,
        duration: duration * 1000,
      });
    } else {
      console.warn('[Warning]:', content);
    }
  },
  
  info: (config) => {
    const content = typeof config === 'string' ? config : config.content;
    const duration = typeof config === 'object' ? config.duration : 3;
    
    if (toastInstance) {
      toastInstance.info({
        title: 'Info',
        description: content,
        duration: duration * 1000,
      });
    } else {
      console.info('[Info]:', content);
    }
  },
};

export default message;

