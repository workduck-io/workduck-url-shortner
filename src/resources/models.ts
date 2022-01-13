export default {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "definitions": {
        "URL": {
            "properties": {
                "expiry": {
                    "type": "number"
                },
                "long": {
                    "type": "string"
                },
                "namespace": {
                    "type": "string"
                },
                "short": {
                    "type": "string"
                }
            },
            "required": [
                "long"
            ],
            "type": "object"
        }
    }
} as const;
