// Global type declarations for ANITA Finance Advisor

interface MessageRecorder {
  sessionId: string;
  messageCount: number;
  recordMessage(content: string, messageType?: 'user' | 'bot' | 'system', metadata?: any): any;
  getAllMessages(): any[];
  getSessionMessages(): any[];
  getMessagesByType(messageType: string): any[];
  clearAllMessages(): boolean;
  clearSessionMessages(): boolean;
  exportMessages(): void;
  getStats(): {
    totalMessages: number;
    sessionMessages: number;
    userMessages: number;
    botMessages: number;
    systemMessages: number;
    currentSessionId: string;
    firstMessage: string | null;
    lastMessage: string | null;
  };
  displayHistory(limit?: number): void;
}

declare global {
  interface Window {
    anitaMessageRecorder: MessageRecorder;
  }
}

export {};
