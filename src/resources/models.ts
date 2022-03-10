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
                "metadata": {
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
        },
        "URLS": {
            "properties": {
                "urls": {
                    "items": {
                        "$ref": "#/definitions/URL"
                    },
                    "type": "array"
                }
            },
            "required": [
                "urls"
            ],
            "type": "object"
        },
        "URLStats": {
            "properties": {
                "count": {
                    "type": "number"
                },
                "long": {
                    "type": "string"
                },
                "metadata": {
                },
                "namespace": {
                    "type": "string"
                },
                "short": {
                    "type": "string"
                }
            },
            "required": [
                "count",
                "long",
                "namespace",
                "short"
            ],
            "type": "object"
        }
    }
} as const;
