import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "../../contexts/ThemeContext";

// --- MOCK DATA ---
const MOCK_CLASSROOMS = [
  {
    id: 123,
    name: "Advanced React Development",
    teacherName: "Prof. Anuvat",
    classCode: "R7H12K",
    studentCount: 45,
  },
  {
    id: 456,
    name: "Introduction to JavaScript",
    teacherName: "Dr. Code",
    classCode: "A9B3C7",
    studentCount: 60,
  },
  {
    id: 789,
    name: "Database Systems 101",
    teacherName: "Mr. SQL",
    classCode: "L2T4P6",
    studentCount: 30,
  },
];

// --- Class Card Component (Now accepts 'styles' as a prop) ---
const ClassroomCard = (
  { classroom, onPress, theme, styles } // <-- FIX HERE: Added 'styles' to props
) => (
  <TouchableOpacity
    onPress={() => onPress(classroom)}
    style={[
      // Access styles from the prop
      styles.card,
      {
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.border,
      },
    ]}
    activeOpacity={0.7}
  >
    <View style={styles.cardContent}>
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: theme.colors.primary + "20" },
        ]}
      >
        <Ionicons name="book" size={32} color={theme.colors.primary} />
      </View>
      <View style={styles.cardText}>
        <Text
          style={[styles.cardTitle, { color: theme.colors.text }]}
          numberOfLines={1}
        >
          {classroom.name}
        </Text>
        <Text
          style={[styles.cardSubtitle, { color: theme.colors.textSecondary }]}
        >
          Teacher: {classroom.teacherName}
        </Text>
      </View>
    </View>
    <View style={styles.cardRight}>
      <View style={styles.studentCount}>
        <Ionicons name="person" size={16} color={theme.colors.textSecondary} />
        <Text
          style={[
            styles.studentCountText,
            { color: theme.colors.textSecondary },
          ]}
        >
          {classroom.studentCount}
        </Text>
      </View>
      <Ionicons
        name="chevron-forward"
        size={20}
        color={theme.colors.textSecondary}
      />
    </View>
  </TouchableOpacity>
);

// --- Main Screen Component ---
export default function ClassroomsScreen() {
  const router = useRouter();
  // Get theme object from context
  const { theme } = useTheme();

  const handleClassroomClick = (classroom) => {
    router.push({
      pathname: "/classroom-detail",
      params: { classroomData: JSON.stringify(classroom) },
    });
  };

  // Create the styles object using the theme
  const styles = getStyles(theme); // <-- STYLES ARE CREATED HERE

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>My Classes</Text>
          <Text style={styles.headerSubtitle}>
            {MOCK_CLASSROOMS.length} enrolled classes
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => router.push("/join-classroom")}
          style={styles.addButton}
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {MOCK_CLASSROOMS.map((classroom) => (
          <ClassroomCard
            key={classroom.id}
            classroom={classroom}
            onPress={handleClassroomClick}
            theme={theme}
            styles={styles} // <-- FIX HERE: Passing styles down to the card
          />
        ))}
      </ScrollView>
    </View>
  );
}

// --- Style Generator Function (Remains the same) ---
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
      padding: 20,
      paddingTop: 60,
      backgroundColor: theme.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: "800",
      color: theme.colors.text,
    },
    headerSubtitle: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginTop: 4,
    },
    addButton: {
      backgroundColor: theme.colors.primary,
      width: 48,
      height: 48,
      borderRadius: 24,
      justifyContent: "center",
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    content: {
      flex: 1,
      padding: 20,
    },
    card: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 20,
      borderRadius: 12,
      marginBottom: 16,
      borderWidth: 1,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 4,
    },
    cardContent: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    iconContainer: {
      borderRadius: 8,
      padding: 8,
      marginRight: 16,
    },
    cardText: {
      flex: 1,
    },
    cardTitle: {
      fontSize: 18,
      fontWeight: "700",
    },
    cardSubtitle: {
      fontSize: 14,
      marginTop: 2,
    },
    cardRight: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    studentCount: {
      flexDirection: "row",
      alignItems: "center",
      marginRight: 8,
    },
    studentCountText: {
      fontSize: 14,
      marginLeft: 4,
    },
  });
