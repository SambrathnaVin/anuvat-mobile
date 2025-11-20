import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { theme } = useTheme();

  const styles = getStyles(theme);

  const quickActions = [
    {
      id: 1,
      title: "Live Quiz",
      icon: "stopwatch",
      color: "#dc2626",
      onPress: () => router.push("/live-quiz"),
    },
    {
      id: 2,
      title: "Join Class",
      icon: "add-circle",
      color: "#16a34a",
      onPress: () => router.push("/join-classroom"),
    },
    {
      id: 3,
      title: "My Classes",
      icon: "book",
      color: "#2563eb",
      onPress: () => router.push("/(tabs)/classrooms"),
    },
    {
      id: 4,
      title: "Profile",
      icon: "person-circle",
      color: "#8b5cf6",
      onPress: () => router.push("/(tabs)/profile"),
    },
  ];

  const upcomingAssignments = [
    {
      id: 1,
      title: "State Management Deep Dive",
      class: "React Dev",
      due: "Nov 15",
    },
    {
      id: 2,
      title: "Final Project Planning",
      class: "React Dev",
      due: "Dec 5",
    },
  ];

  const recentAnnouncements = [
    {
      id: 1,
      class: "React Dev",
      text: "New assignment posted",
      time: "2h ago",
    },
    {
      id: 2,
      class: "JavaScript 101",
      text: "Class rescheduled",
      time: "5h ago",
    },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>
            Hello, {user?.name?.split(" ")[0] || "Student"}! 
          </Text>
          <Text style={styles.subGreeting}>Welcome back to Anuvat</Text>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Ionicons name="notifications" size={24} color={theme.colors.text} />
          <View style={styles.badge}>
            <Text style={styles.badgeText}>3</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsGrid}>
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.id}
              style={styles.quickActionCard}
              onPress={action.onPress}
            >
              <View
                style={[
                  styles.quickActionIcon,
                  { backgroundColor: action.color + "20" },
                ]}
              >
                <Ionicons name={action.icon} size={28} color={action.color} />
              </View>
              <Text style={styles.quickActionTitle}>{action.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Upcoming Assignments */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Upcoming Assignments</Text>
          <TouchableOpacity onPress={() => router.push("/(tabs)/assignments")}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        {upcomingAssignments.map((assignment) => (
          <View key={assignment.id} style={styles.assignmentCard}>
            <View style={styles.assignmentIcon}>
              <Ionicons name="document-text" size={20} color="#f59e0b" />
            </View>
            <View style={styles.assignmentContent}>
              <Text style={styles.assignmentTitle}>{assignment.title}</Text>
              <Text style={styles.assignmentClass}>{assignment.class}</Text>
            </View>
            <View style={styles.assignmentDue}>
              <Ionicons
                name="calendar"
                size={14}
                color={theme.colors.textSecondary}
              />
              <Text style={styles.assignmentDueText}>{assignment.due}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Recent Announcements */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Announcements</Text>
        {recentAnnouncements.map((announcement) => (
          <View key={announcement.id} style={styles.announcementCard}>
            <View style={styles.announcementIcon}>
              <Ionicons
                name="megaphone"
                size={18}
                color={theme.colors.primary}
              />
            </View>
            <View style={styles.announcementContent}>
              <Text style={styles.announcementClass}>{announcement.class}</Text>
              <Text style={styles.announcementText}>{announcement.text}</Text>
            </View>
            <Text style={styles.announcementTime}>{announcement.time}</Text>
          </View>
        ))}
      </View>

      {/* Stats */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Stats</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>3</Text>
            <Text style={styles.statLabel}>Enrolled Classes</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>5</Text>
            <Text style={styles.statLabel}>Pending Tasks</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
        </View>
      </View>
    </ScrollView>
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
      padding: 20,
      paddingTop: 60,
      backgroundColor: theme.colors.surface,
    },
    greeting: {
      fontSize: 24,
      fontWeight: "700",
      color: theme.colors.text,
    },
    subGreeting: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginTop: 4,
    },
    notificationButton: {
      position: "relative",
      padding: 8,
    },
    badge: {
      position: "absolute",
      top: 4,
      right: 4,
      backgroundColor: "#dc2626",
      borderRadius: 10,
      width: 20,
      height: 20,
      justifyContent: "center",
      alignItems: "center",
    },
    badgeText: {
      color: "#fff",
      fontSize: 10,
      fontWeight: "700",
    },
    section: {
      padding: 20,
    },
    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: theme.colors.text,
    },
    seeAllText: {
      fontSize: 14,
      color: theme.colors.primary,
      fontWeight: "600",
    },
    quickActionsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 12,
      marginTop: 16,
    },
    quickActionCard: {
      width: "48%",
      backgroundColor: theme.colors.surface,
      padding: 16,
      borderRadius: 12,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    quickActionIcon: {
      width: 56,
      height: 56,
      borderRadius: 28,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 8,
    },
    quickActionTitle: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.colors.text,
      textAlign: "center",
    },
    assignmentCard: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.surface,
      padding: 16,
      borderRadius: 12,
      marginBottom: 12,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    assignmentIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: "#fef3c7",
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
    },
    assignmentContent: {
      flex: 1,
    },
    assignmentTitle: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.colors.text,
      marginBottom: 4,
    },
    assignmentClass: {
      fontSize: 12,
      color: theme.colors.textSecondary,
    },
    assignmentDue: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    assignmentDueText: {
      fontSize: 12,
      color: theme.colors.textSecondary,
    },
    announcementCard: {
      flexDirection: "row",
      alignItems: "flex-start",
      backgroundColor: theme.colors.surface,
      padding:16,
      borderRadius: 12,
      marginBottom: 12,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    announcementIcon: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: theme.colors.primary + "20",
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
    },
    announcementContent: {
      flex: 1,
    },
    announcementClass: {
      fontSize: 13,
      fontWeight: "600",
      color: theme.colors.text,
      marginBottom: 4,
    },
    announcementText: {
      fontSize: 13,
      color: theme.colors.textSecondary,
    },
    announcementTime: {
      fontSize: 11,
      color: theme.colors.textSecondary,
    },
    statsGrid: {
      flexDirection: "row",
      gap: 12,
      marginTop: 16,
    },
    statCard: {
      flex: 1,
      backgroundColor: theme.colors.surface,
      padding: 16,
      borderRadius: 12,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    statValue: {
      fontSize: 28,
      fontWeight: "700",
      color: theme.colors.primary,
      marginBottom: 4,
    },
    statLabel: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      textAlign: "center",
    },
  });
