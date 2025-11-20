import { Ionicons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";

export default function LiveQuizScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { user } = useAuth();

  const [quizCode, setQuizCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  const handleJoinQuiz = async (code) => {
    const upperCode = code.toUpperCase();

    if (upperCode.length !== 6) {
      Alert.alert("Invalid Code", "Please enter a valid 6-digit quiz code.");
      return;
    }

    setLoading(true);

    // Mock API call to validate quiz code
    setTimeout(() => {
      setLoading(false);
      if (upperCode === "QUIZ01") {
        Alert.alert("Success!", "Joining quiz...", [
          {
            text: "Start",
            onPress: () => {
              router.push({
                pathname: "/quiz-session",
                params: { quizCode: upperCode },
              });
            },
          },
        ]);
      } else {
        Alert.alert(
          "Invalid Quiz Code",
          "The quiz code you entered is not valid or the quiz is not active."
        );
      }
    }, 1000);
  };

  const handleManualJoin = () => {
    handleJoinQuiz(quizCode);
  };

  const handleOpenScanner = async () => {
    if (!permission) {
      const result = await requestPermission();
      if (!result.granted) {
        Alert.alert(
          "Camera Permission Required",
          "Please enable camera access to scan QR codes.",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Settings", onPress: () => requestPermission() },
          ]
        );
        return;
      }
    }

    if (!permission.granted) {
      const result = await requestPermission();
      if (!result.granted) {
        return;
      }
    }

    setScanned(false);
    setShowScanner(true);
  };

  const handleBarcodeScanned = ({ data }) => {
    if (scanned) return;

    setScanned(true);
    setShowScanner(false);

    // Extract quiz code from QR data
    // Assuming QR code contains just the quiz code or URL with code
    let code = data;

    // If it's a URL, extract the code
    if (data.includes("quiz=")) {
      code = data.split("quiz=")[1].split("&")[0];
    } else if (data.includes("/")) {
      code = data.split("/").pop();
    }

    setQuizCode(code.toUpperCase());

    // Auto-join after scanning
    handleJoinQuiz(code);
  };

  const styles = getStyles(theme);

  if (permission === null) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading camera...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Join Live Quiz</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        {/* Icon */}
        <View style={styles.iconContainer}>
          <Ionicons name="qr-code" size={100} color={theme.colors.primary} />
        </View>

        {/* Title */}
        <Text style={styles.title}>Scan QR Code or Enter Code</Text>
        <Text style={styles.subtitle}>
          Scan the QR code displayed by your teacher or enter the code manually
        </Text>

        {/* QR Scanner Button */}
        <TouchableOpacity style={styles.scanButton} onPress={handleOpenScanner}>
          <Ionicons name="scan" size={28} color="#fff" />
          <Text style={styles.scanButtonText}>Scan QR Code</Text>
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Manual Code Input */}
        <Text style={styles.inputLabel}>Enter Quiz Code Manually</Text>
        <View style={styles.codeInputContainer}>
          <View style={styles.inputWrapper}>
            <Ionicons
              name="keypad"
              size={20}
              color={theme.colors.textSecondary}
              style={styles.inputIcon}
            />
            <TextInput
              placeholder="e.g., QUIZ01"
              value={quizCode}
              onChangeText={(text) =>
                setQuizCode(text.slice(0, 6).toUpperCase())
              }
              style={styles.codeInput}
              maxLength={6}
              autoCapitalize="characters"
              editable={!loading}
            />
          </View>
        </View>

        {/* Join Button */}
        <TouchableOpacity
          style={[
            styles.joinButton,
            (loading || quizCode.length !== 6) && styles.joinButtonDisabled,
          ]}
          onPress={handleManualJoin}
          disabled={loading || quizCode.length !== 6}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              <Ionicons name="play-circle" size={24} color="#fff" />
              <Text style={styles.joinButtonText}>Join Quiz</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Instructions */}
        <View style={styles.instructionsCard}>
          <Text style={styles.instructionsTitle}>📱 How to Join</Text>
          <View style={styles.instructionItem}>
            <Ionicons name="ellipse" size={8} color={theme.colors.primary} />
            <Text style={styles.instructionText}>
              Scan the QR code shown on the projector/screen
            </Text>
          </View>
          <View style={styles.instructionItem}>
            <Ionicons name="ellipse" size={8} color={theme.colors.primary} />
            <Text style={styles.instructionText}>
              Or ask your teacher for the 6-digit code
            </Text>
          </View>
          <View style={styles.instructionItem}>
            <Ionicons name="ellipse" size={8} color={theme.colors.primary} />
            <Text style={styles.instructionText}>
              Complete the quiz before time runs out
            </Text>
          </View>
        </View>

        <Text style={styles.helpText}>Test code: QUIZ01</Text>
      </View>

      {/* QR Scanner Modal */}
      <Modal
        visible={showScanner}
        animationType="slide"
        onRequestClose={() => setShowScanner(false)}
      >
        <View style={styles.scannerContainer}>
          <CameraView
            style={styles.camera}
            facing="back"
            onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
            barcodeScannerSettings={{
              barcodeTypes: ["qr"],
            }}
          >
            <View style={styles.scannerOverlay}>
              {/* Header */}
              <View style={styles.scannerHeader}>
                <TouchableOpacity
                  onPress={() => setShowScanner(false)}
                  style={styles.scannerCloseButton}
                >
                  <Ionicons name="close" size={28} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.scannerTitle}>Scan Quiz QR Code</Text>
                <View style={{ width: 40 }} />
              </View>

              {/* Scanning Frame */}
              <View style={styles.scanningArea}>
                <View style={styles.scanFrame}>
                  {/* Corner decorations */}
                  <View style={[styles.corner, styles.cornerTopLeft]} />
                  <View style={[styles.corner, styles.cornerTopRight]} />
                  <View style={[styles.corner, styles.cornerBottomLeft]} />
                  <View style={[styles.corner, styles.cornerBottomRight]} />

                  {/* Scanning line animation could be added here */}
                </View>
                <Text style={styles.scanInstruction}>
                  Position the QR code within the frame
                </Text>
              </View>

              {/* Manual Entry Button */}
              <View style={styles.scannerFooter}>
                <TouchableOpacity
                  style={styles.manualEntryButton}
                  onPress={() => {
                    setShowScanner(false);
                  }}
                >
                  <Ionicons name="keypad" size={24} color="#fff" />
                  <Text style={styles.manualEntryText}>
                    Enter Code Manually
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </CameraView>
        </View>
      </Modal>
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
      alignItems: "center",
      justifyContent: "space-between",
      padding: 16,
      paddingTop: 60,
      backgroundColor: theme.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    backButton: {
      padding: 4,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: "700",
      color: theme.colors.text,
    },
    content: {
      flex: 1,
      padding: 24,
    },
    iconContainer: {
      alignItems: "center",
      marginVertical: 24,
    },
    title: {
      fontSize: 24,
      fontWeight: "800",
      color: theme.colors.text,
      textAlign: "center",
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      textAlign: "center",
      marginBottom: 32,
      lineHeight: 20,
    },
    scanButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colors.primary,
      paddingVertical: 18,
      borderRadius: 12,
      gap: 12,
      marginBottom: 24,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 5,
    },
    scanButtonText: {
      color: "#fff",
      fontSize: 18,
      fontWeight: "700",
    },
    divider: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: 24,
    },
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: theme.colors.border,
    },
    dividerText: {
      marginHorizontal: 16,
      color: theme.colors.textSecondary,
      fontSize: 14,
      fontWeight: "600",
    },
    inputLabel: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.colors.text,
      marginBottom: 12,
    },
    codeInputContainer: {
      marginBottom: 16,
    },
    inputWrapper: {
      position: "relative",
    },
    inputIcon: {
      position: "absolute",
      left: 16,
      top: 16,
      zIndex: 10,
    },
    codeInput: {
      backgroundColor: theme.colors.surface,
      paddingLeft: 48,
      paddingRight: 16,
      paddingVertical: 16,
      borderRadius: 12,
      fontSize: 18,
      fontWeight: "600",
      textAlign: "center",
      letterSpacing: 4,
      borderWidth: 2,
      borderColor: theme.colors.border,
      color: theme.colors.text,
    },
    joinButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colors.secondary,
      paddingVertical: 16,
      borderRadius: 12,
      gap: 8,
      marginBottom: 24,
    },
    joinButtonDisabled: {
      backgroundColor: theme.colors.textSecondary,
      opacity: 0.5,
    },
    joinButtonText: {
      color: "#fff",
      fontSize: 18,
      fontWeight: "700",
    },
    instructionsCard: {
      backgroundColor: theme.colors.surface,
      padding: 20,
      borderRadius: 12,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    instructionsTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: theme.colors.text,
      marginBottom: 16,
    },
    instructionItem: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 12,
      gap: 12,
    },
    instructionText: {
      fontSize: 13,
      color: theme.colors.textSecondary,
      flex: 1,
    },
    helpText: {
      textAlign: "center",
      fontSize: 12,
      color: theme.colors.textSecondary,
    },
    loadingText: {
      marginTop: 16,
      fontSize: 14,
      color: theme.colors.textSecondary,
    },

    // Scanner Modal Styles
    scannerContainer: {
      flex: 1,
      backgroundColor: "#000",
    },
    camera: {
      flex: 1,
    },
    scannerOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    scannerHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 20,
      paddingTop: 60,
    },
    scannerCloseButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "center",
      alignItems: "center",
    },
    scannerTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: "#fff",
    },
    scanningArea: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    scanFrame: {
      width: 280,
      height: 280,
      position: "relative",
    },
    corner: {
      position: "absolute",
      width: 40,
      height: 40,
      borderColor: "#fff",
    },
    cornerTopLeft: {
      top: 0,
      left: 0,
      borderTopWidth: 4,
      borderLeftWidth: 4,
    },
    cornerTopRight: {
      top: 0,
      right: 0,
      borderTopWidth: 4,
      borderRightWidth: 4,
    },
    cornerBottomLeft: {
      bottom: 0,
      left: 0,
      borderBottomWidth: 4,
      borderLeftWidth: 4,
    },
    cornerBottomRight: {
      bottom: 0,
      right: 0,
      borderBottomWidth: 4,
      borderRightWidth: 4,
    },
    scanInstruction: {
      marginTop: 40,
      fontSize: 16,
      color: "#fff",
      fontWeight: "600",
      textAlign: "center",
      paddingHorizontal: 40,
    },
    scannerFooter: {
      padding: 20,
      paddingBottom: 40,
    },
    manualEntryButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      paddingVertical: 14,
      borderRadius: 12,
      gap: 12,
    },
    manualEntryText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "600",
    },
  });
