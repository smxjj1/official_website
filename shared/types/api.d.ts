declare interface ApiResponse<T = any> {
  code: number; // 状态码（200成功，其他为错误）
  message: string; // 提示信息
  isFailed: boolean; // 是否失败（true为失败，false为成功）
  result: T; // 实际数据（成功时返回，失败时可能为null）
}
