// Types pour Web Speech API
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  grammars: SpeechGrammarList;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  serviceURI: string;
  
  // Methods
  start(): void;
  stop(): void;
  abort(): void;
  
  // Event handlers
  onaudiostart: ((this: SpeechRecognition, ev: Event) => any) | undefined;
  onaudioend: ((this: SpeechRecognition, ev: Event) => any) | undefined;
  onend: ((this: SpeechRecognition, ev: Event) => any) | undefined;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | undefined;
  onnomatch: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | undefined;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | undefined;
  onsoundstart: ((this: SpeechRecognition, ev: Event) => any) | undefined;
  onsoundend: ((this: SpeechRecognition, ev: Event) => any) | undefined;
  onspeechstart: ((this: SpeechRecognition, ev: Event) => any) | undefined;
  onspeechend: ((this: SpeechRecognition, ev: Event) => any) | undefined;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | undefined;
}

declare var SpeechRecognition: {
  prototype: SpeechRecognition;
  new(): SpeechRecognition;
};

interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  readonly error: string;
  readonly message: string;
}

interface SpeechRecognitionResult {
  readonly isFinal: boolean;
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionAlternative {
  readonly confidence: number;
  readonly transcript: string;
}

interface SpeechGrammarList {
  readonly length: number;
  item(index: number): SpeechGrammar;
  [index: number]: SpeechGrammar;
  addFromString(string: string, weight?: number): void;
  addFromURI(src: string, weight?: number): void;
}

interface SpeechGrammar {
  src: string;
  weight: number;
}

// Extension de Window pour inclure SpeechRecognition
interface Window {
  SpeechRecognition?: typeof SpeechRecognition;
  webkitSpeechRecognition?: typeof SpeechRecognition;
}