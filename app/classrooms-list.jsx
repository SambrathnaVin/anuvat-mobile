import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

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

const ClassroomCard = ({ classroom, onPress }) => (
  <TouchableOpacity
    onPress={() => onPress(classroom)}
    style={styles.card}
    activeOpacity={0.7}
  >
    <View style={styles.cardContent}>
      <View style={styles.iconContainer}>
        <Ionicons name="book" size={32} color="#2563eb" />
      </View>
      <View style={styles.cardText}>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {classroom.name}
        </Text>
        <Text style={styles.cardSubtitle}>
          Teacher: {classroom.teacherName}
        </Text>
      </View>
    </View>
    <View style={styles.cardRight}>
      <View style={styles.studentCount}>
        <Ionicons name="person" size={16} color="#6b7280" />
        <Text style={styles.studentCountText}>{classroom.studentCount}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
    </View>
  </TouchableOpacity>
);

export default function ClassroomsListScreen() {
  const router = useRouter();
  const userName = "Student Doe";

  const handleLogout = () => {
    Alert.alert("Logging Out", "Goodbye!");
    router.replace("/");
  };

  const handleClassroomClick = (classroom) => {
    router.push({
      pathname: "/classroom-detail",
      params: { classroomData: JSON.stringify(classroom) },
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>
              👋 Welcome, {userName.split(" ")[0]}
            </Text>
            <Text style={styles.headerSubtitle}>Your Enrolled Classrooms</Text>
          </View>
          <View style={styles.headerButtons}>
            <TouchableOpacity
              onPress={() => router.push("/profile")}
              style={styles.profileButton}
            >
              <Ionicons name="person-circle" size={28} color="#2563eb" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleLogout}
              style={styles.logoutButton}
            >
              <Ionicons name="log-out" size={24} color="#dc2626" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Join Class Button */}
        <TouchableOpacity
          onPress={() => router.push("/join-classroom")}
          style={styles.joinButton}
        >
          <Ionicons name="add-circle" size={24} color="#fff" />
          <Text style={styles.joinButtonText}>Join a New Class</Text>
        </TouchableOpacity>

        {/* Classrooms List */}
        {MOCK_CLASSROOMS.map((classroom) => (
          <ClassroomCard
            key={classroom.id}
            classroom={classroom}
            onPress={handleClassroomClick}
          />
        ))}

        <Text style={styles.footerText}>You are logged in as {userName}.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
  },
  content: {
    padding: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 32,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1f2937",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 4,
  },
  logoutButton: {
    padding: 12,
    borderRadius: 50,
    backgroundColor: "#fee2e2",
  },
  joinButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#16a34a",
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  joinButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginLeft: 8,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
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
    backgroundColor: "#eff6ff",
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
    color: "#1f2937",
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#6b7280",
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
    color: "#6b7280",
    marginLeft: 4,
  },
  footerText: {
    textAlign: "center",
    fontSize: 12,
    color: "#6b7280",
    marginTop: 40,
  },
});
