package com.crackcertification.controller;

import com.crackcertification.model.Question;
import com.crackcertification.service.QuestionService;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/questions")
@CrossOrigin(origins = "*")
public class QuestionController {

    private final QuestionService questionService;

    public QuestionController(QuestionService questionService) {
        this.questionService = questionService;
    }

    /** Returns questions WITHOUT correctAnswers or explanations (safe for browser). */
    @GetMapping
    public List<Map<String, Object>> getAllQuestions(@RequestParam(defaultValue = "false") boolean randomize) {
        List<Question> questions = randomize
                ? questionService.getRandomizedQuestions()
                : questionService.getAllQuestions();
        return questions.stream().map(this::stripAnswers).collect(Collectors.toList());
    }

    @GetMapping("/count")
    public Map<String, Integer> getCount() {
        return Map.of("total", questionService.getTotalCount());
    }

    /** Check a single answer — returns correctAnswers + explanation. */
    @PostMapping("/check")
    public Map<String, Object> checkAnswer(@RequestBody Map<String, Object> payload) {
        int questionId = (int) payload.get("questionId");
        @SuppressWarnings("unchecked")
        List<String> userAnswers = (List<String>) payload.get("answers");

        Question question = questionService.getQuestionById(questionId);
        if (question == null) {
            return Map.of("error", "Question not found");
        }

        boolean correct = question.getCorrectAnswers().size() == userAnswers.size()
                && question.getCorrectAnswers().containsAll(userAnswers);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("correct", correct);
        result.put("correctAnswers", question.getCorrectAnswers());
        result.put("explanation", question.getExplanation());
        return result;
    }

    /** Bulk-check all answers at once (Exam mode). Returns per-question results with explanations. */
    @PostMapping("/check-all")
    public List<Map<String, Object>> checkAllAnswers(@RequestBody Map<String, Object> payload) {
        @SuppressWarnings("unchecked")
        Map<String, List<String>> answersMap = (Map<String, List<String>>) payload.get("answers");

        List<Map<String, Object>> results = new ArrayList<>();
        for (Map.Entry<String, List<String>> entry : answersMap.entrySet()) {
            int qId = Integer.parseInt(entry.getKey());
            List<String> userAnswers = entry.getValue();
            Question q = questionService.getQuestionById(qId);
            if (q == null) continue;

            boolean correct = q.getCorrectAnswers().size() == userAnswers.size()
                    && q.getCorrectAnswers().containsAll(userAnswers);

            Map<String, Object> r = new LinkedHashMap<>();
            r.put("questionId", qId);
            r.put("correct", correct);
            r.put("correctAnswers", q.getCorrectAnswers());
            r.put("explanation", q.getExplanation());
            results.add(r);
        }
        return results;
    }

    private Map<String, Object> stripAnswers(Question q) {
        Map<String, Object> safe = new LinkedHashMap<>();
        safe.put("id", q.getId());
        safe.put("type", q.getType());
        safe.put("text", q.getText());
        safe.put("options", q.getOptions());
        return safe;
    }
}


