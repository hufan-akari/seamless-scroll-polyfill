export const failedExecute = (method: string, object: string, reason: string = "cannot convert to dictionary.") =>
    `Failed to execute '${method}' on '${object}': ${reason}`;

export const invalidBehaviorEnumValue = (value: string, method: string, object: string) =>
    failedExecute(method, object, `The provided value '${value}' is not a valid enum value of type ScrollBehavior.`);
