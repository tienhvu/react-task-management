import React from "react"; 
import { Button } from "react-bootstrap"; 
import { Task } from "~/types/Task"; 
import { format } from "date-fns"; 
 
interface TaskItemProps { 
  task: Task; 
  index: number; 
  onUpdate: () => void; 
  onDelete: () => void; 
  onShowModal: () => void; 
  disabled: boolean; 
} 
 
export const TaskItem: React.FC<TaskItemProps> = ({ 
  task, 
  index, 
  onUpdate, 
  onDelete, 
  onShowModal, 
  disabled, 
}) => { 
  const handleRow = (e: React.MouseEvent) => { 
    if (disabled) return;
    const isActionColumn = (e.target as HTMLElement).closest('td:last-child'); 
    if (!isActionColumn) { 
      onUpdate(); 
    } 
  }; 
 
  return ( 
    <tr 
      onClick={handleRow} 
      style={{ 
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.8 : 1
      }} 
    > 
      <td>{index}</td> 
      <td>{task.title}</td> 
      <td>{(task.categories || []).map((cat) => cat.name).join(", ")}</td> 
      <td>{task.status}</td> 
      <td>{format(new Date(task.createdAt), "HH:mm:ss dd/MM/yyyy")}</td> 
      <td>{format(new Date(task.updatedAt), "HH:mm:ss dd/MM/yyyy")}</td> 
      <td onClick={(e) => e.stopPropagation()}> 
        <div className="d-flex gap-2"> 
          <Button 
            variant="primary" 
            onClick={disabled ? undefined : onShowModal} 
            size="sm" 
            disabled={disabled} 
          > 
            Edit 
          </Button> 
          <Button 
            variant="danger" 
            onClick={disabled ? undefined : onDelete} 
            size="sm" 
            disabled={disabled} 
          > 
            Delete 
          </Button> 
        </div> 
      </td> 
    </tr> 
  ); 
};
