import axios, { AxiosError, AxiosResponse, Method } from 'axios';
import { ApiError } from './types';

export const setup = (token: string): void => {
  DatafyCMS.setupAPI(token);
};

interface ApiErrorMessage {
  detail: { [id: string]: unknown };
  message: string;
}

export class DatafyCMS {
  private static API_TOKEN: string;

  static setupAPI(apiToken: string): void {
    DatafyCMS.API_TOKEN = apiToken;
  }

  static getToken(): string {
    const token = DatafyCMS.API_TOKEN || (process.env.DATAFYCMS_API_TOKEN as string);
    if (!token) {
      throw 'API Token is not set';
    }

    return token;
  }

  static authHeader(): { [id: string]: string } {
    return {
      'X-API-TOKEN': DatafyCMS.getToken(),
    };
  }
}

/**
 * Class used for making the requests to the DatafyCMS API
 * Exposed only one method which is using axios for making the requests
 */
export class DatafyRequest {
  private readonly HOST = 'https://api.datafycms.com';
  private readonly LOCALIZATION_HEADER = 'LOCALIZATION';

  /**
   * Make the HTTP Request to DatafyCMS API
   * @param url
   * @param method
   * @param data
   * @param locale
   */
  request<T>(url: string, method: Method, data?: unknown, locale?: string): Promise<T> {
    const headers = DatafyCMS.authHeader();
    if (locale) {
      headers[this.LOCALIZATION_HEADER] = locale;
    }

    return axios({
      url: `${this.HOST}/${url}`,
      method,
      data,
      headers,
    })
      .then((response: AxiosResponse<T>) => response.data)
      .catch((response: AxiosError<ApiErrorMessage>) => {
        const message = new ApiError();
        message.status = response?.response?.status || 500;
        message.message = response?.response?.data?.message || 'Something went wrong';
        message.data = response.response?.data?.detail || {};

        return Promise.reject(message);
      });
  }
}
