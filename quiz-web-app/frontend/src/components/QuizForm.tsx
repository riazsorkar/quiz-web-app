// frontend/src/components/QuizForm.tsx
'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { Quiz, Question } from '@/types/quiz';

interface QuizFormProps {
  quiz?: Quiz | null;
  onSubmit: (quizData: Quiz) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

const defaultQuestion: Question = {
  id: 0,
  text: '',
  options: ['', '', '', ''],
  correctOptionIndex: 0,
  explanation: ''
};

const categories = [
  'Programming',
  'Web Development', 
  'Database',
  'Mathematics',
  'Science',
  'Business',
  'General Knowledge'
];

const difficulties = ['Easy', 'Medium', 'Hard'];

export default function QuizForm({ quiz, onSubmit, onCancel, loading = false }: QuizFormProps) {
  const [formData, setFormData] = useState<Quiz>({
    id: quiz?.id || 0,
    title: quiz?.title || '',
    description: quiz?.description || '',
    category: quiz?.category || 'Programming',
    difficulty: quiz?.difficulty || 'Medium',
    timeLimit: quiz?.timeLimit || 15,
    passingScore: quiz?.passingScore || 70,
    questions: quiz?.questions || [{ ...defaultQuestion, id: Date.now() }]
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Quiz title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Quiz description is required';
    }

    if (formData.timeLimit < 1) {
      newErrors.timeLimit = 'Time limit must be at least 1 minute';
    }

    if (formData.passingScore < 1 || formData.passingScore > 100) {
      newErrors.passingScore = 'Passing score must be between 1 and 100';
    }

    formData.questions.forEach((question, index) => {
      if (!question.text.trim()) {
        newErrors[`question-${index}-text`] = 'Question text is required';
      }

      const emptyOptions = question.options.filter(opt => !opt.trim());
      if (emptyOptions.length > 0) {
        newErrors[`question-${index}-options`] = 'All options must be filled';
      }

      if (question.options.length < 2) {
        newErrors[`question-${index}-options`] = 'At least 2 options are required';
      }

      if (question.correctOptionIndex === undefined || question.correctOptionIndex < 0) {
        newErrors[`question-${index}-correct`] = 'Please select correct answer';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const addQuestion = () => {
    setFormData(prev => ({
      ...prev,
      questions: [
        ...prev.questions,
        { ...defaultQuestion, id: Date.now() + prev.questions.length }
      ]
    }));
  };

  const removeQuestion = (index: number) => {
    if (formData.questions.length <= 1) {
      alert('Quiz must have at least one question');
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index)
    }));
  };

  const moveQuestion = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (newIndex < 0 || newIndex >= formData.questions.length) {
      return;
    }

    const newQuestions = [...formData.questions];
    [newQuestions[index], newQuestions[newIndex]] = [newQuestions[newIndex], newQuestions[index]];
    
    setFormData(prev => ({
      ...prev,
      questions: newQuestions
    }));
  };

  const updateQuestion = (index: number, field: keyof Question, value: any) => {
    setFormData(prev => {
      const newQuestions = [...prev.questions];
      newQuestions[index] = { ...newQuestions[index], [field]: value };
      return { ...prev, questions: newQuestions };
    });
  };

  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    setFormData(prev => {
      const newQuestions = [...prev.questions];
      const newOptions = [...newQuestions[questionIndex].options];
      newOptions[optionIndex] = value;
      newQuestions[questionIndex].options = newOptions;
      return { ...prev, questions: newQuestions };
    });
  };

  const addOption = (questionIndex: number) => {
    setFormData(prev => {
      const newQuestions = [...prev.questions];
      newQuestions[questionIndex].options = [...newQuestions[questionIndex].options, ''];
      return { ...prev, questions: newQuestions };
    });
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    if (formData.questions[questionIndex].options.length <= 2) {
      alert('Question must have at least 2 options');
      return;
    }

    setFormData(prev => {
      const newQuestions = [...prev.questions];
      const newOptions = newQuestions[questionIndex].options.filter((_, i) => i !== optionIndex);
      newQuestions[questionIndex].options = newOptions;
      
      // Adjust correct answer index if needed
      if (newQuestions[questionIndex].correctOptionIndex === optionIndex) {
        newQuestions[questionIndex].correctOptionIndex = 0;
    //   } else if (newQuestions[questionIndex].correctOptionIndex > optionIndex) {
    //     newQuestions[questionIndex].correctOptionIndex -= 1;
      }
      
      return { ...prev, questions: newQuestions };
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Quiz Basic Info */}
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Quiz Information</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quiz Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.title ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter quiz title"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.description ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter quiz description"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty *
              </label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {difficulties.map(diff => (
                  <option key={diff} value={diff}>{diff}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time Limit (minutes) *
              </label>
              <input
                type="number"
                value={formData.timeLimit}
                onChange={(e) => setFormData(prev => ({ ...prev, timeLimit: parseInt(e.target.value) || 0 }))}
                min="1"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.timeLimit ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.timeLimit && (
                <p className="mt-1 text-sm text-red-600">{errors.timeLimit}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Passing Score (%) *
              </label>
              <input
                type="number"
                value={formData.passingScore}
                onChange={(e) => setFormData(prev => ({ ...prev, passingScore: parseInt(e.target.value) || 0 }))}
                min="1"
                max="100"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.passingScore ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.passingScore && (
                <p className="mt-1 text-sm text-red-600">{errors.passingScore}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Questions Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-gray-900">Questions</h3>
          <button
            type="button"
            onClick={addQuestion}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Question
          </button>
        </div>

        <div className="space-y-6">
          {formData.questions.map((question, questionIndex) => (
            <div key={question.id} className="border border-gray-200 rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-bold text-gray-900">
                    Question {questionIndex + 1}
                  </h4>
                  <p className="text-sm text-gray-500">
                    Select the correct answer for this question
                  </p>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => moveQuestion(questionIndex, 'up')}
                    disabled={questionIndex === 0}
                    className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                    title="Move up"
                  >
                    <ChevronUp className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveQuestion(questionIndex, 'down')}
                    disabled={questionIndex === formData.questions.length - 1}
                    className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                    title="Move down"
                  >
                    <ChevronDown className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeQuestion(questionIndex)}
                    className="p-2 text-red-500 hover:text-red-700"
                    title="Remove question"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {/* Question Text */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Question Text *
                  </label>
                  <textarea
                    value={question.text}
                    onChange={(e) => updateQuestion(questionIndex, 'text', e.target.value)}
                    rows={2}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors[`question-${questionIndex}-text`] ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter your question here..."
                  />
                  {errors[`question-${questionIndex}-text`] && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors[`question-${questionIndex}-text`]}
                    </p>
                  )}
                </div>

                {/* Options */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Options *
                  </label>
                  <div className="space-y-2">
                    {question.options.map((option, optionIndex) => (
                      <div key={optionIndex} className="flex items-center space-x-3">
                        <input
                          type="radio"
                          name={`correct-${questionIndex}`}
                          checked={question.correctOptionIndex === optionIndex}
                          onChange={() => updateQuestion(questionIndex, 'correctOptionIndex', optionIndex)}
                          className="h-4 w-4 text-blue-600"
                        />
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => updateOption(questionIndex, optionIndex, e.target.value)}
                          className={`flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors[`question-${questionIndex}-options`] ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder={`Option ${optionIndex + 1}`}
                        />
                        <button
                          type="button"
                          onClick={() => removeOption(questionIndex, optionIndex)}
                          disabled={question.options.length <= 2}
                          className="p-2 text-red-500 hover:text-red-700 disabled:opacity-50"
                          title="Remove option"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    
                    {errors[`question-${questionIndex}-options`] && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors[`question-${questionIndex}-options`]}
                      </p>
                    )}
                    
                    <button
                      type="button"
                      onClick={() => addOption(questionIndex)}
                      className="mt-2 px-4 py-2 text-blue-600 hover:text-blue-800 font-medium flex items-center"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Option
                    </button>
                  </div>
                </div>

                {/* Explanation */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Explanation (Optional)
                  </label>
                  <textarea
                    value={question.explanation || ''}
                    onChange={(e) => updateQuestion(questionIndex, 'explanation', e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Explain why this answer is correct (shown after quiz)"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-4 pt-6 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50 flex items-center"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              {quiz ? 'Updating...' : 'Creating...'}
            </>
          ) : (
            quiz ? 'Update Quiz' : 'Create Quiz'
          )}
        </button>
      </div>
    </form>
  );
}