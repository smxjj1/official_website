/**
 * 成功响应包装
 * @param data 实际返回的数据
 * @param message 成功提示信息（默认'success'）
 * @param code 成功状态码（默认200）
 */
export function success<T>(
  data: T,
  message = 'success',
  code = 200,
): ApiResponse<T> {
  return {
    code,
    message,
    isFailed: false,
    result: data,
  };
}

/**
 * 失败响应包装
 * @param message 错误提示信息
 * @param code 错误状态码（默认500）
 * @param data 错误时附加数据（可选）
 */
export function fail<T = null>(
  message: string,
  code = 500,
  data: T = null as T,
): ApiResponse<T> {
  return {
    code,
    message,
    isFailed: true,
    result: data,
  };
}
