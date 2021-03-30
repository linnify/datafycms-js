import axios, { AxiosResponse, Method } from 'axios';

export const setup = (token: string): void => {
  DatafyCMS.setupAPI(token);
};

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

  /**
   * Make the HTTP Request to DatafyCMS API
   * @param url
   * @param method
   * @param data
   */
  request<T>(url: string, method: Method, data?: unknown): Promise<T> {
    return axios({
      url: `${this.HOST}/${url}`,
      method,
      data,
      headers: DatafyCMS.authHeader(),
    }).then((response: AxiosResponse<T>) => response.data);
  }
}
