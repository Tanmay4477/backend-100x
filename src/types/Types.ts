export interface CustomRequest extends Request {
    userId?: string;
    cookies: {[key: string]: string};
}

