// 공통 API 응답 DTO
export class ApiResponse<T> {
  constructor(
    public readonly result: T,
    public readonly message?: string,
    public readonly status?: number,
  ) {}
}

// 무한 스크롤 페이징 응답 DTO
export class InfiniteQueryResponse<T> {
  constructor(
    public readonly itemList: T[],
    public readonly nextPage: number | null,
    public readonly totalCount: number,
  ) {}
}
