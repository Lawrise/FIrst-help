import { create } from 'zustand';

interface Call {
  id: number;
  checked: boolean;
  name: string;
  priority: "low" | "medium" | "high" | "vital";
  description: string;
  dateTime: string;
}

interface WebSocketStore {
  socket: WebSocket | null;
  calls: Call[];
  connect: () => void;
  disconnect: () => void;
  updateCall: (call: Call) => void;
  addCall: (call: Call) => void;
}

export const useWebSocket = create<WebSocketStore>((set, get) => ({
  socket: null,
  calls: [],
  
  connect: () => {
    const socket = new WebSocket('ws://localhost:3000');
    
    socket.onopen = () => {
      console.log('WebSocket Connected');
    };
    
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      
      switch (message.type) {
        case 'initial_data':
          set({ calls: message.data });
          break;
        
        case 'calls_updated':
          set({ calls: message.data });
          break;
          
        case 'error':
          console.error('WebSocket error:', message.message);
          break;
          
        default:
          console.log('Unknown message type:', message.type);
      }
    };
    
    socket.onclose = () => {
      console.log('WebSocket Disconnected');
      set({ socket: null });
    };
    
    set({ socket });
  },
  
  disconnect: () => {
    const { socket } = get();
    if (socket) {
      socket.close();
      set({ socket: null });
    }
  },
  
  updateCall: (call: Call) => {
    const { socket } = get();
    if (socket) {
      socket.send(JSON.stringify({
        type: 'update_call',
        call
      }));
    }
  },
  
  addCall: (call: Call) => {
    const { socket } = get();
    if (socket) {
      socket.send(JSON.stringify({
        type: 'add_call',
        call
      }));
    }
  }
})); 