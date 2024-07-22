/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */

export interface paths {
    "/api/csrf/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Get Csrf Token */
        post: operations["core_api_get_csrf_token"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/projects/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List Projects */
        get: operations["core_api_list_projects"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/activities/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List Activities */
        get: operations["core_api_list_activities"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/users/current/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Current User */
        get: operations["core_api_current_user"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/users/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Create User */
        post: operations["core_api_create_user"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/time-logs/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List Time Logs */
        get: operations["core_api_list_time_logs"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/time-logs/current/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Current Time Log */
        get: operations["core_api_current_time_log"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/time-logs/start/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Start Time Log */
        post: operations["core_api_start_time_log"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/time-logs/end/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** End Time Log */
        post: operations["core_api_end_time_log"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/auth/login/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Auth Login */
        post: operations["core_api_auth_login"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/auth/logout/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Auth Logout */
        post: operations["core_api_auth_logout"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/holidays/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List Holidays */
        get: operations["core_api_list_holidays"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        /** Input */
        Input: {
            /**
             * Limit
             * @default 100
             */
            limit: number;
            /**
             * Offset
             * @default 0
             */
            offset: number;
        };
        /** PagedProjectDTO */
        PagedProjectDTO: {
            /** Items */
            items: components["schemas"]["ProjectDTO"][];
            /** Count */
            count: number;
        };
        /** ProjectDTO */
        ProjectDTO: {
            /** ID */
            id?: number | null;
            /**
             * Date Created
             * Format: date-time
             */
            date_created: string;
            /**
             * Date Modified
             * Format: date-time
             */
            date_modified: string;
            /** Name */
            name: string;
        };
        /** ActivityDTO */
        ActivityDTO: {
            /** ID */
            id?: number | null;
            /**
             * Date Created
             * Format: date-time
             */
            date_created: string;
            /**
             * Date Modified
             * Format: date-time
             */
            date_modified: string;
            /** Name */
            name: string;
        };
        /** PagedActivityDTO */
        PagedActivityDTO: {
            /** Items */
            items: components["schemas"]["ActivityDTO"][];
            /** Count */
            count: number;
        };
        /** UserDTO */
        UserDTO: {
            /** ID */
            id?: number | null;
            /** Last Login */
            last_login?: string | null;
            /**
             * Superuser Status
             * @description Designates that this user has all permissions without explicitly assigning them.
             * @default false
             */
            is_superuser: boolean;
            /**
             * Username
             * @description Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.
             */
            username: string;
            /** First Name */
            first_name?: string | null;
            /** Last Name */
            last_name?: string | null;
            /** Email Address */
            email?: string | null;
            /**
             * Staff Status
             * @description Designates whether the user can log into this admin site.
             * @default false
             */
            is_staff: boolean;
            /**
             * Active
             * @description Designates whether this user should be treated as active. Unselect this instead of deleting accounts.
             * @default true
             */
            is_active: boolean;
            /**
             * Date Joined
             * Format: date-time
             */
            date_joined?: string;
            /**
             * Expected Hours Sun
             * @default 0
             */
            expected_hours_sun: number;
            /**
             * Expected Hours Mon
             * @default 0
             */
            expected_hours_mon: number;
            /**
             * Expected Hours Tue
             * @default 0
             */
            expected_hours_tue: number;
            /**
             * Expected Hours Wed
             * @default 0
             */
            expected_hours_wed: number;
            /**
             * Expected Hours Thu
             * @default 0
             */
            expected_hours_thu: number;
            /**
             * Expected Hours Fri
             * @default 0
             */
            expected_hours_fri: number;
            /**
             * Expected Hours Sat
             * @default 0
             */
            expected_hours_sat: number;
            /**
             * Groups
             * @description The groups this user belongs to. A user will get all permissions granted to each of their groups.
             */
            groups: number[];
            /**
             * User Permissions
             * @description Specific permissions for this user.
             */
            user_permissions: number[];
        };
        /** GenericDTO */
        GenericDTO: {
            /** Detail */
            detail: string;
        };
        /** CreateUser */
        CreateUser: {
            /** Username */
            username: string;
            /** Password */
            password: string;
        };
        /** PagedTimeLogDTO */
        PagedTimeLogDTO: {
            /** Items */
            items: components["schemas"]["TimeLogDTO"][];
            /** Count */
            count: number;
        };
        /** TimeLogDTO */
        TimeLogDTO: {
            /** Project  Name */
            project__name: string;
            /** Activity  Name */
            activity__name: string;
            /** User  Username */
            user__username: string;
            /** ID */
            id?: number | null;
            /**
             * Date Created
             * Format: date-time
             */
            date_created: string;
            /**
             * Date Modified
             * Format: date-time
             */
            date_modified: string;
            /** User */
            user: number;
            /**
             * Start
             * Format: date-time
             */
            start: string;
            /** End */
            end?: string | null;
            /** Project */
            project: number;
            /** Activity */
            activity: number;
        };
        /** StartTimeLog */
        StartTimeLog: {
            /** Project */
            project: number;
            /** Activity */
            activity: number;
        };
        /** Login */
        Login: {
            /** Username */
            username: string;
            /** Password */
            password: string;
        };
        /** HolidayDTO */
        HolidayDTO: {
            /** ID */
            id?: number | null;
            /**
             * Date Created
             * Format: date-time
             */
            date_created: string;
            /**
             * Date Modified
             * Format: date-time
             */
            date_modified: string;
            /** Name */
            name: string;
            /**
             * Date
             * Format: date
             */
            date: string;
        };
        /** PagedHolidayDTO */
        PagedHolidayDTO: {
            /** Items */
            items: components["schemas"]["HolidayDTO"][];
            /** Count */
            count: number;
        };
    };
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    core_api_get_csrf_token: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    core_api_list_projects: {
        parameters: {
            query?: {
                limit?: number;
                offset?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PagedProjectDTO"];
                };
            };
        };
    };
    core_api_list_activities: {
        parameters: {
            query?: {
                limit?: number;
                offset?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PagedActivityDTO"];
                };
            };
        };
    };
    core_api_current_user: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["UserDTO"];
                };
            };
        };
    };
    core_api_create_user: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateUser"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["UserDTO"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["GenericDTO"];
                };
            };
        };
    };
    core_api_list_time_logs: {
        parameters: {
            query?: {
                limit?: number;
                offset?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PagedTimeLogDTO"];
                };
            };
        };
    };
    core_api_current_time_log: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TimeLogDTO"];
                };
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["GenericDTO"];
                };
            };
        };
    };
    core_api_start_time_log: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["StartTimeLog"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TimeLogDTO"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["GenericDTO"];
                };
            };
        };
    };
    core_api_end_time_log: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["GenericDTO"];
                };
            };
        };
    };
    core_api_auth_login: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["Login"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["GenericDTO"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["GenericDTO"];
                };
            };
        };
    };
    core_api_auth_logout: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["GenericDTO"];
                };
            };
        };
    };
    core_api_list_holidays: {
        parameters: {
            query?: {
                limit?: number;
                offset?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PagedHolidayDTO"];
                };
            };
        };
    };
}
