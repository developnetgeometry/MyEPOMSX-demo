
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

export interface Discipline {
    id?: number,
    code?: string,
    name?: string
}
