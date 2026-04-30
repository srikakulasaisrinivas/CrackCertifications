package com.crackcertification.model;

import java.util.List;

public class Question {
    private int id;
    private String type;
    private String text;
    private List<Option> options;
    private List<String> correctAnswers;
    private String explanation;

    public Question() {}

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getText() { return text; }
    public void setText(String text) { this.text = text; }
    public List<Option> getOptions() { return options; }
    public void setOptions(List<Option> options) { this.options = options; }
    public List<String> getCorrectAnswers() { return correctAnswers; }
    public void setCorrectAnswers(List<String> correctAnswers) { this.correctAnswers = correctAnswers; }
    public String getExplanation() { return explanation; }
    public void setExplanation(String explanation) { this.explanation = explanation; }

    public static class Option {
        private String label;
        private String text;

        public Option() {}

        public Option(String label, String text) {
            this.label = label;
            this.text = text;
        }

        public String getLabel() { return label; }
        public void setLabel(String label) { this.label = label; }
        public String getText() { return text; }
        public void setText(String text) { this.text = text; }
    }
}


