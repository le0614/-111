import { http } from '@kit.NetworkKit';

// 1. 使用枚举明确定义HTTP方法
enum HttpMethod {
  GET = 0,
  POST = 1,
  PUT = 2,
  DELETE = 3
}

// 2. 严格类型定义
interface RequestOptions {
  url: string;
  method?: HttpMethod;
  data?: string;
  headers?: Array<HeaderItem>;
  timeout?: number;
}

interface HeaderItem {
  key: string;
  value: string;
}

interface ApiResponse<T> {
  code: number;
  data: T;
  message?: string;
}

interface ErrorInfo {
  code?: number;
  message?: string;
}

class HttpRequest {
  private static instance: HttpRequest;
  private constructor() {}

  public static getInstance(): HttpRequest {
    if (!HttpRequest.instance) {
      HttpRequest.instance = new HttpRequest();
    }
    return HttpRequest.instance;
  }

  // 3. 使用数组替代Map
  private readonly methodMapping: Array<http.RequestMethod> = [
    http.RequestMethod.GET,
    http.RequestMethod.POST,
    http.RequestMethod.PUT,
    http.RequestMethod.DELETE
  ];

  public request<T>(options: RequestOptions): Promise<ApiResponse<T>> {
    return new Promise((resolve, reject) => {
      const httpRequest = http.createHttp();

      // 4. 类型安全的请求方法获取
      const method = this.methodMapping[options.method ?? HttpMethod.GET];

      // 5. 转换headers为对象（不使用解构）
      const header: Record<string, string> = { 'Content-Type': 'application/json' };
      if (options.headers) {
        for (let i = 0; i < options.headers.length; i++) {
          const item = options.headers[i];
          header[item.key] = item.value;
        }
      }

      httpRequest.request(
        options.url,
        {
          method,
          header,
          extraData: options.data,
          connectTimeout: options.timeout || 30000
        },
        (err, data) => {
          if (err) {
            reject(this.handleError({ code: err.code, message: err.message }));
          } else {
            try {
              const result = this.parseResponse<T>(data.result);
              const response: ApiResponse<T> = {
                code: data.responseCode,
                data: result
              };
              resolve(response);
            } catch (e) {
              reject(this.handleError({ code: -1, message: '响应解析失败' }));
            }
          }
        }
      );
    });
  }

  private parseResponse<T>(data: string | object | ArrayBuffer): T {
    if (typeof data === 'string') {
      return JSON.parse(data) as T;
    }
    return data as T;
  }

  private handleError(err: ErrorInfo): ApiResponse<never> {
    const errorResponse: ApiResponse<never> = {
      code: err.code || -1,
      data: null as never,
      message: err.message || '网络请求失败'
    };
    return errorResponse;
  }

  // 7. 安全的URL参数构建（不使用解构）
  private buildQuery(params: Array<HeaderItem>): string {
    if (!params || params.length === 0) return '';

    let query = '?';
    for (let i = 0; i < params.length; i++) {
      const item = params[i];
      query += (i > 0 ? '&' : '') + encodeURI(item.key) + '=' + encodeURI(item.value);
    }
    return query;
  }

  public get<T>(url: string, params?: Array<HeaderItem>, headers?: Array<HeaderItem>): Promise<ApiResponse<T>> {
    const query = params ? this.buildQuery(params) : '';
    return this.request<T>({
      url: url + query,
      method: HttpMethod.GET,
      headers
    });
  }

  public post<T>(url: string, data: object, headers?: Array<HeaderItem>): Promise<ApiResponse<T>> {
    return this.request<T>({
      url,
      method: HttpMethod.POST,
      data: JSON.stringify(data),
      headers
    });
  }

  public put<T>(url: String, params?: Array<HeaderItem>, headers?: Array<HeaderItem>): Promise<ApiResponse<T>> {
    const query = params ? this.buildQuery(params) : '';
    return this.request<T>({
      url:url + query,
      method: HttpMethod.PUT,
      headers
    })
  }

  public delete<T>(url: String, params?: Array<HeaderItem>, headers?: Array<HeaderItem>): Promise<ApiResponse<T>> {
    const query = params ? this.buildQuery(params) : '';
    return this.request<T>({
      url:url + query,
      method: HttpMethod.DELETE,
      headers
    })
  }
}

export const httpClient = HttpRequest.getInstance();