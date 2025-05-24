export interface CommonApiResponse<R> {
  status_code: number;
  status: string;
  time_taken_in_ms: number;
  data: R;
}
