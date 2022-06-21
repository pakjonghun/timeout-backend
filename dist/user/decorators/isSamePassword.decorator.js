"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsSamePassword = void 0;
const class_validator_1 = require("class-validator");
function IsSamePassword(property, options) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            name: 'IsSamePassword',
            target: object.constructor,
            propertyName,
            constraints: [property],
            options,
            validator: {
                validate(value, args) {
                    const [relatedPropertyName] = args.constraints;
                    const relatedValue = args.object[relatedPropertyName];
                    return relatedValue === value;
                },
            },
        });
    };
}
exports.IsSamePassword = IsSamePassword;
//# sourceMappingURL=isSamePassword.decorator.js.map