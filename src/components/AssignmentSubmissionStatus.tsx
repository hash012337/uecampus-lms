import { Card } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { format } from "date-fns";

interface AssignmentSubmissionStatusProps {
  assignment: {
    title: string;
    due_date: string | null;
    points: number | null;
  };
  submission: {
    submitted_at: string | null;
    status: string | null;
    marks_obtained: number | null;
    file_path: string | null;
    feedback: string | null;
    graded_at: string | null;
  };
}

export function AssignmentSubmissionStatus({ assignment, submission }: AssignmentSubmissionStatusProps) {
  const calculateTimeRemaining = () => {
    if (!submission.submitted_at || !assignment.due_date) return null;
    
    const submittedDate = new Date(submission.submitted_at);
    const dueDate = new Date(assignment.due_date);
    const diffMs = dueDate.getTime() - submittedDate.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffMs < 0) {
      const absDiffHours = Math.abs(diffHours);
      const absDiffMins = Math.abs(diffMins);
      return {
        text: `Assignment was submitted ${absDiffHours} hours ${absDiffMins} mins late`,
        isLate: true
      };
    }
    
    return {
      text: `Assignment was submitted ${diffHours} hours ${diffMins} mins early`,
      isLate: false
    };
  };

  const timeRemaining = calculateTimeRemaining();
  const fileName = submission.file_path ? submission.file_path.split('/').pop() : null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">{assignment.title}</h2>
        <div className="flex gap-4 text-sm text-muted-foreground">
          {assignment.due_date && (
            <>
              <div>
                <span className="font-medium">Opened:</span> {format(new Date(assignment.due_date), "EEEE, MMMM d, yyyy, h:mm a")}
              </div>
              <div>
                <span className="font-medium">Due:</span> {format(new Date(assignment.due_date), "EEEE, MMMM d, yyyy, h:mm a")}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="border-t pt-4">
        <h3 className="text-lg font-semibold mb-4">Submission Status</h3>
        
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
            <tbody>
              <tr className="border-b">
                <td className="py-3 px-4 font-medium bg-muted/50 w-48">Attempt number</td>
                <td className="py-3 px-4">This is attempt 1.</td>
              </tr>
              
              <tr className="border-b">
                <td className="py-3 px-4 font-medium bg-muted/50">Submission status</td>
                <td className="py-3 px-4">
                  <span className="inline-block px-3 py-1 rounded bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200">
                    {submission.status === 'submitted' ? 'Submitted for grading' : submission.status || 'Not submitted'}
                  </span>
                </td>
              </tr>
              
              <tr className="border-b">
                <td className="py-3 px-4 font-medium bg-muted/50">Grading status</td>
                <td className="py-3 px-4">
                  {submission.graded_at ? (
                    <span>Graded - {submission.marks_obtained}/{assignment.points} points</span>
                  ) : (
                    <span>Not graded</span>
                  )}
                </td>
              </tr>
              
              {timeRemaining && (
                <tr className="border-b">
                  <td className="py-3 px-4 font-medium bg-muted/50">Time remaining</td>
                  <td className={`py-3 px-4 ${timeRemaining.isLate ? 'bg-red-100 dark:bg-red-900/30' : 'bg-green-100 dark:bg-green-900/30'}`}>
                    {timeRemaining.text}
                  </td>
                </tr>
              )}
              
              {submission.submitted_at && (
                <tr className="border-b">
                  <td className="py-3 px-4 font-medium bg-muted/50">Last modified</td>
                  <td className="py-3 px-4">
                    {format(new Date(submission.submitted_at), "EEEE, MMMM d, yyyy, h:mm a")}
                  </td>
                </tr>
              )}
              
              {fileName && (
                <tr className="border-b">
                  <td className="py-3 px-4 font-medium bg-muted/50">File submissions</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <span>{fileName}</span>
                      {submission.submitted_at && (
                        <span className="text-muted-foreground text-sm ml-2">
                          {format(new Date(submission.submitted_at), "MMMM d yyyy, h:mm a")}
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              )}
              
              <tr>
                <td className="py-3 px-4 font-medium bg-muted/50">Submission comments</td>
                <td className="py-3 px-4">
                  <button className="text-primary hover:underline">
                    Comments (0)
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {submission.feedback && submission.graded_at && (
          <Card className="mt-4 p-4 bg-muted/50">
            <h4 className="font-semibold mb-2">Feedback</h4>
            <p className="text-sm">{submission.feedback}</p>
          </Card>
        )}
      </div>
    </div>
  );
}
