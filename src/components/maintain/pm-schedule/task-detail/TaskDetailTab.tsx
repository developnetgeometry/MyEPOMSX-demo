import React from "react";

interface TaskDetailTabProps {
  taskDetails: any[];
  onAddTask: () => void;
  onEditTask: (id: number) => void;
  onDeleteTask: (id: number) => void;
}

const TaskDetailTab: React.FC<TaskDetailTabProps> = ({
  taskDetails,
  onAddTask,
  onEditTask,
  onDeleteTask,
}) => {
  return (
    <div>
      <h3 className="text-lg font-semibold text-blue-600 mb-4">Task Detail</h3>
      <div className="border rounded-md overflow-hidden">
        {/* Render task details */}
      </div>
    </div>
  );
};

export default TaskDetailTab;