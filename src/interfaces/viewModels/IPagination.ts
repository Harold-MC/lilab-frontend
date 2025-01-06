interface IPagination<T> {
    data: T[],
    pageCount: number

}

export interface IPaginationParams {
    page?: number,
    pageSize: number,
    
}

export default IPagination