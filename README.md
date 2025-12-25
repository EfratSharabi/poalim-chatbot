# Bank Hapoalim Chat Bot

## **Overview**
This is a **Single Page Application (SPA)** implementing a real-time chat room.  
- Users can post questions and answers.  
- A friendly and cheerful bot automatically answers questions that have already been asked, providing a human-like and entertaining response.  
- Built on **NX Workspace** with Angular 21 for the frontend and NestJS 11 for the backend.  
- The `shared` library is used to share models between frontend and backend.

---

## **Architecture**

### **Frontend (Angular 21)**
- Uses **Standalone Components** and **Signals** instead of ZoneJS for improved performance.
- Modular component structure:
  - **ChatRoomComponent** – main chat feature.
  - **ChatQuestionComposerComponent** – question creation.
  - **ChatQuestionListComponent** – displays list of questions.
  - **ChatQuestionComponent** – displays a single question using MatExpansionPanel.
  - **ChatAnswerListComponent** – displays answers.
  - **ChatAnswerComposerComponent** – answer creation.
  - **ChatMessageEditorComponent** – rich HTML editor using ngx-editor.
  - **ChatMessageComponent** – message display with header (sender, timestamp).
- **Pipes**:
  - `MessageTimestampFormatPipe` – formats timestamps.
  - `MessageSenderFormatPipe` – formats sender info.
- **State Management**:
  - `ChatStateService` – stores questions and answers.
  - `ChatActivityStateService` – manages pending answers state.
  - `ChatSocketService` – handles bi-directional WebSocket communication.
  - `ChatActionService` – sends actions to the backend.

### **Backend (NestJS 11)**
- **ChatGateway** – handles WebSocket communication using `socket.io`.  
- **Stores**:
  - `ChatStore` – stores questions and answers.
  - `EmbeddingStore` – stores embeddings for semantic search.
- **Services / Business Logic**:
  - `ChatService` – main chat logic, emits events via EventEmitter.
  - `BotService` – handles bot responses.
  - `PromptBuilderService` – builds prompts for OpenAI.
  - `QuestionMatcherService` – identifies repeated questions.
  - `VectorSimilarityService` – calculates semantic similarity between questions.
  - `ChatBootstrapService` – initializes in-memory cache from JSON mock file.
- **Dependency Injection with Provider Tokens**:
  - `ILanguageModelService`, `IEmbeddingService` – allows future replacement without changing code dependencies.

---

## **Real-Time Synchronization**
- Uses `socket.io` and WebSocket.
- Defined events:
  - `chatHistory`, `newQuestion`, `newAnswer`, `answerPending`.
- **Flow example**:
  1. Client sends a question with `correlationId`.
  2. Server stores the question and returns a real ID.
  3. `ChatService` emits an event via EventEmitter.
  4. `ChatGateway` broadcasts the new question to all clients.
- Pending answers provide typing feedback for other users or the bot.

---

## **Bot Implementation**
- **Repeated question detection**: 
  - HuggingFace embeddings are generated for each question.
  - Semantic search is performed via vector comparison using the `VectorSimilarityService`.
- **User-friendly answer generation**: 
  - If a matching question is found, the bot calls the OpenAI language service to generate a friendly and helpful response.
  - The prompt instructs the model: *"You are a helpful, friendly, and cheerful banking assistant"*.
- **Process**:
  1. `QuestionMatcherService` checks if the question has already been asked.
  2. If a suitable match is found, `BotService` calls OpenAI to generate the answer.
  3. The `correlationId` ensures the answer is correctly mapped in the UI.
- Unique feature: the bot provides humorous and engaging responses, creating an enjoyable user experience.

---

## **Performance Considerations**
- Lazy loading of components.
- Angular Signals instead of ZoneJS – reduced re-renders.
- OnPush change detection where needed.
- `correlationId` ensures fast and smooth UI updates.
- Caching of previously answered questions.

---

## **Features**
- Rich question and answer editor using ngx-editor.
- Real-time typing feedback (`answerPending`).
- Auto-opening of newly created questions.
- Material Angular with custom theme.

---

## **Code Testing**
- Unit tests implemented only for `ChatStateService` in Angular.
- Testing framework: **Vitest**.

---

## **Deployment**
The application is deployed across two platforms:
- **Backend**: Hosted on Render.
- **Frontend**: Hosted on Netlify.

**Live application:**  
https://polite-praline-8a857f.netlify.app/

- Local setup:
```bash
# Install dependencies
npm install
# Start backend
nx serve api
# Start frontend
nx serve web
