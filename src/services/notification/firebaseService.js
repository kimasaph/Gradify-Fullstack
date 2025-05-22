import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { toast } from 'sonner';
const VAPID_KEY = import.meta.env.VITE_VAPID_KEY;
const API_URL = "http://localhost:8080/api/fcm";
const firebaseConfig = {
  apiKey: "AIzaSyDwTSDcMelDyFMrjUTkqcRjQPaS31dS_J4",
  authDomain: "gradify-f423e.firebaseapp.com",
  projectId: "gradify-f423e",
  storageBucket: "gradify-f423e.firebasestorage.app",
  messagingSenderId: "158565016627",
  appId: "1:158565016627:web:acc2fb9e2fe4097c4a6f46"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const messaging = getMessaging(app);
const notificationSound = new Audio('/notification-sound.mp3');

export const requestNotificationPermission = async (userId) => {
  try {
      if (!('Notification' in window)) {
          console.log('This browser does not support notifications');
          return false;
      }
      
      if (Notification.permission === 'granted') {
          const token = await getToken(messaging, { vapidKey: VAPID_KEY });
          await registerTokenWithServer(token, userId);
          return token;
      }
      
      if (Notification.permission !== 'denied') {
          const permission = await Notification.requestPermission();
          
          if (permission === 'granted') {
              const token = await getToken(messaging, { vapidKey: VAPID_KEY });
              await registerTokenWithServer(token, userId);
              return token;
          } else {
              console.log('Notification permission was not granted');
              return false;
          }
      } else {
          console.log('Notification permission was previously denied');
          return false;
      }
  } catch (err) {
      console.error('Failed to get notification permission:', err);
      return false;
  }
};

const registerTokenWithServer = async (token, userId) => {
  
  try {
      const authToken = localStorage.getItem('token');
      await fetch(`${API_URL}/register-device`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          },
          body: JSON.stringify({ token, userId })
      });
      console.log("Device registered with token for user:", token, userId);
  } catch (error) {
      console.error('Failed to register token with server:', error);
  }
};

// Handle foreground messages
export const setupMessageListener = () => {
  onMessage(messaging, (payload) => {
    console.log('Message received:', payload);
    
    // Check if payload has the expected structure
    const title = payload.notification?.title || 'New Notification';
    const body = payload.notification?.body || 'New update in ProjectSync';
    
    try {
      toast.message(title, {
        description: body,
        duration: 5000,
      });
      notificationSound.play().catch((error) => {
        console.error('Failed to play notification sound:', error);
      });
      
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(title, {
          body: body,
          icon: '/favicon.ico'
        });
      }
    } catch (error) {
      console.error('Failed to show toast notification:', error);
    }
  });
};