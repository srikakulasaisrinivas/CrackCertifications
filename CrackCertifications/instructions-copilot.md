# Crack Certification Portal – Build Instructions

## Overview

Crack Certification is a web portal for users to practice and prepare for certification exams. The initial focus is the Copilot GH300 exam, with all questions sourced from the provided `questions.md` file.

**Tech Stack:**
- **Backend:** Java with Spring Boot
- **Frontend:** React

---

## 1. Home Page (React)

- Display the website name: **Crack Certification**.
- Add a prominent button: **Copilot GH300 Exam**.
    - On click, navigate to the GH300 exam practice section.

---

## 2. Exam Modes

Implement at least two modes:
- **Practice Mode**
    - Users answer questions at their own pace.
    - Show correct answer and explanation after each question.
- **Exam Mode**
    - Simulate real exam conditions (timer, no immediate feedback).
    - Show results and explanations only after submission.

---

## 3. Question Bank

- Store all questions and explanations from `questions.md` in the backend (e.g., as a database or JSON file loaded by Spring Boot).
- Backend should expose REST APIs for:
    - Fetching questions (with randomization support).
    - Submitting answers.
    - Flagging questions.
    - Fetching explanations.
- Frontend (React) should:
    - Fetch questions via API.
    - Display question text and multiple-choice options.
    - Allow users to select an answer.
    - Allow users to **flag** questions for later review.
    - In Practice Mode, show correct answer and explanation after answering.
    - In Exam Mode, show answers and explanations after exam completion.

---

## 4. User Interaction Features

- **Navigation:** Next/Previous buttons to move between questions.
- **Flagging:** Users can flag any question for review, even after answering.
- **Summary Page:** At the end of each session, display:
    - Total questions attempted
    - Number of correct/incorrect answers
    - List of flagged questions
    - Option to review flagged questions
    - Option to retake the exam

---

## 5. Explanations

- For every question, provide a detailed explanation of the correct answer.
- Explanations should be visible:
    - Immediately after answering (Practice Mode)
    - After exam submission (Exam Mode)

---

## 6. Accessibility & Usability

- Ensure the portal is mobile-friendly and accessible.
- Use clear fonts and intuitive navigation.
- Provide visual feedback for selected answers and flagged questions.

---

## 7. Additional Recommendations

- **User Accounts (Optional):** Allow users to register and track progress (implement authentication in Spring Boot and React).
- **Progress Tracking:** Show performance history and improvement.
- **Feedback:** Allow users to report errors or suggest improvements for questions.
- **Resource Links:** Link to official documentation or study resources (e.g., from `gh-300.pdf`).
- **Admin Panel (Optional):** For managing questions and user feedback.

---

## 8. File Usage

- **questions.md:** Source for all exam questions and explanations. Parse and load into backend storage.
- **gh-300.pdf:** Reference for explanations and further reading.

---

## 9. Project Structure Example

### Backend (Spring Boot)
- `/src/main/java/com/crackcertification/`
    - `controller/` – REST controllers for questions, answers, users, etc.
    - `service/` – Business logic.
    - `model/` – Data models for questions, answers, users.
    - `repository/` – Data access layer (if using a database).
    - `resources/questions.json` – Parsed questions from `questions.md`.

### Frontend (React)
- `/src/`
    - `components/` – Home, Exam, Practice, Summary, etc.
    - `services/` – API calls to backend.
    - `App.js` – Main app component.
    - `styles/` – CSS or styled-components.

---

## Example User Flow

1. User visits Crack Certification home page.
2. Clicks "Copilot GH300 Exam" button.
3. Selects Practice or Exam mode.
4. Answers questions, flags any for review, and views explanations (as allowed).
5. Reviews performance and flagged questions at the end.

---

**Start by building the backend REST API with Spring Boot, then connect your React frontend. Expand features as needed.**