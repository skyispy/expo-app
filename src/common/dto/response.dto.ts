export class ApiResponse<T> {
  constructor(
    public readonly result: T,
    public readonly message?: string,
    public readonly status?: number,
  ) {}
}
