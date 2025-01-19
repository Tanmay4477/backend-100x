export interface CustomRequest extends Request {
    userId?: string;
    cookies?: Record<"access-token", string> | undefined;
}