import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const MOCK_ASSIGNMENTS = [
  {
    id: 1,
    title: "State Management Deep Dive",
    dueDate: "2024-11-15",
    status: "Due",
  },
  {
    id: 2,
    title: "Component Lifecycle Essay",
    dueDate: "2024-11-01",
    status: "Submitted",
  },
  {
    id: 3,
    title: "Final Project Planning",
    dueDate: "2024-12-05",
    status: "Due",
  },
];

const INITIAL_DISCUSSIONS = [
  {
    id: 101,
    author: "Prof. Anuvat",
    text: "Welcome to the class! Let me know if you have any questions.",
    timestamp: "10:00 AM",
  },
  {
    id: 102,
    author: "Student Doe",
    text: "When is the first assignment due?",
    timestamp: "10:05 AM",
  },
];

const AssignmentCard = ({ assignment }) => {
  const isDue = assignment.status === "Due";
  return (
    <View style={styles.assignmentCard}>
      <Ionicons
        name="document-text"
        size={24}
        color={isDue ? "#2563eb" : "#16a34a"}
        style={styles.assignmentIcon}
      />
      <View style={styles.assignmentContent}>
        <Text style={styles.assignmentTitle}>{assignment.title}</Text>
        <View style={styles.assignmentDate}>
          <Ionicons name="calendar" size={12} color="#6b7280" />
          <Text style={styles.assignmentDateText}>
            Due: {assignment.dueDate}
          </Text>
        </View>
      </View>
      <View
        style={[
          styles.statusBadge,
          isDue ? styles.statusBadgeDue : styles.statusBadgeSubmitted,
        ]}
      >
        <Text
          style={[
            styles.statusText,
            isDue ? styles.statusTextDue : styles.statusTextSubmitted,
          ]}
        >
          {assignment.status}
        </Text>
      </View>
    </View>
  );
};

const DiscussionMessage = ({ message, isCurrentUser }) => (
  <View
    style={[
      styles.messageContainer,
      isCurrentUser ? styles.messageCurrentUser : styles.messageOtherUser,
    ]}
  >
    <View style={styles.messageHeader}>
      <Text
        style={[
          styles.messageAuthor,
          isCurrentUser && styles.messageAuthorCurrent,
        ]}
      >
        {isCurrentUser ? "You" : message.author}
      </Text>
      <Text style={styles.messageTime}>{message.timestamp}</Text>
    </View>
    <Text style={styles.messageText}>{message.text}</Text>
  </View>
);

export default function ClassroomDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const classroom = params.classroomData
    ? JSON.parse(params.classroomData)
    : null;

  const [activeTab, setActiveTab] = useState("assignments");
  const [discussions, setDiscussions] = useState(INITIAL_DISCUSSIONS);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const userName = "Student Doe";

  const handleSend = () => {
    if (newMessage.trim() === "") return;

    setIsSending(true);
    const text = newMessage.trim();
    setNewMessage("");

    setTimeout(() => {
      setDiscussions((prev) => [
        ...prev,
        {
          id: Date.now(),
          author: userName,
          text: text,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
      setIsSending(false);
    }, 500);
  };

  if (!classroom) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Classroom data is unavailable.</Text>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={20} color="#2563eb" />
            <Text style={styles.backButtonText}>Back to List</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backIcon}
            >
              <Ionicons name="arrow-back" size={24} color="#6b7280" />
            </TouchableOpacity>
            <Text style={styles.headerTitle} numberOfLines={1}>
              {classroom.name}
            </Text>
          </View>
          <Text style={styles.headerSubtitle}>
            Teacher: {classroom.teacherName} | Code: {classroom.classCode}
          </Text>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabBar}>
          <TouchableOpacity
            onPress={() => setActiveTab("assignments")}
            style={[
              styles.tab,
              activeTab === "assignments" && styles.tabActive,
            ]}
          >
            <Ionicons
              name="book"
              size={20}
              color={activeTab === "assignments" ? "#2563eb" : "#6b7280"}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === "assignments" && styles.tabTextActive,
              ]}
            >
              Assignments
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab("discussion")}
            style={[styles.tab, activeTab === "discussion" && styles.tabActive]}
          >
            <Ionicons
              name="chatbubbles"
              size={20}
              color={activeTab === "discussion" ? "#2563eb" : "#6b7280"}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === "discussion" && styles.tabTextActive,
              ]}
            >
              Discussion
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content Area */}
        {activeTab === "assignments" ? (
          <ScrollView style={styles.content}>
            {MOCK_ASSIGNMENTS.map((assignment) => (
              <AssignmentCard key={assignment.id} assignment={assignment} />
            ))}
          </ScrollView>
        ) : (
          <View style={styles.discussionContainer}>
            <ScrollView style={styles.discussionScroll}>
              {discussions.map((d) => (
                <DiscussionMessage
                  key={d.id}
                  message={d}
                  isCurrentUser={d.author === userName}
                />
              ))}
            </ScrollView>

            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Type a message..."
                value={newMessage}
                onChangeText={setNewMessage}
                style={styles.messageInput}
                editable={!isSending}
              />
              <TouchableOpacity
                onPress={handleSend}
                style={[
                  styles.sendButton,
                  (isSending || newMessage.trim() === "") &&
                    styles.sendButtonDisabled,
                ]}
                disabled={isSending || newMessage.trim() === ""}
              >
                {isSending ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Ionicons name="send" size={20} color="#fff" />
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#f9fafb",
  },
  errorText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#dc2626",
    marginBottom: 16,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButtonText: {
    color: "#2563eb",
    marginLeft: 4,
  },
  header: {
    backgroundColor: "#fff",
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  backIcon: {
    marginRight: 16,
    padding: 4,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1f2937",
    flex: 1,
  },
  headerSubtitle: {
    fontSize: 12,
    color: "#6b7280",
    marginLeft: 40,
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    gap: 8,
  },
  tabActive: {
    borderBottomWidth: 4,
    borderBottomColor: "#2563eb",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6b7280",
  },
  tabTextActive: {
    color: "#2563eb",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  assignmentCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  assignmentIcon: {
    marginRight: 16,
  },
  assignmentContent: {
    flex: 1,
  },
  assignmentTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
  },
  assignmentDate: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    gap: 4,
  },
  assignmentDateText: {
    fontSize: 12,
    color: "#6b7280",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeDue: {
    backgroundColor: "#fee2e2",
  },
  statusBadgeSubmitted: {
    backgroundColor: "#dcfce7",
  },
  statusText: {
    fontSize: 11,
    fontWeight: "700",
  },
  statusTextDue: {
    color: "#dc2626",
  },
  statusTextSubmitted: {
    color: "#16a34a",
  },
  discussionContainer: {
    flex: 1,
  },
  discussionScroll: {
    flex: 1,
    padding: 16,
  },
  messageContainer: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    maxWidth: "75%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  messageCurrentUser: {
    alignSelf: "flex-end",
    backgroundColor: "#dbeafe",
    borderColor: "#bfdbfe",
    borderWidth: 1,
  },
  messageOtherUser: {
    alignSelf: "flex-start",
    backgroundColor: "#f9fafb",
    borderColor: "#e5e7eb",
    borderWidth: 1,
  },
  messageHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  messageAuthor: {
    fontSize: 11,
    fontWeight: "600",
    color: "#1f2937",
  },
  messageAuthorCurrent: {
    color: "#1e40af",
  },
  messageTime: {
    fontSize: 9,
    color: "#9ca3af",
    marginLeft: 8,
  },
  messageText: {
    fontSize: 14,
    color: "#374151",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  messageInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    fontSize: 14,
  },
  sendButton: {
    backgroundColor: "#2563eb",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonDisabled: {
    backgroundColor: "#9ca3af",
  },
});
