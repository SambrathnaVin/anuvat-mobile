import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "../contexts/ThemeContext";

export default function QuizSessionScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { theme } = useTheme();

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(600); // 10 minutes

  // Mock quiz data
  const quiz = {
    title: "React Fundamentals Quiz",
    questions: [
      {
        id: 1,
        question: "What is JSX?",
        options: [
          "A JavaScript library",
          "A syntax extension for JavaScript",
          "A CSS framework",
          "A database",
        ],
        correctAnswer: 1,
      },
      {
        id: 2,
        question: "Which hook is used for side effects?",
        options: ["useState", "useEffect", "useContext", "useReducer"],
        correctAnswer: 1,
      },
      {
        id: 3,
        question: "What does props stand for?",
        options: ["Properties", "Protocols", "Propositions", "Programs"],
        correctAnswer: 0,
      },
      {
        id: 4,
        question: "What is the virtual DOM?",
        options: [
          "A copy of the real DOM",
          "A JavaScript library",
          "A CSS framework",
          "A database",
        ],
        correctAnswer: 0,
      },
      {
        id: 5,
        question: "Which company created React?",
        options: ["Google", "Facebook", "Microsoft", "Apple"],
        correctAnswer: 1,
      },
    ],
  };

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleAnswerSelect = (questionId, optionIndex) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmitQuiz = () => {
    Alert.alert(
      "Submit Quiz",
      "Are you sure you want to submit? You cannot change answers after submission.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Submit",
          style: "destructive",
          onPress: () => {
            // Calculate score
            let score = 0;
            quiz.questions.forEach((q) => {
              if (answers[q.id] === q.correctAnswer) {
                score++;
              }
            });

            Alert.alert(
              "Quiz Submitted!",
              `Your score: ${score}/${quiz.questions.length}\n\n` +
                `Correct: ${score}\n` +
                `Incorrect: ${quiz.questions.length - score}\n` +
                `Percentage: ${Math.round(
                  (score / quiz.questions.length) * 100
                )}%`,
              [{ text: "OK", onPress: () => router.back() }]
            );
          },
        },
      ]
    );
  };

  const currentQ = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;
  const answeredCount = Object.keys(answers).length;

  const styles = getStyles(theme);

  return (
    <View style={styles.container}>
      {/* Header with Timer */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            Alert.alert(
              "Exit Quiz?",
              "Your progress will be lost. Are you sure?",
              [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Exit",
                  style: "destructive",
                  onPress: () => router.back(),
                },
              ]
            );
          }}
          style={styles.backButton}
        >
          <Ionicons name="close" size={24} color={theme.colors.danger} />
        </TouchableOpacity>

        <View style={styles.timerContainer}>
          <Ionicons
            name="time"
            size={20}
            color={timeRemaining < 60 ? "#dc2626" : theme.colors.primary}
          />
          <Text
            style={[
              styles.timerText,
              timeRemaining < 60 && styles.timerWarning,
            ]}
          >
            {formatTime(timeRemaining)}
          </Text>
        </View>

        <View style={styles.scoreContainer}>
          <Text style={styles.scoreText}>
            {answeredCount}/{quiz.questions.length}
          </Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressText}>
          Question {currentQuestion + 1} of {quiz.questions.length}
        </Text>
      </View>

      {/* Main Content */}
      <ScrollView style={styles.content}>
        {/* Question */}
        <View style={styles.questionCard}>
          <Text style={styles.questionNumber}>
            Question {currentQuestion + 1}
          </Text>
          <Text style={styles.questionText}>{currentQ.question}</Text>
        </View>

        {/* Options */}
        <View style={styles.optionsContainer}>
          {currentQ.options.map((option, index) => {
            const isSelected = answers[currentQ.id] === index;
            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionCard,
                  isSelected && styles.optionCardSelected,
                ]}
                onPress={() => handleAnswerSelect(currentQ.id, index)}
              >
                <View
                  style={[
                    styles.optionRadio,
                    isSelected && styles.optionRadioSelected,
                  ]}
                >
                  {isSelected && <View style={styles.optionRadioInner} />}
                </View>
                <Text
                  style={[
                    styles.optionText,
                    isSelected && styles.optionTextSelected,
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Question Navigator */}
        <View style={styles.navigator}>
          <Text style={styles.navigatorTitle}>All Questions</Text>
          <View style={styles.questionNumbers}>
            {quiz.questions.map((q, index) => (
              <TouchableOpacity
                key={q.id}
                style={[
                  styles.questionNumberButton,
                  answers[q.id] !== undefined &&
                    styles.questionNumberButtonAnswered,
                  index === currentQuestion &&
                    styles.questionNumberButtonActive,
                ]}
                onPress={() => setCurrentQuestion(index)}
              >
                <Text
                  style={[
                    styles.questionNumberText,
                    (answers[q.id] !== undefined ||
                      index === currentQuestion) &&
                      styles.questionNumberTextActive,
                  ]}
                >
                  {index + 1}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={[
            styles.navButton,
            currentQuestion === 0 && styles.navButtonDisabled,
          ]}
          onPress={handlePrevious}
          disabled={currentQuestion === 0}
        >
          <Ionicons name="chevron-back" size={20} color="#fff" />
          <Text style={styles.navButtonText}>Previous</Text>
        </TouchableOpacity>

        {currentQuestion === quiz.questions.length - 1 ? (
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmitQuiz}
          >
            <Text style={styles.submitButtonText}>Submit Quiz</Text>
            <Ionicons name="checkmark-circle" size={20} color="#fff" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.navButton} onPress={handleNext}>
            <Text style={styles.navButtonText}>Next</Text>
            <Ionicons name="chevron-forward" size={20} color="#fff" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 16,
      paddingTop: 60,
      backgroundColor: theme.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    backButton: {
      padding: 4,
    },
    timerContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.background,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      gap: 8,
    },
    timerText: {
      fontSize: 18,
      fontWeight: "700",
      color: theme.colors.text,
    },
    timerWarning: {
      color: "#dc2626",
    },
    scoreContainer: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
    },
    scoreText: {
      color: "#fff",
      fontSize: 14,
      fontWeight: "700",
    },
    progressContainer: {
      padding: 16,
      backgroundColor: theme.colors.surface,
    },
    progressBar: {
      height: 8,
      backgroundColor: theme.colors.border,
      borderRadius: 4,
      overflow: "hidden",
      marginBottom: 8,
    },
    progressFill: {
      height: "100%",
      backgroundColor: theme.colors.primary,
    },
    progressText: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      textAlign: "center",
    },
    content: {
      flex: 1,
      padding: 20,
    },
    questionCard: {
      backgroundColor: theme.colors.surface,
      padding: 24,
      borderRadius: 12,
      marginBottom: 24,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    questionNumber: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.colors.primary,
      marginBottom: 12,
    },
    questionText: {
      fontSize: 20,
      fontWeight: "600",
      color: theme.colors.text,
      lineHeight: 28,
    },
    optionsContainer: {
      gap: 12,
      marginBottom: 24,
    },
    optionCard: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.surface,
      padding: 16,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: theme.colors.border,
    },
    optionCardSelected: {
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.primary + "10",
    },
    optionRadio: {
      width: 24,
      height: 24,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: theme.colors.border,
      marginRight: 12,
      justifyContent: "center",
      alignItems: "center",
    },
    optionRadioSelected: {
      borderColor: theme.colors.primary,
    },
    optionRadioInner: {
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: theme.colors.primary,
    },
    optionText: {
      flex: 1,
      fontSize: 16,
      color: theme.colors.text,
    },
    optionTextSelected: {
      fontWeight: "600",
      color: theme.colors.primary,
    },
    navigator: {
      backgroundColor: theme.colors.surface,
      padding: 20,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.colors.border,
      marginBottom: 100,
    },
    navigatorTitle: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.colors.text,
      marginBottom: 12,
    },
    questionNumbers: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
    },
    questionNumberButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.background,
      borderWidth: 2,
      borderColor: theme.colors.border,
      justifyContent: "center",
      alignItems: "center",
    },
    questionNumberButtonAnswered: {
      backgroundColor: theme.colors.success + "20",
      borderColor: theme.colors.success,
    },
    questionNumberButtonActive: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    questionNumberText: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.colors.textSecondary,
    },
    questionNumberTextActive: {
      color: "#fff",
    },
    bottomNav: {
      flexDirection: "row",
      padding: 16,
      gap: 12,
      backgroundColor: theme.colors.surface,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
    },
    navButton: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colors.primary,
      paddingVertical: 14,
      borderRadius: 8,
      gap: 8,
    },
    navButtonDisabled: {
      backgroundColor: theme.colors.textSecondary,
      opacity: 0.5,
    },
    navButtonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "700",
    },
    submitButton: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colors.success,
      paddingVertical: 14,
      borderRadius: 8,
      gap: 8,
    },
    submitButtonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "700",
    },
  });
