export default class BaseResponse<T> {
  code: number;
  message: string;
  data: T;
  error: T;
  success: boolean;

  constructor() {
    this.message = null;
    this.data = null;
    this.success = false;
  }

  ok(data?: T) {
    this.success = true;
    this.data = data;
    return this;
  }

  failed(error?: T) {
    this.success = false;
    this.error = error;
    return this;
  }

  m(message: string) {
    this.message = message;
    return this;
  }

  c(code: number) {
    this.code = code;
    return this;
  }
}
