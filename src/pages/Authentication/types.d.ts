export interface FormDataType {
    email: {
        value: string;
        showField: boolean;
        disabled: boolean;
        error?: string;
    };
    name: {
        value: string;
        showField: boolean;
        disabled: boolean;
        error?: string;
    };
    password: {
        value: string;
        showField: boolean;
        disabled: boolean;
        error?: string;
    };
    otp: {
        value: string;
        showField: boolean;
        disabled: boolean;
        error?: string;
    };
    apiName: string;
    generalError?: string;
}
