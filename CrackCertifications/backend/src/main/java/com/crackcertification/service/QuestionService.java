package com.crackcertification.service;

import com.crackcertification.model.Question;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
public class QuestionService {

    private List<Question> questions = new ArrayList<>();

    @PostConstruct
    public void loadQuestions() throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        InputStream is = new ClassPathResource("questions.json").getInputStream();
        questions = mapper.readValue(is, new TypeReference<List<Question>>() {});
    }

    public List<Question> getAllQuestions() {
        return questions;
    }

    public List<Question> getRandomizedQuestions() {
        List<Question> shuffled = new ArrayList<>(questions);
        Collections.shuffle(shuffled);
        return shuffled;
    }

    public Question getQuestionById(int id) {
        return questions.stream()
                .filter(q -> q.getId() == id)
                .findFirst()
                .orElse(null);
    }

    public int getTotalCount() {
        return questions.size();
    }
}

