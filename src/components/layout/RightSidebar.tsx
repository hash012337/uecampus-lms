import { AlertCircle, Calendar, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

const upcomingDeadlines = [
  {
    id: 1,
    title: "Data Structures Assignment",
    course: "CS201",
    deadline: "2024-01-20",
    priority: "high",
    hoursLeft: 8,
  },
  {
    id: 2,
    title: "Web Development Project",
    course: "CS301",
    deadline: "2024-01-22",
    priority: "medium",
    hoursLeft: 48,
  },
  {
    id: 3,
    title: "Database Quiz",
    course: "CS202",
    deadline: "2024-01-25",
    priority: "low",
    hoursLeft: 120,
  },
];

const announcements = [
  {
    id: 1,
    title: "Midterm Schedule Released",
    time: "2 hours ago",
    type: "urgent",
  },
  {
    id: 2,
    title: "New Course Materials Available",
    time: "5 hours ago",
    type: "info",
  },
];

export function RightSidebar() {
  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-6">
        {/* Urgent Deadlines */}
        <div>
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Clock className="h-5 w-5 text-accent" />
            Upcoming Deadlines
          </h2>
          <div className="space-y-3">
            {upcomingDeadlines.map((deadline) => (
              <Card
                key={deadline.id}
                className={cn(
                  "p-4 border-l-4 transition-all duration-200 hover:shadow-md",
                  deadline.priority === "high" && "border-l-destructive bg-destructive/5",
                  deadline.priority === "medium" && "border-l-warning bg-warning/5",
                  deadline.priority === "low" && "border-l-success bg-success/5"
                )}
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-medium text-sm leading-tight">{deadline.title}</h3>
                    <Badge
                      variant={deadline.priority === "high" ? "destructive" : "secondary"}
                      className="shrink-0"
                    >
                      {deadline.priority}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{deadline.course}</p>
                  <div className="flex items-center gap-2 text-xs">
                    <Calendar className="h-3 w-3" />
                    <span>{deadline.deadline}</span>
                    <span className="text-muted-foreground">({deadline.hoursLeft}h left)</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Announcements */}
        <div>
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-primary" />
            Announcements
          </h2>
          <div className="space-y-3">
            {announcements.map((announcement) => (
              <Card
                key={announcement.id}
                className="p-4 border-l-4 border-l-primary hover:shadow-md transition-all duration-200"
              >
                <h3 className="font-medium text-sm mb-1">{announcement.title}</h3>
                <p className="text-xs text-muted-foreground">{announcement.time}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
