import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

const mockJoinClassroom = async (classCode) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (classCode.length === 6 && classCode.toUpperCase() === "R7H12K") {
        resolve({
          success: true,
          message: `Successfully joined classroom ${classCode}.`,
          data: { id: 123, name: "Advanced React Development" },
        });
      } else {
        resolve({
          success: false,
          message: "Invalid classroom code or the class is full.",
        });
      }
    }, 1500);
  });
};

export default function JoinClassroomScreen() {
  const router = useRouter();
  const [classCode, setClassCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: "", text: "" });

  const handleJoin = async () => {
    if (classCode.length !== 6) {
      setStatusMessage({
        type: "error",
        text: "Please enter a valid 6-character classroom code.",
      });
      return;
    }

    setLoading(true);
    setStatusMessage({ type: "", text: "" });

    const result = await mockJoinClassroom(classCode.toUpperCase());
    setLoading(false);

    if (result.success) {
      setStatusMessage({
        type: "success",
        text: `Successfully joined ${result.data.name}!`,
      });
      setTimeout(() => {
        Alert.alert(
          "Joined Class",
          `You are now enrolled in ${result.data.name}.`
        );
        router.back();
      }, 2000);
    } else {
      setStatusMessage({ type: "error", text: result.message });
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.card}>
            <View style={styles.header}>
              <View style={styles.iconContainer}>
                <Ionicons name="key" size={48} color="#16a34a" />
              </View>
              <Text style={styles.title}>Join a Classroom</Text>
              <Text style={styles.subtitle}>
                Enter the 6-character code provided by your teacher.
              </Text>
            </View>

            <View style={styles.form}>
              <View style={styles.inputWrapper}>
                <Ionicons
                  name="keypad"
                  size={20}
                  color="#9ca3af"
                  style={styles.inputIcon}
                />
                <TextInput
                  placeholder="Enter Class Code (e.g., R7H12K)"
                  value={classCode}
                  onChangeText={(text) =>
                    setClassCode(text.slice(0, 6).toUpperCase())
                  }
                  style={styles.input}
                  maxLength={6}
                  editable={!loading}
                  autoCapitalize="characters"
                />
              </View>

              {statusMessage.text && (
                <View
                  style={[
                    styles.statusContainer,
                    statusMessage.type === "error"
                      ? styles.statusError
                      : styles.statusSuccess,
                  ]}
                >
                  <Ionicons
                    name={
                      statusMessage.type === "error"
                        ? "alert-circle"
                        : "checkmark-circle"
                    }
                    size={20}
                    color={
                      statusMessage.type === "error" ? "#b91c1c" : "#15803d"
                    }
                  />
                  <Text
                    style={[
                      styles.statusText,
                      statusMessage.type === "error"
                        ? styles.statusTextError
                        : styles.statusTextSuccess,
                    ]}
                  >
                    {statusMessage.text}
                  </Text>
                </View>
              )}

              <TouchableOpacity
                onPress={handleJoin}
                style={[
                  styles.joinButton,
                  (loading || classCode.length !== 6) &&
                    styles.joinButtonDisabled,
                ]}
                disabled={loading || classCode.length !== 6}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Ionicons name="add" size={20} color="#fff" />
                )}
                <Text style={styles.joinButtonText}>
                  {loading ? "Joining..." : "Join Class"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => router.back()}
                style={styles.cancelButton}
              >
                <Text style={styles.cancelButtonText}>Cancel and Go Back</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.helpText}>
            Use code R7H12K to test the mock join.
          </Text>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    paddingBottom: 40,
  },
  card: {
    width: "100%",
    maxWidth: 500,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  iconContainer: {
    backgroundColor: "#dcfce7",
    borderRadius: 50,
    padding: 12,
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1f2937",
  },
  subtitle: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    marginTop: 4,
  },
  form: {
    gap: 24,
  },
  inputWrapper: {
    position: "relative",
  },
  inputIcon: {
    position: "absolute",
    left: 12,
    top: 14,
    zIndex: 10,
  },
  input: {
    width: "100%",
    paddingLeft: 40,
    paddingRight: 16,
    paddingVertical: 12,
    borderWidth: 2,
    borderColor: "#d1d5db",
    borderRadius: 8,
    fontSize: 18,
    textAlign: "center",
    letterSpacing: 4,
    textTransform: "uppercase",
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  statusError: {
    backgroundColor: "#fee2e2",
  },
  statusSuccess: {
    backgroundColor: "#dcfce7",
  },
  statusText: {
    fontSize: 13,
    fontWeight: "500",
    flex: 1,
  },
  statusTextError: {
    color: "#b91c1c",
  },
  statusTextSuccess: {
    color: "#15803d",
  },
  joinButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#16a34a",
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  joinButtonDisabled: {
    backgroundColor: "#9ca3af",
  },
  joinButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 8,
  },
  cancelButton: {
    alignItems: "center",
    paddingTop: 8,
  },
  cancelButtonText: {
    fontSize: 14,
    color: "#2563eb",
  },
  helpText: {
    textAlign: "center",
    fontSize: 12,
    color: "#6b7280",
    marginTop: 24,
  },
});
