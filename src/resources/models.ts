export default {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "definitions": {
        "URL": {
            "properties": {
                "alias": {
                    "type": "string"
                },
                "expiry": {
                    "type": "number"
                },
                "properties": {
                },
                "tags": {
                    "items": {
                        "type": "string"
                    },
                    "type": "array"
                },
                "url": {
                    "type": "string"
                },
                "workspace": {
                    "type": "string"
                }
            },
            "required": [
                "alias",
                "url"
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
                "metadata": {
                },
                "url": {
                    "type": "string"
                },
                "workspace": {
                    "type": "string"
                }
            },
            "required": [
                "count",
                "url",
                "workspace"
            ],
            "type": "object"
        }
    }
} as const;
