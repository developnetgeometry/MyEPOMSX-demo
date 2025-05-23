
export interface Task {
    id: number,
    task_code: string,
    task_name: string,
    discipline_id: number,
    is_active: boolean
    created_at?: string,
    updated_at?: string
    discipline?: Discipline
}

export interface TaskWithDetails extends Task {
    details: TaskDetail[]
}

export interface TaskDetail {
    seq: number
    task_list: string
}

export interface UpdateTaskDetail {
    id: number,
    task_list: string,
    updated_at: Date
}

export interface TaskDetailCreate {
    id?: number
    task_id: number,
    seq: number,
    task_list: string,
    created_at?: Date
    updated_at?: Date
}

export interface createTaskDTO {
    task_code: string,
    task_name: string,
    discipline_id: number,
    is_active: boolean,
    created_at?: Date,
}

export interface updateTaskDTO {
    id: number
    task_code: string
    task_name: string
    discipline_id: number
    is_active: boolean
    updated_at: Date
}

export interface Discipline {
    id?: number,
    code?: string,
    name?: string
}
