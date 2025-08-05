# 🧼 Project SOAP

An AI-powered medical documentation tool that generates and reviews SOAP notes from patient encounter transcripts.  
Built with **Next.js**, **OpenAI GPT-4o**, and **Tailwind CSS**.

---

## How It Works

### 1. Generate SOAP Note
- **Input**: Paste a full patient encounter transcript formatted as user, assistant. Be sure to include all relevant modules.
- The app parses the dialogue into clinician/patient turns (`src/lib/parseCsv.ts`).
- A **system prompt** (`src/lib/prompts.ts`) instructs the AI to produce a concise, markdown-formatted SOAP note.
- The transcript + prompt are sent to the **`/api/generate`** endpoint, which calls the OpenAI API.
- The AI-generated SOAP note is stored in memory (`src/lib/store.ts`) and displayed to the user.

### 2. Edit & Submit
- Users can click **"Edit & Review"** to refine the SOAP note.
- Their edits are saved as the **student note** for the encounter.

### 3. AI Review & Grading
- On submission, the **`/api/review`** endpoint:
  - Retrieves the original AI note and the student-edited note.
  - Uses a **PDQI-9 scoring rubric** with clinical appropriateness rules (`src/app/api/review/route.ts`).
  - Compares both notes against the encounter transcript.
  - Returns JSON with:
    - **Scores** for each PDQI-9 dimension.
    - **Delta scores** (student vs. AI).
    - **Per-dimension change comments**.
    - **Overall feedback**.

### 4. Feedback Display
- The UI presents a detailed breakdown:
  - Scores and deltas per dimension.
  - Specific snippets causing score changes.
  - Global comments for improvement.

---

## Tech Stack

- **Framework**: Next.js 15
- **Styling**: Tailwind CSS
- **AI**: OpenAI GPT-4o / GPT-4o-mini
- **Parsing**: PapaParse for CSV input
- **State**: In-memory store (Map)
- **UI Components**: Custom + Tailwind utilities
- **Icons**: Lucide React
- **Notifications**: Sonner

---

## Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open in browser
http://localhost:3000
