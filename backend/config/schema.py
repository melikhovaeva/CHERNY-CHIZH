"""
OpenAPI (drf-spectacular) схема для config.
Postprocessing-хуки: приведение схемы к camelCase в соответствии с ответами API.
"""


def _to_camel_case(snake_str: str) -> str:
    """Convert snake_case to camelCase."""
    if not snake_str:
        return snake_str
    parts = snake_str.split("_")
    return parts[0].lower() + "".join(p.capitalize() for p in parts[1:])


def _camelize_schema_object(obj):
    """
    Recursively convert object keys from snake_case to camelCase.
    Leaves $ref targets as-is (only the key names in the current object).
    """
    if isinstance(obj, dict):
        result = {}
        for k, v in obj.items():
            new_key = _to_camel_case(k) if isinstance(k, str) and "_" in k else k
            result[new_key] = _camelize_schema_object(v)
        return result
    if isinstance(obj, list):
        return [_camelize_schema_object(item) for item in obj]
    return obj


def camelize_schema(result, generator, request, public):
    """
    Postprocessing hook: convert component schemas' property names to camelCase
    so the OpenAPI schema matches API responses (CamelCaseSerializerMixin).
    """
    components = result.get("components") or {}
    schemas = components.get("schemas") or {}
    for name, schema in schemas.items():
        if not isinstance(schema, dict):
            continue
        if "properties" in schema and isinstance(schema["properties"], dict):
            schema["properties"] = _camelize_schema_object(schema["properties"])
        if "required" in schema and isinstance(schema["required"], list):
            schema["required"] = [
                _to_camel_case(r) if isinstance(r, str) and "_" in r else r
                for r in schema["required"]
            ]
        if "additionalProperties" in schema and isinstance(
            schema["additionalProperties"], dict
        ):
            schema["additionalProperties"] = _camelize_schema_object(
                schema["additionalProperties"]
            )
    return result


__all__ = ["camelize_schema"]
