// SAHARA Contextual Permission Manager
// Manages privacy-first, just-in-time permission requests with local persistence,
// non-blocking fallbacks, and clear user explanations.

const PERMISSIONS_KEY = 'sahara_permissions_state_v1';

export const PERMISSION_TYPES = {
  NOTIFICATIONS: 'notifications',
  MICROPHONE: 'microphone',
  LOCATION: 'location',
  CAMERA: 'camera'
};

const defaultPermissions = {
  [PERMISSION_TYPES.NOTIFICATIONS]: { status: 'prompt', askedAt: null, explanationShown: false },
  [PERMISSION_TYPES.MICROPHONE]: { status: 'prompt', askedAt: null, explanationShown: false },
  [PERMISSION_TYPES.LOCATION]: { status: 'prompt', askedAt: null, explanationShown: false },
  [PERMISSION_TYPES.CAMERA]: { status: 'prompt', askedAt: null, explanationShown: false }
};

export class PermissionManager {
  static getPermissions() {
    try {
      const stored = localStorage.getItem(PERMISSIONS_KEY);
      return stored ? { ...defaultPermissions, ...JSON.parse(stored) } : defaultPermissions;
    } catch (e) {
      return defaultPermissions;
    }
  }

  static getStatus(type) {
    const all = this.getPermissions();
    return all[type]?.status || 'prompt';
  }

  static async request(type, explanationCallback) {
    const all = this.getPermissions();

    // Contextual rationale callback before triggering native prompt
    if (explanationCallback && !all[type]?.explanationShown) {
      await explanationCallback();
      all[type].explanationShown = true;
    }

    all[type].askedAt = new Date().toISOString();

    try {
      if (type === PERMISSION_TYPES.NOTIFICATIONS) {
        if ('Notification' in window) {
          const res = await Notification.requestPermission();
          all[type].status = res === 'granted' ? 'granted' : 'denied';
        } else {
          all[type].status = 'granted'; // Graceful simulated grant
        }
      } else if (type === PERMISSION_TYPES.MICROPHONE) {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            // Release immediately - never keep listening
            stream.getTracks().forEach(t => t.stop());
            all[type].status = 'granted';
          } catch (micErr) {
            all[type].status = 'denied';
          }
        } else {
          all[type].status = 'granted'; // Fallback
        }
      } else if (type === PERMISSION_TYPES.LOCATION) {
        if ('geolocation' in navigator) {
          all[type].status = await new Promise(resolve => {
            navigator.geolocation.getCurrentPosition(
              () => resolve('granted'),
              () => resolve('denied'),
              { timeout: 8000 }
            );
          });
        } else {
          all[type].status = 'denied';
        }
      } else if (type === PERMISSION_TYPES.CAMERA) {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            stream.getTracks().forEach(t => t.stop());
            all[type].status = 'granted';
          } catch (camErr) {
            all[type].status = 'denied';
          }
        } else {
          all[type].status = 'denied';
        }
      }
    } catch (err) {
      console.warn(`Permission request for ${type} failed gracefully:`, err);
      all[type].status = 'denied';
    }

    localStorage.setItem(PERMISSIONS_KEY, JSON.stringify(all));
    return all[type].status;
  }

  static setManualStatus(type, status) {
    const all = this.getPermissions();
    all[type] = { ...all[type], status, askedAt: new Date().toISOString() };
    localStorage.setItem(PERMISSIONS_KEY, JSON.stringify(all));
  }

  static resetAll() {
    localStorage.removeItem(PERMISSIONS_KEY);
    return defaultPermissions;
  }
}
