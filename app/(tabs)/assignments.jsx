import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "../../contexts/ThemeContext";

export default function AssignmentsScreen() {
  const { theme } = useTheme();
  const [filter, setFilter] = useState("all");

  const assignments = [
    {
      id: 1,
      title: "State Management Deep Dive",
      class: "Advanced React Development",
      dueDate: "2024-11-15",
      status: "pending",
      priority: "high",
    },
    {
      id: 2,
      title: "Component Lifecycle Essay",
      class: "Advanced React Development",
      dueDate: "2024-11-01",
      status: "completed",
      priority: "medium",
    },
    {
      id: 3,
      title: "Final Project Planning",
      class: "Advanced React Development",
      dueDate: "2024-12-05",
      status: "pending",
      priority: "high",
    },
    {
      id: 4,
      title: "JavaScript Basics Quiz",
      class: "Introduction to JavaScript",
      dueDate: "2024-11-20",
      status: "pending",
      priority: "low",
    },
    {
      id: 5,
      title: "Database Design Project",
      class: "Database Systems 101",
      dueDate: "2024-11-18",
      status: "completed",
      priority: "high",
    },
  ];

  const filteredAssignments = assignments.filter((assignment) => {
    if (filter === "pending") return assignment.status === "pending";
    if (filter === "completed") return assignment.status === "completed";
    return true;
  });

  const stats = {
    total: assignments.length,
    pending: assignments.filter((a) => a.status === "pending").length,
    completed: assignments.filter((a) => a.status === "completed").length,
  };

  const styles = getStyles(theme);

  const AssignmentCard = ({ assignment }) => {
    const isPending = assignment.status === "pending";
    const priorityColors = {
      high: "#dc2626",
      medium: "#f59e0b",
      low: "#16a34a",
    };

    return (
      <TouchableOpacity style={styles.assignmentCard}>
        <View style={styles.assignmentHeader}>
          <View
            style={[
              styles.statusIndicator,
              {
                backgroundColor: isPending
                  ? priorityColors[assignment.priority] + "20"
                  : theme.colors.success + "20",
              },
            ]}
          >
            <Ionicons
              name={isPending ? "time" : "checkmark-circle"}
              size={24}
              color={
                isPending
                  ? priorityColors[assignment.priority]
                  : theme.colors.success
              }
            />
          </View>
          <View style={styles.assignmentInfo}>
            <Text style={styles.assignmentTitle}>{assignment.title}</Text>
            <Text style={styles.assignmentClass}>{assignment.class}</Text>
          </View>
        </View>

        <View style={styles.assignmentFooter}>
          <View style={styles.dueDate}>
            <Ionicons
              name="calendar"
              size={14}
              color={theme.colors.textSecondary}
            />
            <Text style={styles.dueDateText}>Due: {assignment.dueDate}</Text>
          </View>
          <View
            style={[
              styles.priorityBadge,
              { backgroundColor: priorityColors[assignment.priority] + "20" },
            ]}
          >
            <Text
              style={[
                styles.priorityText,
                { color: priorityColors[assignment.priority] },
              ]}
            >
              {assignment.priority.toUpperCase()}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Assignments</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="options" size={24} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.total}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={[styles.statCard, styles.statCardPending]}>
          <Text style={styles.statValuePending}>{stats.pending}</Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
        <View style={[styles.statCard, styles.statCardCompleted]}>
          <Text style={styles.statValueCompleted}>{stats.completed}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
      </View>

      <View style={styles.filterTabs}>
        <TouchableOpacity
          style={[styles.filterTab, filter === "all" && styles.filterTabActive]}
          onPress={() => setFilter("all")}
        >
          <Text
            style={[
              styles.filterTabText,
              filter === "all" && styles.filterTabTextActive,
            ]}
          >
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterTab,
            filter === "pending" && styles.filterTabActive,
          ]}
          onPress={() => setFilter("pending")}
        >
          <Text
            style={[
              styles.filterTabText,
              filter === "pending" && styles.filterTabTextActive,
            ]}
          >
            Pending
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterTab,
            filter === "completed" && styles.filterTabActive,
          ]}
          onPress={() => setFilter("completed")}
        >
          <Text
            style={[
              styles.filterTabText,
              filter === "completed" && styles.filterTabTextActive,
            ]}
          >
            Completed
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {filteredAssignments.map((assignment) => (
          <AssignmentCard key={assignment.id} assignment={assignment} />
        ))}
      </ScrollView>
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
    filterButton: {
      padding: 8,
    },
    statsContainer: {
      flexDirection: "row",
      padding: 20,
      gap: 12,
      backgroundColor: theme.colors.surface,
    },
    statCard: {
      flex: 1,
      backgroundColor: theme.colors.background,
      padding: 16,
      borderRadius: 12,
      alignItems: "center",
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    statCardPending: {
      backgroundColor: "#fef3c7",
      borderColor: "#f59e0b",
    },
    statCardCompleted: {
      backgroundColor: "#dcfce7",
      borderColor: "#16a34a",
    },
    statValue: {
      fontSize: 24,
      fontWeight: "700",
      color: theme.colors.text,
      marginBottom: 4,
    },
    statValuePending: {
      fontSize: 24,
      fontWeight: "700",
      color: "#f59e0b",
      marginBottom: 4,
    },
    statValueCompleted: {
      fontSize: 24,
      fontWeight: "700",
      color: "#16a34a",
      marginBottom: 4,
    },
    statLabel: {
      fontSize: 12,
      color: theme.colors.textSecondary,
    },
    filterTabs: {
      flexDirection: "row",
      padding: 20,
      gap: 8,
    },
    filterTab: {
      flex: 1,
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 8,
      backgroundColor: theme.colors.surface,
      alignItems: "center",
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    filterTabActive: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    filterTabText: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.colors.text,
    },
    filterTabTextActive: {
      color: "#fff",
    },
    content: {
      flex: 1,
      padding: 20,
      paddingTop: 0,
    },
    assignmentCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: theme.colors.border,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    assignmentHeader: {
      flexDirection: "row",
      marginBottom: 12,
    },
    statusIndicator: {
      width: 48,
      height: 48,
      borderRadius: 24,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
    },
    assignmentInfo: {
      flex: 1,
    },
    assignmentTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.colors.text,
      marginBottom: 4,
    },
    assignmentClass: {
      fontSize: 13,
      color: theme.colors.textSecondary,
    },
    assignmentFooter: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    dueDate: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },
    dueDateText: {
      fontSize: 13,
      color: theme.colors.textSecondary,
    },
    priorityBadge: {
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 12,
    },
    priorityText: {
      fontSize: 11,
      fontWeight: "700",
    },
  });
